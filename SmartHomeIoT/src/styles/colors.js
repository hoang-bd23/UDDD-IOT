/**
 * SmartHome IoT Color Palette
 * Supports both light and dark modes
 */

export const colors = {
    // Primary colors
    primary: '#2563EB',      // Blue
    primaryDark: '#1D4ED8',
    primaryLight: '#3B82F6',

    // Secondary colors
    secondary: '#10B981',    // Green (for ON state)
    secondaryDark: '#059669',

    // Accent colors
    accent: '#F59E0B',       // Amber (for warnings, lights)
    accentDark: '#D97706',

    // Status colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Light mode
    light: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceSecondary: '#F1F5F9',
        text: '#1E293B',
        textSecondary: '#64748B',
        textMuted: '#94A3B8',
        border: '#E2E8F0',
        divider: '#F1F5F9',
    },

    // Dark mode
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        surfaceSecondary: '#334155',
        text: '#F8FAFC',
        textSecondary: '#CBD5E1',
        textMuted: '#64748B',
        border: '#334155',
        divider: '#1E293B',
    },

    // Device states
    deviceOn: '#22C55E',
    deviceOff: '#64748B',
    deviceOffline: '#EF4444',

    // Common
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
};

export default colors;
