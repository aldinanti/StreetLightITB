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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation, onRegister }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const logoScale = useRef(new Animated.Value(0.9)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(logoScale, { toValue: 1, duration: 450, useNativeDriver: false }),
            Animated.timing(logoOpacity, { toValue: 1, duration: 450, useNativeDriver: false }),
        ]).start();
    }, [logoScale, logoOpacity]);

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Animated.Image source={require('../assets/logo-darkStreetLightITB.png')} style={[styles.logo, { transform: [{ scale: logoScale }], opacity: logoOpacity }]} resizeMode="contain" />

                    <Text style={styles.title}>Buat akun</Text>

                    <View style={styles.card}>
                        <Text style={styles.label}>Nama</Text>
                        <TextInput placeholder="Nama lengkap" placeholderTextColor="#9aa6b0" value={name} onChangeText={setName} style={styles.input} />

                        <Text style={[styles.label, { marginTop: 8 }]}>Email</Text>
                        <TextInput placeholder="nama@contoh.com" placeholderTextColor="#9aa6b0" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />

                        <Text style={[styles.label, { marginTop: 8 }]}>Password</Text>
                        <View style={styles.passwordRow}>
                            <TextInput placeholder="Minimal 8 karakter" placeholderTextColor="#9aa6b0" value={password} onChangeText={setPassword} style={[styles.input, { flex: 1 }]} secureTextEntry={!showPassword} autoCapitalize="none" />
                            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.toggleBtn}>
                                <Text style={styles.toggleText}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
                        >
                            <Text style={styles.primaryBtnText}>Daftar</Text>
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <Text style={styles.small}>Sudah punya akun? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
    toggleText: { color: '#5b9cee' },
    primaryBtn: { backgroundColor: '#5b9cee', paddingVertical: 12, borderRadius: 10, marginTop: 14, alignItems: 'center' },
    primaryBtnText: { color: '#000000', fontWeight: '600' },
    row: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
    link: { color: '#5b9cee', fontWeight: '600' },
    small: { color: '#9aa6b0' },
});
