/**
 * Schedule Context
 * Manages automation schedules with Firebase sync
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseDatabase } from '../services/firebase';
import { useAuth } from './AuthContext';

const ScheduleContext = createContext(null);

const SCHEDULES_STORAGE_KEY = '@SmartHome:schedules';

export function ScheduleProvider({ children }) {
    const { isAuthenticated, user } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Subscribe to Firebase schedules when authenticated
    useEffect(() => {
        if (!isAuthenticated || !user) {
            loadLocalSchedules();
            return;
        }

        // Subscribe to real-time schedule updates
        const unsubscribe = firebaseDatabase.subscribeToSchedules((firebaseSchedules) => {
            setSchedules(firebaseSchedules);
            // Also save locally for offline access
            AsyncStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(firebaseSchedules));
            setIsLoading(false);
        });

        return unsubscribe;
    }, [isAuthenticated, user]);

    const loadLocalSchedules = async () => {
        try {
            const stored = await AsyncStorage.getItem(SCHEDULES_STORAGE_KEY);
            if (stored) {
                setSchedules(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading local schedules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSchedulesLocal = async (newSchedules) => {
        try {
            await AsyncStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(newSchedules));
        } catch (error) {
            console.error('Error saving schedules locally:', error);
        }
    };

    const addSchedule = useCallback(async (schedule) => {
        const newSchedule = {
            ...schedule,
            id: schedule.id || `schedule-${Date.now()}`,
            isEnabled: true,
            createdAt: Date.now(),
        };

        const updatedSchedules = [...schedules, newSchedule];
        setSchedules(updatedSchedules);
        await saveSchedulesLocal(updatedSchedules);

        if (isAuthenticated) {
            await firebaseDatabase.saveSchedule(newSchedule);
        }

        return newSchedule;
    }, [schedules, isAuthenticated]);

    const updateSchedule = useCallback(async (scheduleId, updates) => {
        const updatedSchedules = schedules.map(s =>
            s.id === scheduleId ? { ...s, ...updates } : s
        );
        setSchedules(updatedSchedules);
        await saveSchedulesLocal(updatedSchedules);

        if (isAuthenticated) {
            const schedule = updatedSchedules.find(s => s.id === scheduleId);
            if (schedule) {
                await firebaseDatabase.saveSchedule(schedule);
            }
        }
    }, [schedules, isAuthenticated]);

    const toggleSchedule = useCallback(async (scheduleId) => {
        const schedule = schedules.find(s => s.id === scheduleId);
        if (schedule) {
            await updateSchedule(scheduleId, { isEnabled: !schedule.isEnabled });
        }
    }, [schedules, updateSchedule]);

    const removeSchedule = useCallback(async (scheduleId) => {
        const updatedSchedules = schedules.filter(s => s.id !== scheduleId);
        setSchedules(updatedSchedules);
        await saveSchedulesLocal(updatedSchedules);

        if (isAuthenticated) {
            await firebaseDatabase.deleteSchedule(scheduleId);
        }
    }, [schedules, isAuthenticated]);

    const getSchedulesForDevice = useCallback((deviceId) => {
        return schedules.filter(s => s.deviceId === deviceId);
    }, [schedules]);

    const value = {
        schedules,
        isLoading,
        addSchedule,
        updateSchedule,
        toggleSchedule,
        removeSchedule,
        getSchedulesForDevice,
        refreshSchedules: loadLocalSchedules,
    };

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}

export function useSchedules() {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error('useSchedules must be used within a ScheduleProvider');
    }
    return context;
}

export default ScheduleContext;
