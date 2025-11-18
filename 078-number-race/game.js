const GAME_ID = '078';
const player = document.getElementById('player');
const startBtn = document.getElementById('startBtn');
const clickBtn = document.getElementById('clickBtn');
const positionDisplay = document.getElementById('position');

let gameActive = false;
let position = 0;
let startTime;

function startGame() {
    gameActive = true;
    position = 0;
    positionDisplay.textContent = position;
    startBtn.style.display = 'none';
    clickBtn.style.display = 'block';
    player.style.left = '0%';
    startTime = Date.now();
}

function moveForward() {
    if (!gameActive) return;

    position += Math.floor(Math.random() * 3) + 1;
    if (position > 100) position = 100;

    positionDisplay.textContent = position;
    player.style.left = position + '%';

    if (position >= 100) {
        endGame(true);
    }
}

function endGame(won) {
    gameActive = false;
    clickBtn.style.display = 'none';

    const timeElapsed = (Date.now() - startTime) / 1000;
    const score = won ? Math.max(0, 1000 - Math.floor(timeElapsed * 10)) : 0;

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Finish!\nTime: ${timeElapsed.toFixed(1)}s\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

clickBtn.onclick = moveForward;
startBtn.onclick = startGame;
