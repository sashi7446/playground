const GAME_ID = '074';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let score = 0;
let timeLeft = 30;
let timerInterval;
let spawnInterval;

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    spawnInterval = setInterval(spawnTarget, 1000);
    timerInterval = setInterval(updateTimer, 1000);
    spawnTarget();
}

function spawnTarget() {
    if (!gameActive) return;

    const target = document.createElement('div');
    target.className = 'target';
    target.textContent = '🎯';
    target.style.left = Math.random() * 340 + 'px';
    target.style.top = Math.random() * 340 + 'px';

    target.onclick = () => hitTarget(target);
    gameArea.appendChild(target);

    setTimeout(() => {
        if (target.parentNode) {
            target.remove();
        }
    }, 2000);
}

function hitTarget(target) {
    if (!gameActive) return;

    score += 10;
    scoreDisplay.textContent = score;
    target.style.transform = 'scale(0)';
    setTimeout(() => target.remove(), 100);
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
