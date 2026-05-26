import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createReport, getNodes } from '../apiService';

const NODE_OPTIONS = [
    'NODE-001',
    'NODE-002',
    'NODE-003',
    'NODE-004',
    'NODE-005',
    'NODE-006',
    'NODE-007',
    'NODE-008',
    'NODE-009',
    'NODE-010',
    'NODE-011',
    'NODE-012',
    'NODE-013',
    'NODE-014',
    'NODE-015',
    'NODE-016',
    'NODE-017',
    'NODE-018',
    'NODE-019',
    'NODE-020',
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
    const [nodeOptions, setNodeOptions] = useState<string[]>(NODE_OPTIONS);
    const [showNodeOptions, setShowNodeOptions] = useState(false);
    const [showIssueOptions, setShowIssueOptions] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadNodes() {
            try {
                const data = await getNodes();
                const ids = data.map((item: any) => item.id).filter(Boolean);

                if (mounted && ids.length > 0) {
                    setNodeOptions(ids);
                }
            } catch (e) {
                // Keep static node options when backend nodes cannot be loaded.
            }
        }

        loadNodes();

        return () => {
            mounted = false;
        };
    }, []);

    const issueToType = (value: string) => value.toLowerCase().replace(/\s*\/\s*/g, '_').replace(/\s+/g, '_');

    async function submit() {
        if (!node || !issue || !notes.trim()) {
            Alert.alert('ALERT', 'Kamu belum isi semua field! Cek lagi ya <3');
            return;
        }

        setLoading(true);
        try {
            await createReport({
                nodeId: node,
                issueType: issueToType(issue),
                severity: 'MEDIUM',
                description: notes.trim(),
            });

            setNode('');
            setIssue('');
            setNotes('');
            Alert.alert('Berhasil', 'Laporan terkirim ke backend.');
            navigation.navigate('Riwayat');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Gagal mengirim laporan.');
        } finally {
            setLoading(false);
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
                            {nodeOptions.map(n => (
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

                <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={submit} activeOpacity={0.85} disabled={loading}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        {loading
                            ? <ActivityIndicator color="#ffffff" size="small" />
                            : <>
                                <Text style={styles.submitText}>Kirim Laporan</Text>
                                <Ionicons name="chevron-forward" size={18} color="#e6eef6" style={{ marginLeft: 8 }} />
                            </>
                        }
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
    submitBtnDisabled: { backgroundColor: '#405987', opacity: 0.8 },
    submitText: { color: '#ffffff', fontWeight: '700' },
});

export default ReportScreen;
