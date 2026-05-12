import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const NODE_OPTIONS = [
    'Titik 1C - GKU 2',
    'Titik 2A - Parkir',
    'Titik 3B - Jalan Utama',
    'Titik 4D - Perpustakaan',
];

const ISSUE_OPTIONS = [
    'Lampu mati',
    'Lampu redup',
    'Kabel putus',
    'Flicker / kedip',
    'Lainnya'
];

const ReportScreen: React.FC<any> = ({ navigation }) => {
    const [node, setNode] = useState<string>(NODE_OPTIONS[0]);
    const [issue, setIssue] = useState<string>(ISSUE_OPTIONS[0]);
    const [urgency, setUrgency] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');
    const [notes, setNotes] = useState<string>('');
    const [showNodeOptions, setShowNodeOptions] = useState(false);
    const [showIssueOptions, setShowIssueOptions] = useState(false);

    async function submit() {
        try {
            const raw = await AsyncStorage.getItem('streetlight_reports');
            const items = raw ? JSON.parse(raw) : [];
            items.push({ node, issue, urgency, notes, ts: Date.now() });
            await AsyncStorage.setItem('streetlight_reports', JSON.stringify(items));
            setNotes('');
            Alert.alert('Berhasil', 'Laporan tersimpan');
            navigation.navigate('Riwayat');
        } catch (e: any) {
            Alert.alert('Error', String(e));
        }
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.headerMeta}></Text>
                <Text style={styles.header}>Formulir Pelaporan</Text>

                <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Node Lampu</Text>
                    <TouchableOpacity style={styles.select} onPress={() => setShowNodeOptions(s => !s)}>
                        <Text style={styles.selectText}>{node}</Text>
                    </TouchableOpacity>
                    {showNodeOptions && (
                        <View style={styles.optionsBox}>
                            {NODE_OPTIONS.map(n => (
                                <TouchableOpacity key={n} style={styles.optionItem} onPress={() => { setNode(n); setShowNodeOptions(false); }}>
                                    <Text style={styles.optionText}>{n}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Jenis Kerusakan</Text>
                    <TouchableOpacity style={styles.select} onPress={() => setShowIssueOptions(s => !s)}>
                        <Text style={styles.selectText}>{issue}</Text>
                    </TouchableOpacity>
                    {showIssueOptions && (
                        <View style={styles.optionsBox}>
                            {ISSUE_OPTIONS.map(i => (
                                <TouchableOpacity key={i} style={styles.optionItem} onPress={() => { setIssue(i); setShowIssueOptions(false); }}>
                                    <Text style={styles.optionText}>{i}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Tingkat Urgensi</Text>
                    <View style={styles.urgencyRow}>
                        {(['Tinggi', 'Sedang', 'Rendah'] as const).map(level => (
                            <TouchableOpacity key={level} style={[styles.urgencyPill, urgency === level && styles.urgencyActive]} onPress={() => setUrgency(level)}>
                                <Text style={[styles.urgencyText, urgency === level && styles.urgencyTextActive]}>{level}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Catatan (optional)</Text>
                    <TextInput value={notes} onChangeText={setNotes} placeholder="Tambahkan descript..." placeholderTextColor="#6b7280" multiline style={[styles.input, styles.textarea]} />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={submit} activeOpacity={0.85}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.submitText}>Kirim Laporan</Text>
                        <Ionicons name="chevron-forward" size={18} color="#e6eef6" style={{ marginLeft: 8 }} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#0f1720' },
    container: { padding: 20, paddingBottom: 40 },
    headerMeta: { color: '#9aa3ad', marginBottom: 4 },
    header: { color: '#e6eef6', fontSize: 26, fontWeight: '700', marginBottom: 12 },
    field: { marginTop: 12 },
    fieldLabel: { color: '#c7d2da', marginBottom: 8 },
    select: { backgroundColor: '#0b141a', borderWidth: 1, borderColor: '#20313a', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10 },
    selectText: { color: '#e6eef6' },
    optionsBox: { backgroundColor: '#0b141a', borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: '#21303a', overflow: 'hidden' },
    optionItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
    optionText: { color: '#cbd6dc' },
    urgencyRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    urgencyPill: { flex: 1, marginHorizontal: 4, paddingVertical: 10, borderRadius: 20, backgroundColor: '#14202a', alignItems: 'center' },
    urgencyActive: { backgroundColor: '#ff6b6b' },
    urgencyText: { color: '#c3ccd1' },
    urgencyTextActive: { color: '#fff', fontWeight: '700' },
    input: { backgroundColor: '#0b141a', borderWidth: 1, borderColor: '#20313a', padding: 12, borderRadius: 10, color: '#e6eef6' },
    textarea: { height: 110, textAlignVertical: 'top', marginTop: 8 },
    submitBtn: { marginTop: 18, backgroundColor: '#1f2933', paddingVertical: 14, borderRadius: 22, alignItems: 'center' },
    submitText: { color: '#e6eef6', fontWeight: '700' },
});

export default ReportScreen;
