import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { getStoredUser } from '../authService';
import { getNodes } from '../apiService';

type NodeItem = {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    status: 'aktif' | 'hemat' | 'rusak';
    lastDetected?: string;
    lux?: number | null;
    brightnessPwm?: number | null;
    pirActive?: boolean | null;
    temperature?: number | null;
};

const FALLBACK_NODES: NodeItem[] = [
    { id: 'NODE-001', title: 'NODE-001 - Jalan Utama - Gerbang Utama ITB', latitude: -6.933680, longitude: 107.768339, status: 'aktif' },
    { id: 'NODE-002', title: 'NODE-002 - Jalan Barat - Area Parkir', latitude: -6.929030, longitude: 107.767977, status: 'hemat' },
    { id: 'NODE-003', title: 'NODE-003 - Jalan Timur - Gedung Rektorat', latitude: -6.928200, longitude: 107.770754, status: 'rusak', lastDetected: '21:03:43'},
    { id: 'NODE-004', title: 'NODE-004 - Jalan Selatan - Area Akademik', latitude: -6.930404, longitude: 107.768775, status: 'aktif' },
    { id: 'NODE-005', title: 'NODE-005 - Area Olahraga', latitude: -6.926872, longitude: 107.769679, status: 'aktif'},
    { id: 'NODE-006', title: 'NODE-006 - Jalan Belakang - Perpustakaan', latitude: -6.926964, longitude: 107.770474, status: 'hemat' },
    { id: 'NODE-007', title: 'NODE-007 - GKU 2', latitude: -6.929870, longitude: 107.769072, status: 'aktif' },
    { id: 'NODE-008', title: 'NODE-008 - Gerbang Utama', latitude: -6.933180, longitude: 107.768315, status: 'aktif' },
    { id: 'NODE-009', title: 'NODE-009 - Labtek VA', latitude: -6.931555, longitude: 107.770831, status: 'rusak', lastDetected: '19:30:05' },
    { id: 'NODE-010', title: 'NODE-010 - Laboratorium GEM-ITB-CSU', latitude: -6.931358, longitude: 107.768812, status: 'hemat' },
    { id: 'NODE-011', title: 'NODE-011 - Asrama ITB Jatinangor TB 3', latitude: -6.927059, longitude: 107.768653, status: 'aktif' },
    { id: 'NODE-012', title: 'NODE-012 - WTP', latitude: -6.927073, longitude: 107.766836, status: 'hemat' },
    { id: 'NODE-013', title: 'NODE-013 - Asrama ITB Jatinangor TB 5', latitude: -6.928214, longitude: 107.767802, status: 'rusak', lastDetected: '18:22:11' },
    { id: 'NODE-014', title: 'NODE-014 - IPST', latitude: -6.930191, longitude: 107.770447, status: 'aktif' },
    { id: 'NODE-015', title: 'NODE-015 - GKU 1', latitude: -6.929133, longitude: 107.769919, status: 'hemat' },
    { id: 'NODE-016', title: 'NODE-016 - Gedung Koica', latitude: -6.927436, longitude: 107.770063, status: 'aktif' },
    { id: 'NODE-017', title: 'NODE-017 - Lapangan Bola', latitude: -6.924819, longitude: 107.767623, status: 'rusak', lastDetected: '17:15:00' },
    { id: 'NODE-018', title: 'NODE-018 - Situ 1 ITB Jatinangor', latitude: -6.928986, longitude: 107.767782, status: 'aktif' },
    { id: 'NODE-019', title: 'NODE-019 - Asrama ITB Jatinangor TB 4', latitude: -6.927212, longitude: 107.768463, status: 'hemat' },
    { id: 'NODE-020', title: 'NODE-020 - Jalan Lingkar Timur', latitude: -6.930966, longitude: 107.770630, status: 'aktif' },
];

