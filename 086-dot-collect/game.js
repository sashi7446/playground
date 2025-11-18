const GAME_ID = '086';
const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let score = 0;
let timeLeft = 30;
let timerInterval;
let spawnInterval;
let playerPos = { x: 185, y: 185 };
let dots = [];

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    playerPos = { x: 185, y: 185 };
    dots = [];
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    document.querySelectorAll('.dot').forEach(d => d.remove());

    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';

    spawnInterval = setInterval(spawnDot, 1000);
    timerInterval = setInterval(updateTimer, 1000);
    requestAnimationFrame(checkCollisions);
}

function spawnDot() {
    if (!gameActive) return;

    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.textContent = '⚫';
    dot.style.left = Math.random() * 370 + 'px';
    dot.style.top = Math.random() * 370 + 'px';
    gameArea.appendChild(dot);

    dots.push({
        element: dot,
        x: parseFloat(dot.style.left),
        y: parseFloat(dot.style.top)
    });
}

function movePlayer(dx, dy) {
    if (!gameActive) return;

    playerPos.x += dx * 10;
    playerPos.y += dy * 10;

    playerPos.x = Math.max(0, Math.min(370, playerPos.x));
    playerPos.y = Math.max(0, Math.min(370, playerPos.y));

    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
}

function checkCollisions() {
    if (!gameActive) return;

    dots.forEach((dot, index) => {
        const distance = Math.sqrt(
            Math.pow(playerPos.x - dot.x, 2) +
            Math.pow(playerPos.y - dot.y, 2)
        );

        if (distance < 30) {
            score += 10;
            scoreDisplay.textContent = score;
            dot.element.remove();
            dots.splice(index, 1);
        }
    });

    requestAnimationFrame(checkCollisions);
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
        dots.forEach(d => d.element.remove());
        dots = [];
    }, 100);
}

document.addEventListener('keydown', (e) => {
    if (!gameActive) return;

    switch(e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
    }
    e.preventDefault();
});

startBtn.onclick = startGame;
