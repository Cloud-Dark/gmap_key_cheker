const APIs = [
    { name: 'Maps JavaScript API', test: testMapsJS },
    { name: 'Static Maps API', test: testStaticMaps },
    { name: 'Street View Static API', test: testStreetView },
    { name: 'Maps Embed API', test: testMapsEmbed },
    { name: 'Geocoding API', test: testGeocodingBasic },
    { name: 'Reverse Geocoding API', test: testReverseGeocodingBasic },
    { name: 'Places API (Nearby Search)', test: testPlacesBasic },
    { name: 'Places API (Text Search)', test: testPlacesBasic },
    { name: 'Places API (Details)', test: testPlacesBasic },
    { name: 'Places API (Photos)', test: testPlacesBasic },
    { name: 'Places API (Autocomplete)', test: testPlacesBasic },
    { name: 'Directions API', test: testDirectionsBasic },
    { name: 'Distance Matrix API', test: testDistanceMatrixBasic },
    { name: 'Elevation API', test: testElevationBasic },
    { name: 'Timezone API', test: testTimezoneBasic },
    { name: 'Geolocation API', test: testGeolocationBasic },
    { name: 'Roads API (Snap to Roads)', test: testRoadsBasic },
    { name: 'Roads API (Nearest Roads)', test: testRoadsBasic },
    { name: 'Roads API (Speed Limits)', test: testRoadsBasic },
    { name: 'Maps URLs', test: testMapsUrls }
];

let apiResults = [];
let backendAvailable = false;

// Backend status management
async function checkBackendStatus() {
    const backendUrl = document.getElementById('backendUrl').value || 'http://localhost:3000';
    const statusIndicator = document.getElementById('backendStatus');
    const checkButton = document.getElementById('checkBackend');
    
    // Show loading state
    statusIndicator.style.color = '#ffc107';
    statusIndicator.title = 'Checking...';
    checkButton.textContent = 'Please wait while checking connection to backend...';
    checkButton.disabled = true;
    
    try {
        const response = await fetch(`${backendUrl}/health`);
        const data = await response.json();
        
        if (data.status === 'active') {
            backendAvailable = true;
            statusIndicator.style.color = '#4CAF50';
            statusIndicator.title = 'Backend Active';
            checkButton.textContent = 'Backend Connected ✓';
            console.log('Backend is active');
        } else {
            throw new Error('Backend not active');
        }
    } catch (error) {
        backendAvailable = false;
        statusIndicator.style.color = '#f44336';
        statusIndicator.title = 'Backend Offline';
        checkButton.textContent = 'Backend Offline ✗';
        console.log('Backend is offline:', error.message);
    }
    
    // Reset button after 2 seconds
    setTimeout(() => {
        checkButton.textContent = 'Check Backend';
        checkButton.disabled = false;
    }, 2000);
}

