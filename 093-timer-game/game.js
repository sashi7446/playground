const GAME_ID = '093';
const timerDisplay = document.getElementById('timer');
const stopBtn = document.getElementById('stopBtn');
const startBtn = document.getElementById('startBtn');
const bestDisplay = document.getElementById('best');
const attemptsDisplay = document.getElementById('attempts');

let gameActive = false;
let startTime;
let timerInterval;
let attempts = 0;
let bestDiff = null;
let results = [];

function startGame() {
    gameActive = true;
    attempts = 0;
    bestDiff = null;
    results = [];
    attemptsDisplay.textContent = attempts;
    bestDisplay.textContent = '--';
    startBtn.style.display = 'none';

    nextAttempt();
}

function nextAttempt() {
    if (attempts >= 5) {
        endGame();
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;
    timerDisplay.textContent = '0.00';
    stopBtn.style.display = 'block';

    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 10);
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    timerDisplay.textContent = elapsed.toFixed(2);
}

function stopTimer() {
    if (!gameActive) return;

    clearInterval(timerInterval);
    const elapsed = parseFloat(timerDisplay.textContent);
    const diff = Math.abs(5.0 - elapsed);

    results.push(diff);

    if (bestDiff === null || diff < bestDiff) {
        bestDiff = diff;
        bestDisplay.textContent = diff.toFixed(3);
    }

    stopBtn.style.display = 'none';

    if (diff < 0.1) {
        timerDisplay.style.color = '#4caf50';
    } else if (diff < 0.5) {
        timerDisplay.style.color = '#ffa500';
    } else {
        timerDisplay.style.color = '#ff4444';
    }

    setTimeout(() => {
        timerDisplay.style.color = '#a8edea';
        nextAttempt();
    }, 1500);
}

function endGame() {
    gameActive = false;

    const avgDiff = results.reduce((a, b) => a + b, 0) / results.length;
    const score = Math.max(0, 1000 - Math.floor(avgDiff * 1000));

    GameStorage.recordPlay(GAME_ID, score, bestDiff < 0.2 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Complete!\nBest: ${bestDiff.toFixed(3)}s\nAverage: ${avgDiff.toFixed(3)}s\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

stopBtn.onclick = stopTimer;
startBtn.onclick = startGame;
