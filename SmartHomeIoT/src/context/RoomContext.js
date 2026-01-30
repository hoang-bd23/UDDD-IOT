/**
 * Room Context
 * Manages room organization with Firebase sync
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseDatabase } from '../services/firebase';
import { useAuth } from './AuthContext';
import { colors } from '../styles';

const RoomContext = createContext(null);

const ROOMS_STORAGE_KEY = '@SmartHome:rooms';

// Default rooms
const defaultRooms = [
    {
        id: 'living-room',
        name: 'Phòng khách',
        icon: 'home-outline',
        color: colors.primary,
    },
    {
        id: 'bedroom',
        name: 'Phòng ngủ',
        icon: 'bed-outline',
        color: colors.secondary,
    },
    {
        id: 'kitchen',
        name: 'Nhà bếp',
        icon: 'restaurant-outline',
        color: colors.accent,
    },
];

export function RoomProvider({ children }) {
    const { isAuthenticated, user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load rooms when authenticated
    useEffect(() => {
        if (!isAuthenticated || !user) {
            loadLocalRooms();
            return;
        }

        loadFirebaseRooms();
    }, [isAuthenticated, user]);

    const loadFirebaseRooms = async () => {
        try {
            const firebaseRooms = await firebaseDatabase.getRooms();

            if (firebaseRooms.length > 0) {
                setRooms(firebaseRooms);
                await AsyncStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(firebaseRooms));
            } else {
                // Initialize with default rooms
                await initializeDefaultRooms();
            }
        } catch (error) {
            console.error('Error loading Firebase rooms:', error);
            loadLocalRooms();
        } finally {
            setIsLoading(false);
        }
    };

    const loadLocalRooms = async () => {
        try {
            const stored = await AsyncStorage.getItem(ROOMS_STORAGE_KEY);
            if (stored) {
                setRooms(JSON.parse(stored));
            } else {
                setRooms(defaultRooms);
            }
        } catch (error) {
            console.error('Error loading local rooms:', error);
            setRooms(defaultRooms);
        } finally {
            setIsLoading(false);
        }
    };

    const initializeDefaultRooms = async () => {
        try {
            for (const room of defaultRooms) {
                await firebaseDatabase.saveRoom(room);
            }
            setRooms(defaultRooms);
            await AsyncStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(defaultRooms));
        } catch (error) {
            console.error('Error initializing default rooms:', error);
            setRooms(defaultRooms);
        }
    };

    const saveRoomsLocal = async (newRooms) => {
        try {
            await AsyncStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(newRooms));
        } catch (error) {
            console.error('Error saving rooms locally:', error);
        }
    };

    const addRoom = useCallback(async (room) => {
        const newRoom = {
            ...room,
            id: room.id || `room-${Date.now()}`,
        };

        const updatedRooms = [...rooms, newRoom];
        setRooms(updatedRooms);
        await saveRoomsLocal(updatedRooms);

        if (isAuthenticated) {
            await firebaseDatabase.saveRoom(newRoom);
        }

        return newRoom;
    }, [rooms, isAuthenticated]);

    const updateRoom = useCallback(async (roomId, updates) => {
        const updatedRooms = rooms.map(r =>
            r.id === roomId ? { ...r, ...updates } : r
        );
        setRooms(updatedRooms);
        await saveRoomsLocal(updatedRooms);

        if (isAuthenticated) {
            const room = updatedRooms.find(r => r.id === roomId);
            if (room) {
                await firebaseDatabase.saveRoom(room);
            }
        }
    }, [rooms, isAuthenticated]);

    const removeRoom = useCallback(async (roomId) => {
        const updatedRooms = rooms.filter(r => r.id !== roomId);
        setRooms(updatedRooms);
        await saveRoomsLocal(updatedRooms);

        if (isAuthenticated) {
            await firebaseDatabase.deleteRoom(roomId);
        }
    }, [rooms, isAuthenticated]);

    const getRoomById = useCallback((roomId) => {
        return rooms.find(r => r.id === roomId);
    }, [rooms]);

    const value = {
        rooms,
        isLoading,
        addRoom,
        updateRoom,
        removeRoom,
        getRoomById,
        refreshRooms: isAuthenticated ? loadFirebaseRooms : loadLocalRooms,
    };

    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRooms() {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRooms must be used within a RoomProvider');
    }
    return context;
}

export default RoomContext;
