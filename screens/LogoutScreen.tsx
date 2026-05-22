import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { logoutUser } from '../authService';

export default function LogoutScreen({ navigation }: any) {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        } catch (e: any) {
            Alert.alert('Error', 'Gagal keluar. Coba lagi.');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text style={styles.title}>Keluar</Text>
                <Text style={styles.subtitle}>Apakah Anda yakin ingin keluar?</Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={styles.cancelText}>Batal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.logoutBtn, loading && styles.logoutBtnDisabled]}
                        onPress={handleLogout}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading
                            ? <ActivityIndicator color="#022027" />
                            : <Text style={styles.logoutText}>Keluar</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#071018' },
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    title: { color: '#fff', fontSize: 22, marginBottom: 8 },
    subtitle: { color: '#9aa6b0', textAlign: 'center', marginBottom: 24 },
    actions: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
    cancelBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#0b1720', alignItems: 'center', marginRight: 8 },
    cancelText: { color: '#9aa6b0' },
    logoutBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#9be7ff', alignItems: 'center', marginLeft: 8 },
    logoutBtnDisabled: { backgroundColor: '#5c8c96' },
    logoutText: { color: '#022027', fontWeight: '600' },
});