const GAME_ID = '077';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let score = 0;
let timeLeft = 30;
let timerInterval;
let spawnInterval;

const balloons = ['🎈', '🎈', '🎈', '🎈', '🎈'];
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    spawnInterval = setInterval(spawnBalloon, 800);
    timerInterval = setInterval(updateTimer, 1000);
}

function spawnBalloon() {
    if (!gameActive) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = '🎈';
    balloon.style.left = Math.random() * 350 + 'px';
    balloon.style.top = Math.random() * 350 + 'px';
    balloon.style.filter = `hue-rotate(${Math.random() * 360}deg)`;

    balloon.onclick = () => popBalloon(balloon);
    gameArea.appendChild(balloon);

    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.remove();
        }
    }, 3000);
}

function popBalloon(balloon) {
    if (!gameActive) return;

    score += 10;
    scoreDisplay.textContent = score;
    balloon.textContent = '💥';
    balloon.style.transform = 'scale(1.5)';
    setTimeout(() => balloon.remove(), 200);
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
