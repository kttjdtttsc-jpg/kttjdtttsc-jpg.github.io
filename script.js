console.log('script loaded');

const scanBtn = document.getElementById('scan-btn');
const resultsSection = document.getElementById('results');
const dataContainer = document.getElementById('data-container');
const scoreContainer = document.getElementById('score-container');

const calculateScore = (data) => {
    let score = 0;
    let total = 0;
    console.log('cookies:', data[4].value);
    console.log('online:', data[5].value); 

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




scanBtn.addEventListener('click', () => {
   const footprint = [
    { label: 'User Agent', value: navigator.userAgent },
    { label: 'Platform', value: navigator.platform },
    { label: 'Language', value: navigator.language },
    { label: 'Color Depth', value: window.screen.colorDepth },
    { label: 'Cookies Enabled', value: navigator.cookieEnabled },
    { label: 'Online Status', value: navigator.onLine },
    { label: 'Screen Resolution', value: `${window.screen.width}x${window.screen.height}`},
    { label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone} 
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
