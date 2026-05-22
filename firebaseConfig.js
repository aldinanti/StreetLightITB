import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5rQw0oggUoi1Yxim286cUsh2MCEhA66E",
  authDomain: "smart-adaptive-street-lighting.firebaseapp.com",
  databaseURL: "https://smart-adaptive-street-lighting-default-rtdb.firebaseio.com",
  projectId: "smart-adaptive-street-lighting",
  storageBucket: "smart-adaptive-street-lighting.firebasestorage.app",
  messagingSenderId: "604493942105",
  appId: "1:604493942105:web:0b8c3c6457ec8f57ca5048",
  measurementId: "G-XSJKJHLERY"
};

const app = initializeApp(firebaseConfig);

// Gunakan initializeAuth + AsyncStorage agar sesi login tersimpan di device
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);