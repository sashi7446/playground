const GAME_ID = '075';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let timeLeft = 30;
let timerInterval;
let playerPos = { x: 0, y: 0 };
let goalPos = { x: 6, y: 6 };

const maze = [
    [0,0,0,1,0,0,0],
    [1,1,0,1,0,1,0],
    [0,0,0,0,0,1,0],
    [0,1,1,1,0,1,0],
    [0,0,0,1,0,0,0],
    [1,1,0,0,0,1,1],
    [0,0,0,1,0,0,0]
];

function startGame() {
    gameActive = true;
    timeLeft = 30;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    playerPos = { x: 0, y: 0 };

    renderMaze();
    timerInterval = setInterval(updateTimer, 1000);
}

function renderMaze() {
    gameArea.innerHTML = '';

    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (maze[y][x] === 1) {
                cell.classList.add('wall');
            } else {
                cell.classList.add('path');
            }

            if (x === playerPos.x && y === playerPos.y) {
                cell.classList.add('player');
            }

            if (x === goalPos.x && y === goalPos.y) {
                cell.classList.add('goal');
            }

            gameArea.appendChild(cell);
        }
    }
}

function movePlayer(dx, dy) {
    if (!gameActive) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX < 0 || newX > 6 || newY < 0 || newY > 6) return;
    if (maze[newY][newX] === 1) return;

    playerPos.x = newX;
    playerPos.y = newY;

    renderMaze();

    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
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

    const score = won ? (timeLeft * 50) : 0;

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(won ? `You Win!\nTime Left: ${timeLeft}s\nScore: ${score}` : 'Time Up!');
        startBtn.style.display = 'block';
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
