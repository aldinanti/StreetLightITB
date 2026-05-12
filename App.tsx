import React, { JSX } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ReportScreen from './screens/ReportScreen';
import HistoryScreen from './screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App(): JSX.Element {
    return (
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
