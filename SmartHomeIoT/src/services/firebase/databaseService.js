/**
 * Firebase Realtime Database Service
 * Handles data sync with Firebase Realtime Database
 */

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { FIREBASE_CONFIG } from './config';

const { paths } = FIREBASE_CONFIG;

/**
 * Get current user's UID
 */
const getUid = () => {
    const user = auth().currentUser;
    if (!user) throw new Error('User not authenticated');
    return user.uid;
};

export const firebaseDatabase = {
    // ==================== DEVICES ====================

    /**
     * Get reference to user's devices
     */
    getDevicesRef: () => {
        return database().ref(`${paths.devices}/${getUid()}`);
    },

    /**
     * Get all devices for current user
     */
    getDevices: async () => {
        try {
            const snapshot = await database()
                .ref(`${paths.devices}/${getUid()}`)
                .once('value');

            const data = snapshot.val();
            if (!data) return [];

            return Object.keys(data).map(key => ({
                id: key,
                ...data[key],
            }));
        } catch (error) {
            console.error('Error getting devices:', error);
            return [];
        }
    },

    /**
     * Add or update a device
     */
    saveDevice: async (device) => {
        try {
            const deviceRef = database()
                .ref(`${paths.devices}/${getUid()}/${device.id}`);

            await deviceRef.set({
                ...device,
                updatedAt: database.ServerValue.TIMESTAMP,
            });

            return { success: true };
        } catch (error) {
            console.error('Error saving device:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Update device state (on/off)
     */
    updateDeviceState: async (deviceId, isOn) => {
        try {
            await database()
                .ref(`${paths.devices}/${getUid()}/${deviceId}`)
                .update({
                    isOn,
                    lastUpdated: database.ServerValue.TIMESTAMP,
                });

            // Log to history
            await firebaseDatabase.addDeviceHistory(deviceId, isOn);

            return { success: true };
        } catch (error) {
            console.error('Error updating device state:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Delete a device
     */
    deleteDevice: async (deviceId) => {
        try {
            await database()
                .ref(`${paths.devices}/${getUid()}/${deviceId}`)
                .remove();

            return { success: true };
        } catch (error) {
            console.error('Error deleting device:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Subscribe to devices changes
     */
    subscribeToDevices: (callback) => {
        const ref = database().ref(`${paths.devices}/${getUid()}`);

        const listener = ref.on('value', (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                callback([]);
                return;
            }

            const devices = Object.keys(data).map(key => ({
                id: key,
                ...data[key],
            }));
            callback(devices);
        });

        // Return unsubscribe function
        return () => ref.off('value', listener);
    },

    // ==================== DEVICE HISTORY ====================

    /**
     * Add device state change to history
     */
    addDeviceHistory: async (deviceId, isOn) => {
        try {
            const historyRef = database()
                .ref(`${paths.deviceHistory}/${getUid()}`)
                .push();

            await historyRef.set({
                deviceId,
                action: isOn ? 'ON' : 'OFF',
                timestamp: database.ServerValue.TIMESTAMP,
            });

            // Keep only last 100 entries
            const snapshot = await database()
                .ref(`${paths.deviceHistory}/${getUid()}`)
                .orderByChild('timestamp')
                .once('value');

            const entries = snapshot.val();
            if (entries) {
                const keys = Object.keys(entries);
                if (keys.length > 100) {
                    const keysToRemove = keys.slice(0, keys.length - 100);
                    const updates = {};
                    keysToRemove.forEach(key => {
                        updates[key] = null;
                    });
                    await database()
                        .ref(`${paths.deviceHistory}/${getUid()}`)
                        .update(updates);
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error adding device history:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get device history (last 20 entries)
     */
    getDeviceHistory: async (limit = 20) => {
        try {
            const snapshot = await database()
                .ref(`${paths.deviceHistory}/${getUid()}`)
                .orderByChild('timestamp')
                .limitToLast(limit)
                .once('value');

            const data = snapshot.val();
            if (!data) return [];

            return Object.keys(data)
                .map(key => ({
                    id: key,
                    ...data[key],
                }))
                .reverse(); // Newest first
        } catch (error) {
            console.error('Error getting device history:', error);
            return [];
        }
    },

    // ==================== ROOMS ====================

    /**
     * Get all rooms
     */
    getRooms: async () => {
        try {
            const snapshot = await database()
                .ref(`${paths.rooms}/${getUid()}`)
                .once('value');

            const data = snapshot.val();
            if (!data) return [];

            return Object.keys(data).map(key => ({
                id: key,
                ...data[key],
            }));
        } catch (error) {
            console.error('Error getting rooms:', error);
            return [];
        }
    },

    /**
     * Save room
     */
    saveRoom: async (room) => {
        try {
            await database()
                .ref(`${paths.rooms}/${getUid()}/${room.id}`)
                .set(room);

            return { success: true };
        } catch (error) {
            console.error('Error saving room:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Delete room
     */
    deleteRoom: async (roomId) => {
        try {
            await database()
                .ref(`${paths.rooms}/${getUid()}/${roomId}`)
                .remove();

            return { success: true };
        } catch (error) {
            console.error('Error deleting room:', error);
            return { success: false, error: error.message };
        }
    },

    // ==================== SCHEDULES ====================

    /**
     * Get all schedules
     */
    getSchedules: async () => {
        try {
            const snapshot = await database()
                .ref(`${paths.schedules}/${getUid()}`)
                .once('value');

            const data = snapshot.val();
            if (!data) return [];

            return Object.keys(data).map(key => ({
                id: key,
                ...data[key],
            }));
        } catch (error) {
            console.error('Error getting schedules:', error);
            return [];
        }
    },

    /**
     * Save schedule
     */
    saveSchedule: async (schedule) => {
        try {
            await database()
                .ref(`${paths.schedules}/${getUid()}/${schedule.id}`)
                .set({
                    ...schedule,
                    updatedAt: database.ServerValue.TIMESTAMP,
                });

            return { success: true };
        } catch (error) {
            console.error('Error saving schedule:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Delete schedule
     */
    deleteSchedule: async (scheduleId) => {
        try {
            await database()
                .ref(`${paths.schedules}/${getUid()}/${scheduleId}`)
                .remove();

            return { success: true };
        } catch (error) {
            console.error('Error deleting schedule:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Subscribe to schedules changes
     */
    subscribeToSchedules: (callback) => {
        const ref = database().ref(`${paths.schedules}/${getUid()}`);

        const listener = ref.on('value', (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                callback([]);
                return;
            }

            const schedules = Object.keys(data).map(key => ({
                id: key,
                ...data[key],
            }));
            callback(schedules);
        });

        return () => ref.off('value', listener);
    },

    // ==================== USER PROFILE ====================

    /**
     * Get user profile
     */
    getUserProfile: async () => {
        try {
            const snapshot = await database()
                .ref(`${paths.users}/${getUid()}`)
                .once('value');

            return snapshot.val();
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    },

    /**
     * Save user profile
     */
    saveUserProfile: async (profile) => {
        try {
            await database()
                .ref(`${paths.users}/${getUid()}`)
                .update({
                    ...profile,
                    updatedAt: database.ServerValue.TIMESTAMP,
                });

            return { success: true };
        } catch (error) {
            console.error('Error saving user profile:', error);
            return { success: false, error: error.message };
        }
    },
};

export default firebaseDatabase;
