const GAME_ID = '082';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const foundDisplay = document.getElementById('found');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let found = 0;
let timeLeft = 40;
let timerInterval;

function startGame() {
    gameActive = true;
    found = 0;
    timeLeft = 40;
    foundDisplay.textContent = found;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    // Create hidden stars
    for (let i = 0; i < 10; i++) {
        const object = document.createElement('div');
        object.className = 'object';
        object.textContent = '⭐';
        object.style.left = Math.random() * 350 + 'px';
        object.style.top = Math.random() * 350 + 'px';
        object.onclick = () => findObject(object);
        gameArea.appendChild(object);
    }

    timerInterval = setInterval(updateTimer, 1000);
}

function findObject(object) {
    if (!gameActive || object.classList.contains('found')) return;

    object.classList.add('found');
    found++;
    foundDisplay.textContent = found;

    if (found === 10) {
        endGame(true);
    }
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame(false);
    }
}

function endGame(won) {
    gameActive = false;
    clearInterval(timerInterval);

    const score = found * 100 + (won ? timeLeft * 10 : 0);

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`${won ? 'All Found!' : 'Time Up!'}\nFound: ${found}/10\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
