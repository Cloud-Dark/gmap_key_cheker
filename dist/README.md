# Google Maps API Key Checker

Tool untuk mengecek status Google Maps API Key dengan dukungan proxy Node.js untuk server-side requests.

## Features

- Test 21 different Google Maps APIs dengan satu API key
- Real-time status updates (ON/OFF)
- Simple and clean interface
- **Node.js proxy server** untuk testing API yang membutuhkan server-side requests
- Auto-detection backend server status

## Supported APIs

### Core APIs
- Maps JavaScript API
- Geocoding API
- Reverse Geocoding API
- Directions API
- Distance Matrix API

### Places APIs
- Places API (Nearby Search)
- Places API (Text Search)
- Places API (Details)
- Places API (Photos)
- Places API (Autocomplete)

### Visual APIs
- Static Maps API
- Street View Static API
- Maps Embed API

### Utility APIs
- Elevation API
- Timezone API
- Geolocation API

### Roads APIs
- Roads API (Snap to Roads)
- Roads API (Nearest Roads)
- Roads API (Speed Limits)

### Other
- Maps URLs

## Cara Menggunakan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server Proxy (Opsional tapi Direkomendasikan)

**Opsi A: Jalankan dari Source Code**
```bash
npm start
```

**Opsi B: Build ke Executable**
```bash
npm run build
```
Executable akan tersedia di folder `dist/`

Server akan berjalan di `http://localhost:3000`

### 3. Buka Frontend
- Jika server proxy aktif: Buka `http://localhost:3000`
- Tanpa server proxy: Buka file `index.html` langsung di browser

### 4. Cara Testing

1. **Masukkan Backend URL** (biasanya `http://localhost:3000`)
2. **Klik "Check Backend"** untuk memastikan server proxy aktif
3. **Masukkan Google Maps API Key**
4. **Klik "Check APIs"**

## Status Indikator

- **🟢 (Hijau)**: Backend server aktif
- **🔴 (Merah)**: Backend server offline
- **ON**: API aktif dan berfungsi
- **OFF**: API tidak aktif/bermasalah

## API Categories

### ✅ APIs yang Dapat Ditest Tanpa Proxy (Browser):
- Maps JavaScript API
- Static Maps API
- Street View Static API
- Maps Embed API
- Maps URLs

### ⚡ APIs yang Membutuhkan Proxy (Server-side):
- Geocoding API
- Reverse Geocoding API
- Places API (Nearby Search, Text Search, Details, Photos, Autocomplete)
- Directions API
- Distance Matrix API
- Elevation API
- Timezone API
- Geolocation API
- Roads API (Snap to Roads, Nearest Roads, Speed Limits)

## Requirements

- Modern web browser dengan JavaScript enabled
- Valid Google Maps API key
- Internet connection untuk API testing
- **Node.js** (untuk server proxy)

## Build ke Executable

Untuk membuat executable yang bisa dijalankan tanpa Node.js:

```bash
# Install dependencies dulu
npm install

# Build semua platform (Windows, Linux, macOS)
npm run build

# Build specific platform
npm run build:win     # Windows .exe
npm run build:linux   # Linux executable  
npm run build:mac     # macOS executable
```

Hasil build akan tersimpan di folder `dist/`:
- `gmaps-api-checker-win.exe` (Windows)
- `gmaps-api-checker-linux` (Linux)
- `gmaps-api-checker-macos` (macOS)

## Catatan Penting

- Tanpa server proxy, beberapa API akan gagal karena CORS policy
- Server proxy memungkinkan testing semua Google Maps APIs
- API key harus format yang valid (dimulai dengan "AIza" dan minimal 30 karakter)
- Executable tidak memerlukan Node.js untuk dijalankan

## API Key Setup

To use this tool, you need a Google Maps API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Maps APIs you want to use
4. Create credentials (API key)
5. Configure API key restrictions if needed

## Security Note

- Never commit your API key to version control
- Use API key restrictions in production
- Consider using environment variables or config files for API keys

## Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This tool is for testing purposes only. Please respect Google's API usage limits and terms of service.