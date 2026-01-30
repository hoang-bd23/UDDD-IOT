/**
 * Register Screen
 * New user registration screen
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
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../styles';

export default function RegisterScreen({ navigation }) {
    const { register, isLoading } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!displayName.trim()) {
            newErrors.displayName = 'Vui lòng nhập tên hiển thị';
        }

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        const result = await register(email, password, displayName);
        if (!result.success) {
            Alert.alert('Lỗi đăng ký', result.error || 'Không thể đăng ký');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-back" size={24} color={colors.light.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Tạo tài khoản</Text>
                    <Text style={styles.subtitle}>Điền thông tin để đăng ký</Text>
                </View>

                {/* Register Form */}
                <View style={styles.form}>
                    {/* Display Name Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Tên hiển thị</Text>
                        <View style={[styles.inputWrapper, errors.displayName && styles.inputError]}>
                            <Icon name="person-outline" size={20} color={colors.light.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nguyễn Văn A"
                                placeholderTextColor={colors.light.textMuted}
                                value={displayName}
                                onChangeText={setDisplayName}
                                autoCapitalize="words"
                            />
                        </View>
                        {errors.displayName && <Text style={styles.errorText}>{errors.displayName}</Text>}
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                            <Icon name="mail-outline" size={20} color={colors.light.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="example@email.com"
                                placeholderTextColor={colors.light.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mật khẩu</Text>
                        <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                            <Icon name="lock-closed-outline" size={20} color={colors.light.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={colors.light.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                <Icon
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color={colors.light.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Xác nhận mật khẩu</Text>
                        <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                            <Icon name="lock-closed-outline" size={20} color={colors.light.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={colors.light.textMuted}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.buttonText}>Đăng ký</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.screenPadding,
    },
    header: {
        marginTop: spacing.huge,
        marginBottom: spacing.xl,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h2,
        color: colors.light.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.light.textSecondary,
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
    eyeButton: {
        padding: spacing.sm,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: spacing.borderRadius.lg,
        height: spacing.touchTarget,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        ...typography.button,
        color: colors.white,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    loginText: {
        ...typography.body,
        color: colors.light.textSecondary,
    },
    loginLink: {
        ...typography.body,
        color: colors.primary,
        fontWeight: '600',
    },
});
