const scanBtn = document.getElementById('scan-btn');
const resultsSection = document.getElementById('results');
const dataContainer = document.getElementById('data-container');
const scoreContainer = document.getElementById('score-container');

const calculateScore = (data) => {
    let score = 0;
    let total = 0;
    const fallbacks = ['Not set', 'Not available', 'Unknown', 'WebGL not supported', 'WebGL debug info not supported'];
   
    
    // Check each data point for exposure 
    for (let i = 0; i < data.length; i++) {
        total++;
        const val = data[i].value;

        // If the value exists and doesn't match the fall backs, it's exposed 
        if (val && !fallbacks.includes(val)) {
            score++;
        }
    }
   
    // Calculate percentage
    const percentage = Math.floor((score / total) * 100);
    return percentage;
};

const getCanvasFingerprint = () => {
    // Create a canvas element (not added to the page)
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;

    // Get the drawing content
    const ctx = canvas.getContext('2d');

    // Draw text with specific styling
    ctx.textBaseline = 'top';
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Fingerprint test 123', 2, 2);

    // Draw a colored shape
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(100, 10, 80, 30);

    // Extract the canvas data as a string
    const dataUrl = canvas.toDataURL();

    return dataUrl;
};

const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
};

const getWebGLInfo = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        return 'WebGL not supported';
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
        return 'WebGL debug info not supported';
    }

    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
};


scanBtn.addEventListener('click', () => {
   const footprint = [
    { label: 'User Agent', value: navigator.userAgent },
    { label: 'Platform', value: navigator.platform },
    { label: 'Language', value: navigator.language },
    { label: 'Color Depth', value: window.screen.colorDepth },
    { label: 'Cookies Enabled', value: navigator.cookieEnabled },
    { label: 'Online Status', value: navigator.onLine },
    { label: 'Screen Resolution', value: `${window.screen.width}x${window.screen.height}`},
    { label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone},
    { label: 'Canvas Fingerprint', value: simpleHash(getCanvasFingerprint()) },
    { label: 'WebGL Info', value: getWebGLInfo() },
    { label: 'Do Not Track', value: navigator.doNotTrack || 'Not set'},
    { label: 'Hardware Concurrency', value: navigator.hardwareConcurrency || 'Unknown'},
    { label: 'Device Memory', value: navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'Not available'  },
   ];

   // Clear any previous results
   dataContainer.innerHTML = '';
   scoreContainer.innerHTML = '';

   // Loop through the array and create elements for each data point
   for (let i = 0; i < footprint.length; i++) {
    const card = document.createElement('div');
    card.classList.add('data-card');

    const labelE1 = document.createElement('h3');
    labelE1.textContent = footprint[i].label;

    const valueE1 = document.createElement('p');
    valueE1.textContent = footprint[i].value;

    card.appendChild(labelE1);
    card.appendChild(valueE1);
    dataContainer.appendChild(card);
   }

   // Calculate and display privacy score
   const score = calculateScore(footprint);

   let riskLevel = '';
   if (score < 25) {
    riskLevel = 'Low';
   } else if (score < 50) {
    riskLevel = 'Moderate';
   } else if (score < 75) {
    riskLevel = 'High';
   } else {
    riskLevel = 'Extreme';
   }
   
   scoreContainer.innerHTML = '';
   const scoreCard = document.createElement('div');
   scoreCard.classList.add('score-card');
   scoreCard.innerHTML = `
    <h3>Privacy Risk Score</h3>
    <p class="score-number">${score}</p>
    <p class="risk-level">Risk Level:${riskLevel}</p>
   `;
   scoreContainer.appendChild(scoreCard);

   // Reveal the results section
   resultsSection.classList.remove('hidden');

});
