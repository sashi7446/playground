const GAME_ID = '099';
const reactionBox = document.getElementById('reactionBox');
const startBtn = document.getElementById('startBtn');
const bestDisplay = document.getElementById('best');
const roundDisplay = document.getElementById('round');

let gameActive = false;
let round = 0;
let waiting = false;
let startTime = 0;
let best = null;
let times = [];

function startGame() {
    gameActive = true;
    round = 0;
    best = null;
    times = [];
    bestDisplay.textContent = '---';
    startBtn.style.display = 'none';

    reactionBox.onclick = handleClick;
    nextRound();
}

function nextRound() {
    if (round >= 5) {
        endGame();
        return;
    }

    round++;
    roundDisplay.textContent = round;
    waiting = true;

    reactionBox.classList.remove('ready');
    reactionBox.style.background = '#ff4444';
    reactionBox.textContent = 'Wait...';

    const delay = Math.random() * 3000 + 1000;

    setTimeout(() => {
        if (!gameActive) return;

        reactionBox.classList.add('ready');
        reactionBox.textContent = 'CLICK NOW!';
        waiting = false;
        startTime = Date.now();
    }, delay);
}

function handleClick() {
    if (!gameActive) return;

    if (waiting) {
        reactionBox.textContent = 'Too early!';
        reactionBox.style.background = '#ffa500';
        setTimeout(nextRound, 1000);
    } else {
        const reactionTime = Date.now() - startTime;
        times.push(reactionTime);

        if (best === null || reactionTime < best) {
            best = reactionTime;
            bestDisplay.textContent = best;
        }

        reactionBox.textContent = reactionTime + 'ms';
        reactionBox.style.background = '#667eea';

        setTimeout(nextRound, 1000);
    }
}

function endGame() {
    gameActive = false;

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const score = Math.max(0, 1000 - Math.floor(avg));

    GameStorage.recordPlay(GAME_ID, score, best < 300 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Complete!\nBest: ${best}ms\nAverage: ${avg.toFixed(0)}ms\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
