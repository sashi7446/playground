const GAME_ID = '003-slide-puzzle';
const GRID_SIZE = 4;

class SlidePuzzleGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.movesDisplay = document.getElementById('moves');
        this.bestDisplay = document.getElementById('best');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.solveBtn = document.getElementById('solveBtn');

        // Game state
        this.tiles = [];
        this.moves = 0;
        this.best = GameStorage.getBestScore(GAME_ID);
        this.emptyPos = GRID_SIZE * GRID_SIZE - 1;

        this.init();
        this.setupEventListeners();
    }

    init() {
        // Initialize solved puzzle
        this.tiles = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

        // Shuffle
        this.shuffleWithSolvable();

        this.moves = 0;
        this.render();
        this.updateDisplay();
    }

    shuffleWithSolvable() {
        // Fisher-Yates shuffle with valid moves
        for (let i = 0; i < 100; i++) {
            const neighbors = this.getMovableIndices();
            const randomIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.swapTiles(this.emptyPos, randomIndex);
        }
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.solveBtn.addEventListener('click', () => this.showHint());
    }

    getMovableIndices() {
        const row = Math.floor(this.emptyPos / GRID_SIZE);
        const col = this.emptyPos % GRID_SIZE;
        const neighbors = [];

        if (row > 0) neighbors.push(this.emptyPos - GRID_SIZE);
        if (row < GRID_SIZE - 1) neighbors.push(this.emptyPos + GRID_SIZE);
        if (col > 0) neighbors.push(this.emptyPos - 1);
        if (col < GRID_SIZE - 1) neighbors.push(this.emptyPos + 1);

        return neighbors;
    }

    swapTiles(index1, index2) {
        [this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]];
        this.emptyPos = index1;
    }

    handleTileClick(index) {
        const neighbors = this.getMovableIndices();

        if (neighbors.includes(index)) {
            this.swapTiles(this.emptyPos, index);
            this.moves++;
            this.render();
            this.updateDisplay();

            if (this.isSolved()) {
                this.gameWon();
            }
        }
    }

    isSolved() {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i] !== i) {
                return false;
            }
        }
        return true;
    }

    render() {
        this.gameBoard.innerHTML = '';
        const neighbors = this.getMovableIndices();

        this.tiles.forEach((tile, index) => {
            const button = document.createElement('button');
            button.className = 'puzzle-piece';

            if (tile === GRID_SIZE * GRID_SIZE - 1) {
                button.classList.add('empty');
            } else {
                button.textContent = tile + 1;
                if (neighbors.includes(index)) {
                    button.classList.add('movable');
                }
                button.addEventListener('click', () => this.handleTileClick(index));
            }

            this.gameBoard.appendChild(button);
        });
    }

    updateDisplay() {
        this.movesDisplay.textContent = this.moves;
        this.bestDisplay.textContent = this.best;
    }

    showHint() {
        GameModal.show(
            'ヒント',
            '隣のピースをクリックして、数字を順番に並べてください。\n赤く光っているピースが動かせます！',
            () => {}
        );
    }

    gameWon() {
        if (this.moves < this.best || this.best === 0) {
            this.best = this.moves;
            GameStorage.setBestScore(GAME_ID, this.best);
        }

        GameStats.recordGame(GAME_ID, {
            moves: this.moves,
            result: 'won'
        });

        GameModal.show(
            'クリア！',
            `${this.moves} 手でクリア！\nベスト: ${this.best}`,
            () => {
                this.newGame();
            }
        );
    }

    newGame() {
        this.init();
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    new SlidePuzzleGame();
});
