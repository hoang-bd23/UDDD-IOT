/**
 * Theme Context
 * Manages app theme (light/dark mode)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@smarthome_theme';

const ThemeContext = createContext();

export const THEME_MODES = {
    SYSTEM: 'system',
    LIGHT: 'light',
    DARK: 'dark',
};

export function ThemeProvider({ children }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState(THEME_MODES.SYSTEM);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved theme preference
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && Object.values(THEME_MODES).includes(savedTheme)) {
                setThemeMode(savedTheme);
            }
        } catch (error) {
            console.warn('Error loading theme preference:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveThemePreference = async (mode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.warn('Error saving theme preference:', error);
        }
    };

    // Change theme mode
    const setTheme = (mode) => {
        setThemeMode(mode);
        saveThemePreference(mode);
    };

    // Get actual dark mode state
    const isDarkMode = themeMode === THEME_MODES.SYSTEM
        ? systemColorScheme === 'dark'
        : themeMode === THEME_MODES.DARK;

    // Toggle between light and dark (not system)
    const toggleTheme = () => {
        const newMode = isDarkMode ? THEME_MODES.LIGHT : THEME_MODES.DARK;
        setTheme(newMode);
    };

    const value = {
        themeMode,
        isDarkMode,
        isLoading,
        setTheme,
        toggleTheme,
        THEME_MODES,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;
