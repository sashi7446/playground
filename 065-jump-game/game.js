const GAME_ID = '065';
const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let score = 0;
let isJumping = false;
let gameLoop;
let obstacles = [];

function startGame() {
    gameActive = true;
    score = 0;
    obstacles = [];
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';
    document.querySelectorAll('.obstacle').forEach(o => o.remove());

    gameLoop = setInterval(update, 50);
    setInterval(spawnObstacle, 2000);
}

function spawnObstacle() {
    if (!gameActive) return;

    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.right = '0px';
    gameArea.appendChild(obstacle);
    obstacles.push({ element: obstacle, x: 400 });
}

function update() {
    if (!gameActive) return;

    obstacles.forEach((obs, index) => {
        obs.x -= 5;
        obs.element.style.right = (400 - obs.x) + 'px';

        // Check collision
        if (obs.x < 90 && obs.x > 40 && !isJumping) {
            endGame(false);
        }

        // Score point
        if (obs.x === 40 && isJumping) {
            score += 10;
            scoreDisplay.textContent = score;
        }

        // Remove off-screen obstacles
        if (obs.x < -30) {
            obs.element.remove();
            obstacles.splice(index, 1);
            score += 5;
            scoreDisplay.textContent = score;
        }
    });
}

function jump() {
    if (!gameActive || isJumping) return;

    isJumping = true;
    player.classList.add('jumping');

    setTimeout(() => {
        player.classList.remove('jumping');
        isJumping = false;
    }, 500);
}

function endGame(won) {
    gameActive = false;
    clearInterval(gameLoop);

    GameStorage.recordPlay(GAME_ID, score, score >= 50 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}`);
        startBtn.style.display = 'block';
        obstacles.forEach(o => o.element.remove());
        obstacles = [];
    }, 100);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

gameArea.addEventListener('click', jump);

startBtn.onclick = startGame;
