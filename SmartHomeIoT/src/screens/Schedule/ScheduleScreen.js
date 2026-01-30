/**
 * Schedule Screen
 * Manage automation schedules
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Switch,
    useColorScheme,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSchedules } from '../../context/ScheduleContext';
import { useDevices } from '../../context/DeviceContext';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

export default function ScheduleScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const theme = getThemeColors(isDarkMode);

    const { schedules, toggleSchedule, removeSchedule } = useSchedules();
    const { devices } = useDevices();

    const getDeviceName = (deviceId) => {
        const device = devices.find(d => d.id === deviceId);
        return device?.name || 'Thiết bị không xác định';
    };

    const formatTime = (time) => {
        if (!time) return '--:--';
        return time;
    };

    const formatDays = (days) => {
        if (!days || days.length === 0) return 'Một lần';
        if (days.length === 7) return 'Hàng ngày';

        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return days.map(d => dayNames[d]).join(', ');
    };

    const handleDelete = (scheduleId) => {
        Alert.alert(
            'Xóa lịch hẹn',
            'Bạn có chắc muốn xóa lịch hẹn này?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => removeSchedule(scheduleId) },
            ]
        );
    };

    const renderSchedule = ({ item }) => (
        <View style={[styles.scheduleCard, { backgroundColor: theme.surface }]}>
            <View style={styles.scheduleHeader}>
                <View style={styles.scheduleTimeContainer}>
                    <Text style={[styles.scheduleTime, { color: theme.text }]}>
                        {formatTime(item.time)}
                    </Text>
                    <View style={styles.actionBadge}>
                        <Icon
                            name={item.action === 'on' ? 'power' : 'power-outline'}
                            size={12}
                            color={item.action === 'on' ? colors.success : colors.error}
                        />
                        <Text
                            style={[
                                styles.actionText,
                                { color: item.action === 'on' ? colors.success : colors.error }
                            ]}
                        >
                            {item.action === 'on' ? 'BẬT' : 'TẮT'}
                        </Text>
                    </View>
                </View>

                <Switch
                    value={item.isEnabled}
                    onValueChange={() => toggleSchedule(item.id)}
                    trackColor={{ false: theme.surfaceSecondary, true: colors.primary + '50' }}
                    thumbColor={item.isEnabled ? colors.primary : theme.textMuted}
                />
            </View>

            <View style={styles.scheduleBody}>
                <View style={styles.scheduleInfo}>
                    <Icon name="bulb-outline" size={16} color={theme.textSecondary} />
                    <Text style={[styles.deviceName, { color: theme.text }]}>
                        {getDeviceName(item.deviceId)}
                    </Text>
                </View>

                <View style={styles.scheduleInfo}>
                    <Icon name="calendar-outline" size={16} color={theme.textSecondary} />
                    <Text style={[styles.repeatText, { color: theme.textSecondary }]}>
                        {formatDays(item.repeatDays)}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
            >
                <Icon name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {schedules.length > 0 ? (
                <FlatList
                    data={schedules}
                    renderItem={renderSchedule}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Icon name="time-outline" size={64} color={theme.textMuted} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>
                        Chưa có lịch hẹn
                    </Text>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        Tạo lịch hẹn để tự động hóa thiết bị
                    </Text>
                </View>
            )}

            {/* Add Schedule FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => Alert.alert('Thêm lịch hẹn', 'Tính năng đang phát triển')}
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
        padding: spacing.screenPadding,
        paddingBottom: 100,
    },
    scheduleCard: {
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.md,
        ...globalStyles.shadowSmall,
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    scheduleTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scheduleTime: {
        ...typography.h3,
        marginRight: spacing.md,
    },
    actionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.borderRadius.sm,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    actionText: {
        ...typography.caption,
        fontWeight: '600',
        marginLeft: spacing.xs,
    },
    scheduleBody: {
        gap: spacing.sm,
    },
    scheduleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    deviceName: {
        ...typography.body,
    },
    repeatText: {
        ...typography.bodySmall,
    },
    deleteButton: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        padding: spacing.sm,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: {
        ...typography.h4,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    emptyText: {
        ...typography.body,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...globalStyles.shadowMedium,
    },
});
