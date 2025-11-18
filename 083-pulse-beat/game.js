const GAME_ID = '083';
const pulse = document.getElementById('pulse');
const clickZone = document.getElementById('clickZone');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');

let gameActive = false;
let score = 0;
let streak = 0;
let beats = 0;
let beatInterval;
let lastBeatTime = 0;

function startGame() {
    gameActive = true;
    score = 0;
    streak = 0;
    beats = 0;
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    startBtn.style.display = 'none';

    clickZone.onclick = handleClick;

    beatInterval = setInterval(() => {
        lastBeatTime = Date.now();
        beats++;

        if (beats >= 30) {
            endGame();
        }
    }, 1000);
}

function handleClick() {
    if (!gameActive) return;

    const timeSinceBeat = Date.now() - lastBeatTime;
    const isOnBeat = timeSinceBeat < 300; // 300ms window

    if (isOnBeat) {
        score += 10 + streak;
        streak++;
        clickZone.style.background = '#4caf50';
    } else {
        streak = 0;
        clickZone.style.background = '#ff4444';
    }

    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;

    setTimeout(() => {
        clickZone.style.background = '#30cfd0';
    }, 200);
}

function endGame() {
    gameActive = false;
    clearInterval(beatInterval);

    GameStorage.recordPlay(GAME_ID, score, score >= 200 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}\nBest Streak: ${streak}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
