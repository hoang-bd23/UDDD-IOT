/**
 * Rooms Screen
 * Manage rooms and their devices
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    useColorScheme,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRooms } from '../../context/RoomContext';
import { useDevices } from '../../context/DeviceContext';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

export default function RoomsScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const theme = getThemeColors(isDarkMode);

    const { rooms } = useRooms();
    const { devices } = useDevices();

    const getDevicesInRoom = (roomId) => {
        return devices.filter(d => d.room === roomId);
    };

    const getActiveDevicesInRoom = (roomId) => {
        return devices.filter(d => d.room === roomId && d.isOn);
    };

    const renderRoom = ({ item }) => {
        const roomDevices = getDevicesInRoom(item.id);
        const activeDevices = getActiveDevicesInRoom(item.id);

        return (
            <TouchableOpacity
                style={[styles.roomCard, { backgroundColor: theme.surface }]}
                onPress={() => Alert.alert(item.name, `${roomDevices.length} thiết bị`)}
                activeOpacity={0.7}
            >
                <View
                    style={[
                        styles.roomIcon,
                        { backgroundColor: item.color + '20' }
                    ]}
                >
                    <Icon name={item.icon || 'home-outline'} size={32} color={item.color} />
                </View>

                <View style={styles.roomInfo}>
                    <Text style={[styles.roomName, { color: theme.text }]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.roomDevices, { color: theme.textSecondary }]}>
                        {roomDevices.length} thiết bị • {activeDevices.length} đang bật
                    </Text>
                </View>

                <Icon name="chevron-forward" size={24} color={theme.textMuted} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {rooms.length > 0 ? (
                <FlatList
                    data={rooms}
                    renderItem={renderRoom}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Icon name="grid-outline" size={64} color={theme.textMuted} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>
                        Chưa có phòng nào
                    </Text>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        Thêm phòng mới để tổ chức thiết bị
                    </Text>
                </View>
            )}

            {/* Add Room FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => Alert.alert('Thêm phòng', 'Tính năng đang phát triển')}
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
    roomCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        marginBottom: spacing.md,
        ...globalStyles.shadowSmall,
    },
    roomIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    roomInfo: {
        flex: 1,
    },
    roomName: {
        ...typography.bodyLarge,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    roomDevices: {
        ...typography.bodySmall,
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
