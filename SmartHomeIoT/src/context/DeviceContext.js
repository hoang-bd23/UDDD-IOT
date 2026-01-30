/**
 * Device Context
 * Manages IoT device state with Firebase sync
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseDatabase } from '../services/firebase';
import { useAuth } from './AuthContext';

const DeviceContext = createContext(null);

const DEVICES_STORAGE_KEY = '@SmartHome:devices';
const SERVER_URL_KEY = '@SmartHome:serverUrl';
const CAMERA_URL_KEY = '@SmartHome:cameraUrl';

// Default device for LED testing
const defaultDevices = [
    {
        id: 'led-1',
        name: 'Đèn LED',
        type: 'light',
        room: 'living-room',
        isOn: false,
        brightness: 100,
        isOnline: true,
        lastUpdated: Date.now(),
    },
];

export function DeviceProvider({ children }) {
    const { isAuthenticated, user } = useAuth();
    const [devices, setDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [raspberryPiUrl, setRaspberryPiUrl] = useState('http://10.0.2.2:8080');
    const [cameraUrl, setCameraUrl] = useState('http://10.0.2.2:8081');
    const [isToggling, setIsToggling] = useState(false);

    // Load server URL from storage
    useEffect(() => {
        loadServerUrl();
    }, []);

    // Subscribe to Firebase devices when authenticated
    useEffect(() => {
        if (!isAuthenticated || !user) {
            loadLocalDevices();
            return;
        }

        // Subscribe to real-time device updates
        const unsubscribe = firebaseDatabase.subscribeToDevices((firebaseDevices) => {
            if (firebaseDevices.length > 0) {
                setDevices(firebaseDevices);
                // Also save locally for offline access
                AsyncStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(firebaseDevices));
            } else {
                // Initialize with default devices if none exist
                initializeDefaultDevices();
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, [isAuthenticated, user]);

    const loadServerUrl = async () => {
        try {
            const [serverUrl, camUrl] = await Promise.all([
                AsyncStorage.getItem(SERVER_URL_KEY),
                AsyncStorage.getItem(CAMERA_URL_KEY),
            ]);
            if (serverUrl) {
                setRaspberryPiUrl(serverUrl);
            }
            if (camUrl) {
                setCameraUrl(camUrl);
            }
        } catch (error) {
            console.error('Error loading server URLs:', error);
        }
    };

    const loadLocalDevices = async () => {
        try {
            const stored = await AsyncStorage.getItem(DEVICES_STORAGE_KEY);
            if (stored) {
                setDevices(JSON.parse(stored));
            } else {
                setDevices(defaultDevices);
            }
        } catch (error) {
            console.error('Error loading local devices:', error);
            setDevices(defaultDevices);
        } finally {
            setIsLoading(false);
        }
    };

    const initializeDefaultDevices = async () => {
        try {
            for (const device of defaultDevices) {
                await firebaseDatabase.saveDevice(device);
            }
        } catch (error) {
            console.error('Error initializing default devices:', error);
        }
    };

    const saveDevicesLocal = async (newDevices) => {
        try {
            await AsyncStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(newDevices));
        } catch (error) {
            console.error('Error saving devices locally:', error);
        }
    };

    const toggleDevice = useCallback(async (deviceId) => {
        // Prevent double-clicks
        if (isToggling) {
            return { success: false, error: 'Đang xử lý...' };
        }

        const device = devices.find(d => d.id === deviceId);
        if (!device) return { success: false, error: 'Device not found' };

        setIsToggling(true);
        const newState = !device.isOn;
        const maxRetries = 2;
        let lastError = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                // Create abort controller with timeout (increased to 8s)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                // Send command to Raspberry Pi
                const response = await fetch(`${raspberryPiUrl}/led`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        state: newState ? 'ON' : 'OFF',
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                // Success - update local state
                const updatedDevices = devices.map(d =>
                    d.id === deviceId
                        ? { ...d, isOn: newState, lastUpdated: Date.now() }
                        : d
                );
                setDevices(updatedDevices);
                saveDevicesLocal(updatedDevices);

                // Sync to Firebase if authenticated (non-blocking)
                if (isAuthenticated) {
                    firebaseDatabase.updateDeviceState(deviceId, newState).catch(() => { });
                }

                setConnectionStatus('connected');
                setIsToggling(false);
                return { success: true, state: newState };

            } catch (error) {
                lastError = error;
                // Only log on last attempt
                if (attempt === maxRetries) {
                    console.warn('Toggle failed:', error.message);
                }

                // Wait before retry (except last attempt)
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }

        // All retries failed - but keep connected status if it was connected before
        // Only set disconnected after multiple consecutive failures
        setIsToggling(false);
        return { success: false, error: lastError?.message || 'Không thể điều khiển thiết bị' };
    }, [devices, raspberryPiUrl, isAuthenticated, isToggling]);

    const updateDeviceBrightness = useCallback(async (deviceId, brightness) => {
        const updatedDevices = devices.map(d =>
            d.id === deviceId
                ? { ...d, brightness, lastUpdated: Date.now() }
                : d
        );
        setDevices(updatedDevices);
        await saveDevicesLocal(updatedDevices);

        if (isAuthenticated) {
            const device = updatedDevices.find(d => d.id === deviceId);
            if (device) {
                await firebaseDatabase.saveDevice(device);
            }
        }
    }, [devices, isAuthenticated]);

    const addDevice = useCallback(async (device) => {
        const newDevice = {
            ...device,
            id: device.id || `device-${Date.now()}`,
            isOn: false,
            brightness: 100,
            isOnline: false,
            lastUpdated: Date.now(),
        };

        const updatedDevices = [...devices, newDevice];
        setDevices(updatedDevices);
        await saveDevicesLocal(updatedDevices);

        if (isAuthenticated) {
            await firebaseDatabase.saveDevice(newDevice);
        }

        return newDevice;
    }, [devices, isAuthenticated]);

    const removeDevice = useCallback(async (deviceId) => {
        const updatedDevices = devices.filter(d => d.id !== deviceId);
        setDevices(updatedDevices);
        await saveDevicesLocal(updatedDevices);

        if (isAuthenticated) {
            await firebaseDatabase.deleteDevice(deviceId);
        }
    }, [devices, isAuthenticated]);

    const checkConnection = useCallback(async () => {
        setConnectionStatus('connecting');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${raspberryPiUrl}/health`, {
                method: 'GET',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                setConnectionStatus('connected');
                return true;
            }
        } catch (error) {
            console.error('Connection check failed:', error);
        }
        setConnectionStatus('disconnected');
        return false;
    }, [raspberryPiUrl]);

    const setServerUrl = useCallback(async (url) => {
        setRaspberryPiUrl(url);
        await AsyncStorage.setItem(SERVER_URL_KEY, url);
        // Re-check connection with new URL
        setTimeout(checkConnection, 100);
    }, [checkConnection]);

    const setCameraServerUrl = useCallback(async (url) => {
        setCameraUrl(url);
        await AsyncStorage.setItem(CAMERA_URL_KEY, url);
    }, []);

    const getDeviceHistory = useCallback(async () => {
        if (!isAuthenticated) return [];
        return await firebaseDatabase.getDeviceHistory(20);
    }, [isAuthenticated]);

    const value = {
        devices,
        isLoading,
        isToggling,
        connectionStatus,
        raspberryPiUrl,
        cameraUrl,
        toggleDevice,
        updateDeviceBrightness,
        addDevice,
        removeDevice,
        checkConnection,
        setServerUrl,
        setCameraServerUrl,
        getDeviceHistory,
        refreshDevices: loadLocalDevices,
    };

    return (
        <DeviceContext.Provider value={value}>
            {children}
        </DeviceContext.Provider>
    );
}

export function useDevices() {
    const context = useContext(DeviceContext);
    if (!context) {
        throw new Error('useDevices must be used within a DeviceProvider');
    }
    return context;
}

export default DeviceContext;
