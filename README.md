# Google Maps API Key Checker

A simple web-based tool to test and verify Google Maps API key functionality across all available Google Maps APIs.

## Features

- Test 20 different Google Maps APIs with a single API key
- Real-time status updates (ON/OFF)
- Simple and clean interface
- No backend required - runs entirely in the browser

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

## Usage

1. Open `index.html` in your web browser
2. Enter your Google Maps API key in the input field
3. Click "Check APIs" button
4. View the results in the table below

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/Cloud-Dark/gmap_key_cheker.git
   ```

2. Open `index.html` in your web browser

3. Enter your Google Maps API key and start testing!

## Requirements

- Modern web browser with JavaScript enabled
- Valid Google Maps API key
- Internet connection for API testing

## How It Works

The tool makes HTTP requests to various Google Maps API endpoints to verify if your API key has access to each service. Each API is tested with a simple request:

- **Success (ON)**: API responds correctly
- **Failure (OFF)**: API returns an error or is not accessible

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