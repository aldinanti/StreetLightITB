import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type Report = { node?: string; issue?: string; urgency?: string; notes?: string; ts: number };

const SAMPLE_ANOMALIES = [
    { id: 'a1', title: 'Anomali - Titik 1C GKU 2', desc: 'Lampu terdeteksi meredup tanpa alasan.', ts: Date.now() - 1000 * 60 * 20 },
    { id: 'a2', title: 'Hemat Energi - Titik 3B Asrama', desc: 'Mode hemat aktif, namun tidak berespon pada pergerakan.', ts: Date.now() - 1000 * 60 * 40 },
];

const HistoryScreen: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        load();
        const id = setInterval(load, 3000);
        return () => clearInterval(id);
    }, []);

    async function load() {
        try {
            const raw = await AsyncStorage.getItem('streetlight_reports');
            const arr: Report[] = raw ? JSON.parse(raw) : [];
            setReports(arr.slice().reverse());
        } catch (e) {
            setReports([]);
        }
    }

    const renderAnomaly = ({ item }: { item: typeof SAMPLE_ANOMALIES[number] }) => (
        <View style={styles.anomCard}>
            <View style={styles.anomAccent} />
            <View style={{ flex: 1 }}>
                <Text style={styles.anomTitle}>{item.title}</Text>
                <Text style={styles.anomDesc}>{item.desc}</Text>
                <Text style={styles.anomTs}>{new Date(item.ts).toLocaleTimeString()}</Text>
            </View>
        </View>
    );

    const renderReport = ({ item, index }: { item: Report; index: number }) => {
        const idLabel = `Laporan #LAP-2026-${String(index + 1).padStart(3, '0')}`;
        const status = index % 2 === 0 ? 'SELESAI' : 'DALAM PROSES';
        const statusStyle = status === 'SELESAI' ? styles.badgeDone : styles.badgeProgress;
        return (
            <View style={styles.reportCard}>
                <View style={styles.reportLeft}>
                    <Ionicons name={status === 'SELESAI' ? 'checkmark-circle' : 'time-outline'} size={20} color={status === 'SELESAI' ? '#9be7ff' : '#ffb86b'} />
                </View>
                <View style={styles.reportMiddle}>
                    <Text style={styles.reportTitle}>{idLabel}</Text>
                    <Text style={styles.reportSub}>{item.node || 'Titik 4A'}, {item.notes ? item.notes.slice(0, 40) : '—'}</Text>
                </View>
                <View style={styles.reportRight}>
                    <View style={[styles.statusBadge, statusStyle]}>
                        <Text style={styles.statusText}>{status}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <FlatList
                ListHeaderComponent={() => (
                    <View style={styles.headerWrap}>
                        <Text style={styles.header}>Riwayat & Notifikasi</Text>

                        <Text style={styles.sectionLabel}>NOTIFIKASI ANOMALI</Text>
                        {SAMPLE_ANOMALIES.map(a => (
                            <View key={a.id} style={{ marginBottom: 12 }}>{renderAnomaly({ item: a })}</View>
                        ))}

                        <Text style={styles.sectionLabel}>RIWAYAT LAPORAN SAYA</Text>
                    </View>
                )}
                data={reports}
                keyExtractor={(item, idx) => String(idx)}
                renderItem={renderReport}
                contentContainerStyle={styles.container}
                ListEmptyComponent={<Text style={styles.empty}>Belum ada laporan</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#0f1720' },
    container: { padding: 16, paddingBottom: 40 },
    headerWrap: { paddingBottom: 8 },
    header: { color: '#e6eef6', fontSize: 24, fontWeight: '700', marginBottom: 12 },
    sectionLabel: { color: '#cbd6dc', fontWeight: '700', marginTop: 6, marginBottom: 8 },
    anomCard: { flexDirection: 'row', backgroundColor: '#14202a', borderRadius: 10, padding: 12, alignItems: 'center' },
    anomAccent: { width: 6, height: '100%', backgroundColor: '#ff6b6b', borderRadius: 4, marginRight: 10 },
    anomTitle: { color: '#e9f0f6', fontWeight: '700', marginBottom: 6 },
    anomDesc: { color: '#cbd6dc', fontSize: 13 },
    anomTs: { color: '#9aa3ad', marginTop: 8, fontSize: 12 },
    reportCard: { flexDirection: 'row', backgroundColor: '#14202a', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 12 },
    reportLeft: { width: 36, alignItems: 'center', justifyContent: 'center' },
    reportMiddle: { flex: 1, paddingHorizontal: 8 },
    reportRight: { width: 110, alignItems: 'flex-end' },
    reportTitle: { color: '#e9f0f6', fontWeight: '700' },
    reportSub: { color: '#b9c3c9', marginTop: 6, fontSize: 12 },
    statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
    badgeDone: { backgroundColor: '#d0f7ff' },
    badgeProgress: { backgroundColor: '#ffe7c7' },
    statusText: { fontWeight: '700', color: '#0b141a' },
    empty: { color: '#9aa3ad', textAlign: 'center', marginTop: 20 },
});

export default HistoryScreen;
