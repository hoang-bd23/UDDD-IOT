/**
 * Camera Screen
 * Camera overview and selection
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDevices } from '../../context/DeviceContext';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

export default function CameraScreen({ navigation }) {
    const isDarkMode = useColorScheme() === 'dark';
    const theme = getThemeColors(isDarkMode);

    const { connectionStatus, raspberryPiUrl } = useDevices();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <Text style={styles.headerTitle}>Camera</Text>
            </View>

            <View style={styles.content}>
                {/* Camera Card */}
                <TouchableOpacity
                    style={[styles.cameraCard, { backgroundColor: theme.surface }]}
                    onPress={() => navigation.navigate('LiveStream')}
                    activeOpacity={0.7}
                >
                    <View style={styles.cameraPreview}>
                        <View style={[styles.cameraPlaceholder, { backgroundColor: theme.surfaceSecondary }]}>
                            <Icon name="videocam" size={48} color={theme.textMuted} />
                        </View>
                    </View>

                    <View style={styles.cameraInfo}>
                        <View style={styles.cameraHeader}>
                            <Text style={[styles.cameraName, { color: theme.text }]}>
                                Camera Raspberry Pi
                            </Text>
                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor: connectionStatus === 'connected'
                                            ? colors.success + '20'
                                            : colors.error + '20'
                                    }
                                ]}
                            >
                                <View
                                    style={[
                                        styles.statusDot,
                                        {
                                            backgroundColor: connectionStatus === 'connected'
                                                ? colors.success
                                                : colors.error
                                        }
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.statusText,
                                        {
                                            color: connectionStatus === 'connected'
                                                ? colors.success
                                                : colors.error
                                        }
                                    ]}
                                >
                                    {connectionStatus === 'connected' ? 'Online' : 'Offline'}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.cameraUrl, { color: theme.textSecondary }]}>
                            {raspberryPiUrl}/camera/stream
                        </Text>

                        <View style={styles.viewButton}>
                            <Icon name="play-circle" size={20} color={colors.primary} />
                            <Text style={[styles.viewButtonText, { color: colors.primary }]}>
                                Xem trực tiếp
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Info */}
                <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
                    <Icon name="information-circle" size={24} color={colors.info} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoTitle, { color: theme.text }]}>
                            Hướng dẫn
                        </Text>
                        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                            Đảm bảo Raspberry Pi Camera Server đang chạy và kết nối cùng mạng WiFi với điện thoại.
                        </Text>
                    </View>
                </View>

                {/* Features List */}
                <View style={styles.featuresList}>
                    <Text style={[styles.featuresTitle, { color: theme.text }]}>
                        Tính năng Camera
                    </Text>

                    <View style={styles.featureItem}>
                        <Icon name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                            Xem video trực tiếp (MJPEG Stream)
                        </Text>
                    </View>

                    <View style={styles.featureItem}>
                        <Icon name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                            Chụp ảnh snapshot
                        </Text>
                    </View>

                    <View style={styles.featureItem}>
                        <Icon name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                            Điều khiển start/stop stream
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.screenPadding,
    },
    headerTitle: {
        ...typography.h4,
        color: colors.white,
    },
    content: {
        flex: 1,
        padding: spacing.screenPadding,
    },
    cameraCard: {
        borderRadius: spacing.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        ...globalStyles.shadowMedium,
    },
    cameraPreview: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraInfo: {
        padding: spacing.lg,
    },
    cameraHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cameraName: {
        ...typography.bodyLarge,
        fontWeight: '600',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.borderRadius.full,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: spacing.xs,
    },
    statusText: {
        ...typography.caption,
        fontWeight: '600',
    },
    cameraUrl: {
        ...typography.bodySmall,
        marginBottom: spacing.md,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    viewButtonText: {
        ...typography.button,
    },
    infoCard: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.lg,
        ...globalStyles.shadowSmall,
    },
    infoContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    infoTitle: {
        ...typography.label,
        marginBottom: spacing.xs,
    },
    infoText: {
        ...typography.bodySmall,
        lineHeight: 20,
    },
    featuresList: {
        marginTop: spacing.md,
    },
    featuresTitle: {
        ...typography.bodyLarge,
        fontWeight: '600',
        marginBottom: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    featureText: {
        ...typography.body,
    },
});
