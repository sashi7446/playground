const GAME_ID = '084';
const gameArea = document.getElementById('gameArea');
const catcher = document.getElementById('catcher');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let score = 0;
let timeLeft = 30;
let timerInterval;
let spawnInterval;
let stars = [];
let catcherX = 200;

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    stars = [];
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    document.querySelectorAll('.star').forEach(s => s.remove());

    spawnInterval = setInterval(spawnStar, 700);
    timerInterval = setInterval(updateTimer, 1000);
    requestAnimationFrame(updateStars);
}

function spawnStar() {
    if (!gameActive) return;

    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = '⭐';
    star.style.left = Math.random() * 370 + 'px';
    gameArea.appendChild(star);

    stars.push({ element: star, y: 0, x: parseFloat(star.style.left) });
}

function updateStars() {
    if (!gameActive) return;

    stars.forEach((star, index) => {
        star.y += 3;
        star.element.style.top = star.y + 'px';

        // Check collision
        if (star.y > 440 && star.y < 480) {
            if (Math.abs(star.x - catcherX) < 40) {
                score += 10;
                scoreDisplay.textContent = score;
                star.element.remove();
                stars.splice(index, 1);
            }
        }

        // Remove off-screen stars
        if (star.y > 500) {
            star.element.remove();
            stars.splice(index, 1);
        }
    });

    requestAnimationFrame(updateStars);
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
        stars.forEach(s => s.element.remove());
        stars = [];
    }, 100);
}

gameArea.addEventListener('mousemove', (e) => {
    if (!gameActive) return;
    const rect = gameArea.getBoundingClientRect();
    catcherX = e.clientX - rect.left;
    catcher.style.left = catcherX + 'px';
});

startBtn.onclick = startGame;
