/**
 * Add/Edit Schedule Screen
 * Create or edit LED schedules
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { firebaseDatabase } from '../../services/firebase';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

const DAYS = [
    { key: 'Mon', label: 'T2' },
    { key: 'Tue', label: 'T3' },
    { key: 'Wed', label: 'T4' },
    { key: 'Thu', label: 'T5' },
    { key: 'Fri', label: 'T6' },
    { key: 'Sat', label: 'T7' },
    { key: 'Sun', label: 'CN' },
];

export default function AddScheduleScreen({ route, navigation }) {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);

    const { isAuthenticated } = useAuth();
    const existingSchedule = route.params?.schedule;
    const isEditing = !!existingSchedule;

    // Parse existing time or use current time
    const getInitialTime = () => {
        if (existingSchedule?.time) {
            const [hours, minutes] = existingSchedule.time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date;
        }
        return new Date();
    };

    const [time, setTime] = useState(getInitialTime());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [action, setAction] = useState(existingSchedule?.action || 'ON');
    const [repeatDays, setRepeatDays] = useState(existingSchedule?.repeat || []);
    const [isSaving, setIsSaving] = useState(false);

    // Format time to HH:MM
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Handle time change
    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    // Toggle day selection
    const toggleDay = (dayKey) => {
        setRepeatDays(prev => {
            if (prev.includes(dayKey)) {
                return prev.filter(d => d !== dayKey);
            } else {
                return [...prev, dayKey];
            }
        });
    };

    // Select all days
    const selectAllDays = () => {
        if (repeatDays.length === 7) {
            setRepeatDays([]);
        } else {
            setRepeatDays(DAYS.map(d => d.key));
        }
    };

    // Save schedule
    const handleSave = async () => {
        if (!isAuthenticated) {
            Alert.alert('Lỗi', 'Vui lòng đăng nhập để lưu lịch hẹn');
            return;
        }

        setIsSaving(true);

        try {
            const scheduleData = {
                time: formatTime(time),
                action,
                repeat: repeatDays,
                enabled: existingSchedule?.enabled ?? true,
                deviceId: 'led-1',
            };

            if (isEditing) {
                await firebaseDatabase.updateSchedule(existingSchedule.id, scheduleData);
            } else {
                await firebaseDatabase.addSchedule(scheduleData);
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error saving schedule:', error);
            Alert.alert('Lỗi', 'Không thể lưu lịch hẹn. Vui lòng thử lại.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Time Picker Section */}
            <View style={[styles.section, { backgroundColor: theme.surface }]}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    THỜI GIAN
                </Text>

                <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.timeText, { color: theme.text }]}>
                        {formatTime(time)}
                    </Text>
                    <Icon name="chevron-forward" size={24} color={theme.textMuted} />
                </TouchableOpacity>

                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onTimeChange}
                    />
                )}
            </View>

            {/* Action Section */}
            <View style={[styles.section, { backgroundColor: theme.surface }]}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    HÀNH ĐỘNG
                </Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            action === 'ON' && styles.actionButtonActive,
                            action === 'ON' && { backgroundColor: colors.success },
                            action !== 'ON' && { backgroundColor: theme.surfaceSecondary }
                        ]}
                        onPress={() => setAction('ON')}
                        activeOpacity={0.7}
                    >
                        <Icon
                            name="power"
                            size={24}
                            color={action === 'ON' ? colors.white : theme.textMuted}
                        />
                        <Text style={[
                            styles.actionButtonText,
                            { color: action === 'ON' ? colors.white : theme.textMuted }
                        ]}>
                            BẬT đèn
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            action === 'OFF' && styles.actionButtonActive,
                            action === 'OFF' && { backgroundColor: colors.error },
                            action !== 'OFF' && { backgroundColor: theme.surfaceSecondary }
                        ]}
                        onPress={() => setAction('OFF')}
                        activeOpacity={0.7}
                    >
                        <Icon
                            name="power-outline"
                            size={24}
                            color={action === 'OFF' ? colors.white : theme.textMuted}
                        />
                        <Text style={[
                            styles.actionButtonText,
                            { color: action === 'OFF' ? colors.white : theme.textMuted }
                        ]}>
                            TẮT đèn
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Repeat Section */}
            <View style={[styles.section, { backgroundColor: theme.surface }]}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                        LẶP LẠI
                    </Text>
                    <TouchableOpacity onPress={selectAllDays}>
                        <Text style={[styles.selectAllText, { color: colors.primary }]}>
                            {repeatDays.length === 7 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.daysContainer}>
                    {DAYS.map((day) => (
                        <TouchableOpacity
                            key={day.key}
                            style={[
                                styles.dayButton,
                                repeatDays.includes(day.key) && { backgroundColor: colors.primary },
                                !repeatDays.includes(day.key) && { backgroundColor: theme.surfaceSecondary }
                            ]}
                            onPress={() => toggleDay(day.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.dayText,
                                { color: repeatDays.includes(day.key) ? colors.white : theme.text }
                            ]}>
                                {day.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.repeatHint, { color: theme.textMuted }]}>
                    {repeatDays.length === 0
                        ? 'Lịch sẽ chạy một lần'
                        : repeatDays.length === 7
                            ? 'Lặp lại hàng ngày'
                            : `Lặp lại vào ${repeatDays.length} ngày trong tuần`}
                </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                style={[
                    styles.saveButton,
                    { backgroundColor: colors.primary },
                    isSaving && { opacity: 0.7 }
                ]}
                onPress={handleSave}
                disabled={isSaving}
                activeOpacity={0.8}
            >
                <Icon name="checkmark" size={24} color={colors.white} />
                <Text style={styles.saveButtonText}>
                    {isSaving ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo lịch hẹn')}
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
        padding: spacing.md,
    },
    section: {
        borderRadius: spacing.borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...globalStyles.shadowSmall,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        ...typography.label,
        marginBottom: spacing.md,
    },
    selectAllText: {
        ...typography.bodySmall,
        fontWeight: '600',
        marginBottom: spacing.md,
    },
    timeButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    timeText: {
        fontSize: 48,
        fontWeight: '300',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.md,
        gap: spacing.sm,
    },
    actionButtonActive: {
        transform: [{ scale: 1.02 }],
    },
    actionButtonText: {
        ...typography.button,
        fontWeight: '600',
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        ...typography.bodySmall,
        fontWeight: '600',
    },
    repeatHint: {
        ...typography.caption,
        textAlign: 'center',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        borderRadius: spacing.borderRadius.lg,
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    saveButtonText: {
        ...typography.button,
        color: colors.white,
        fontWeight: '600',
    },
});
