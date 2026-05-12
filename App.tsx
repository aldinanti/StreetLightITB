import React, { JSX, useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ReportScreen from './screens/ReportScreen';
import HistoryScreen from './screens/HistoryScreen';

const Tab = createBottomTabNavigator();

function Splash({ onFinish }: { onFinish: () => void }) {
    useEffect(() => {
        const t = setTimeout(() => onFinish(), 1400);
        return () => clearTimeout(t);
    }, [onFinish]);

    return (
        <View style={splashStyles.container}>
            <Image source={require('./assets/logo StreetLightITB.png')} style={splashStyles.logo} resizeMode="contain" />
            <ActivityIndicator color="#9be7ff" style={{ marginTop: 18 }} />
        </View>
    );
}

export default function App(): JSX.Element {
        const [showSplash, setShowSplash] = useState(true);

        return showSplash ? (
            <Splash onFinish={() => setShowSplash(false)} />
        ) : (
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: true,
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
            </NavigationContainer>
        );
}

const splashStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f1720', alignItems: 'center', justifyContent: 'center' },
    logo: { width: 220, height: 220 },
});
