import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
    { id: '4', title: 'Titik 4D - GKU 3', latitude: -6.927330, longitude: 107.770032, status: 'aktif' },
    { id: '5', title: 'Titik 5A - Lapangan Bola', latitude: -6.926131, longitude: 107.768361, status: 'anomali', lastDetected: '20:47:12' },
    { id: '6', title: 'Titik 6B - IPST', latitude: -6.930191, longitude: 107.770447, status: 'hemat' },
    { id: '7', title: 'Titik 7C - GKU 2', latitude: -6.929870, longitude: 107.769072, status: 'aktif' },
    { id: '8', title: 'Titik 8D - Gerbang Utama', latitude: -6.933180, longitude: 107.768315, status: 'aktif' },
    { id: '9', title: 'Titik 9E - Labtek VA', latitude: -6.931555, longitude: 107.770831, status: 'anomali', lastDetected: '19:30:05' },
    { id: '10', title: 'Titik 10F - Laboratorium GEM-ITB-CSU', latitude: -6.931358, longitude: 107.768812, status: 'hemat' },
    { id: '11', title: 'Titik 11A - Asrama ITB Jatinangor TB 3', latitude: -6.927059, longitude: 107.768653, status: 'aktif' },
    { id: '12', title: 'Titik 12B - WTP', latitude: -6.927073, longitude: 107.766836, status: 'hemat' },
    { id: '13', title: 'Titik 13C - Asrama ITB Jatinangor TB 5', latitude: -6.928214, longitude: 107.767802, status: 'anomali', lastDetected: '18:22:11' },
    { id: '14', title: 'Titik 14D - Gedung Rektorat', latitude: -6.928200, longitude: 107.770754, status: 'aktif' },
    { id: '15', title: 'Titik 15E - GKU 1', latitude: -6.929133, longitude: 107.769919, status: 'hemat' },
    { id: '16', title: 'Titik 16F - Gedung Koica', latitude: -6.927436, longitude: 107.770063, status: 'aktif' },
    { id: '17', title: 'Titik 17G - Lapangan Bola', latitude: -6.924819, longitude: 107.767623, status: 'anomali', lastDetected: '17:15:00' },
    { id: '18', title: 'Titik 18H - Situ 1 ITB Jatinangor', latitude: -6.928986, longitude: 107.767782, status: 'aktif' },
    { id: '19', title: 'Titik 19I - Asrama ITB Jatinangor TB 4', latitude: -6.927212, longitude: 107.768463, status: 'hemat' },
    { id: '20', title: 'Titik 20J - Jalan Lingkar Timur', latitude: -6.930966, longitude: 107.77063, status: 'aktif' },
];

const MapScreen: React.FC = () => {
    const [selected, setSelected] = useState<NodeItem | null>(NODES[0]);

    const initialRegion = {
        latitude: -6.929315,
        longitude: 107.769362,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
    };

    const mapRef = useRef<MapView | null>(null);

    useEffect(() => {
        // animate to ITB Jatinangor region on mount to ensure correct center
        if (mapRef.current) {
            try { mapRef.current.animateToRegion(initialRegion, 800); } catch (e) { /* ignore */ }
        }
    }, []);

    const colorFor = (status: NodeItem['status']) => {
        switch (status) {
            case 'aktif':
                return '#9be7ff';
            case 'hemat':
                return '#ffb86b';
            case 'anomali':
                return '#ff6b6b';
            default:
                return '#9be7ff';
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.smallHeader}>Lokasi Node</Text>
                <Text style={styles.title}>Peta Lampu</Text>
            </View>

            <View style={styles.mapWrap}>
                <MapView
                    ref={ref => { mapRef.current = ref }}
                    style={styles.map}
                    initialRegion={initialRegion}
                    showsUserLocation={false}
                    toolbarEnabled={false}
                >
                    {NODES.map(n => (
                        <Marker
                            key={n.id}
                            coordinate={{ latitude: n.latitude, longitude: n.longitude }}
                            onPress={() => setSelected(n)}
                        >
                            <View style={[styles.pin, { backgroundColor: colorFor(n.status) }]} />
                        </Marker>
                    ))}
                </MapView>
            </View>

            <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#9be7ff' }]} /><Text style={styles.legendText}>Aktif</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ffb86b' }]} /><Text style={styles.legendText}>Hemat</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} /><Text style={styles.legendText}>Anomali</Text></View>
            </View>

            <Text style={styles.sectionTitle}>DETAIL NODE TERPILIH</Text>

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

            <TouchableOpacity style={styles.reportButton} activeOpacity={0.8} onPress={() => { /* navigate to report screen */ }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="alert-circle-outline" size={18} color="#e6eef6" style={{ marginRight: 10 }} />
                    <Text style={styles.reportText}>Laporkan Kerusakan</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#0f1720' },
    header: { paddingHorizontal: 20, paddingTop: 12 },
    smallHeader: { color: '#9aa3ad', fontSize: 14 },
    title: { color: '#e6eef6', fontSize: 26, fontWeight: '700', marginTop: 6 },
    mapWrap: { height: 300, margin: 16, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
    map: { flex: 1, backgroundColor: '#0b141a' },
    pin: { width: 18, height: 24, borderRadius: 9, borderTopLeftRadius: 9, borderTopRightRadius: 9, transform: [{ translateY: -6 }], borderWidth: 2, borderColor: '#0b1320' },
    legendRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginTop: 6 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
    legendText: { color: '#c3ccd1' },
    sectionTitle: { color: '#f1f5f9', fontWeight: '700', marginTop: 14, marginLeft: 20 },
    detailCard: { flexDirection: 'row', backgroundColor: '#14202a', margin: 16, borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 6, elevation: 3 },
    detailLeft: { width: 56, alignItems: 'center', justifyContent: 'center' },
    bigPin: { width: 40, height: 48, borderRadius: 20, borderWidth: 3, borderColor: '#0b1320' },
    detailRight: { flex: 1, paddingLeft: 12 },
    nodeTitle: { color: '#e9f0f6', fontWeight: '700', marginBottom: 4 },
    nodeCoords: { color: '#b9c3c9', fontSize: 12 },
    nodeAnom: { color: '#ff9aa2', fontSize: 12, marginTop: 6 },
    nodeBlocked: { color: '#ff6b6b', fontWeight: '600', marginTop: 4 },
    reportButton: { marginHorizontal: 20, marginBottom: 18, marginTop: 6, backgroundColor: '#1f2933', paddingVertical: 14, borderRadius: 22, alignItems: 'center' },
    reportText: { color: '#e6eef6', fontWeight: '700' },
});

export default MapScreen;