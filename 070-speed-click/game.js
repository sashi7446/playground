const GAME_ID = '070';
const clickZone = document.getElementById('clickZone');
const startBtn = document.getElementById('startBtn');
const clicksDisplay = document.getElementById('clicks');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let clicks = 0;
let timeLeft = 20;
let timerInterval;

function startGame() {
    gameActive = true;
    clicks = 0;
    timeLeft = 20;
    clicksDisplay.textContent = clicks;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';

    clickZone.onclick = handleClick;
    timerInterval = setInterval(updateTimer, 1000);
}

function handleClick() {
    if (!gameActive) return;

    clicks++;
    clicksDisplay.textContent = clicks;

    // Visual feedback
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff9a9e'];
    clickZone.style.background = colors[Math.floor(Math.random() * colors.length)];
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);

    const score = clicks * 10;
    const cps = (clicks / 20).toFixed(1);

    GameStorage.recordPlay(GAME_ID, score, clicks >= 50 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Time's Up!\nTotal Clicks: ${clicks}\nClicks/Second: ${cps}\nScore: ${score}`);
        startBtn.style.display = 'block';
        clickZone.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)';
    }, 100);
}

startBtn.onclick = startGame;
