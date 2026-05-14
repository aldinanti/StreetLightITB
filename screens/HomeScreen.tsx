import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const SUMMARY = [
    { label: 'Aktif', value: 8, color: '#7DD3FC' },
    { label: 'Hemat Energi', value: 3, color: '#FBC02D' },
    { label: 'Anomali', value: 1, color: '#FB7185' }
];

const NODES = [
    { title: 'Titik 2A - Gerbang Utama', desc: '450 lux · PWM 100%', status: 'Aktif', statusColor: '#7DD3FC' },
    { title: 'Titik 3B - Gedung KOICA', desc: '120 lux · PWM 0%', status: 'Hemat', statusColor: '#FBBF24' },
    { title: 'Titik 1C - GKU 2', desc: '15 lux · PWM 0%', status: 'Anomali', statusColor: '#FB7185' }
];

const HomeScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.small}>Dashboard</Text>
                <Text style={styles.header}>Monitoring Jatinangor</Text>

                <View style={styles.row}>
                    {SUMMARY.map((s) => (
                        <View key={s.label} style={styles.summaryCard}>
                            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
                            <Text style={styles.summaryLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>STATUS NODE LAMPU — LIVE</Text>

                {NODES.map((n) => (
                    <View key={n.title} style={styles.nodeCard}>
                        <View style={styles.nodeLeft} />
                        <View style={styles.nodeBody}>
                            <Text style={styles.nodeTitle}>{n.title}</Text>
                            <Text style={styles.nodeDesc}>{n.desc}</Text>
                        </View>
                        <View style={styles.nodeMeta}>
                            <View style={[styles.statusBadge, { backgroundColor: n.statusColor + '22' }]}>
                                <Text style={[styles.statusText, { color: n.statusColor }]}>{n.status}</Text>
                            </View>
                        </View>
                    </View>
                ))}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1720' },
    scroll: { padding: 20, paddingBottom: 40 },
    small: { color: '#94A3B8', fontSize: 14, marginTop: 8 },
    header: { color: '#E6EEF8', fontSize: 28, fontWeight: '700', marginTop: 6, marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
    summaryCard: { flex: 1, marginRight: 10, backgroundColor: '#15202B', padding: 14, borderRadius: 12, alignItems: 'center' },
    summaryValue: { fontSize: 26, fontWeight: '800' },
    summaryLabel: { color: '#94A3B8', marginTop: 6 },
    sectionTitle: { color: '#CBD5E1', fontWeight: '700', marginBottom: 12, marginTop: 6 },
    nodeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1220', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#12232F' },
    nodeLeft: { width: 10 },
    nodeBody: { flex: 1 },
    nodeTitle: { color: '#E6EEF8', fontWeight: '700', marginBottom: 4 },
    nodeDesc: { color: '#94A3B8', fontSize: 13 },
    nodeMeta: { marginLeft: 10 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
    statusText: { fontWeight: '700' }
});

export default HomeScreen;