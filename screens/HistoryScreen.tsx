import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAdminReports, getMyReports } from '../apiService';
import { getStoredUser } from '../authService';

type Report = { id?: number; node?: string; issue?: string; urgency?: string; notes?: string; status?: string; ts: number };

const SAMPLE_ANOMALIES = [
    { id: 'a1', title: 'Rusak - Node-003 - Jalan Timur - Gedung Rektorat', desc: 'Lampu terdeteksi meredup tanpa alasan.', ts: Date.now() - 1000 * 60 * 20 },
    { id: 'a2', title: 'Hemat - Node-002 - Jalan Barat - Area Parkir', desc: 'Mode hemat aktif, namun tidak berespon pada pergerakan.', ts: Date.now() - 1000 * 60 * 40 },
];

const HistoryScreen: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        load();
        const id = setInterval(load, 3000);
        return () => clearInterval(id);
    }, []);

    async function load() {
        try {
            const user = await getStoredUser();

            if (user?.role === 'ADMIN') {
                const backendReports = await getAdminReports({ limit: 50 });
                setReports(backendReports.map((item: any) => ({
                    id: item.id,
                    node: item.node_id,
                    issue: item.issue_type,
                    notes: item.description,
                    status: item.status,
                    ts: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
                })));
                return;
            }

            const myReports = await getMyReports({ limit: 50 });
            setReports(myReports.map((item: any) => ({
                id: item.id,
                node: item.node_id,
                issue: item.issue_type,
                notes: item.description,
                status: item.status,
                ts: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
            })));
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
        // Hitung nomor urut asli relatif terhadap daftar keseluruhan agar ID tetap stabil saat difilter
        const originalListIndex = reports.indexOf(item);
        const reportNumber = reports.length - originalListIndex;
        const idLabel = item.id ? `Laporan #${item.id}` : `Laporan #LAP-2026-${String(reportNumber).padStart(3, '0')}`;
        const status = item.status || 'PENDING';
        const statusText = status === 'RESOLVED' ? 'SELESAI' : status === 'IN_PROGRESS' ? 'DALAM PROSES' : 'MENUNGGU';
        const statusStyle = status === 'RESOLVED' ? styles.badgeDone : styles.badgeProgress;
        return (
            <View style={styles.reportCard}>
                <View style={styles.reportLeft}>
                    <Ionicons name={status === 'RESOLVED' ? 'checkmark-circle' : 'time-outline'} size={20} color={status === 'RESOLVED' ? '#2a5298' : '#ffb86b'} />
                </View>
                <View style={styles.reportMiddle}>
                    <Text style={styles.reportTitle}>{idLabel}</Text>
                    <Text style={styles.reportSub}>{item.node || 'Titik 4A'}, {item.notes ? item.notes.slice(0, 40) : '-'}</Text>
                </View>
                <View style={styles.reportRight}>
                    <View style={[styles.statusBadge, statusStyle]}>
                        <Text style={styles.statusText}>{statusText}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const filteredReports = reports.filter(r => {
        const date = new Date(r.ts);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const dateStr = `${day}/${month}/${year}`;

        const originalListIndex = reports.indexOf(r);
        const reportNumber = reports.length - originalListIndex;
        const idLabel = r.id ? `Laporan #${r.id}` : `Laporan #LAP-2026-${String(reportNumber).padStart(3, '0')}`;
        
        const query = searchQuery.toLowerCase();
        
        return idLabel.toLowerCase().includes(query) || dateStr.includes(query);
    });

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            // Gunakan format manual yang sama (DD/MM/YYYY) agar filter sinkron
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            const dateStr = `${day}/${month}/${year}`;
            setSearchQuery(dateStr);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <FlatList
                ListHeaderComponent={
                    <View style={styles.headerWrap}>
                        <Text style={styles.headerMeta}></Text>
                        <Text style={styles.header}>Riwayat & Notifikasi</Text>

                        <Text style={styles.sectionLabel}>NOTIFIKASI ANOMALI</Text>
                        {SAMPLE_ANOMALIES.map(a => (
                            <View key={a.id} style={{ marginBottom: 12 }}>{renderAnomaly({ item: a })}</View>
                        ))}

                        <Text style={styles.sectionLabel}>RIWAYAT LAPORAN SAYA</Text>

                        <View style={styles.searchBar}>
                            <Ionicons name="search-outline" size={18} color="#e0e6f0" style={{ marginRight: 8 }} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Cari ID atau pilih tanggal..."
                                placeholderTextColor="#e0e6f088"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                returnKeyType="search"
                                blurOnSubmit={false}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 10 }}>
                                    <Ionicons name="close-circle" size={18} color="#e0e6f0" />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => setShowPicker(true)}>
                                <Ionicons name="calendar-outline" size={22} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                data={filteredReports}
                keyExtractor={(item, idx) => item.ts ? String(item.ts) : String(idx)}
                renderItem={renderReport}
                contentContainerStyle={styles.container}
                ListEmptyComponent={<Text style={styles.empty}>Belum ada laporan</Text>}
            />

            {showPicker && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 12 }}>
                    <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    />
                </View>
                </View>
            )}
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#1e3c72' },
    container: { padding: 20, paddingBottom: 40 },
    headerMeta: { color: '#e0e6f0', marginBottom: 4 },
    headerWrap: { paddingBottom: 8 },
    header: { color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 12 },
    sectionLabel: { color: '#e0e6f0', fontWeight: '700', marginTop: 6, marginBottom: 8 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#40619f', borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 16, borderWidth: 1, borderColor: '#405987' },
    searchInput: { flex: 1, color: '#ffffff', fontSize: 14, paddingVertical: 0 },
    anomCard: { flexDirection: 'row', backgroundColor: '#40619f', borderRadius: 10, padding: 12, alignItems: 'center' },
    anomAccent: { width: 6, height: '100%', backgroundColor: '#ff6b6b', borderRadius: 4, marginRight: 10 },
    anomTitle: { color: '#ffffff', fontWeight: '700', marginBottom: 6 },
    anomDesc: { color: '#e0e6f0', fontSize: 13 },
    anomTs: { color: '#ffffff', opacity: 0.6, marginTop: 8, fontSize: 12 },
    reportCard: { flexDirection: 'row', backgroundColor: '#40619f', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 12 },
    reportLeft: { width: 36, alignItems: 'center', justifyContent: 'center' },
    reportMiddle: { flex: 1, paddingHorizontal: 8 },
    reportRight: { width: 110, alignItems: 'flex-end' },
    reportTitle: { color: '#ffffff', fontWeight: '700' },
    reportSub: { color: '#e0e6f0', marginTop: 6, fontSize: 12 },
    statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
    badgeDone: { backgroundColor: '#d0f7ff' },
    badgeProgress: { backgroundColor: '#ffe7c7' },
    statusText: { fontWeight: '700', color: '#0b141a' },
    empty: { color: '#e0e6f0', textAlign: 'center', marginTop: 20 },
});

export default HistoryScreen;
