/**
 * History Screen
 * Display device activity history from Firebase
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDevices } from '../../context/DeviceContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { firebaseDatabase } from '../../services/firebase';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

export default function HistoryScreen() {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);

    const { isAuthenticated } = useAuth();
    const { devices } = useDevices();

    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Load history from Firebase with timeout
    const loadHistory = useCallback(async () => {
        if (!isAuthenticated) {
            setHistory([]);
            setIsLoading(false);
            setIsRefreshing(false);
            return;
        }

        try {
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 10000)
            );

            const historyPromise = firebaseDatabase.getDeviceHistory(50);
            const historyData = await Promise.race([historyPromise, timeoutPromise]);

            setHistory(historyData || []);
        } catch (error) {
            console.warn('Error loading history:', error);
            setHistory([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadHistory();
    }, [loadHistory]);

    // Get device name from ID
    const getDeviceName = (deviceId) => {
        const device = devices.find(d => d.id === deviceId);
        return device?.name || 'Thiết bị không xác định';
    };

    // Format timestamp to readable string (time and date)
    const formatTime = (timestamp) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        const time = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });

        if (isToday) {
            return `Hôm nay, ${time}`;
        }

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return `Hôm qua, ${time}`;
        }

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Render each history item
    const renderItem = ({ item }) => {
        const isOn = item.action === 'ON';

        return (
            <View style={[styles.historyItem, { backgroundColor: theme.surface }]}>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: isOn ? colors.success + '20' : colors.error + '20' }
                ]}>
                    <Icon
                        name={isOn ? 'power' : 'power-outline'}
                        size={24}
                        color={isOn ? colors.success : colors.error}
                    />
                </View>

                <View style={styles.contentContainer}>
                    <Text style={[styles.deviceName, { color: theme.text }]}>
                        {getDeviceName(item.deviceId)}
                    </Text>
                    <View style={styles.actionRow}>
                        <View style={[
                            styles.actionBadge,
                            { backgroundColor: isOn ? colors.success : colors.error }
                        ]}>
                            <Text style={styles.actionText}>
                                {isOn ? 'BẬT' : 'TẮT'}
                            </Text>
                        </View>
                        <Text style={[styles.timestamp, { color: theme.textMuted }]}>
                            {formatTime(item.timestamp)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // Empty state
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="time-outline" size={64} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Chưa có lịch sử
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                Lịch sử hoạt động sẽ hiển thị khi bạn bật/tắt thiết bị
            </Text>
        </View>
    );

    // Loading state
    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                    Đang tải lịch sử...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    history.length === 0 && styles.emptyList
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: spacing.md,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingText: {
        ...typography.body,
        marginTop: spacing.md,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.md,
        ...globalStyles.shadowSmall,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    contentContainer: {
        flex: 1,
    },
    deviceName: {
        ...typography.bodyLarge,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: spacing.borderRadius.sm,
        marginRight: spacing.sm,
    },
    actionText: {
        ...typography.caption,
        color: colors.white,
        fontWeight: '700',
    },
    timestamp: {
        ...typography.caption,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: {
        ...typography.h4,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        ...typography.body,
        textAlign: 'center',
    },
});
