/**
 * Firebase Notification Context
 * Manages push notification state and handlers
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firebaseMessaging } from '../services/firebase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [fcmToken, setFcmToken] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [hasPermission, setHasPermission] = useState(false);

    // Initialize messaging when authenticated
    useEffect(() => {
        if (!isAuthenticated) return;

        initializeNotifications();

        // Setup foreground handler
        const unsubscribeForeground = firebaseMessaging.onForegroundMessage((message) => {
            console.log('Received foreground message:', message);
            addNotification(message);
        });

        // Setup notification opened handler
        const unsubscribeOpened = firebaseMessaging.onNotificationOpenedApp((message) => {
            console.log('Notification opened app:', message);
            handleNotificationAction(message);
        });

        // Check for initial notification
        checkInitialNotification();

        return () => {
            unsubscribeForeground();
            unsubscribeOpened();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const initializeNotifications = async () => {
        try {
            const result = await firebaseMessaging.initialize();
            if (result.success) {
                setFcmToken(result.token);
                setHasPermission(true);
            }
        } catch (error) {
            console.error('Error initializing notifications:', error);
        }
    };

    const checkInitialNotification = async () => {
        const initialMessage = await firebaseMessaging.getInitialNotification();
        if (initialMessage) {
            handleNotificationAction(initialMessage);
        }
    };

    const addNotification = useCallback((message) => {
        const notification = {
            id: Date.now().toString(),
            title: message.notification?.title || 'SmartHome',
            body: message.notification?.body || '',
            data: message.data || {},
            timestamp: Date.now(),
            read: false,
        };

        setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
    }, []);

    const handleNotificationAction = useCallback((message) => {
        // Handle notification action based on data
        const { data } = message;

        if (data?.type === 'schedule') {
            // Navigate to schedule screen
            console.log('Schedule notification:', data);
        } else if (data?.type === 'connection') {
            // Navigate to settings for connection setup
            console.log('Connection notification:', data);
        } else if (data?.type === 'device') {
            // Navigate to device
            console.log('Device notification:', data);
        }
    }, []);

    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const getUnreadCount = useCallback(() => {
        return notifications.filter(n => !n.read).length;
    }, [notifications]);

    const subscribeToScheduleAlerts = useCallback(async () => {
        return await firebaseMessaging.subscribeToTopic('schedule-alerts');
    }, []);

    const subscribeToConnectionAlerts = useCallback(async () => {
        return await firebaseMessaging.subscribeToTopic('connection-alerts');
    }, []);

    const value = {
        fcmToken,
        notifications,
        hasPermission,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        getUnreadCount,
        subscribeToScheduleAlerts,
        subscribeToConnectionAlerts,
        requestPermission: firebaseMessaging.requestPermission,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

export default NotificationContext;
