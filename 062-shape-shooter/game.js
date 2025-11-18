const GAME_ID = '062';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let score = 0;
let timeLeft = 30;
let spawnInterval;
let timerInterval;

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    spawnInterval = setInterval(spawnShape, 800);
    timerInterval = setInterval(updateTimer, 1000);
}

function spawnShape() {
    if (!gameActive) return;

    const shapes = ['circle', 'square', 'triangle'];
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];

    const shape = document.createElement('div');
    shape.className = `shape ${shapeType}`;
    shape.style.left = Math.random() * 350 + 'px';
    shape.style.top = Math.random() * 350 + 'px';

    shape.onclick = () => shootShape(shape);
    gameArea.appendChild(shape);

    setTimeout(() => {
        if (shape.parentNode) {
            shape.remove();
        }
    }, 2000);
}

function shootShape(shape) {
    if (!gameActive) return;
    score += 10;
    scoreDisplay.textContent = score;
    shape.style.transform = 'scale(0)';
    setTimeout(() => shape.remove(), 100);
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
    clearInterval(spawnInterval);
    clearInterval(timerInterval);

    GameStorage.recordPlay(GAME_ID, score, score >= 100 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}`);
        startBtn.style.display = 'block';
        gameArea.innerHTML = '';
    }, 100);
}

startBtn.onclick = startGame;
