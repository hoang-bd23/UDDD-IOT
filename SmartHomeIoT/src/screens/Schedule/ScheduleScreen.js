/**
 * Schedule Screen
 * Display and manage LED schedules
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { firebaseDatabase } from '../../services/firebase';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

export default function ScheduleScreen({ navigation }) {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);

    const { isAuthenticated } = useAuth();

    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Load schedules from Firebase
    const loadSchedules = useCallback(async () => {
        if (!isAuthenticated) {
            setSchedules([]);
            setIsLoading(false);
            setIsRefreshing(false);
            return;
        }

        try {
            const data = await firebaseDatabase.getSchedules();
            setSchedules(data || []);
        } catch (error) {
            console.warn('Error loading schedules:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadSchedules();
    }, [loadSchedules]);

    // Refresh when screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadSchedules();
        });
        return unsubscribe;
    }, [navigation, loadSchedules]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadSchedules();
    }, [loadSchedules]);

    // Toggle schedule enabled/disabled
    const toggleSchedule = async (scheduleId, currentEnabled) => {
        try {
            await firebaseDatabase.updateSchedule(scheduleId, {
                enabled: !currentEnabled,
            });
            // Update local state
            setSchedules(prev =>
                prev.map(s =>
                    s.id === scheduleId ? { ...s, enabled: !currentEnabled } : s
                )
            );
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật lịch hẹn');
        }
    };

    // Delete schedule
    const deleteSchedule = (scheduleId) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc muốn xóa lịch hẹn này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await firebaseDatabase.deleteSchedule(scheduleId);
                            setSchedules(prev => prev.filter(s => s.id !== scheduleId));
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa lịch hẹn');
                        }
                    },
                },
            ]
        );
    };

    // Format repeat days
    const formatRepeatDays = (repeat) => {
        if (!repeat || repeat.length === 0) return 'Một lần';
        if (repeat.length === 7) return 'Hàng ngày';

        const dayMap = {
            'Mon': 'T2',
            'Tue': 'T3',
            'Wed': 'T4',
            'Thu': 'T5',
            'Fri': 'T6',
            'Sat': 'T7',
            'Sun': 'CN',
        };

        return repeat.map(d => dayMap[d] || d).join(', ');
    };

    // Render each schedule item
    const renderItem = ({ item }) => {
        const isOn = item.action === 'ON';

        return (
            <View style={[styles.scheduleItem, { backgroundColor: theme.surface }]}>
                <TouchableOpacity
                    style={styles.scheduleContent}
                    onPress={() => navigation.navigate('AddSchedule', { schedule: item })}
                    activeOpacity={0.7}
                >
                    <View style={[
                        styles.actionIndicator,
                        { backgroundColor: isOn ? colors.success : colors.error }
                    ]} />

                    <View style={styles.timeContainer}>
                        <Text style={[styles.time, { color: theme.text }]}>
                            {item.time}
                        </Text>
                        <View style={styles.detailsRow}>
                            <View style={[
                                styles.actionBadge,
                                { backgroundColor: isOn ? colors.success + '20' : colors.error + '20' }
                            ]}>
                                <Text style={[
                                    styles.actionText,
                                    { color: isOn ? colors.success : colors.error }
                                ]}>
                                    {isOn ? 'BẬT' : 'TẮT'}
                                </Text>
                            </View>
                            <Text style={[styles.repeatText, { color: theme.textMuted }]}>
                                {formatRepeatDays(item.repeat)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.actionsContainer}>
                    <Switch
                        value={item.enabled}
                        onValueChange={() => toggleSchedule(item.id, item.enabled)}
                        trackColor={{ false: theme.surfaceSecondary, true: colors.primary + '50' }}
                        thumbColor={item.enabled ? colors.primary : theme.textMuted}
                    />
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteSchedule(item.id)}
                    >
                        <Icon name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Empty state
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="alarm-outline" size={64} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Chưa có lịch hẹn
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                Nhấn nút + để tạo lịch bật/tắt đèn tự động
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={schedules}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    schedules.length === 0 && styles.emptyList
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={!isLoading && renderEmpty}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB to add new schedule */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('AddSchedule')}
                activeOpacity={0.8}
            >
                <Icon name="add" size={28} color={colors.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
    scheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.md,
        overflow: 'hidden',
        ...globalStyles.shadowSmall,
    },
    actionIndicator: {
        width: 4,
        height: '100%',
        position: 'absolute',
        left: 0,
    },
    scheduleContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        paddingLeft: spacing.lg + 4,
    },
    timeContainer: {
        flex: 1,
    },
    time: {
        ...typography.h2,
        fontWeight: '600',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    actionBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: spacing.borderRadius.sm,
        marginRight: spacing.sm,
    },
    actionText: {
        ...typography.caption,
        fontWeight: '700',
    },
    repeatText: {
        ...typography.caption,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: spacing.md,
        gap: spacing.sm,
    },
    deleteButton: {
        padding: spacing.sm,
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
    fab: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...globalStyles.shadowMedium,
    },
});
