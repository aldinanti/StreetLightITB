import React, { JSX, useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Animated, StatusBar, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

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
        // Animation sequence
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: false }),
            Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: false }),
        ]).start(() => {
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: false }),
                    Animated.timing(scale, { toValue: 1.04, duration: 600, useNativeDriver: false }),
                ]).start();
            }, 3000);
        });

        // Guaranteed transition to main screen after 4.3 seconds
        const holdTimer = setTimeout(() => {
            onFinish();
        }, 4300);

        return () => {
            clearTimeout(holdTimer);
        };
    }, []); // Empty dependency array to prevent re-renders from clearing the timer

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

function MainTabsComponent() {
    return (
        <Tab.Navigator
            id="MainTabs"
            screenOptions={({ route, navigation }) => ({
                headerShown: true,
                headerLeft: () => (
                    <Image source={require('./assets/logo StreetLightITB.png')} style={{ width: 36, height: 36, marginLeft: 12 }} resizeMode="contain" />
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Logout')} style={{ marginRight: 12 }}>
                        <Text style={{ color: '#132147', fontWeight: '600' }}>Keluar</Text>
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
    );
}

export default function App(): JSX.Element {
    const [showSplash, setShowSplash] = useState(true);
    const [authReady, setAuthReady] = useState(false);
    const [initialRoute, setInitialRoute] = useState<'Login' | 'MainTabs'>('Login');
 
    useEffect(() => {
        if (showSplash) return;
 
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setInitialRoute(user ? 'MainTabs' : 'Login');
            setAuthReady(true);
        });
 
        return () => unsubscribe();
    }, [showSplash]);
 
    if (showSplash) {
        return (
            <SafeAreaProvider style={{ flex: 1 }}>
                <Splash onFinish={() => setShowSplash(false)} />
            </SafeAreaProvider>
        );
    }
 
    if (!authReady) {
        // Menunggu Firebase cek sesi login yang tersimpan
        return (
            <SafeAreaProvider style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color="#9be7ff" size="large" />
                </View>
            </SafeAreaProvider>
        );
    }
 
    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator id="RootStack" initialRouteName={initialRoute}>
                    <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                    <Stack.Screen name="Register" options={{ headerShown: false }} component={RegisterScreen} />
                    <Stack.Screen name="MainTabs" options={{ headerShown: false }} component={MainTabsComponent} />
                    <Stack.Screen
                        name="Logout"
                        component={LogoutScreen}
                        options={{ presentation: 'modal', title: 'Keluar' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const splashStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
    logo: { width: 220, height: 220 },
});