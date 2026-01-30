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
import RoomsScreen from '../screens/Rooms/RoomsScreen';
import ScheduleScreen from '../screens/Schedule/ScheduleScreen';
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
                        case 'Rooms':
                            iconName = focused ? 'grid' : 'grid-outline';
                            break;
                        case 'Schedule':
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
                name="Rooms"
                component={RoomsScreen}
                options={{ title: 'Phòng' }}
            />
            <Tab.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{ title: 'Lịch hẹn' }}
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
