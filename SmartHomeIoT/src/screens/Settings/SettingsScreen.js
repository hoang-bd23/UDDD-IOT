/**
 * Settings Screen
 * App settings and configuration
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    Alert,
    useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { useDevices } from '../../context/DeviceContext';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

export default function SettingsScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const theme = getThemeColors(isDarkMode);

    const { user, logout } = useAuth();
    const {
        raspberryPiUrl,
        cameraUrl,
        setServerUrl,
        setCameraServerUrl,
        connectionStatus,
        checkConnection
    } = useDevices();

    const [serverUrl, setServerUrlInput] = useState(raspberryPiUrl);
    const [camUrl, setCamUrlInput] = useState(cameraUrl);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleSaveServerUrl = () => {
        if (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://')) {
            Alert.alert('Lỗi', 'URL phải bắt đầu bằng http:// hoặc https://');
            return;
        }
        setServerUrl(serverUrl);
        Alert.alert('Thành công', 'Đã lưu địa chỉ LED server');
    };

    const handleSaveCameraUrl = () => {
        if (!camUrl.startsWith('http://') && !camUrl.startsWith('https://')) {
            Alert.alert('Lỗi', 'URL phải bắt đầu bằng http:// hoặc https://');
            return;
        }
        setCameraServerUrl(camUrl);
        Alert.alert('Thành công', 'Đã lưu địa chỉ Camera server');
    };

    const handleTestConnection = async () => {
        const connected = await checkConnection();
        if (connected) {
            Alert.alert('Thành công', 'Kết nối thành công với Raspberry Pi');
        } else {
            Alert.alert('Lỗi', 'Không thể kết nối với Raspberry Pi. Kiểm tra địa chỉ IP và đảm bảo server đang chạy.');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: logout },
            ]
        );
    };

    const SettingItem = ({ icon, title, subtitle, right, onPress }) => (
        <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: theme.surface }]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                <Icon name={icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {right}
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
        >
            {/* User Info */}
            <View style={[styles.userCard, { backgroundColor: theme.surface }]}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.text }]}>
                        {user?.displayName || 'Người dùng'}
                    </Text>
                    <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                        {user?.email || 'email@example.com'}
                    </Text>
                </View>
            </View>

            {/* LED Server Settings */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                KẾT NỐI LED SERVER (Port 8080)
            </Text>

            <View style={[styles.card, { backgroundColor: theme.surface }]}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>
                        Địa chỉ LED server:
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.surfaceSecondary,
                                color: theme.text,
                                borderColor: theme.border,
                            }
                        ]}
                        value={serverUrl}
                        onChangeText={setServerUrlInput}
                        placeholder="http://192.168.1.100:8080"
                        placeholderTextColor={theme.textMuted}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonOutline, { borderColor: colors.primary }]}
                        onPress={handleTestConnection}
                    >
                        <Text style={[styles.buttonText, { color: colors.primary }]}>
                            Kiểm tra
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleSaveServerUrl}
                    >
                        <Text style={[styles.buttonText, { color: colors.white }]}>
                            Lưu
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.connectionStatus}>
                    <View
                        style={[
                            styles.connectionDot,
                            {
                                backgroundColor: connectionStatus === 'connected'
                                    ? colors.success
                                    : connectionStatus === 'connecting'
                                        ? colors.warning
                                        : colors.error
                            }
                        ]}
                    />
                    <Text style={[styles.connectionText, { color: theme.textSecondary }]}>
                        {connectionStatus === 'connected' ? 'Đã kết nối' :
                            connectionStatus === 'connecting' ? 'Đang kết nối...' : 'Mất kết nối'}
                    </Text>
                </View>
            </View>

            {/* Camera Server Settings */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                KẾT NỐI CAMERA SERVER (Port 8081)
            </Text>

            <View style={[styles.card, { backgroundColor: theme.surface }]}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>
                        Địa chỉ Camera server:
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.surfaceSecondary,
                                color: theme.text,
                                borderColor: theme.border,
                            }
                        ]}
                        value={camUrl}
                        onChangeText={setCamUrlInput}
                        placeholder="http://192.168.1.100:8081"
                        placeholderTextColor={theme.textMuted}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={handleSaveCameraUrl}
                >
                    <Text style={[styles.buttonText, { color: colors.white }]}>
                        Lưu Camera URL
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Notifications */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                THÔNG BÁO
            </Text>

            <SettingItem
                icon="notifications-outline"
                title="Push Notifications"
                subtitle="Nhận thông báo khi schedule chạy và mất kết nối"
                right={
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: theme.surfaceSecondary, true: colors.primary + '50' }}
                        thumbColor={notificationsEnabled ? colors.primary : theme.textMuted}
                    />
                }
            />

            {/* App Info */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                ỨNG DỤNG
            </Text>

            <SettingItem
                icon="information-circle-outline"
                title="Phiên bản"
                subtitle="1.0.0"
            />

            <SettingItem
                icon="help-circle-outline"
                title="Hướng dẫn sử dụng"
                right={<Icon name="chevron-forward" size={20} color={theme.textMuted} />}
                onPress={() => Alert.alert('Hướng dẫn', 'Tính năng đang phát triển')}
            />

            {/* Logout */}
            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: colors.error + '10' }]}
                onPress={handleLogout}
            >
                <Icon name="log-out-outline" size={20} color={colors.error} />
                <Text style={[styles.logoutText, { color: colors.error }]}>
                    Đăng xuất
                </Text>
            </TouchableOpacity>
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
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.xl,
        ...globalStyles.shadowSmall,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        ...typography.h3,
        color: colors.white,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...typography.bodyLarge,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    userEmail: {
        ...typography.bodySmall,
    },
    sectionTitle: {
        ...typography.caption,
        fontWeight: '600',
        marginBottom: spacing.sm,
        marginTop: spacing.md,
        paddingHorizontal: spacing.xs,
    },
    card: {
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.md,
        ...globalStyles.shadowSmall,
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    inputLabel: {
        ...typography.label,
        marginBottom: spacing.sm,
    },
    input: {
        height: spacing.touchTarget,
        borderWidth: 1,
        borderRadius: spacing.borderRadius.md,
        paddingHorizontal: spacing.md,
        ...typography.body,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    button: {
        flex: 1,
        height: spacing.touchTarget,
        borderRadius: spacing.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonOutline: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    buttonText: {
        ...typography.button,
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    connectionText: {
        ...typography.bodySmall,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.sm,
        ...globalStyles.shadowSmall,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        ...typography.body,
        fontWeight: '500',
    },
    settingSubtitle: {
        ...typography.caption,
        marginTop: spacing.xs,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginTop: spacing.xl,
        gap: spacing.sm,
    },
    logoutText: {
        ...typography.button,
    },
});
