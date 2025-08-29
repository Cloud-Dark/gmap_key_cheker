const APIs = [
    { name: 'Maps JavaScript API', test: testMapsJS },
    { name: 'Geocoding API', test: testGeocoding },
    { name: 'Reverse Geocoding API', test: testReverseGeocoding },
    { name: 'Directions API', test: testDirections },
    { name: 'Distance Matrix API', test: testDistanceMatrix },
    { name: 'Places API (Nearby Search)', test: testPlacesNearby },
    { name: 'Places API (Text Search)', test: testPlacesText },
    { name: 'Places API (Details)', test: testPlacesDetails },
    { name: 'Places API (Photos)', test: testPlacesPhotos },
    { name: 'Places API (Autocomplete)', test: testPlacesAutocomplete },
    { name: 'Static Maps API', test: testStaticMaps },
    { name: 'Street View Static API', test: testStreetView },
    { name: 'Elevation API', test: testElevation },
    { name: 'Timezone API', test: testTimeZone },
    { name: 'Geolocation API', test: testGeolocation },
    { name: 'Roads API (Snap to Roads)', test: testRoadsSnap },
    { name: 'Roads API (Nearest Roads)', test: testRoadsNearest },
    { name: 'Roads API (Speed Limits)', test: testRoadsSpeed },
    { name: 'Maps Embed API', test: testMapsEmbed },
    { name: 'Maps URLs', test: testMapsUrls }
];

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

let apiResults = [];

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
        statusSpan.title = status === 'success' ? 'API is working' : 'API is not working or returned an error';
        
        apiResults.push({
            index,
            name: APIs[index].name,
            status,
            response: responseData
        });
        
        console.log(`API Status Update - ${APIs[index].name}: ${statusText}`, responseData);
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
        content.textContent = JSON.stringify(result.response, null, 2);
        
        responseDiv.appendChild(header);
        responseDiv.appendChild(content);
        responseContainer.appendChild(responseDiv);
    });
    
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

async function checkBackendStatus() {
    const backendUrl = document.getElementById('backendUrl').value;
    const backendStatusIndicator = document.getElementById('backendStatus');

    if (!backendUrl) {
        alert('Please enter a Backend URL.');
        backendStatusIndicator.style.backgroundColor = 'red';
        backendStatusIndicator.title = 'Backend URL is empty';
        return;
    }

    try {
        console.log('Checking backend status at:', `${backendUrl}/health`);
        const response = await fetch(`${backendUrl}/health`);
        console.log('Backend health check response:', response.status, response.statusText);
        if (response.ok) {
            backendStatusIndicator.style.backgroundColor = 'green';
            backendStatusIndicator.title = 'Backend is active';
            console.log('Backend is active.');
        } else {
            backendStatusIndicator.style.backgroundColor = 'red';
            backendStatusIndicator.title = `Backend returned error: ${response.status} ${response.statusText}`;
            console.error('Backend is not active or returned an error.');
        }
    } catch (error) {
        backendStatusIndicator.style.backgroundColor = 'red';
        backendStatusIndicator.title = `Failed to connect to backend: ${error.message}`;
        console.error('Failed to connect to backend:', error);
    }
}

// Toggle API Key Visibility
document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleButton = document.getElementById('toggleApiKeyVisibility');

    if (apiKeyInput && toggleButton) {
        toggleButton.addEventListener('click', () => {
            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                toggleButton.textContent = 'Hide';
            } else {
                apiKeyInput.type = 'password';
                toggleButton.textContent = 'Show';
            }
        });
    }
});

async function checkApis() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert('Masukkan API Key terlebih dahulu');
        return;
    }

    console.log('Starting API checks with key:', apiKey.substring(0, 5) + '...'); // Log part of the key for debugging (but not the full key)
    showLoading(true);
    initTable();

    const promises = APIs.map(async (api, index) => {
        try {
            console.log(`Testing API: ${api.name}`);
            const result = await api.test(apiKey);
            console.log(`API test result for ${api.name}:`, result);
            updateApiStatus(index, result.success ? 'success' : 'error', result.data);
        } catch (error) {
            console.error(`API test failed for ${api.name}:`, error);
            updateApiStatus(index, 'error', { error: error.message });
        }
    });

    await Promise.all(promises);
    sortAndRenderTable();
    renderResponseLogs();
    showLoading(false);
    console.log('All API checks completed.');
}

