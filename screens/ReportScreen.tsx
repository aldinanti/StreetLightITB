import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const NODE_OPTIONS = [
    'Node-001',
    'Node-002',
    'Node-003',
    'Node-004',
    'Node-005',
    'Node-006',
    'Node-007',
    'Node-008',
    'Node-009',
    'Node-010',
    'Node-011',
    'Node-012',
    'Node-013',
    'Node-014',
    'Node-015',
    'Node-016',
    'Node-017',
    'Node-018',
    'Node-019',
    'Node-020',
];

const ISSUE_OPTIONS = [
    'Lampu mati',
    'Lampu redup',
    'Kabel putus',
    'Flicker / kedip',
    'Lampu pecah'
];

const ReportScreen: React.FC<any> = ({ navigation }) => {
    const [node, setNode] = useState<string>('');
    const [issue, setIssue] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [showNodeOptions, setShowNodeOptions] = useState(false);
    const [showIssueOptions, setShowIssueOptions] = useState(false);

    async function submit() {
        if (!node || !issue || !notes.trim()) {
            Alert.alert('ALERT', 'Kamu belum isi semua field! Cek lagi ya <3');
            return;
        }

        try {
            const raw = await AsyncStorage.getItem('streetlight_reports');
            const items = raw ? JSON.parse(raw) : [];
            items.push({ node, issue, notes, ts: Date.now() });
            await AsyncStorage.setItem('streetlight_reports', JSON.stringify(items));
            setNode('');
            setIssue('');
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
                        <Text style={styles.selectText}>{node || 'Pilih Node Lampu...'}</Text>
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
                        <Text style={styles.selectText}>{issue || 'Pilih Jenis Kerusakan...'}</Text>
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
                    <Text style={styles.fieldLabel}>Catatan</Text>
                    <TextInput value={notes} onChangeText={setNotes} placeholder="Deskripsikan detail kerusakan di sini..." placeholderTextColor="#ffffff" multiline style={[styles.input, styles.textarea]} />
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
    safe: { flex: 1, backgroundColor: '#1e3c72' },
    container: { padding: 20, paddingBottom: 40 },
    headerMeta: { color: '#e0e6f0', marginBottom: 4 },
    header: { color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 12 },
    field: { marginTop: 12 },
    fieldLabel: { color: '#e0e6f0', marginBottom: 8 },
    select: { backgroundColor: '#40619f', borderWidth: 1, borderColor: '#405987', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10 },
    selectText: { color: '#ffffff' },
    optionsBox: { backgroundColor: '#295196', borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: '#405987', overflow: 'hidden' },
    optionItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#405987' },
    optionText: { color: '#ffffff' },
    input: { backgroundColor: '#40619f', borderWidth: 1, borderColor: '#405987', padding: 12, borderRadius: 10, color: '#ffffff' },
    textarea: { height: 110, textAlignVertical: 'top', marginTop: 8 },
    submitBtn: { marginTop: 18, backgroundColor: '#295196', paddingVertical: 14, borderRadius: 22, alignItems: 'center' },
    submitText: { color: '#ffffff', fontWeight: '700' },
});

export default ReportScreen;