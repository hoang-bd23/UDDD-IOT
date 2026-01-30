/**
 * SmartHome IoT Styles Index
 * Central export for all style modules
 */

import colors from './colors';
import typography, { fontSizes, fontWeights, lineHeights } from './typography';
import spacing from './spacing';
import globalStyles from './globalStyles';

export { colors, typography, fontSizes, fontWeights, lineHeights, spacing, globalStyles };

// Theme helper for dark/light mode
export const getThemeColors = (isDarkMode) => {
    const theme = isDarkMode ? 'dark' : 'light';
    return {
        ...colors[theme],
        primary: colors.primary,
        primaryDark: colors.primaryDark,
        primaryLight: colors.primaryLight,
        secondary: colors.secondary,
        accent: colors.accent,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        deviceOn: colors.deviceOn,
        deviceOff: colors.deviceOff,
        deviceOffline: colors.deviceOffline,
    };
};
