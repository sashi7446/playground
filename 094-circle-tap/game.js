const GAME_ID = '094';
const circle = document.getElementById('circle');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const roundDisplay = document.getElementById('round');

let gameActive = false;
let score = 0;
let round = 0;
let growing = true;
let size = 50;
let animationFrame;

function startGame() {
    gameActive = true;
    score = 0;
    round = 0;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';

    nextRound();
}

function nextRound() {
    if (round >= 10) {
        endGame(true);
        return;
    }

    round++;
    roundDisplay.textContent = round;
    size = 50;
    growing = true;

    animate();
}

function animate() {
    if (!gameActive) return;

    if (growing) {
        size += 2;
        if (size >= 200) growing = false;
    } else {
        size -= 2;
        if (size <= 50) growing = true;
    }

    circle.style.width = size + 'px';
    circle.style.height = size + 'px';

    animationFrame = requestAnimationFrame(animate);
}

function tapCircle() {
    if (!gameActive) return;

    cancelAnimationFrame(animationFrame);

    // Ideal size is 150px
    const diff = Math.abs(150 - size);
    let points = 0;

    if (diff < 10) {
        points = 100;
        circle.style.background = '#4caf50';
    } else if (diff < 30) {
        points = 50;
        circle.style.background = '#ffa500';
    } else {
        points = 10;
        circle.style.background = '#ff4444';
    }

    score += points;
    scoreDisplay.textContent = score;

    setTimeout(() => {
        circle.style.background = '#ff9a9e';
        nextRound();
    }, 500);
}

function endGame(won) {
    gameActive = false;
    cancelAnimationFrame(animationFrame);

    GameStorage.recordPlay(GAME_ID, score, score >= 500 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Complete!\nFinal Score: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

circle.onclick = tapCircle;
startBtn.onclick = startGame;
