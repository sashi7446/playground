const GAME_ID = '088';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const movesDisplay = document.getElementById('moves');

let gameActive = false;
let moves = 0;
let boxPos = { x: 1, y: 1 };
let goalPos = { x: 5, y: 5 };

const grid = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,1,0,1],
    [1,0,1,0,0,0,1],
    [1,0,0,0,1,0,1],
    [1,1,0,1,0,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1]
];

function startGame() {
    gameActive = true;
    moves = 0;
    movesDisplay.textContent = moves;
    startBtn.style.display = 'none';
    boxPos = { x: 1, y: 1 };

    renderGrid();
}

function renderGrid() {
    gameArea.innerHTML = '';

    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (grid[y][x] === 1) {
                cell.classList.add('wall');
            }

            if (x === boxPos.x && y === boxPos.y) {
                cell.classList.add('box');
                cell.textContent = '📦';
            }

            if (x === goalPos.x && y === goalPos.y) {
                cell.classList.add('goal');
                cell.textContent = '🎯';
            }

            gameArea.appendChild(cell);
        }
    }
}

function moveBox(dx, dy) {
    if (!gameActive) return;

    const newX = boxPos.x + dx;
    const newY = boxPos.y + dy;

    if (newX < 0 || newX > 6 || newY < 0 || newY > 6) return;
    if (grid[newY][newX] === 1) return;

    boxPos.x = newX;
    boxPos.y = newY;
    moves++;
    movesDisplay.textContent = moves;

    renderGrid();

    if (boxPos.x === goalPos.x && boxPos.y === goalPos.y) {
        endGame(true);
    }
}

function endGame(won) {
    gameActive = false;
    const score = won ? Math.max(0, 500 - moves * 10) : 0;

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Success!\nMoves: ${moves}\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

document.addEventListener('keydown', (e) => {
    if (!gameActive) return;

    switch(e.key) {
        case 'ArrowUp': moveBox(0, -1); break;
        case 'ArrowDown': moveBox(0, 1); break;
        case 'ArrowLeft': moveBox(-1, 0); break;
        case 'ArrowRight': moveBox(1, 0); break;
    }
    e.preventDefault();
});

startBtn.onclick = startGame;
