const GAME_ID = '091';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let score = 0;
let timeLeft = 30;
let timerInterval;
let balls = [];

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    balls = [];
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        createBall();
    }

    timerInterval = setInterval(updateTimer, 1000);
    requestAnimationFrame(updateBalls);
}

function createBall() {
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.textContent = '⚽';
    ball.style.left = Math.random() * 360 + 'px';
    ball.style.top = Math.random() * 360 + 'px';
    gameArea.appendChild(ball);

    const ballData = {
        element: ball,
        x: parseFloat(ball.style.left),
        y: parseFloat(ball.style.top),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4
    };

    ball.onclick = () => clickBall(ballData);
    balls.push(ballData);
}

function updateBalls() {
    if (!gameActive) return;

    balls.forEach(ball => {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x <= 0 || ball.x >= 360) ball.vx *= -1;
        if (ball.y <= 0 || ball.y >= 360) ball.vy *= -1;

        ball.element.style.left = ball.x + 'px';
        ball.element.style.top = ball.y + 'px';
    });

    requestAnimationFrame(updateBalls);
}

function clickBall(ball) {
    if (!gameActive) return;

    score += 10;
    scoreDisplay.textContent = score;
    ball.element.style.transform = 'scale(0)';
    setTimeout(() => ball.element.remove(), 200);

    const index = balls.indexOf(ball);
    if (index > -1) balls.splice(index, 1);

    setTimeout(createBall, 500);
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

    GameStorage.recordPlay(GAME_ID, score, score >= 100 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}`);
        startBtn.style.display = 'block';
        gameArea.innerHTML = '';
        balls = [];
    }, 100);
}

startBtn.onclick = startGame;
