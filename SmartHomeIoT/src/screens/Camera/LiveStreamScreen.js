/**
 * Live Stream Screen
 * Display camera stream from Raspberry Pi using WebView for MJPEG support
 */

import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDevices } from '../../context/DeviceContext';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, typography, getThemeColors, globalStyles } from '../../styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LiveStreamScreen() {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);

    const { cameraUrl, connectionStatus } = useDevices();
    const webViewRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [streamKey, setStreamKey] = useState(Date.now());

    // Build URLs - ensure no double slashes
    const baseUrl = cameraUrl.replace(/\/$/, ''); // Remove trailing slash
    const streamUrl = `${baseUrl}/camera/stream`;
    const snapshotUrl = `${baseUrl}/camera/snapshot`;

    // HTML content for WebView to display MJPEG stream
    const getStreamHtml = () => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    background: #000; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh;
                    overflow: hidden;
                }
                img { 
                    max-width: 100%; 
                    max-height: 100vh; 
                    object-fit: contain;
                }
                .error {
                    color: #ff6b6b;
                    text-align: center;
                    padding: 20px;
                    font-family: sans-serif;
                }
            </style>
        </head>
        <body>
            <img 
                id="stream" 
                src="${streamUrl}?t=${streamKey}" 
                alt="Camera Stream"
                onerror="this.style.display='none'; document.getElementById('error').style.display='block';"
            />
            <div id="error" class="error" style="display:none;">
                Không thể tải stream camera
            </div>
        </body>
        </html>
    `;

    const handlePlay = useCallback(() => {
        setIsLoading(true);
        setError(null);
        setIsPlaying(true);
        setStreamKey(Date.now());
    }, []);

    const handleStop = useCallback(() => {
        setIsPlaying(false);
        setIsLoading(false);
    }, []);

    const handleSnapshot = useCallback(async () => {
        try {
            const response = await fetch(snapshotUrl);
            if (response.ok) {
                Alert.alert('Thành công', 'Đã chụp ảnh từ camera');
            } else {
                throw new Error('Failed to take snapshot');
            }
        } catch (err) {
            Alert.alert('Lỗi', 'Không thể chụp ảnh');
        }
    }, [snapshotUrl]);

    const handleRefresh = useCallback(() => {
        setStreamKey(Date.now());
        setIsLoading(true);
        setError(null);
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
    }, []);

    const handleWebViewLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleWebViewError = useCallback(() => {
        setIsLoading(false);
        setError('Không thể tải stream. Kiểm tra kết nối và camera server.');
        setIsPlaying(false);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Stream View */}
            <View style={[styles.streamContainer, { backgroundColor: '#000' }]}>
                {isPlaying ? (
                    <>
                        <WebView
                            ref={webViewRef}
                            key={streamKey}
                            source={{ html: getStreamHtml() }}
                            style={styles.webView}
                            onLoad={handleWebViewLoad}
                            onError={handleWebViewError}
                            scrollEnabled={false}
                            bounces={false}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            renderLoading={() => (
                                <View style={styles.loadingOverlay}>
                                    <ActivityIndicator size="large" color={colors.white} />
                                    <Text style={styles.loadingText}>Đang tải stream...</Text>
                                </View>
                            )}
                        />
                        {isLoading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color={colors.white} />
                                <Text style={styles.loadingText}>Đang tải stream...</Text>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.placeholder}>
                        {error ? (
                            <>
                                <Icon name="alert-circle" size={64} color={colors.error} />
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={handlePlay}>
                                    <Text style={styles.retryButtonText}>Thử lại</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Icon name="videocam-off" size={64} color={theme.textMuted} />
                                <Text style={[styles.placeholderText, { color: theme.textMuted }]}>
                                    Nhấn Play để xem camera
                                </Text>
                            </>
                        )}
                    </View>
                )}
            </View>

            {/* Controls */}
            <View style={[styles.controls, { backgroundColor: theme.surface }]}>
                <View style={styles.controlsRow}>
                    {/* Play/Stop Button */}
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            styles.mainButton,
                            { backgroundColor: isPlaying ? colors.error : colors.success }
                        ]}
                        onPress={isPlaying ? handleStop : handlePlay}
                    >
                        <Icon
                            name={isPlaying ? 'stop' : 'play'}
                            size={32}
                            color={colors.white}
                        />
                    </TouchableOpacity>

                    {/* Refresh Button */}
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            { backgroundColor: theme.surfaceSecondary }
                        ]}
                        onPress={handleRefresh}
                        disabled={!isPlaying}
                    >
                        <Icon
                            name="refresh"
                            size={24}
                            color={isPlaying ? theme.text : theme.textMuted}
                        />
                    </TouchableOpacity>

                    {/* Snapshot Button */}
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            { backgroundColor: theme.surfaceSecondary }
                        ]}
                        onPress={handleSnapshot}
                        disabled={!isPlaying}
                    >
                        <Icon
                            name="camera"
                            size={24}
                            color={isPlaying ? theme.text : theme.textMuted}
                        />
                    </TouchableOpacity>

                    {/* Fullscreen Button */}
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            { backgroundColor: theme.surfaceSecondary }
                        ]}
                        onPress={() => Alert.alert('Toàn màn hình', 'Tính năng đang phát triển')}
                    >
                        <Icon
                            name="expand"
                            size={24}
                            color={theme.text}
                        />
                    </TouchableOpacity>
                </View>

                {/* Stream Info */}
                <View style={styles.streamInfo}>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                            URL:
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
                            {streamUrl}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                            Trạng thái:
                        </Text>
                        <View style={styles.statusContainer}>
                            <View
                                style={[
                                    styles.statusDot,
                                    {
                                        backgroundColor: isPlaying ? colors.success :
                                            connectionStatus === 'connected' ? colors.warning : colors.error
                                    }
                                ]}
                            />
                            <Text style={[styles.infoValue, { color: theme.text }]}>
                                {isPlaying ? 'Đang phát' :
                                    connectionStatus === 'connected' ? 'Sẵn sàng' : 'Mất kết nối'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    streamContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webView: {
        width: SCREEN_WIDTH,
        height: (SCREEN_WIDTH * 3) / 4, // 4:3 aspect ratio
        backgroundColor: '#000',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    loadingText: {
        ...typography.body,
        color: colors.white,
        marginTop: spacing.md,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xxl,
    },
    placeholderText: {
        ...typography.body,
        marginTop: spacing.lg,
        textAlign: 'center',
    },
    errorText: {
        ...typography.body,
        color: colors.error,
        marginTop: spacing.lg,
        textAlign: 'center',
        marginHorizontal: spacing.xl,
    },
    retryButton: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        backgroundColor: colors.primary,
        borderRadius: spacing.borderRadius.md,
    },
    retryButtonText: {
        ...typography.button,
        color: colors.white,
    },
    controls: {
        padding: spacing.lg,
        borderTopLeftRadius: spacing.borderRadius.xl,
        borderTopRightRadius: spacing.borderRadius.xl,
        ...globalStyles.shadowLarge,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.lg,
        marginBottom: spacing.lg,
    },
    controlButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    streamInfo: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        paddingTop: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    infoLabel: {
        ...typography.label,
        width: 80,
    },
    infoValue: {
        ...typography.bodySmall,
        flex: 1,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
});
