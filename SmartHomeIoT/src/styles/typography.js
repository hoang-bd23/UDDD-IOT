/**
 * SmartHome IoT Typography
 * Font sizes and text styles
 */

import { StyleSheet } from 'react-native';

export const fontSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32,
    hero: 40,
};

export const fontWeights = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
};

export const lineHeights = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
};

export const typography = StyleSheet.create({
    // Headings
    h1: {
        fontSize: fontSizes.hero,
        fontWeight: fontWeights.bold,
        lineHeight: fontSizes.hero * lineHeights.tight,
    },
    h2: {
        fontSize: fontSizes.display,
        fontWeight: fontWeights.bold,
        lineHeight: fontSizes.display * lineHeights.tight,
    },
    h3: {
        fontSize: fontSizes.xxxl,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.xxxl * lineHeights.tight,
    },
    h4: {
        fontSize: fontSizes.xxl,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.xxl * lineHeights.normal,
    },

    // Body text
    bodyLarge: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.normal,
        lineHeight: fontSizes.lg * lineHeights.normal,
    },
    body: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.normal,
        lineHeight: fontSizes.md * lineHeights.normal,
    },
    bodySmall: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.normal,
        lineHeight: fontSizes.sm * lineHeights.normal,
    },

    // Labels
    label: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        lineHeight: fontSizes.sm * lineHeights.normal,
    },
    caption: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.normal,
        lineHeight: fontSizes.xs * lineHeights.normal,
    },

    // Buttons
    button: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.md * lineHeights.tight,
    },
    buttonSmall: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.sm * lineHeights.tight,
    },
});

export default typography;