const MapScreen: React.FC<any> = ({ navigation }) => {
    const [nodes, setNodes] = useState<NodeItem[]>(FALLBACK_NODES);
    const [selected, setSelected] = useState<NodeItem | null>(FALLBACK_NODES[0]);
    const [userName, setUserName] = useState('User');
    const [loadingNodes, setLoadingNodes] = useState(false);
    const [nodeError, setNodeError] = useState('');

    const initialRegion = {
        latitude: -6.929315,
        longitude: 107.769362,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
    };

    const mapRef = useRef<MapView | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            try { mapRef.current.animateToRegion(initialRegion, 800); } catch (e) { /* ignore */ }
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        async function loadUserAndNodes() {
            try {
                const user = await getStoredUser();
                if (mounted && user?.display_name) {
                    setUserName(user.display_name);
                }
            } catch (e) {
                // User name is cosmetic; keep default when storage is unavailable.
            }

            setLoadingNodes(true);
            setNodeError('');
            try {
                const data = await getNodes();
                if (!mounted) return;

                const mapped = data
                    .filter((item: any) => Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)))
                    .map((item: any) => ({
                        id: item.id,
                        title: `${item.id} - ${item.location_name || item.zone || 'Tanpa lokasi'}`,
                        latitude: Number(item.latitude),
                        longitude: Number(item.longitude),
                        status: normalizeStatus(item.status),
                        lastDetected: item.last_seen_at ? new Date(item.last_seen_at).toLocaleTimeString() : undefined,
                        lux: item.lux ?? null,
                        brightnessPwm: item.brightness_pwm ?? null,
                        pirActive: item.pir_active ?? null,
                        temperature: item.temperature ?? null,
                    }));

                if (mapped.length > 0) {
                    setNodes(mapped);
                    setSelected(mapped[0]);
                }
            } catch (e: any) {
                if (mounted) {
                    setNodeError(e.message || 'Gagal memuat data node dari backend.');
                }
            } finally {
                if (mounted) {
                    setLoadingNodes(false);
                }
            }
        }

        loadUserAndNodes();

        return () => {
            mounted = false;
        };
    }, []);

    const normalizeStatus = (status?: string): NodeItem['status'] => {
        const value = String(status || '').toUpperCase();

        if (value === 'BROKEN' || value === 'OFF') return 'rusak';
        if (value === 'ECO') return 'hemat';
        return 'aktif';
    };

    const colorFor = (status: NodeItem['status']) => {
        switch (status) {
            case 'aktif': return '#00ff1e';
            case 'hemat': return '#ffb86b';
            case 'rusak': return '#ff6b6b';
            default: return '#ffffff';
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.headerMeta}></Text>
                <Text style={styles.smallHeader}>Selamat datang, {userName} !</Text>
                <Text style={styles.title}>Monitoring ITB Jatinangor</Text>
            </View>

            <View style={styles.mapWrap}>
                <MapView
                    ref={ref => { mapRef.current = ref; }}
                    style={styles.map}
                    initialRegion={initialRegion}
                    showsUserLocation={false}
                    toolbarEnabled={false}
                >
                    {nodes.map(n => (
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

            {loadingNodes && (
                <View style={styles.loadingRow}>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.loadingText}>Memuat node backend...</Text>
                </View>
            )}
            {!!nodeError && <Text style={styles.errorText}>{nodeError}</Text>}

            <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#00ff1e' }]} /><Text style={styles.legendText}>Aktif</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ffb86b' }]} /><Text style={styles.legendText}>Hemat</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} /><Text style={styles.legendText}>Rusak</Text></View>
            </View>

            <Text style={styles.sectionTitle}>DETAIL NODE</Text>

            {selected && (
                <View style={styles.detailCard}>
                    <View style={styles.detailLeft}>
                        <View style={[styles.bigPin, { backgroundColor: colorFor(selected.status) }]} />
                    </View>
                    <View style={styles.detailRight}>
                        <Text style={styles.nodeTitle}>{selected.title}</Text>
                        <Text style={styles.nodeCoords}>
                            Koordinat: {selected.latitude.toFixed(6)}, {selected.longitude.toFixed(6)}
                        </Text>
                        {selected.lastDetected && (
                            <Text style={styles.nodeAnom}>Rusak terdeteksi: {selected.lastDetected}</Text>
                        )}
                        <Text style={styles.nodeMetric}>
                            Lux: {selected.lux ?? '-'} | PWM: {selected.brightnessPwm ?? '-'} | PIR: {selected.pirActive == null ? '-' : selected.pirActive ? 'Aktif' : 'Tidak aktif'}
                        </Text>
                        {selected.temperature != null && (
                            <Text style={styles.nodeMetric}>Suhu: {selected.temperature} C</Text>
                        )}
                    </View>
                </View>
            )}

            {/* Navigasi ke tab Laporan */}
            <TouchableOpacity
                style={styles.reportButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Laporan')}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="alert-circle-outline" size={18} color="#e6eef6" style={{ marginRight: 10 }} />
                    <Text style={styles.reportText}>Laporkan Kerusakan</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#1e3c72' },
    header: { paddingHorizontal: 20, paddingTop: 20 },
    headerMeta: { color: '#e0e6f0', marginBottom: 4 },
    smallHeader: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
    title: { color: '#e0e6f0', fontSize: 16, marginTop: 4 },
    mapWrap: { height: 300, margin: 16, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#405987' },
    map: { flex: 1, backgroundColor: '#295196' },
    pin: { width: 18, height: 24, borderRadius: 9, transform: [{ translateY: -6 }], borderWidth: 2, borderColor: '#0b1320' },
    legendRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
    legendText: { color: '#e0e6f0' },
    loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -4, marginBottom: 8 },
    loadingText: { color: '#e0e6f0', marginLeft: 8, fontSize: 12 },
    errorText: { color: '#ffb4b4', textAlign: 'center', marginHorizontal: 20, marginBottom: 8, fontSize: 12 },
    sectionTitle: { color: '#ffffff', fontWeight: '700', marginTop: 14, marginLeft: 20 },
    detailCard: { flexDirection: 'row', backgroundColor: '#40619f', margin: 16, borderRadius: 12, padding: 12, alignItems: 'center', elevation: 3 },
    detailLeft: { width: 56, alignItems: 'center', justifyContent: 'center' },
    bigPin: { width: 40, height: 48, borderRadius: 20, borderWidth: 3, borderColor: '#0b1320' },
    detailRight: { flex: 1, paddingLeft: 12 },
    nodeTitle: { color: '#ffffff', fontWeight: '700', marginBottom: 4 },
    nodeCoords: { color: '#e0e6f0', fontSize: 12 },
    nodeAnom: { color: '#ff9aa2', fontSize: 12, marginTop: 6 },
    nodeMetric: { color: '#e0e6f0', fontSize: 12, marginTop: 6 },
    reportButton: { marginHorizontal: 20, marginBottom: 18, marginTop: 6, backgroundColor: '#295196', paddingVertical: 14, borderRadius: 22, alignItems: 'center' },
    reportText: { color: '#ffffff', fontWeight: '700' },
});

export default MapScreen;
