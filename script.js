const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output-canvas');
const canvasCtx = canvasElement.getContext('2d');

// UI View Document Selectors
const repCounter = document.getElementById('rep-count');
const angleDisplay = document.getElementById('joint-angle');
const angleLabel = document.getElementById('angle-label');
const feedbackText = document.getElementById('feedback-text');
const feedbackCard = document.getElementById('feedback-card');
const progressBar = document.getElementById('rep-progress-bar');

// Circular Telemetry Progress Gauge Setup
const radius = progressBar.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
progressBar.style.strokeDashoffset = circumference;

// Application Configuration and State Management Variables
let currentExercise = 'bicep_curl';
let count = 0;
let position = null;
let lastSpokenFeedback = "";
let totalCaloriesConsumed = 0;
let loggedFoods = [];

// Static Biometric Angle Metrics Parameters Matrix
const exerciseRules = {
    bicep_curl: { name: "ELBOW JOINTS", nodes: [11, 13, 15], extension: 160, flexion: 45 },
    squat: { name: "KNEE JOINTS", nodes: [23, 25, 27], extension: 160, flexion: 90 }
};

const routinePlans = {
    fat_loss: `
        <p><span class="badge-dot bg-green"></span> <strong>DAY 1:</strong> AI Squat Performance Engine (4 Sets x 20 Reps)</p>
        <p><span class="badge-dot bg-green"></span> <strong>DAY 2:</strong> High Velocity Bicep Curl Burn (4 Sets x 25 Reps)</p>
        <p><span class="badge-dot bg-green"></span> <strong>DAY 3:</strong> High-Burn Aerobic Acceleration Interval (30 Mins)</p>
        <p><strong>CORE GOAL:</strong> High repetition density to drive metabolic unit expenditure.</p>
    `,
    muscle_gain: `
        <p><span class="badge-dot bg-green"></span> <strong>DAY 1:</strong> High Mechanical Tension Squat Deck (4 Sets x 10 Hyper-Controlled Reps)</p>
        <p><span class="badge-dot bg-green"></span> <strong>DAY 2:</strong> Slow-Eccentric Isolate Bicep Curls (4 Sets x 12 Slow Reps)</p>
        <p><span class="badge-dot bg-green"></span> <strong>DAY 3:</strong> Upper-Body Hypertrophy Load Manifest (Chest Focus)</p>
        <p><strong>CORE GOAL:</strong> Maximized time under tension to optimize target strain vectors.</p>
    `
};

// Continuous Clock Tracking Loop
setInterval(() => {
    document.getElementById('system-time').textContent = new Date().toUTCString().replace("GMT", "UTC");
}, 1000);

// App Lifecycle Initializer Hook
window.onload = function() {
    loadPersonalizedPlan('fat_loss');
    initializeLocalStorageLogs();
    syncAnalyticsDashboard();
    loadProfileManifest();
};

/* --- 5-Page Navigation Switching Controller Engine --- */
function switchModule(moduleName) {
    const modules = ['vision', 'nutrition', 'routines', 'analytics', 'config'];
    modules.forEach(m => {
        const container = document.getElementById(`module-${m}-container`);
        const tabButton = document.getElementById(`tab-${m}`);
        if (m === moduleName) {
            container.classList.add('module-visible');
            container.classList.remove('module-hidden');
            tabButton.classList.add('active');
        } else {
            container.classList.remove('module-visible');
            container.classList.add('module-hidden');
            tabButton.classList.remove('active');
        }
    });
    syncAnalyticsDashboard();
    triggerAudioFeedback(`Accessing ${moduleName} workspace.`);
}

/* --- Calorie Log Storage and Data Ingestion Engines --- */
function initializeLocalStorageLogs() {
    const cachedLogs = localStorage.getItem('fitverse_food_registry');
    if (cachedLogs) {
        loggedFoods = JSON.parse(cachedLogs);
        rebuildFoodDOMList();
    }
}

function logFoodItem(event) {
    event.preventDefault();
    const nameInput = document.getElementById('food-name');
    const calInput = document.getElementById('food-calories');
    
    const entry = {
        id: Date.now(),
        name: nameInput.value.toUpperCase(),
        calories: parseInt(calInput.value)
    };
    
    loggedFoods.push(entry);
    localStorage.setItem('fitverse_food_registry', JSON.stringify(loggedFoods));
    
    nameInput.value = '';
    calInput.value = '';
    
    rebuildFoodDOMList();
    syncAnalyticsDashboard();
    triggerAudioFeedback(`Logged ${entry.calories} calories.`);
}

function rebuildFoodDOMList() {
    const targetList = document.getElementById('food-log-list');
    targetList.innerHTML = '';
    totalCaloriesConsumed = 0;
    
    loggedFoods.forEach(item => {
        totalCaloriesConsumed += item.calories;
        const li = document.createElement('li');
        li.className = 'hud-list-item';
        li.innerHTML = `<span>${item.name}</span> <span class="text-green">${item.calories} KCAL</span>`;
        targetList.appendChild(li);
    });
    
    document.getElementById('total-calories').textContent = totalCaloriesConsumed;
}

/* --- Routine Configuration Loader --- */
function loadPersonalizedPlan(type) {
    document.getElementById('routine-plan-content').innerHTML = routinePlans[type];
    document.getElementById('plan-fatloss').classList.toggle('active', type === 'fat_loss');
    document.getElementById('plan-muscle').classList.toggle('active', type === 'muscle_gain');
    triggerAudioFeedback(`Loading ${type.replace('_', ' ')} structural metrics.`);
}

