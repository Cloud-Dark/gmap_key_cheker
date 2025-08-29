# Google Maps API Key Checker

A comprehensive tool to check the status of Google Maps API Keys with Node.js proxy support for server-side requests.

## Features

- Test 21 different Google Maps APIs with a single API key
- Real-time status updates (ON/OFF)
- Simple and clean interface
- **Node.js proxy server** for testing APIs that require server-side requests
- Auto-detection of backend server status

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

## How to Use

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Proxy Server (Optional but Recommended)

**Option A: Run from Source Code**
```bash
npm start
```

**Option B: Build to Executable**
```bash
npm run build
```
Executables will be available in the `dist/` folder

Server will run on `http://localhost:3000`

### 3. Open Frontend
- If proxy server is active: Open `http://localhost:3000`
- Without proxy server: Open `index.html` file directly in browser

### 4. Testing Process

1. **Enter Backend URL** (usually `http://localhost:3000`)
2. **Click "Check Backend"** to ensure proxy server is active
3. **Enter Google Maps API Key**
4. **Click "Check APIs"**

## Status Indicators

- **🟢 (Green)**: Backend server active
- **🔴 (Red)**: Backend server offline
- **ON**: API active and working
- **OFF**: API inactive/problematic

## API Categories

### ✅ APIs that Can Be Tested Without Proxy (Browser):
- Maps JavaScript API
- Static Maps API
- Street View Static API
- Maps Embed API
- Maps URLs

### ⚡ APIs that Require Proxy (Server-side):
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

- Modern web browser with JavaScript enabled
- Valid Google Maps API key
- Internet connection for API testing
- **Node.js** (for server proxy)

## Build to Executable

To create an executable that can run without Node.js:

```bash
# Install dependencies first
npm install

# Build all platforms (Windows, Linux, macOS)
npm run build

# Build specific platform
npm run build:win     # Windows .exe
npm run build:linux   # Linux executable  
npm run build:mac     # macOS executable
```

Build results will be saved in the `dist/` folder:
- `gmaps-api-checker-win.exe` (Windows)
- `gmaps-api-checker-linux` (Linux)
- `gmaps-api-checker-macos` (macOS)

## Important Notes

- Without server proxy, some APIs will fail due to CORS policy
- Server proxy enables testing of all Google Maps APIs
- API key must be in valid format (starts with "AIza" and minimum 30 characters)
- Executables do not require Node.js to run

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