async function proxyRequest(url, method = 'GET', body = null) {
    const backendUrl = document.getElementById('backendUrl').value;
    if (!backendUrl) {
        throw new Error('Backend URL is not set. Please check backend status first.');
    }

    try {
        console.log(`Proxying request: ${method} ${url}`);
        const response = await fetch(`${backendUrl}/api/proxy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, method, body }),
        });
        
        console.log('Proxy response status:', response.status, response.statusText);
        const data = await response.json();
        console.log('Proxy response data:', data);
        
        if (response.ok && data.status && data.status >= 200 && data.status < 300) {
            return { success: true, data: data.data };
        } else {
            // Return full error information including raw response
            return { 
                success: false, 
                data: {
                    error: data.error || `HTTP ${data.status}: ${data.statusText || 'Unknown error'}`,
                    status_code: data.status,
                    status_text: data.statusText,
                    raw_response: data.data,
                    full_response: data
                }
            };
        }
    } catch (error) {
        console.error('Proxy request failed:', error);
        return { 
            success: false, 
            data: { 
                error: `Network/Proxy Error: ${error.message}`,
                error_type: 'network_error',
                original_error: error.toString()
            } 
        };
    }
}

async function testMapsJS(apiKey) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        script.onerror = () => resolve({ success: false, data: { error: 'Script loading failed' } });
        
        window.initMap = () => {
            resolve({ success: true, data: { status: 'Maps JS loaded successfully' } });
            delete window.initMap;
        };
        
        document.head.appendChild(script);
        setTimeout(() => resolve({ success: false, data: { error: 'Timeout after 5 seconds' } }), 5000);
    });
}

async function testGeocoding(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=Jakarta&key=${apiKey}`;
        console.log('Testing Geocoding API with URL:', url);
        const result = await proxyRequest(url);
        console.log('Geocoding API result:', result);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        console.error('Geocoding API test failed:', error);
        return { success: false, data: { error: error.message } };
    }
}

async function testReverseGeocoding(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=-6.2,106.8&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testPlacesNearby(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-6.2,106.8&radius=1500&type=restaurant&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testPlacesText(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testPlacesDetails(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testPlacesPhotos(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATplDJa7_dtLd6Aa7j3QsDPy_vJoHPqjNTM&key=${apiKey}`;
        const result = await proxyRequest(url, 'HEAD');
        return { success: result.success && result.data.status === 200, data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testPlacesAutocomplete(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Pizza&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testStaticMaps(apiKey) {
    try {
        // Static Maps API can be tested by checking if the URL is valid
        const testUrl = `https://maps.googleapis.com/maps/api/staticmap?center=-6.2,106.8&zoom=13&size=400x400&key=${apiKey}`;
        
        // Create an image element to test if the API key works
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ success: true, data: { status: 'Image loaded successfully', url: testUrl } });
            };
            img.onerror = () => {
                resolve({ success: false, data: { error: 'Failed to load image - API key may be invalid or quota exceeded' } });
            };
            
            // Set timeout
            setTimeout(() => {
                resolve({ success: false, data: { error: 'Timeout - image loading took too long' } });
            }, 10000);
            
            img.src = testUrl;
        });
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testGeolocation(apiKey) {
    try {
        const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
        const result = await proxyRequest(url, 'POST', {});
        return { success: result.success && !!result.data.location, data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testRoadsSnap(apiKey) {
    try {
        const url = `https://roads.googleapis.com/v1/snapToRoads?path=-6.2,106.8|-6.21,106.81&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && !!result.data.snappedPoints, data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testRoadsNearest(apiKey) {
    try {
        const url = `https://roads.googleapis.com/v1/nearestRoads?points=-6.2,106.8&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && !!result.data.snappedPoints, data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testRoadsSpeed(apiKey) {
    try {
        const url = `https://roads.googleapis.com/v1/speedLimits?path=-6.2,106.8&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && (!!result.data.speedLimits || !!result.data.snappedPoints), data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testMapsEmbed(apiKey) {
    try {
        const testUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Jakarta`;
        const response = await fetch(testUrl, { method: 'HEAD' });
        return { success: response.ok, data: { status: response.status, statusText: response.statusText } };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testMapsUrls(apiKey) {
    return { success: true, data: { status: 'Maps URLs always accessible' } };
}

async function testDirections(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=Jakarta&destination=Bandung&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testDistanceMatrix(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=Jakarta&destinations=Bandung&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testElevation(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=-6.2,106.8&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testTimeZone(apiKey) {
    try {
        const url = `https://maps.googleapis.com/maps/api/timezone/json?location=-6.2,106.8&timestamp=1331161200&key=${apiKey}`;
        const result = await proxyRequest(url);
        return { success: result.success && result.data.status === 'OK', data: result.data };
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}

async function testStreetView(apiKey) {
    try {
        // Street View Static API can be tested by checking if the image loads
        const testUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=-6.2,106.8&key=${apiKey}`;
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ success: true, data: { status: 'Street View image loaded successfully', url: testUrl } });
            };
            img.onerror = () => {
                resolve({ success: false, data: { error: 'Failed to load Street View image - API key may be invalid' } });
            };
            
            setTimeout(() => {
                resolve({ success: false, data: { error: 'Timeout - Street View image loading took too long' } });
            }, 10000);
            
            img.src = testUrl;
        });
    } catch (error) {
        return { success: false, data: { error: error.message } };
    }
}