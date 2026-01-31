/**
 * Local Notification Service
 * Handles local push notifications using Notifee
 */

import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';

// Channel IDs
const CHANNEL_IDS = {
    CONNECTION: 'connection-alerts',
    SCHEDULE: 'schedule-alerts',
    DEVICE: 'device-alerts',
};

export const localNotifications = {
    /**
     * Initialize notification channels (Android)
     */
    initialize: async () => {
        // Connection alerts channel
        await notifee.createChannel({
            id: CHANNEL_IDS.CONNECTION,
            name: 'Thông báo kết nối',
            description: 'Thông báo khi mất hoặc khôi phục kết nối với Raspberry Pi',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        });

        // Schedule alerts channel
        await notifee.createChannel({
            id: CHANNEL_IDS.SCHEDULE,
            name: 'Thông báo lịch hẹn',
            description: 'Thông báo khi lịch bật/tắt đèn được thực thi',
            importance: AndroidImportance.DEFAULT,
            sound: 'default',
        });

        // Device alerts channel
        await notifee.createChannel({
            id: CHANNEL_IDS.DEVICE,
            name: 'Thông báo thiết bị',
            description: 'Thông báo trạng thái thiết bị',
            importance: AndroidImportance.DEFAULT,
        });
    },

    /**
     * Show connection lost notification
     */
    showConnectionLost: async () => {
        await notifee.displayNotification({
            title: '⚠️ Mất kết nối',
            body: 'Không thể kết nối với Raspberry Pi. Kiểm tra kết nối mạng.',
            android: {
                channelId: CHANNEL_IDS.CONNECTION,
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
                style: {
                    type: AndroidStyle.BIGTEXT,
                    text: 'Không thể kết nối với Raspberry Pi. Vui lòng kiểm tra:\n\n• Raspberry Pi đang bật\n• Cùng mạng WiFi\n• LED Server đang chạy',
                },
                smallIcon: 'ic_launcher',
                color: '#F44336',
            },
        });
    },

    /**
     * Show connection restored notification
     */
    showConnectionRestored: async () => {
        await notifee.displayNotification({
            title: '✅ Đã kết nối',
            body: 'Đã kết nối lại với Raspberry Pi!',
            android: {
                channelId: CHANNEL_IDS.CONNECTION,
                importance: AndroidImportance.DEFAULT,
                pressAction: {
                    id: 'default',
                },
                smallIcon: 'ic_launcher',
                color: '#4CAF50',
            },
        });
    },

    /**
     * Show schedule executed notification
     */
    showScheduleExecuted: async (action, time) => {
        const isOn = action === 'ON';
        await notifee.displayNotification({
            title: isOn ? '💡 Đèn đã bật' : '🌙 Đèn đã tắt',
            body: `Lịch hẹn lúc ${time} đã được thực thi`,
            android: {
                channelId: CHANNEL_IDS.SCHEDULE,
                importance: AndroidImportance.DEFAULT,
                pressAction: {
                    id: 'default',
                },
                smallIcon: 'ic_launcher',
                color: isOn ? '#FFC107' : '#607D8B',
            },
        });
    },

    /**
     * Show custom notification
     */
    show: async (title, body, channelId = CHANNEL_IDS.DEVICE) => {
        await notifee.displayNotification({
            title,
            body,
            android: {
                channelId,
                importance: AndroidImportance.DEFAULT,
                pressAction: {
                    id: 'default',
                },
                smallIcon: 'ic_launcher',
            },
        });
    },

    /**
     * Cancel all notifications
     */
    cancelAll: async () => {
        await notifee.cancelAllNotifications();
    },

    CHANNEL_IDS,
};

export default localNotifications;
