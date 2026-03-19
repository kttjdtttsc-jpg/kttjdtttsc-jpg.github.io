const scanBtn = document.getElementById('scan-btn');
const resultsSection = document.getElementById('results');
const dataContainer = document.getElementById('data-container');
const scoreContainer = document.getElementById('score-container');

const calculateScore = (data) => {
    let score = 0;
    let total = 0;
    

    // Check if cookies are enabled (more trackable)
    total++;
    if (data[4].value) {
        score++;
    }

    // Check if online status is true
    total++;
    if (data[5].value === true) {
        score++;
    }

    // Check if screen resolution is common (easier to blend in)
    total++;
    const commonWidths = [1920, 1440, 1536, 1366];
    if (!commonWidths.includes(screen.width)) {
        score++;
    }

    // Check color depth (uncommon depth = more unique)
    total++;
    if (screen.colorDepth !== 24) {
        score++;
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
        hash += str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
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
   ];

   // Clear any previous results
   dataContainer.innerHTML = '';
   scoreContainer.innerHTML = '';

   // Loop through the array and create eloements for each data point
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



   console.log(footprint);
});