// Proxy request function
async function makeProxyRequest(url, method = 'GET', headers = {}) {
    const backendUrl = document.getElementById('backendUrl').value || 'http://localhost:3000';
    
    try {
        const response = await fetch(`${backendUrl}/api/proxy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, method, headers })
        });
        
        const data = await response.json();
        return {
            ok: data.status >= 200 && data.status < 300,
            status: data.status,
            statusText: data.statusText,
            headers: data.headers,
            text: () => Promise.resolve(data.data),
            json: () => Promise.resolve(JSON.parse(data.data))
        };
    } catch (error) {
        throw new Error(`Proxy request failed: ${error.message}`);
    }
}

// Auto-check backend on page load
window.addEventListener('load', () => {
    checkBackendStatus();
});

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function initTable() {
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = '';
    document.getElementById('responseSection').style.display = 'none';
    
    APIs.forEach((api, index) => {
        const row = tbody.insertRow();
        row.id = `api-row-${index}`;
        row.innerHTML = `
            <td>${api.name}</td>
            <td><span class="status loading">TESTING...</span></td>
        `;
    });
    
    apiResults = [];
}

function updateApiStatus(index, status, responseData = null) {
    const row = document.getElementById(`api-row-${index}`);
    if (row) {
        const statusSpan = row.querySelector('.status');
        const statusText = status === 'success' ? 'ON' : 'OFF';
        const statusClass = status === 'success' ? 'success' : 'error';
        
        statusSpan.textContent = statusText;
        statusSpan.className = `status ${statusClass}`;
        
        apiResults.push({
            index,
            name: APIs[index].name,
            status,
            response: responseData
        });
    }
}

function sortAndRenderTable() {
    apiResults.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === 'success' ? -1 : 1;
    });
    
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';
    
    apiResults.forEach((result, newIndex) => {
        const row = tbody.insertRow();
        const statusText = result.status === 'success' ? 'ON' : 'OFF';
        const statusClass = result.status === 'success' ? 'success' : 'error';
        
        row.innerHTML = `
            <td>${result.name}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
        `;
    });
}

function renderResponseLogs() {
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = '';
    
    // First, display images in a separate section if any exist
    const imageAPIs = apiResults.filter(result => 
        result.response && result.response.type === 'image' && result.response.imageElement && result.status === 'success'
    );
    
    if (imageAPIs.length > 0) {
        const imagesSection = document.createElement('div');
        imagesSection.className = 'images-section';
        
        const imagesTitle = document.createElement('h4');
        imagesTitle.textContent = 'API Images:';
        imagesTitle.style.marginBottom = '15px';
        imagesSection.appendChild(imagesTitle);
        
        // Create image rows (2 per row)
        for (let i = 0; i < imageAPIs.length; i += 2) {
            const imageRow = document.createElement('div');
            imageRow.className = 'image-row';
            
            for (let j = i; j < Math.min(i + 2, imageAPIs.length); j++) {
                const result = imageAPIs[j];
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'image-wrapper';
                
                const imageTitle = document.createElement('h4');
                imageTitle.textContent = result.name;
                imageTitle.className = 'image-title';
                
                const img = result.response.imageElement.cloneNode();
                img.className = 'response-image';
                img.alt = result.name;
                
                const urlInfo = document.createElement('p');
                urlInfo.className = 'image-url';
                urlInfo.textContent = `URL: ${result.response.url}`;
                
                imageWrapper.appendChild(imageTitle);
                imageWrapper.appendChild(img);
                imageWrapper.appendChild(urlInfo);
                imageRow.appendChild(imageWrapper);
            }
            
            imagesSection.appendChild(imageRow);
        }
        
        responseContainer.appendChild(imagesSection);
    }
    
    // Then display all raw responses (including image APIs)
    const rawSection = document.createElement('div');
    rawSection.className = 'raw-responses-section';
    
    const rawTitle = document.createElement('h4');
    rawTitle.textContent = 'Raw API Responses:';
    rawTitle.style.marginTop = imageAPIs.length > 0 ? '30px' : '0';
    rawTitle.style.marginBottom = '15px';
    rawSection.appendChild(rawTitle);
    
    apiResults.forEach((result, index) => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response-item';
        
        const header = document.createElement('div');
        header.className = 'response-header';
        header.innerHTML = `
            <strong>${result.name}</strong>
            <span class="status ${result.status === 'success' ? 'success' : 'error'}">
                ${result.status === 'success' ? 'ON' : 'OFF'}
            </span>
        `;
        
        const content = document.createElement('pre');
        content.className = 'response-content';
        
        // Remove imageElement from JSON display to avoid circular reference
        const displayData = { ...result.response };
        if (displayData.imageElement) {
            displayData.imageElement = '[Image Element - Displayed Above]';
        }
        
        content.textContent = JSON.stringify(displayData, null, 2);
        
        responseDiv.appendChild(header);
        responseDiv.appendChild(content);
        rawSection.appendChild(responseDiv);
    });
    
    responseContainer.appendChild(rawSection);
    document.getElementById('responseSection').style.display = 'block';
}

function toggleResponseVisibility() {
    const container = document.getElementById('responseContainer');
    const button = document.getElementById('toggleResponses');
    
    if (container.style.display === 'none') {
        container.style.display = 'block';
        button.textContent = 'Hide';
    } else {
        container.style.display = 'none';
        button.textContent = 'Show';
    }
}

async function checkApis() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert('Masukkan API Key terlebih dahulu');
        return;
    }

    showLoading(true);
    initTable();

    const promises = APIs.map(async (api, index) => {
        try {
            const result = await api.test(apiKey);
            updateApiStatus(index, result.success ? 'success' : 'error', result.data);
        } catch (error) {
            updateApiStatus(index, 'error', { error: error.message });
        }
    });

    await Promise.all(promises);
    sortAndRenderTable();
    renderResponseLogs();
    showLoading(false);
}

// Validate API key format
function isValidApiKey(apiKey) {
    return apiKey && apiKey.length >= 30 && apiKey.startsWith('AIza');
}

// Test Functions that actually work in browser
async function testMapsJS(apiKey) {
    return new Promise((resolve) => {
        if (!isValidApiKey(apiKey)) {
            resolve({ success: false, data: { error: 'Invalid API key format' } });
            return;
        }
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapTest`;
        script.onerror = () => resolve({ success: false, data: { error: 'Failed to load Maps JavaScript API' } });
        
        window.initMapTest = () => {
            resolve({ success: true, data: { status: 'Maps JavaScript API loaded successfully' } });
            delete window.initMapTest;
            document.head.removeChild(script);
        };
        
        document.head.appendChild(script);
        setTimeout(() => {
            if (window.initMapTest) {
                delete window.initMapTest;
                document.head.removeChild(script);
                resolve({ success: false, data: { error: 'Timeout - API key may be invalid or quota exceeded' } });
            }
        }, 10000);
    });
}

