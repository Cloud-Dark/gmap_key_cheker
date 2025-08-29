const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Determine the base path for static files
const staticPath = path.join(__dirname, '..');

app.use(cors());
app.use(express.json());
app.use(express.static(staticPath));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'active', timestamp: new Date().toISOString() });
});

// Proxy endpoint for Google Maps API requests
app.post('/api/proxy', async (req, res) => {
    const { url, method = 'GET', headers = {}, body = null } = req.body;
    
    try {
        const response = await axios.request({
            url,
            method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ...headers
            },
            data: body // For POST, PUT, etc.
        });
        
        res.json({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        });
        console.log('Proxy request successful:', { status: response.status, headers: response.headers, data: response.data });
        
    } catch (error) {
        console.error('Proxy request failed:', error.message);
        res.status(500).json({
            error: error.message,
            status: 500,
            statusText: 'Internal Server Error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
    console.log('Frontend available at: http://localhost:${PORT}');
});