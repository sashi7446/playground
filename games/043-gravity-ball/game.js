const GAME_ID = '043';
const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

const AREA_WIDTH = gameArea.offsetWidth;
const AREA_HEIGHT = gameArea.offsetHeight;
const PADDLE_WIDTH = 100;
const BALL_SIZE = 30;

let score = 0;
let lives = 3;
let paddleX = AREA_WIDTH / 2 - PADDLE_WIDTH / 2;
let ballX = AREA_WIDTH / 2 - BALL_SIZE / 2;
let ballY = 50;
let ballVx = 3;
let ballVy = 5;
let keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

const gameLoop = setInterval(() => {
    // Move paddle
    if (keys['arrowleft'] || keys['a']) {
        paddleX = Math.max(0, paddleX - 8);
    }
    if (keys['arrowright'] || keys['d']) {
        paddleX = Math.min(AREA_WIDTH - PADDLE_WIDTH, paddleX + 8);
    }

    paddle.style.left = paddleX + 'px';

    // Move ball
    ballX += ballVx;
    ballY += ballVy;

    // Bounce off walls
    if (ballX < 0 || ballX + BALL_SIZE > AREA_WIDTH) {
        ballVx *= -1;
    }

    if (ballY < 0) {
        ballVy *= -1;
    }

    // Check paddle collision
    if (ballY + BALL_SIZE > AREA_HEIGHT - 40 &&
        ballX + BALL_SIZE > paddleX &&
        ballX < paddleX + PADDLE_WIDTH) {
        ballVy *= -1;
        score++;
        scoreDisplay.textContent = score;
        GameStorage.recordPlay(GAME_ID, score, 'play', 1);
    }

    // Ball falls out
    if (ballY > AREA_HEIGHT) {
        lives--;
        livesDisplay.textContent = lives;

        if (lives <= 0) {
            clearInterval(gameLoop);
            ball.textContent = '✖';
            paddle.style.pointerEvents = 'none';
        } else {
            ballX = AREA_WIDTH / 2 - BALL_SIZE / 2;
            ballY = 50;
            ballVy = 5;
        }
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}, 30);
