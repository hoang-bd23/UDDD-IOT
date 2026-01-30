/**
 * Auth Context
 * Manages authentication state with Firebase Auth
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth } from '../services/firebase';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = '@SmartHome:auth';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Listen to Firebase auth state changes
    useEffect(() => {
        let isMounted = true;

        const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const userData = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                    };

                    if (isMounted) {
                        setUser(userData);
                        setIsAuthenticated(true);
                    }

                    // Save to local storage (non-blocking)
                    AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData)).catch(console.error);

                    // Initialize messaging in background (non-blocking)
                    // This prevents hanging on startup
                    initializeBackgroundServices(userData).catch(console.error);
                } else {
                    if (isMounted) {
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                    AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(console.error);
                }
            } catch (error) {
                console.error('Auth state change error:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    // Initialize background services without blocking
    const initializeBackgroundServices = async (userData) => {
        try {
            // Import dynamically to avoid blocking
            const { firebaseMessaging, firebaseDatabase } = await import('../services/firebase');

            // Initialize messaging
            await firebaseMessaging.initialize();

            // Save user profile to database
            await firebaseDatabase.saveUserProfile({
                email: userData.email,
                displayName: userData.displayName,
                lastLogin: Date.now(),
            });
        } catch (error) {
            console.error('Background services init error:', error);
            // Don't throw - let app continue
        }
    };

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            const result = await firebaseAuth.login(email, password);

            if (!result.success) {
                return { success: false, error: result.error };
            }

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email, password, displayName) => {
        try {
            setIsLoading(true);
            const result = await firebaseAuth.register(email, password, displayName);

            if (!result.success) {
                return { success: false, error: result.error };
            }

            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Sign out from Firebase first
            await firebaseAuth.logout();

            setUser(null);
            setIsAuthenticated(false);

            // Cleanup in background
            try {
                const { firebaseMessaging } = await import('../services/firebase');
                await firebaseMessaging.deleteToken();
            } catch (e) {
                console.error('FCM cleanup error:', e);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const resetPassword = async (email) => {
        try {
            const result = await firebaseAuth.resetPassword(email);
            return result;
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
