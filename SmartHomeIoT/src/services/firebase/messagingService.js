/**
 * Firebase Cloud Messaging Service
 * Handles push notifications
 */

import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_TOKEN_KEY = '@SmartHome:fcmToken';

export const firebaseMessaging = {
    /**
     * Request notification permissions
     */
    requestPermission: async () => {
        try {
            if (Platform.OS === 'android') {
                // Android 13+ requires explicit permission
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
                return true;
            }

            // iOS
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            return enabled;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    },

    /**
     * Get FCM token
     */
    getToken: async () => {
        try {
            // Check if we have a stored token
            const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);

            // Get current token
            const token = await messaging().getToken();

            // Store if new
            if (token !== storedToken) {
                await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
            }

            return token;
        } catch (error) {
            console.error('Error getting FCM token:', error);
            return null;
        }
    },

    /**
     * Delete FCM token (on logout)
     */
    deleteToken: async () => {
        try {
            await messaging().deleteToken();
            await AsyncStorage.removeItem(FCM_TOKEN_KEY);
            return { success: true };
        } catch (error) {
            console.error('Error deleting FCM token:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Setup foreground message handler
     * Call this in App.js or root component
     */
    onForegroundMessage: (callback) => {
        return messaging().onMessage(async (remoteMessage) => {
            console.log('Foreground message received:', remoteMessage);

            // Show alert for foreground messages
            if (remoteMessage.notification) {
                Alert.alert(
                    remoteMessage.notification.title || 'Thông báo',
                    remoteMessage.notification.body || '',
                    [{ text: 'OK' }]
                );
            }

            if (callback) {
                callback(remoteMessage);
            }
        });
    },

    /**
     * Setup background message handler
     * Call this in index.js BEFORE AppRegistry.registerComponent
     */
    setBackgroundMessageHandler: () => {
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Background message received:', remoteMessage);
            // Handle background message (e.g., update local state)
        });
    },

    /**
     * Get initial notification (app opened from quit state)
     */
    getInitialNotification: async () => {
        try {
            const remoteMessage = await messaging().getInitialNotification();
            if (remoteMessage) {
                console.log('App opened from notification:', remoteMessage);
                return remoteMessage;
            }
            return null;
        } catch (error) {
            console.error('Error getting initial notification:', error);
            return null;
        }
    },

    /**
     * Handle notification opened (app in background)
     */
    onNotificationOpenedApp: (callback) => {
        return messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('Notification opened app:', remoteMessage);
            if (callback) {
                callback(remoteMessage);
            }
        });
    },

    /**
     * Subscribe to topic
     */
    subscribeToTopic: async (topic) => {
        try {
            await messaging().subscribeToTopic(topic);
            console.log(`Subscribed to topic: ${topic}`);
            return { success: true };
        } catch (error) {
            console.error('Error subscribing to topic:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Unsubscribe from topic
     */
    unsubscribeFromTopic: async (topic) => {
        try {
            await messaging().unsubscribeFromTopic(topic);
            console.log(`Unsubscribed from topic: ${topic}`);
            return { success: true };
        } catch (error) {
            console.error('Error unsubscribing from topic:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Initialize messaging (call on app start)
     */
    initialize: async () => {
        try {
            // Request permission
            const hasPermission = await firebaseMessaging.requestPermission();
            if (!hasPermission) {
                console.log('Notification permission denied');
                return { success: false, error: 'Permission denied' };
            }

            // Get token
            const token = await firebaseMessaging.getToken();
            console.log('FCM Token:', token);

            // Subscribe to default topics
            await firebaseMessaging.subscribeToTopic('smarthome-updates');
            await firebaseMessaging.subscribeToTopic('schedule-alerts');
            await firebaseMessaging.subscribeToTopic('connection-alerts');

            return { success: true, token };
        } catch (error) {
            console.error('Error initializing messaging:', error);
            return { success: false, error: error.message };
        }
    },
};

export default firebaseMessaging;
