import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '../authService';

export default function LoginScreen({ navigation }: any) {
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
 
    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Perhatian', 'Email dan password harus diisi.');
            return;
        }
 
        setLoading(true);
        try {
            await loginUser(email.trim(), password);
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } catch (e: any) {
            let msg = 'Login gagal. Coba lagi.';
            if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
                msg = 'Email atau password salah.';
            } else if (e.code === 'auth/invalid-email') {
                msg = 'Format email tidak valid.';
            } else if (e.code === 'auth/too-many-requests') {
                msg = 'Terlalu banyak percobaan. Coba lagi nanti.';
            } else if (e.code === 'auth/network-request-failed') {
                msg = 'Tidak ada koneksi internet.';
            }
            Alert.alert('Login Gagal', msg);
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
 
                    <Text style={styles.title}>Selamat datang</Text>
 
                    <View style={styles.card}>
                        <Text style={styles.label}>Email</Text>
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
                                placeholder="••••••••"
                                placeholderTextColor="#9aa6b0"
                                value={password}
                                onChangeText={setPassword}
                                style={[styles.input, { flex: 1 }]}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.toggleBtn}>
                                <Text style={styles.toggleText}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</Text>
                            </TouchableOpacity>
                        </View>
 
                        <TouchableOpacity
                            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading
                                ? <ActivityIndicator color="#000" />
                                : <Text style={styles.primaryBtnText}>Masuk</Text>
                            }
                        </TouchableOpacity>
 
                        <View style={styles.row}>
                            <Text style={styles.small}>Belum punya akun? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
                                <Text style={styles.link}>Daftar</Text>
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
    toggleText: { color: '#5b9cee' },
    primaryBtn: { backgroundColor: '#5b9cee', paddingVertical: 12, borderRadius: 10, marginTop: 14, alignItems: 'center' },
    primaryBtnDisabled: { backgroundColor: '#3a5a8a', opacity: 0.7 },
    primaryBtnText: { color: '#000000', fontWeight: '600' },
    row: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
    link: { color: '#5b9cee', fontWeight: '600' },
    small: { color: '#9aa6b0' },
});
