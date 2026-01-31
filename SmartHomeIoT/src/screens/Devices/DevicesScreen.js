/**
 * Devices Screen
 * List all devices with control options
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDevices } from '../../context/DeviceContext';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

export default function DevicesScreen() {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);

    const { devices, toggleDevice, connectionStatus } = useDevices();

    const handleDeviceToggle = async (device) => {
        if (connectionStatus !== 'connected') {
            Alert.alert(
                'Không có kết nối',
                'Không thể điều khiển thiết bị khi mất kết nối với Raspberry Pi'
            );
            return;
        }

        const result = await toggleDevice(device.id);
        if (!result.success) {
            Alert.alert('Lỗi', result.error || 'Không thể điều khiển thiết bị');
        }
    };

    const renderDevice = ({ item }) => (
        <TouchableOpacity
            style={[styles.deviceCard, { backgroundColor: theme.surface }]}
            onPress={() => handleDeviceToggle(item)}
            activeOpacity={0.7}
        >
            <View style={styles.deviceHeader}>
                <View
                    style={[
                        styles.deviceIcon,
                        { backgroundColor: item.isOn ? colors.accent + '20' : theme.surfaceSecondary }
                    ]}
                >
                    <Icon
                        name={item.isOn ? 'bulb' : 'bulb-outline'}
                        size={32}
                        color={item.isOn ? colors.accent : theme.textMuted}
                    />
                </View>
                <View
                    style={[
                        styles.statusIndicator,
                        { backgroundColor: item.isOn ? colors.success : theme.textMuted }
                    ]}
                />
            </View>

            <Text style={[styles.deviceName, { color: theme.text }]} numberOfLines={1}>
                {item.name}
            </Text>

            <Text style={[styles.deviceRoom, { color: theme.textSecondary }]}>
                {item.room === 'living-room' ? 'Phòng khách' :
                    item.room === 'bedroom' ? 'Phòng ngủ' :
                        item.room === 'kitchen' ? 'Nhà bếp' : item.room}
            </Text>

            <View style={styles.deviceFooter}>
                <Text
                    style={[
                        styles.deviceStatus,
                        { color: item.isOn ? colors.success : theme.textMuted }
                    ]}
                >
                    {item.isOn ? 'BẬT' : 'TẮT'}
                </Text>
                <Icon
                    name={item.isOn ? 'toggle' : 'toggle-outline'}
                    size={24}
                    color={item.isOn ? colors.success : theme.textMuted}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {devices.length > 0 ? (
                <FlatList
                    data={devices}
                    renderItem={renderDevice}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Icon name="bulb-outline" size={64} color={theme.textMuted} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>
                        Chưa có thiết bị
                    </Text>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        Thêm thiết bị mới để bắt đầu điều khiển
                    </Text>
                </View>
            )}

            {/* Add Device FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => Alert.alert('Thêm thiết bị', 'Tính năng đang phát triển')}
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
    row: {
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    deviceCard: {
        width: '48%',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        ...globalStyles.shadowSmall,
    },
    deviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    deviceIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    deviceName: {
        ...typography.bodyLarge,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    deviceRoom: {
        ...typography.bodySmall,
        marginBottom: spacing.md,
    },
    deviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deviceStatus: {
        ...typography.label,
        fontWeight: '700',
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
