# Tugas Besar Kelompok 5 Mobile App StreetLightITB

## Anggota Kelompok

| Nama | NIM |
|------------|-------------|
| Leticia Aldina Trulykinanti | 18223108|
| Aldoy Fauzan Avanza | 18223113|
| Laras Hati Mahendra | 18223118|
| Maria Vransiska Pingkhan | 18223119|
| M. Rafly Fauzan | 18223132|
| Katry Kezia | 18223135|

## Deskripsi

Aplikasi mobile Android "StreetLightITB" dirancang untuk interface mahasiswa dan civitas akademika ITB Jatinangor sebagai pengguna akhir.

Aplikasi ini menyediakan dua fungsi utama: 
1. Monitoring status kondisi lampu jalan secara real time 
2. Pelaporan kerusakan lampu yang dapat dilakukan dalam maksimal 3 langkah interaksi. 

Aplikasi juga dilengkapi dengan fitur pembaruan otomatis untuk memberikan informasi terkini mengenai kondisi lingkungan atau status pemeliharaan secara proaktif kepada pengguna. Ketiga komponen tersebut berinteraksi membentuk arsitektur tiga-tier:
1. Field Layer: Bertindak sebagai sumber data utama dan unit aktuasi yang berinteraksi langsung dengan lingkungan fisik.
2. Data Integration Layer: Berfungsi sebagai perantara yang mengelola aliran data, memastikan informasi bisa selaras dengan perangkat lapangan.
3. Presentation Layer: Terdiri atas antarmuka berbasis web dan mobile yang menyajikan informasi terstruktur bagi pengguna dengan hak akses berbeda, baik untuk kebutuhan manajemen operasional maupun layanan informasi publik.

Quick start:

1. Install node modules

```bash
npm install
```

2. Install native dependencies recommended by Expo:

```bash
npx expo install react-native-maps react-native-safe-area-context react-native-screens @react-navigation/native @react-navigation/bottom-tabs @react-native-async-storage/async-storage
```

3. Start the dev server

```bash
npm run start
# or
npx expo start
```

Notes:
- The project in this folder is scaffolded for convenience. If you prefer, create a fresh Expo app with `npx create-expo-app` and copy the `screens/` and `App.js` files into it.
- On first run you may need to follow Expo prompts to configure the project for Android/iOS simulators or physical devices.
- To open in Expo Go on iOS: start the dev server with `npx expo start`, then scan the QR code from the Expo DevTools using the Expo Go app on your iPhone (or choose "Run on iOS device").
- If you use native modules that are not included in Expo Go, you will need a custom dev client. For most common packages (navigation, async-storage, react-native-maps) `npx expo install` will pick compatible versions that work with Expo Go.