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

export default function LoginScreen({ navigation, onLogin }: any) {
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
                        />

                        <Text style={[styles.label, { marginTop: 8 }]}>Password</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                placeholder="••••••••"
                                placeholderTextColor="#9aa6b0"
                                value={password}
                                onChangeText={setPassword}
                                style={[styles.input, { flex: 1 }]}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.toggleBtn}>
                                <Text style={styles.toggleText}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
                        >
                            <Text style={styles.primaryBtnText}>Masuk</Text>
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <Text style={styles.small}>Belum punya akun? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
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
    safe: { flex: 1, backgroundColor: '#0b141a' },
    container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    logo: { width: 140, height: 140, marginBottom: 18 },
    title: { color: '#fff', fontSize: 22, marginBottom: 12 },
    card: { width: '100%', backgroundColor: '#000000', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
    label: { color: '#a9b7c0', marginBottom: 6 },
    input: { backgroundColor: '#081216', color: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#122026' },
    passwordRow: { flexDirection: 'row', alignItems: 'center' },
    toggleBtn: { paddingHorizontal: 8, marginLeft: 8 },
    toggleText: { color: '#9be7ff' },
    primaryBtn: { backgroundColor: '#9be7ff', paddingVertical: 12, borderRadius: 10, marginTop: 14, alignItems: 'center' },
    primaryBtnText: { color: '#022027', fontWeight: '600' },
    row: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
    link: { color: '#9be7ff', fontWeight: '600' },
    small: { color: '#9aa6b0' },
});