/* --- Analytics Reporting Synchronization --- */
function syncAnalyticsDashboard() {
    document.getElementById('analytics-total-reps').textContent = count;
    document.getElementById('analytics-calories').textContent = `${totalCaloriesConsumed} kcal`;
}

/* --- User profile Configuration Manifest Engines --- */
function saveProfileConfig(event) {
    event.preventDefault();
    const nameVal = document.getElementById('user-name-input').value.toUpperCase();
    const weightVal = document.getElementById('user-weight-input').value;
    
    const userManifest = { name: nameVal, weight: weightVal };
    localStorage.setItem('fitverse_operator_manifest', JSON.stringify(userManifest));
    
    renderProfileDisplay(userManifest.name, userManifest.weight);
    triggerAudioFeedback(`Profile initialized for operator ${nameVal}.`);
}

function loadProfileManifest() {
    const profileData = localStorage.getItem('fitverse_operator_manifest');
    if (profileData) {
        const parsed = JSON.parse(profileData);
        document.getElementById('user-name-input').value = parsed.name;
        document.getElementById('user-weight-input').value = parsed.weight;
        renderProfileDisplay(parsed.name, parsed.weight);
    }
}

function renderProfileDisplay(name, weight) {
    document.getElementById('profile-display-data').innerHTML = `
        <p><strong>OPERATOR:</strong> <span class="text-magenta">${name}</span></p>
        <p><strong>MASS UNIT:</strong> ${weight} KG</p>
        <p><strong>AUDIO ENGINE:</strong> TEXT-TO-SPEECH ENABLED</p>
        <p><strong>VISION TRACKER:</strong> MEDIAPIPE MODEL V1</p>
    `;
}

/* --- Biometric Real-Time Vision Mesh Tracking Loop --- */
function setExercise(type) {
    currentExercise = type;
    count = 0;
    position = null;
    repCounter.textContent = count;
    updateProgressBar(0);
    angleLabel.textContent = exerciseRules[type].name;
    
    document.getElementById('btn-curl').classList.toggle('active', type === 'bicep_curl');
    document.getElementById('btn-squat').classList.toggle('active', type === 'squat');
    triggerAudioFeedback(`Switching analysis to ${type.replace('_', ' ')} constraints.`);
}

function updateProgressBar(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressBar.style.strokeDashoffset = offset;
}

function triggerAudioFeedback(text) {
    if (text === lastSpokenFeedback) return;
    lastSpokenFeedback = text;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
}

function playBeepSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    oscillator.stop(audioCtx.currentTime + 0.12);
}

function calculateAngle(p1, p2, p3) {
    let radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360.0 - angle;
    return Math.round(angle);
}

function onResults(results) {
    if (!document.getElementById('module-vision-container').classList.contains('module-visible')) return;

    if (!results.poseLandmarks) {
        feedbackText.textContent = "BIO-LINK DROP // TARGET UNRESOLVED";
        feedbackText.className = "status-warn";
        feedbackCard.className = "metric-card feedback-card status-warn-border";
        return;
    }

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // Render Skeletal Mesh Vectors with highly precise accent transparency
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: 'rgba(0, 242, 254, 0.35)', lineWidth: 2 });
    drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#ff5f6d', lineWidth: 1, radius: 2.5 });

    const rule = exerciseRules[currentExercise];
    const p1 = results.poseLandmarks[rule.nodes[0]];
    const p2 = results.poseLandmarks[rule.nodes[1]];
    const p3 = results.poseLandmarks[rule.nodes[2]];

    if (p1 && p2 && p3) {
        const angle = calculateAngle(p1, p2, p3);
        angleDisplay.textContent = `${angle}°`;

        let progressPercent = 0;
        if (position === "down") {
            const range = rule.extension - rule.flexion;
            const currentDelta = rule.extension - angle;
            progressPercent = Math.min(Math.max((currentDelta / range) * 100, 0), 100);
        }
        updateProgressBar(progressPercent);

        if (angle > rule.extension) {
            position = "down";
            feedbackText.textContent = "EXECUTE FLEXION RECOVERY MOVEMENT";
            feedbackText.className = "status-good";
            feedbackCard.className = "metric-card feedback-card status-good-border";
        }
        
        if (angle < rule.flexion && position === "down") {
            position = "up";
            count++;
            repCounter.textContent = count;
            playBeepSound();
            updateProgressBar(100);
            syncAnalyticsDashboard();
            feedbackText.textContent = `TARGET ACQUIRED // COUNT INCREASED: ${count}`;
            feedbackText.className = "status-good";
            feedbackCard.className = "metric-card feedback-card status-good-border";
            triggerAudioFeedback(`${count}`);
        }
        
        if (angle < rule.extension && angle > rule.flexion && position === null) {
            feedbackText.textContent = "INITIALIZE STATE VECTOR // EXTEND JOINT FULLY";
            feedbackText.className = "status-warn";
            feedbackCard.className = "metric-card feedback-card status-warn-border";
            triggerAudioFeedback("Extend body vectors fully to calibrate engine.");
        }
    }
}

const pose = new Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => { await pose.send({ image: videoElement }); },
    width: 640, height: 480
});
camera.start().then(() => {
    feedbackText.textContent = "CORE TRANSLATION INTERFACE ONLINE";
    triggerAudioFeedback("Fitverse Quantum operational.");
});