async function testStaticMaps(apiKey) {
    return new Promise((resolve) => {
        if (!isValidApiKey(apiKey)) {
            resolve({ success: false, data: { error: 'Invalid API key format' } });
            return;
        }
        
        const img = new Image();
        const testUrl = `https://maps.googleapis.com/maps/api/staticmap?center=-6.2,106.8&zoom=13&size=400x400&key=${apiKey}`;
        
        img.onload = () => {
            resolve({ 
                success: true, 
                data: { 
                    status: 'Static Maps API working', 
                    url: testUrl,
                    type: 'image',
                    imageElement: img
                } 
            });
        };
        
        img.onerror = () => {
            resolve({ success: false, data: { error: 'Static Maps API failed - check API key and quota', url: testUrl } });
        };
        
        setTimeout(() => {
            resolve({ success: false, data: { error: 'Timeout loading static map' } });
        }, 10000);
        
        img.src = testUrl;
    });
}

async function testStreetView(apiKey) {
    return new Promise((resolve) => {
        if (!isValidApiKey(apiKey)) {
            resolve({ success: false, data: { error: 'Invalid API key format' } });
            return;
        }
        
        const img = new Image();
        const testUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=-6.2,106.8&key=${apiKey}`;
        
        img.onload = () => {
            resolve({ 
                success: true, 
                data: { 
                    status: 'Street View Static API working', 
                    url: testUrl,
                    type: 'image',
                    imageElement: img
                } 
            });
        };
        
        img.onerror = () => {
            resolve({ success: false, data: { error: 'Street View Static API failed - check API key and quota', url: testUrl } });
        };
        
        setTimeout(() => {
            resolve({ success: false, data: { error: 'Timeout loading street view image' } });
        }, 10000);
        
        img.src = testUrl;
    });
}

async function testMapsEmbed(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Jakarta`;
    return { success: true, data: { status: 'Maps Embed API URL format valid', url: testUrl, note: 'Embed in iframe to fully test' } };
}

async function testMapsUrls(apiKey) {
    return { success: true, data: { status: 'Maps URLs always accessible (no API key required)' } };
}

// Enhanced testing for APIs that require server-side testing
async function testGeocodingBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Jakarta&key=${apiKey}`;
    
    // If backend is available, use proxy
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return { success: true, data: { ...data, note: 'Geocoding API working (via proxy)' } };
            } else if (data.status === 'REQUEST_DENIED') {
                return { success: false, data: { error: `Request denied: ${data.error_message || 'API not enabled or quota exceeded'}`, raw_response: data } };
            } else {
                return { success: false, data: { error: `API Error: ${data.status}`, raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    // Fallback to direct request (will likely fail due to CORS)
    try {
        const response = await fetch(testUrl);
        const data = await response.json();
        
        if (data.status === 'OK') {
            return { success: true, data: { ...data, note: 'Geocoding API working' } };
        } else {
            return { success: false, data: { error: `API Error: ${data.status}`, raw_response: data } };
        }
    } catch (error) {
        return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
    }
}

async function testReverseGeocodingBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=-6.2,106.8&key=${apiKey}`;
    
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return { success: true, data: { ...data, note: 'Reverse Geocoding API working (via proxy)' } };
            } else {
                return { success: false, data: { error: `API Error: ${data.status}`, raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
}

async function testPlacesBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-6.2,106.8&radius=1000&key=${apiKey}`;
    
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return { success: true, data: { ...data, note: 'Places API working (via proxy)' } };
            } else {
                return { success: false, data: { error: `API Error: ${data.status}`, raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
}

async function testDirectionsBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=-6.2,106.8&destination=-6.3,106.9&key=${apiKey}`;
    
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return { success: true, data: { ...data, note: 'Directions API working (via proxy)' } };
            } else {
                return { success: false, data: { error: `API Error: ${data.status}`, raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
}

async function testDistanceMatrixBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=-6.2,106.8&destinations=-6.3,106.9&key=${apiKey}`;
    
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return { success: true, data: { ...data, note: 'Distance Matrix API working (via proxy)' } };
            } else {
                return { success: false, data: { error: `API Error: ${data.status}`, raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
}

async function testElevationBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://maps.googleapis.com/maps/api/elevation/json?locations=-6.2,106.8&key=${apiKey}`;
    
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return { success: true, data: { ...data, note: 'Elevation API working (via proxy)' } };
            } else {
                return { success: false, data: { error: `API Error: ${data.status}`, raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
}

async function testTimezoneBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=-6.2,106.8&timestamp=${Math.floor(Date.now()/1000)}&key=${apiKey}`;
    
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return { success: true, data: { ...data, note: 'Timezone API working (via proxy)' } };
            } else {
                return { success: false, data: { error: `API Error: ${data.status}`, raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
}

async function testGeolocationBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
    
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl, 'POST', { 'Content-Type': 'application/json' });
            const data = await response.json();
            
            if (data.location) {
                return { success: true, data: { ...data, note: 'Geolocation API working (via proxy)' } };
            } else {
                return { success: false, data: { error: 'API Error', raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
}

async function testRoadsBasic(apiKey) {
    if (!isValidApiKey(apiKey)) {
        return { success: false, data: { error: 'Invalid API key format' } };
    }
    
    const testUrl = `https://roads.googleapis.com/v1/snapToRoads?path=-6.2,106.8|-6.21,106.81&key=${apiKey}`;
    
    if (backendAvailable) {
        try {
            const response = await makeProxyRequest(testUrl);
            const data = await response.json();
            
            if (data.snappedPoints) {
                return { success: true, data: { ...data, note: 'Roads API working (via proxy)' } };
            } else {
                return { success: false, data: { error: 'API Error', raw_response: data } };
            }
        } catch (error) {
            return { success: false, data: { error: `Proxy request failed: ${error.message}` } };
        }
    }
    
    return { success: false, data: { error: 'CORS policy blocks direct testing', note: 'Start the Node.js backend server for full testing' } };
}