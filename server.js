const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'active', timestamp: new Date().toISOString() });
});

// Proxy endpoint for Google Maps API requests
app.post('/api/proxy', async (req, res) => {
    const { url, method = 'GET', headers = {} } = req.body;
    
    try {
        const fetch = (await import('node-fetch')).default;
        
        const response = await fetch(url, {
            method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ...headers
            }
        });
        
        const data = await response.text();
        
        res.json({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers),
            data: data
        });
        
    } catch (error) {
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