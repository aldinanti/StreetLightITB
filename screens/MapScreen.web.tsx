import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NodeItem = {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    status: 'aktif' | 'hemat' | 'anomali';
    lastDetected?: string;
};

const NODES: NodeItem[] = [
    { id: '1', title: 'Titik 1C - Gedung Rektorat', latitude: -6.928668, longitude: 107.770390, status: 'anomali', lastDetected: '21:03:43' },
    { id: '2', title: 'Titik 2A - Labtek IA', latitude: -6.929095, longitude: 107.768121, status: 'aktif' },
    { id: '3', title: 'Titik 3B - Gedung Koica', latitude: -6.927547, longitude: 107.770139, status: 'hemat' },
];

const MapScreen: React.FC = () => {
    const [selected, setSelected] = useState<NodeItem | null>(NODES[0]);

    const colorFor = (status: NodeItem['status']) => {
        switch (status) {
            case 'aktif': return '#9be7ff';
            case 'hemat': return '#ffb86b';
            case 'anomali': return '#ff6b6b';
            default: return '#9be7ff';
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.smallHeader}>Dashboard</Text>
                <Text style={styles.title}>Monitoring Jatinangor (Web)</Text>
            </View>

            <View style={styles.mapWrap}>
                <View style={styles.mapPlaceholder}>
                    <Ionicons name="map-outline" size={48} color="#455a64" />
                    <Text style={styles.placeholderText}>Peta interaktif tidak tersedia di versi Web.</Text>
                    <Text style={styles.placeholderSubText}>Silakan gunakan aplikasi mobile untuk melihat peta.</Text>
                </View>
            </View>

            {selected && (
                <View style={styles.detailCard}>
                    <View style={styles.detailLeft}>
                        <View style={[styles.bigPin, { backgroundColor: colorFor(selected.status) }]} />
                    </View>
                    <View style={styles.detailRight}>
                        <Text style={styles.nodeTitle}>{selected.title}</Text>
                        <Text style={styles.nodeCoords}>Koordinat: {selected.latitude.toFixed(6)}, {selected.longitude.toFixed(6)}</Text>
                        {selected.lastDetected && <Text style={styles.nodeAnom}>Anomali terdeteksi: {selected.lastDetected}</Text>}
                        {selected.status === 'anomali' && <Text style={styles.nodeBlocked}>kaga mau nyala bray</Text>}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#0f1720' },
    header: { paddingHorizontal: 20, paddingTop: 12 },
    smallHeader: { color: '#9aa3ad', fontSize: 14 },
    title: { color: '#e6eef6', fontSize: 26, fontWeight: '700', marginTop: 6 },
    mapWrap: { height: 300, margin: 16, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
    mapPlaceholder: { flex: 1, backgroundColor: '#0b141a', alignItems: 'center', justifyContent: 'center', padding: 20 },
    placeholderText: { color: '#e6eef6', marginTop: 12, fontSize: 16, textAlign: 'center' },
    placeholderSubText: { color: '#9aa3ad', marginTop: 8, fontSize: 14, textAlign: 'center' },
    detailCard: { flexDirection: 'row', backgroundColor: '#14202a', margin: 16, borderRadius: 12, padding: 12, alignItems: 'center' },
    detailLeft: { width: 56, alignItems: 'center', justifyContent: 'center' },
    bigPin: { width: 40, height: 48, borderRadius: 20, borderWidth: 3, borderColor: '#0b1320' },
    detailRight: { flex: 1, paddingLeft: 12 },
    nodeTitle: { color: '#e9f0f6', fontWeight: '700', marginBottom: 4 },
    nodeCoords: { color: '#b9c3c9', fontSize: 12 },
    nodeAnom: { color: '#ff9aa2', fontSize: 12, marginTop: 6 },
    nodeBlocked: { color: '#ff6b6b', fontWeight: '600', marginTop: 4 },
});

export default MapScreen;
