import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerMahasiswa } from '../authService';

export default function RegisterScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const logoScale = useRef(new Animated.Value(0.9)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
 
    useEffect(() => {
        Animated.parallel([
            Animated.timing(logoScale, { toValue: 1, duration: 450, useNativeDriver: false }),
            Animated.timing(logoOpacity, { toValue: 1, duration: 450, useNativeDriver: false }),
        ]).start();
    }, [logoScale, logoOpacity]);
 
    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert('Perhatian', 'Nama harus diisi.');
            return;
        }
        if (!email.trim()) {
            Alert.alert('Perhatian', 'Email harus diisi.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Perhatian', 'Password minimal 8 karakter.');
            return;
        }
 
        setLoading(true);
        try {
            await registerMahasiswa(email.trim(), password, name.trim());
            Alert.alert('Berhasil', 'Akun berhasil dibuat. Silakan masuk.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (e: any) {
            let msg = e.message || 'Pendaftaran gagal. Coba lagi.';
            if (e.status === 409) {
                msg = 'Email sudah terdaftar.';
            } else if (e.status === 400) {
                msg = 'Data pendaftaran tidak valid.';
            }
            Alert.alert('Pendaftaran Gagal', msg);
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Animated.Image
                        source={require('../assets/logo-darkStreetLightITB.png')}
                        style={[styles.logo, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}
                        resizeMode="contain"
                    />
 
                    <Text style={styles.title}>Buat akun</Text>
 
                    <View style={styles.card}>
                        <Text style={styles.label}>Nama</Text>
                        <TextInput
                            placeholder="Nama lengkap"
                            placeholderTextColor="#9aa6b0"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            editable={!loading}
                        />
 
                        <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
                        <TextInput
                            placeholder="nama@contoh.com"
                            placeholderTextColor="#9aa6b0"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />
 
                        <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                placeholder="Minimal 8 karakter"
                                placeholderTextColor="#9aa6b0"
                                value={password}
                                onChangeText={setPassword}
                                style={[styles.input, { flex: 1 }]}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.toggleBtn} disabled={loading}>
                                <Text style={styles.toggleText}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</Text>
                            </TouchableOpacity>
                        </View>
 
                        <TouchableOpacity
                            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading
                                ? <ActivityIndicator color="#000" />
                                : <Text style={styles.primaryBtnText}>Daftar</Text>
                            }
                        </TouchableOpacity>
 
                        <View style={styles.row}>
                            <Text style={styles.small}>Sudah punya akun? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
                                <Text style={styles.link}>Masuk</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#000000' },
    container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    logo: { width: 140, height: 140, marginBottom: 18 },
    title: { color: '#fff', fontSize: 22, marginBottom: 12 },
    card: { width: '100%', backgroundColor: '#132147', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
    label: { color: '#a9b7c0', marginBottom: 6 },
    input: { backgroundColor: '#081216', color: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#122026' },
    passwordRow: { flexDirection: 'row', alignItems: 'center' },
    toggleBtn: { paddingHorizontal: 8, marginLeft: 8 },
    toggleText: { color: '#2a5298' },
    primaryBtn: { backgroundColor: '#2a5298', paddingVertical: 12, borderRadius: 10, marginTop: 14, alignItems: 'center' },
    primaryBtnDisabled: { backgroundColor: '#3a5a8a', opacity: 0.7 },
    primaryBtnText: { color: '#000000', fontWeight: '600' },
    row: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
    link: { color: '#2a5298', fontWeight: '600' },
    small: { color: '#9aa6b0' },
});
