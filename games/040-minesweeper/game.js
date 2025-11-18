const GAME_ID = '040';
const GRID_SIZE = 4;
const MINE_COUNT = 4;
const SAFE_CELLS = GRID_SIZE * GRID_SIZE - MINE_COUNT;

const grid = document.getElementById('grid');
const statusDisplay = document.getElementById('status');
const clearedDisplay = document.getElementById('cleared');
const resetBtn = document.getElementById('resetBtn');

let cells = [];
let mines = [];
let revealed = 0;
let flagged = 0;
let gameActive = true;

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isMine = false;
        this.revealed = false;
        this.flagged = false;
        this.element = null;
    }

    createElement() {
        const el = document.createElement('div');
        el.className = 'cell';
        el.addEventListener('click', () => this.reveal());
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.toggleFlag();
        });
        this.element = el;
        return el;
    }

    reveal() {
        if (!gameActive || this.revealed || this.flagged) return;

        this.revealed = true;
        revealed++;

        if (this.isMine) {
            this.element.classList.add('revealed', 'mine');
            this.element.textContent = '💣';
            endGame(false);
        } else {
            this.element.classList.add('revealed', 'safe');
            const nearbyMines = this.countNearbyMines();
            this.element.textContent = nearbyMines > 0 ? nearbyMines : '';
            clearedDisplay.textContent = revealed;

            if (revealed === SAFE_CELLS) {
                endGame(true);
            }
        }
    }

    toggleFlag() {
        if (!gameActive || this.revealed) return;

        this.flagged = !this.flagged;
        if (this.flagged) {
            this.element.classList.add('flagged');
            this.element.textContent = '🚩';
        } else {
            this.element.classList.remove('flagged');
            this.element.textContent = '';
        }
    }

    countNearbyMines() {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = this.x + dx;
                const ny = this.y + dy;
                if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                    if (cells[ny * GRID_SIZE + nx].isMine) count++;
                }
            }
        }
        return count;
    }
}

function initGame() {
    grid.innerHTML = '';
    cells = [];
    mines = [];
    revealed = 0;
    flagged = 0;
    gameActive = true;
    statusDisplay.textContent = '';
    clearedDisplay.textContent = '0';

    // Create cells
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = new Cell(x, y);
            cells.push(cell);
            grid.appendChild(cell.createElement());
        }
    }

    // Place mines randomly
    const mineIndices = new Set();
    while (mineIndices.size < MINE_COUNT) {
        mineIndices.add(Math.floor(Math.random() * cells.length));
    }

    mineIndices.forEach(idx => {
        cells[idx].isMine = true;
        mines.push(cells[idx]);
    });
}

function endGame(won) {
    gameActive = false;

    // Reveal all mines
    cells.forEach(cell => {
        if (cell.isMine && !cell.revealed) {
            cell.element.classList.add('revealed', 'mine');
            cell.element.textContent = '💣';
        }
    });

    if (won) {
        statusDisplay.textContent = '🎉 You Won!';
        GameStorage.recordPlay(GAME_ID, revealed, 'win', 1);
    } else {
        statusDisplay.textContent = '💥 Game Over!';
        GameStorage.recordPlay(GAME_ID, revealed, 'loss', 1);
    }
}

resetBtn.addEventListener('click', initGame);

initGame();
