/**
 * Forgot Password Screen
 * Reset password via email
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../styles';

export default function ForgotPasswordScreen({ navigation }) {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateEmail = () => {
        if (!email.trim()) {
            setError('Vui lòng nhập email');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ');
            return false;
        }
        setError('');
        return true;
    };

    const handleResetPassword = async () => {
        if (!validateEmail()) return;

        setIsLoading(true);
        try {
            const result = await resetPassword(email);

            if (result.success) {
                setSuccess(true);
                Alert.alert(
                    'Thành công',
                    'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Lỗi', result.error || 'Không thể gửi email đặt lại mật khẩu');
            }
        } catch (err) {
            Alert.alert('Lỗi', err.message || 'Đã xảy ra lỗi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                {/* Header */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={colors.light.text} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Icon name="key-outline" size={48} color={colors.primary} />
                    </View>
                    <Text style={styles.title}>Quên mật khẩu?</Text>
                    <Text style={styles.subtitle}>
                        Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputWrapper, error && styles.inputError]}>
                            <Icon
                                name="mail-outline"
                                size={20}
                                color={colors.light.textMuted}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="example@email.com"
                                placeholderTextColor={colors.light.textMuted}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setError('');
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!success}
                            />
                        </View>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, (isLoading || success) && styles.buttonDisabled]}
                        onPress={handleResetPassword}
                        disabled={isLoading || success}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : success ? (
                            <>
                                <Icon name="checkmark-circle" size={20} color={colors.white} />
                                <Text style={styles.buttonText}> Đã gửi email</Text>
                            </>
                        ) : (
                            <Text style={styles.buttonText}>Gửi link đặt lại</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Back to Login */}
                <TouchableOpacity
                    style={styles.backToLogin}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={16} color={colors.primary} />
                    <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    content: {
        flex: 1,
        padding: spacing.screenPadding,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: spacing.xl,
        left: spacing.screenPadding,
        padding: spacing.sm,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.light.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        ...typography.h3,
        color: colors.light.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.light.textSecondary,
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    form: {
        backgroundColor: colors.light.surface,
        borderRadius: spacing.borderRadius.xl,
        padding: spacing.xl,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.label,
        color: colors.light.text,
        marginBottom: spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.light.border,
        borderRadius: spacing.borderRadius.lg,
        backgroundColor: colors.light.surfaceSecondary,
        paddingHorizontal: spacing.md,
    },
    inputError: {
        borderColor: colors.error,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        height: spacing.touchTarget,
        ...typography.body,
        color: colors.light.text,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderRadius: spacing.borderRadius.lg,
        height: spacing.touchTarget,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        ...typography.button,
        color: colors.white,
    },
    backToLogin: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
        gap: spacing.xs,
    },
    backToLoginText: {
        ...typography.body,
        color: colors.primary,
    },
});
