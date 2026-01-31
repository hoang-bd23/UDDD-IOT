/**
 * Home Screen
 * Main dashboard showing devices overview and quick controls
 */

import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDevices } from '../../context/DeviceContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

export default function HomeScreen({ navigation }) {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);

    const { user } = useAuth();
    const {
        devices,
        isLoading,
        connectionStatus,
        toggleDevice,
        checkConnection,
        refreshDevices,
    } = useDevices();

    // Check connection on mount only (once)
    useEffect(() => {
        checkConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(async () => {
        await refreshDevices();
        await checkConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshDevices]);

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return colors.success;
            case 'connecting':
                return colors.warning;
            default:
                return colors.error;
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'Đã kết nối';
            case 'connecting':
                return 'Đang kết nối...';
            default:
                return 'Mất kết nối';
        }
    };

    const handleDeviceToggle = async (deviceId) => {
        const result = await toggleDevice(deviceId);
        if (!result.success) {
            Alert.alert('Lỗi', result.error || 'Không thể điều khiển thiết bị');
        }
    };

    const activeDevicesCount = devices.filter(d => d.isOn).length;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={onRefresh}
                    colors={[colors.primary]}
                />
            }
        >
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <View>
                    <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>
                        Xin chào,
                    </Text>
                    <Text style={[styles.userName, { color: theme.text }]}>
                        {user?.displayName || 'Người dùng'}
                    </Text>
                </View>
                <View style={styles.connectionBadge}>
                    <View
                        style={[
                            styles.connectionDot,
                            { backgroundColor: getConnectionStatusColor() }
                        ]}
                    />
                    <Text style={[styles.connectionText, { color: getConnectionStatusColor() }]}>
                        {getConnectionStatusText()}
                    </Text>
                </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                    <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
                        <Icon name="bulb" size={24} color={colors.primary} />
                    </View>
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {devices.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Thiết bị
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                    <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
                        <Icon name="power" size={24} color={colors.success} />
                    </View>
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {activeDevicesCount}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Đang bật
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                    <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
                        <Icon name="videocam" size={24} color={colors.accent} />
                    </View>
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        1
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Camera
                    </Text>
                </View>
            </View>

            {/* Quick Controls */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Điều khiển nhanh
                </Text>

                {devices.map((device) => (
                    <TouchableOpacity
                        key={device.id}
                        style={[
                            styles.deviceCard,
                            { backgroundColor: theme.surface },
                            device.isOn && styles.deviceCardActive,
                        ]}
                        onPress={() => handleDeviceToggle(device.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.deviceInfo}>
                            <View
                                style={[
                                    styles.deviceIconContainer,
                                    { backgroundColor: device.isOn ? colors.accent + '20' : theme.surfaceSecondary }
                                ]}
                            >
                                <Icon
                                    name={device.isOn ? 'bulb' : 'bulb-outline'}
                                    size={28}
                                    color={device.isOn ? colors.accent : theme.textMuted}
                                />
                            </View>
                            <View style={styles.deviceText}>
                                <Text style={[styles.deviceName, { color: theme.text }]}>
                                    {device.name}
                                </Text>
                                <Text style={[styles.deviceStatus, { color: theme.textSecondary }]}>
                                    {device.isOn ? 'Đang bật' : 'Đang tắt'}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.toggleButton,
                                { backgroundColor: device.isOn ? colors.success : theme.surfaceSecondary }
                            ]}
                        >
                            <Icon
                                name={device.isOn ? 'power' : 'power-outline'}
                                size={20}
                                color={device.isOn ? colors.white : theme.textMuted}
                            />
                        </View>
                    </TouchableOpacity>
                ))}

                {devices.length === 0 && (
                    <View style={styles.emptyState}>
                        <Icon name="bulb-outline" size={48} color={theme.textMuted} />
                        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                            Chưa có thiết bị nào
                        </Text>
                    </View>
                )}
            </View>

            {/* Camera Preview Card */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Camera giám sát
                </Text>

                <TouchableOpacity
                    style={[styles.cameraCard, { backgroundColor: theme.surface }]}
                    onPress={() => navigation.navigate('Camera', { screen: 'LiveStream' })}
                    activeOpacity={0.7}
                >
                    <View style={styles.cameraPreview}>
                        <Icon name="videocam" size={40} color={theme.textMuted} />
                    </View>
                    <View style={styles.cameraInfo}>
                        <Text style={[styles.cameraName, { color: theme.text }]}>
                            Camera Raspberry Pi
                        </Text>
                        <Text style={[styles.cameraStatus, { color: theme.textSecondary }]}>
                            Nhấn để xem trực tiếp
                        </Text>
                    </View>
                    <Icon name="chevron-forward" size={24} color={theme.textMuted} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.screenPadding,
        paddingBottom: spacing.huge,
    },
    welcomeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    welcomeText: {
        ...typography.body,
    },
    userName: {
        ...typography.h3,
    },
    connectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: spacing.borderRadius.full,
    },
    connectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    connectionText: {
        ...typography.caption,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    statCard: {
        flex: 1,
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        alignItems: 'center',
        ...globalStyles.shadowSmall,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        ...typography.h3,
        marginBottom: spacing.xs,
    },
    statLabel: {
        ...typography.caption,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h4,
        marginBottom: spacing.md,
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.md,
        ...globalStyles.shadowSmall,
    },
    deviceCardActive: {
        borderWidth: 1,
        borderColor: colors.accent,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deviceIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    deviceText: {
        justifyContent: 'center',
    },
    deviceName: {
        ...typography.bodyLarge,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    deviceStatus: {
        ...typography.bodySmall,
    },
    toggleButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        padding: spacing.xxxl,
    },
    emptyText: {
        ...typography.body,
        marginTop: spacing.md,
    },
    cameraCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        ...globalStyles.shadowSmall,
    },
    cameraPreview: {
        width: 80,
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: spacing.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    cameraInfo: {
        flex: 1,
    },
    cameraName: {
        ...typography.bodyLarge,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    cameraStatus: {
        ...typography.bodySmall,
    },
});
