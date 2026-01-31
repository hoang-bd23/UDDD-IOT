/**
 * Main Navigator
 * Bottom tab navigation for authenticated users
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import DevicesScreen from '../screens/Devices/DevicesScreen';
import ScheduleScreen from '../screens/Schedule/ScheduleScreen';
import AddScheduleScreen from '../screens/Schedule/AddScheduleScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import CameraScreen from '../screens/Camera/CameraScreen';
import LiveStreamScreen from '../screens/Camera/LiveStreamScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Camera Stack Navigator
function CameraStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CameraMain"
                component={CameraScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LiveStream"
                component={LiveStreamScreen}
                options={{
                    title: 'Camera trực tiếp',
                    headerStyle: { backgroundColor: colors.primary },
                    headerTintColor: colors.white,
                }}
            />
        </Stack.Navigator>
    );
}

// Schedule Stack Navigator
function ScheduleStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ScheduleMain"
                component={ScheduleScreen}
                options={{
                    title: 'Lịch hẹn',
                    headerStyle: { backgroundColor: colors.primary },
                    headerTintColor: colors.white,
                    headerTitleStyle: { fontWeight: '600' },
                }}
            />
            <Stack.Screen
                name="AddSchedule"
                component={AddScheduleScreen}
                options={({ route }) => ({
                    title: route.params?.schedule ? 'Sửa lịch hẹn' : 'Thêm lịch hẹn',
                    headerStyle: { backgroundColor: colors.primary },
                    headerTintColor: colors.white,
                })}
            />
        </Stack.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Devices':
                            iconName = focused ? 'bulb' : 'bulb-outline';
                            break;
                        case 'Schedule':
                            iconName = focused ? 'alarm' : 'alarm-outline';
                            break;
                        case 'History':
                            iconName = focused ? 'time' : 'time-outline';
                            break;
                        case 'Camera':
                            iconName = focused ? 'videocam' : 'videocam-outline';
                            break;
                        case 'Settings':
                            iconName = focused ? 'settings' : 'settings-outline';
                            break;
                        default:
                            iconName = 'ellipse';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.light.textMuted,
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Trang chủ',
                    headerTitle: 'SmartHome IoT',
                }}
            />
            <Tab.Screen
                name="Devices"
                component={DevicesScreen}
                options={{ title: 'Thiết bị' }}
            />
            <Tab.Screen
                name="Schedule"
                component={ScheduleStack}
                options={{
                    title: 'Lịch hẹn',
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: 'Lịch sử' }}
            />
            <Tab.Screen
                name="Camera"
                component={CameraStack}
                options={{
                    title: 'Camera',
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Cài đặt' }}
            />
        </Tab.Navigator>
    );
}
