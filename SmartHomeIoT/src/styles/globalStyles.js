/**
 * SmartHome IoT Global Styles
 * Common styles used throughout the app
 */

import { StyleSheet, Platform } from 'react-native';
import colors from './colors';
import spacing from './spacing';
import { fontSizes, fontWeights } from './typography';

export const globalStyles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
    },
    screenContainer: {
        flex: 1,
        paddingHorizontal: spacing.screenPadding,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Rows & Columns
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
    },

    // Cards
    card: {
        borderRadius: spacing.borderRadius.lg,
        padding: spacing.cardPadding,
        ...Platform.select({
            ios: {
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    // Shadows
    shadowSmall: {
        ...Platform.select({
            ios: {
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    shadowMedium: {
        ...Platform.select({
            ios: {
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    shadowLarge: {
        ...Platform.select({
            ios: {
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
            },
            android: {
                elevation: 12,
            },
        }),
    },

    // Dividers
    divider: {
        height: 1,
        width: '100%',
    },
    dividerVertical: {
        width: 1,
        height: '100%',
    },

    // Absolute positioning
    absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    // Touch targets (44px minimum)
    touchTarget: {
        minHeight: spacing.touchTarget,
        minWidth: spacing.touchTarget,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default globalStyles;
