const GAME_ID = '064';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let score = 0;
let bricksLeft = 0;
let startTime;
let timerInterval;

function startGame() {
    gameActive = true;
    score = 0;
    bricksLeft = 50;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';
    startTime = Date.now();

    const colors = ['#30cfd0', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'];

    for (let i = 0; i < 50; i++) {
        const brick = document.createElement('div');
        brick.className = 'brick';
        brick.style.background = colors[Math.floor(i / 10)];
        brick.onclick = () => hitBrick(brick);
        gameArea.appendChild(brick);
    }

    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    timeDisplay.textContent = elapsed.toFixed(1);
}

function hitBrick(brick) {
    if (!gameActive || brick.classList.contains('hit')) return;

    brick.classList.add('hit');
    score += 10;
    bricksLeft--;
    scoreDisplay.textContent = score;

    setTimeout(() => brick.remove(), 300);

    if (bricksLeft === 0) {
        endGame(true);
    }
}

function endGame(won) {
    gameActive = false;
    clearInterval(timerInterval);
    const finalTime = parseFloat(timeDisplay.textContent);
    const finalScore = won ? score + Math.max(0, 500 - Math.floor(finalTime * 10)) : 0;

    GameStorage.recordPlay(GAME_ID, finalScore, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Complete!\nTime: ${finalTime}s\nScore: ${finalScore}`);
        startBtn.style.display = 'block';
    }, 500);
}

startBtn.onclick = startGame;
