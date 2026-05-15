import React, { JSX, useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Animated, StatusBar, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ReportScreen from './screens/ReportScreen';
import HistoryScreen from './screens/HistoryScreen';
import LogoutScreen from './screens/LogoutScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Splash({ onFinish }: { onFinish: () => void }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.96)).current;

    useEffect(() => {
        const fadeIn = Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
        ]);

        let holdTimer: ReturnType<typeof setTimeout> | null = null;

        fadeIn.start(() => {
            holdTimer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 1.04, duration: 600, useNativeDriver: true }),
                ]).start(({ finished }) => {
                    if (finished) onFinish();
                });
            }, 3000);
        });

        return () => {
            if (holdTimer) clearTimeout(holdTimer);
        };
    }, [onFinish, opacity, scale]);

    return (
        <View style={splashStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <Animated.Image
                source={require('./assets/logo-darkStreetLightITB.png')}
                style={[splashStyles.logo, { opacity, transform: [{ scale }] }]}
                resizeMode="contain"
            />
        </View>
    );
}

export default function App(): JSX.Element {
    const [showSplash, setShowSplash] = useState(true);

    if (showSplash) return <Splash onFinish={() => setShowSplash(false)} />;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                <Stack.Screen name="Register" options={{ headerShown: false }} component={RegisterScreen} />
                <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
                    {() => (
                        <Tab.Navigator
                            screenOptions={({ route, navigation }) => ({
                                headerShown: true,
                                headerRight: () => (
                                    <TouchableOpacity onPress={() => navigation.navigate('Logout')} style={{ marginRight: 12 }}>
                                        <Text style={{ color: '#9be7ff', fontWeight: '600' }}>Keluar</Text>
                                    </TouchableOpacity>
                                ),
                                tabBarIcon: ({ color, size }) => {
                                    let name: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';
                                    if (route.name === 'Home') name = 'home-outline';
                                    else if (route.name === 'Peta') name = 'map-outline';
                                    else if (route.name === 'Laporan') name = 'document-text-outline';
                                    else if (route.name === 'Riwayat') name = 'time-outline';
                                    return <Ionicons name={name} size={size} color={color} />;
                                },
                                tabBarActiveTintColor: '#9be7ff',
                                tabBarInactiveTintColor: '#c3ccd1',
                                tabBarStyle: { backgroundColor: '#0b141a', borderTopColor: 'rgba(255,255,255,0.03)' },
                            })}
                        >
                            <Tab.Screen name="Home" component={HomeScreen} />
                            <Tab.Screen name="Peta" component={MapScreen} />
                            <Tab.Screen name="Laporan" component={ReportScreen} />
                            <Tab.Screen name="Riwayat" component={HistoryScreen} />
                        </Tab.Navigator>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Logout" component={LogoutScreen} options={{ presentation: 'modal', title: 'Keluar' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const splashStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
    logo: { width: 220, height: 220 },
});
