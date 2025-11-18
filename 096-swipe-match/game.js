const GAME_ID = '096';
const target = document.getElementById('target');
const arrowBtns = document.querySelectorAll('.arrow-btn');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

const directions = {
    up: '⬆️',
    down: '⬇️',
    left: '⬅️',
    right: '➡️'
};

let gameActive = false;
let score = 0;
let timeLeft = 30;
let currentDir = '';
let timerInterval;

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';

    arrowBtns.forEach(btn => {
        btn.onclick = () => handleArrowClick(btn.dataset.dir);
    });

    nextDirection();
    timerInterval = setInterval(updateTimer, 1000);
}

function nextDirection() {
    if (!gameActive) return;

    const dirs = Object.keys(directions);
    currentDir = dirs[Math.floor(Math.random() * dirs.length)];
    target.textContent = directions[currentDir];
}

function handleArrowClick(dir) {
    if (!gameActive) return;

    if (dir === currentDir) {
        score += 10;
        scoreDisplay.textContent = score;
        target.style.transform = 'scale(1.2)';
        setTimeout(() => {
            target.style.transform = 'scale(1)';
            nextDirection();
        }, 100);
    } else {
        score = Math.max(0, score - 5);
        scoreDisplay.textContent = score;
        target.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            target.style.filter = 'hue-rotate(0deg)';
        }, 200);
    }
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

    GameStorage.recordPlay(GAME_ID, score, score >= 150 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
