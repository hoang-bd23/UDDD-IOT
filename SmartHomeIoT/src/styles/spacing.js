/**
 * SmartHome IoT Spacing System
 * Consistent spacing values throughout the app
 */

export const spacing = {
    // Base spacing scale (4px increments)
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
    massive: 64,

    // Specific use cases
    screenPadding: 16,
    cardPadding: 16,
    listItemPadding: 12,
    buttonPadding: 16,
    inputPadding: 12,

    // Border radius
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        xxl: 24,
        full: 9999,
    },

    // Touch targets (minimum 44px for accessibility)
    touchTarget: 44,
    touchTargetLarge: 48,
};

export default spacing;
