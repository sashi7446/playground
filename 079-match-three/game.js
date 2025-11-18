const GAME_ID = '079';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');

const colors = ['🔴', '🔵', '🟢', '🟡', '🟣'];
let gameActive = false;
let score = 0;
let moves = 20;
let grid = [];
let selected = null;

function startGame() {
    gameActive = true;
    score = 0;
    moves = 20;
    scoreDisplay.textContent = score;
    movesDisplay.textContent = moves;
    startBtn.style.display = 'none';
    grid = [];

    createGrid();
}

function createGrid() {
    gameArea.innerHTML = '';
    grid = [];

    for (let i = 0; i < 49; i++) {
        const gem = document.createElement('div');
        gem.className = 'gem';
        const color = colors[Math.floor(Math.random() * colors.length)];
        gem.textContent = color;
        gem.dataset.index = i;
        gem.dataset.color = color;
        gem.onclick = () => selectGem(i);
        gameArea.appendChild(gem);
        grid.push(gem);
    }
}

function selectGem(index) {
    if (!gameActive) return;

    const gem = grid[index];

    if (selected === null) {
        selected = index;
        gem.classList.add('selected');
    } else {
        grid[selected].classList.remove('selected');

        if (isAdjacent(selected, index)) {
            swapGems(selected, index);
            moves--;
            movesDisplay.textContent = moves;

            setTimeout(() => {
                checkMatches();
                if (moves <= 0) {
                    endGame();
                }
            }, 300);
        }

        selected = null;
    }
}

function isAdjacent(i1, i2) {
    const row1 = Math.floor(i1 / 7);
    const col1 = i1 % 7;
    const row2 = Math.floor(i2 / 7);
    const col2 = i2 % 7;

    return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
           (Math.abs(col1 - col2) === 1 && row1 === row2);
}

function swapGems(i1, i2) {
    const temp = grid[i1].dataset.color;
    grid[i1].dataset.color = grid[i2].dataset.color;
    grid[i1].textContent = grid[i2].dataset.color;
    grid[i2].dataset.color = temp;
    grid[i2].textContent = temp;
}

function checkMatches() {
    let matched = new Set();

    // Check rows
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 5; col++) {
            const i1 = row * 7 + col;
            const i2 = row * 7 + col + 1;
            const i3 = row * 7 + col + 2;

            if (grid[i1].dataset.color === grid[i2].dataset.color &&
                grid[i2].dataset.color === grid[i3].dataset.color) {
                matched.add(i1);
                matched.add(i2);
                matched.add(i3);
            }
        }
    }

    if (matched.size > 0) {
        score += matched.size * 10;
        scoreDisplay.textContent = score;

        matched.forEach(i => {
            grid[i].dataset.color = colors[Math.floor(Math.random() * colors.length)];
            grid[i].textContent = grid[i].dataset.color;
        });
    }
}

function endGame() {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, score, score >= 100 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
