import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LogoutScreen({ navigation, route }: any) {
    const handleLogout = () => {
        if (route?.params?.onLogout) {
            try {
                route.params.onLogout();
            } catch (e) {
                // ignore
            }
        }
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text style={styles.title}>Keluar</Text>
                <Text style={styles.subtitle}>Apakah Anda yakin ingin keluar?</Text>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelText}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Keluar</Text>
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
    logoutText: { color: '#022027', fontWeight: '600' },
});
