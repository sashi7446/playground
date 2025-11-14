const GAME_ID = '004-sudoku';
const BOARD_SIZE = 9;
const BOX_SIZE = 3;

class SudokuGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.statusDisplay = document.getElementById('status');
        this.timerDisplay = document.getElementById('timer');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.hintBtn = document.getElementById('hintBtn');

        this.board = [];
        this.solution = [];
        this.originalBoard = [];
        this.selectedCell = null;
        this.gameRunning = false;
        this.difficulty = 'normal';
        this.startTime = 0;
        this.timerInterval = null;

        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.clearBtn.addEventListener('click', () => this.clearBoard());
        this.hintBtn.addEventListener('click', () => this.giveHint());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.startNewGame();
        });

        document.addEventListener('keydown', (e) => {
            if (this.selectedCell && this.gameRunning) {
                if (e.key >= '1' && e.key <= '9') {
                    this.setNumber(this.selectedCell.row, this.selectedCell.col, parseInt(e.key));
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    this.setNumber(this.selectedCell.row, this.selectedCell.col, 0);
                }
            }
        });
    }

    startNewGame() {
        this.generatePuzzle();
        this.gameRunning = true;
        this.selectedCell = null;
        this.startTime = Date.now();
        this.renderBoard();
        this.updateStatus('Solve the puzzle!');

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    generatePuzzle() {
        // Generate complete solution
        this.solution = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
        this.fillBoard(this.solution);

        // Copy for the puzzle
        this.board = this.solution.map(row => [...row]);
        this.originalBoard = this.solution.map(row => [...row]);

        // Remove numbers based on difficulty
        const cellsToRemove = this.difficulty === 'easy' ? 30 : this.difficulty === 'normal' ? 40 : 50;
        let removed = 0;

        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * BOARD_SIZE);
            const col = Math.floor(Math.random() * BOARD_SIZE);

            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                removed++;
            }
        }

        this.originalBoard = this.board.map(row => [...row]);
    }

    fillBoard(board, row = 0, col = 0) {
        if (row === BOARD_SIZE) return true;

        const nextRow = col === BOARD_SIZE - 1 ? row + 1 : row;
        const nextCol = col === BOARD_SIZE - 1 ? 0 : col + 1;

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

        for (let num of numbers) {
            if (this.isValidPlace(board, row, col, num)) {
                board[row][col] = num;
                if (this.fillBoard(board, nextRow, nextCol)) return true;
                board[row][col] = 0;
            }
        }

        return false;
    }

    isValidPlace(board, row, col, num) {
        // Check row
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (board[row][i] === num) return false;
        }

        // Check column
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (board[i][col] === num) return false;
        }

        // Check box
        const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
        const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
        for (let i = boxRow; i < boxRow + BOX_SIZE; i++) {
            for (let j = boxCol; j < boxCol + BOX_SIZE; j++) {
                if (board[i][j] === num) return false;
            }
        }

        return true;
    }

    setNumber(row, col, num) {
        if (this.originalBoard[row][col] !== 0) return; // Can't change original numbers

        this.board[row][col] = num;
        this.renderBoard();

        if (this.isSolved()) {
            this.endGame();
        }
    }

    isSolved() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.board[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    giveHint() {
        if (!this.gameRunning) return;

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.board[i][j] === 0 && this.originalBoard[i][j] === 0) {
                    this.board[i][j] = this.solution[i][j];
                    this.renderBoard();
                    return;
                }
            }
        }
    }

    clearBoard() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.originalBoard[i][j] === 0) {
                    this.board[i][j] = 0;
                }
            }
        }
        this.renderBoard();
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';

                // Add border classes
                if (j % BOX_SIZE === BOX_SIZE - 1 && j !== BOARD_SIZE - 1) {
                    cell.classList.add('right-border');
                }
                if (i % BOX_SIZE === BOX_SIZE - 1 && i !== BOARD_SIZE - 1) {
                    cell.classList.add('bottom-border');
                }

                // Highlight selected cell
                if (this.selectedCell && this.selectedCell.row === i && this.selectedCell.col === j) {
                    cell.classList.add('selected');
                }

                // Highlight same number
                if (this.board[i][j] !== 0 && this.selectedCell &&
                    this.board[this.selectedCell.row][this.selectedCell.col] === this.board[i][j]) {
                    cell.classList.add('highlight');
                }

                // Highlight same row/column/box as selected
                if (this.selectedCell) {
                    if (i === this.selectedCell.row || j === this.selectedCell.col ||
                        (Math.floor(i / BOX_SIZE) === Math.floor(this.selectedCell.row / BOX_SIZE) &&
                         Math.floor(j / BOX_SIZE) === Math.floor(this.selectedCell.col / BOX_SIZE))) {
                        cell.classList.add('related');
                    }
                }

                // Display number
                if (this.board[i][j] !== 0) {
                    const numEl = document.createElement('div');
                    numEl.className = this.originalBoard[i][j] !== 0 ? 'number original' : 'number user';
                    numEl.textContent = this.board[i][j];
                    cell.appendChild(numEl);
                }

                cell.addEventListener('click', () => this.selectCell(i, j));
                this.gameBoard.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        if (this.originalBoard[row][col] === 0) {
            this.selectedCell = { row, col };
            this.renderBoard();
        }
    }

    updateTimer() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.timerDisplay.textContent =
            String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    endGame() {
        this.gameRunning = false;
        if (this.timerInterval) clearInterval(this.timerInterval);

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.updateStatus('Congratulations! Puzzle Solved!');
        GameStorage.recordPlay(GAME_ID, elapsed, 'completed', elapsed);
    }

    updateStatus(message) {
        this.statusDisplay.textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
