const GAME_ID = '039';
const gameArea = document.getElementById('gameArea');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

const AREA_WIDTH = gameArea.offsetWidth;
const AREA_HEIGHT = gameArea.offsetHeight;
const BALL_SIZE = 40;

let score = 0;
let timeLeft = 30;
let gameActive = true;

let ballX = Math.random() * (AREA_WIDTH - BALL_SIZE);
let ballY = Math.random() * (AREA_HEIGHT - BALL_SIZE);
let ballVx = (Math.random() - 0.5) * 8;
let ballVy = (Math.random() - 0.5) * 8;

ball.addEventListener('click', hitBall);

function hitBall(e) {
    e.stopPropagation();
    if (!gameActive) return;

    score++;
    scoreDisplay.textContent = score;
    GameStorage.recordPlay(GAME_ID, score, 'play', 1);

    // Boost ball speed slightly
    ballVx *= 1.1;
    ballVy *= 1.1;
}

function updateBall() {
    ballX += ballVx;
    ballY += ballVy;

    // Bounce off walls
    if (ballX < 0 || ballX + BALL_SIZE > AREA_WIDTH) {
        ballVx *= -1;
        ballX = Math.max(0, Math.min(ballX, AREA_WIDTH - BALL_SIZE));
    }

    if (ballY < 0 || ballY + BALL_SIZE > AREA_HEIGHT) {
        ballVy *= -1;
        ballY = Math.max(0, Math.min(ballY, AREA_HEIGHT - BALL_SIZE));
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

const gameLoop = setInterval(() => {
    if (gameActive) {
        updateBall();
    }
}, 30);

const timer = setInterval(() => {
    if (gameActive) {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }
}, 1000);

function endGame() {
    gameActive = false;
    clearInterval(gameLoop);
    clearInterval(timer);
    ball.textContent = '🏁';
    ball.style.cursor = 'default';
}
