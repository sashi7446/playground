const GAME_ID = '017-tic-tac-toe';
const SIZE = 3;
const EMPTY = 0, X = 1, O = -1;

class TicTacToeGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.statusDisplay = document.getElementById('status');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.newGameBtn = document.getElementById('newGameBtn');

        this.board = [];
        this.currentPlayer = X;
        this.gameRunning = false;

        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
    }

    initializeBoard() {
        this.board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(EMPTY));
        this.currentPlayer = X;
    }

    startNewGame() {
        this.initializeBoard();
        this.gameRunning = true;
        this.renderBoard();
        this.updateStatus('X to play');
    }

    makeMove(row, col) {
        if (!this.gameRunning || this.board[row][col] !== EMPTY) return false;

        this.board[row][col] = this.currentPlayer;

        if (this.checkWin(this.currentPlayer)) {
            this.updateStatus(`${this.currentPlayer === X ? 'X' : 'O'} wins!`);
            GameStorage.recordPlay(GAME_ID, 1, 'won', 0);
            this.gameRunning = false;
        } else if (this.isBoardFull()) {
            this.updateStatus('Draw!');
            this.gameRunning = false;
        } else {
            this.currentPlayer = this.currentPlayer === X ? O : X;
            this.updateStatus(`${this.currentPlayer === X ? 'X' : 'O'} to play`);

            if (this.currentPlayer === O) {
                setTimeout(() => this.aiMove(), 600);
            }
        }

        this.renderBoard();
        return true;
    }

    checkWin(player) {
        // Check rows
        for (let i = 0; i < SIZE; i++) {
            if (this.board[i][0] === player && this.board[i][1] === player && this.board[i][2] === player) {
                return true;
            }
        }

        // Check columns
        for (let j = 0; j < SIZE; j++) {
            if (this.board[0][j] === player && this.board[1][j] === player && this.board[2][j] === player) {
                return true;
            }
        }

        // Check diagonals
        if (this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) {
            return true;
        }
        if (this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player) {
            return true;
        }

        return false;
    }

    isBoardFull() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (this.board[i][j] === EMPTY) return false;
            }
        }
        return true;
    }

    minimax(depth, isMaximizing) {
        if (this.checkWin(O)) return { score: 10 - depth, move: null };
        if (this.checkWin(X)) return { score: depth - 10, move: null };
        if (this.isBoardFull()) return { score: 0, move: null };

        let bestScore = isMaximizing ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (this.board[i][j] === EMPTY) {
                    this.board[i][j] = isMaximizing ? O : X;
                    const result = this.minimax(depth + 1, !isMaximizing);

                    if (isMaximizing) {
                        if (result.score > bestScore) {
                            bestScore = result.score;
                            bestMove = { row: i, col: j };
                        }
                    } else {
                        if (result.score < bestScore) {
                            bestScore = result.score;
                            bestMove = { row: i, col: j };
                        }
                    }

                    this.board[i][j] = EMPTY;
                }
            }
        }

        return { score: bestScore, move: bestMove };
    }

    aiMove() {
        const result = this.minimax(0, true);
        if (result.move) {
            this.makeMove(result.move.row, result.move.col);
        }
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';

        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'ttt-cell';

                const piece = this.board[i][j];
                if (piece !== EMPTY) {
                    const text = document.createElement('div');
                    text.className = `ttt-text ${piece === X ? 'x' : 'o'}`;
                    text.textContent = piece === X ? 'X' : 'O';
                    cell.appendChild(text);
                }

                if (piece === EMPTY && this.gameRunning && this.currentPlayer === X) {
                    cell.classList.add('playable');
                    cell.addEventListener('click', () => this.makeMove(i, j));
                }

                this.gameBoard.appendChild(cell);
            }
        }

        this.currentPlayerDisplay.textContent = this.currentPlayer === X ? 'X' : 'O';
    }

    updateStatus(message) {
        this.statusDisplay.textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToeGame();
});
