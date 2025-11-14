const GAME_ID = '012-connect-four';
const COLS = 7;
const ROWS = 6;

const EMPTY = 0;
const RED = 1;
const YELLOW = 2;

class ConnectFourGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.statusDisplay = document.getElementById('status');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.undoBtn = document.getElementById('undoBtn');

        this.board = [];
        this.currentPlayer = RED;
        this.gameRunning = false;
        this.difficulty = 'normal';
        this.gameHistory = [];
        this.playerIsRed = true;

        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.undoBtn.addEventListener('click', () => this.undo());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.startNewGame();
        });
    }

    initializeBoard() {
        this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
        this.currentPlayer = RED;
        this.gameHistory = [];
    }

    startNewGame() {
        this.initializeBoard();
        this.gameRunning = true;
        this.playerIsRed = true;
        this.renderBoard();
        this.updateStatus('Red to play');

        if (this.currentPlayer !== RED) {
            setTimeout(() => this.aiMove(), 800);
        }
    }

    dropPiece(col) {
        if (!this.gameRunning || col < 0 || col >= COLS) return false;

        // Find the lowest empty row in this column
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.board[row][col] === EMPTY) {
                this.gameHistory.push(JSON.parse(JSON.stringify(this.board)));
                this.board[row][col] = this.currentPlayer;

                if (this.checkWin(row, col)) {
                    const winner = this.currentPlayer === RED ? 'Red' : 'Yellow';
                    this.updateStatus(`${winner} wins!`);
                    GameStorage.recordPlay(GAME_ID, 1, 'won', 0);
                    this.gameRunning = false;
                } else if (this.isBoardFull()) {
                    this.updateStatus('Draw!');
                    this.gameRunning = false;
                } else {
                    this.currentPlayer = this.currentPlayer === RED ? YELLOW : RED;
                    this.updateStatus(`${this.currentPlayer === RED ? 'Red' : 'Yellow'} to play`);
                }

                this.renderBoard();
                return true;
            }
        }

        return false;
    }

    checkWin(row, col) {
        const piece = this.board[row][col];
        const directions = [
            [0, 1],   // Horizontal
            [1, 0],   // Vertical
            [1, 1],   // Diagonal right
            [1, -1]   // Diagonal left
        ];

        for (let [dr, dc] of directions) {
            let count = 1;

            // Check positive direction
            for (let i = 1; i < 4; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && this.board[r][c] === piece) {
                    count++;
                } else break;
            }

            // Check negative direction
            for (let i = 1; i < 4; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && this.board[r][c] === piece) {
                    count++;
                } else break;
            }

            if (count >= 4) return true;
        }

        return false;
    }

    isBoardFull() {
        for (let col = 0; col < COLS; col++) {
            if (this.board[0][col] === EMPTY) return false;
        }
        return true;
    }

    evaluatePosition() {
        let score = 0;

        // Count potential winning positions
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.board[row][col] !== EMPTY) {
                    score += this.countConnections(row, col, YELLOW) * 10;
                    score -= this.countConnections(row, col, RED) * 10;
                }
            }
        }

        // Prefer center columns
        for (let row = 0; row < ROWS; row++) {
            if (this.board[row][3] === YELLOW) score += 3;
            if (this.board[row][2] === YELLOW) score += 2;
            if (this.board[row][4] === YELLOW) score += 2;
            if (this.board[row][1] === YELLOW) score += 1;
            if (this.board[row][5] === YELLOW) score += 1;

            if (this.board[row][3] === RED) score -= 3;
            if (this.board[row][2] === RED) score -= 2;
            if (this.board[row][4] === RED) score -= 2;
            if (this.board[row][1] === RED) score -= 1;
            if (this.board[row][5] === RED) score -= 1;
        }

        return score;
    }

    countConnections(row, col, player) {
        let count = 0;
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

        for (let [dr, dc] of directions) {
            let consecutive = 1;
            for (let i = 1; i < 4; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && this.board[r][c] === player) {
                    consecutive++;
                } else break;
            }
            count = Math.max(count, consecutive);
        }

        return count;
    }

    minimax(depth, isMaximizing) {
        // Check for wins
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                if (this.board[row][col] !== EMPTY) {
                    if (this.checkWin(row, col)) {
                        return { score: this.board[row][col] === YELLOW ? 1000 : -1000, col: null };
                    }
                }
            }
        }

        if (depth === 0 || this.isBoardFull()) {
            return { score: this.evaluatePosition(), col: null };
        }

        const validMoves = [];
        for (let col = 0; col < COLS; col++) {
            if (this.board[0][col] === EMPTY) {
                validMoves.push(col);
            }
        }

        let bestScore = isMaximizing ? -Infinity : Infinity;
        let bestCol = validMoves[0];

        for (let col of validMoves) {
            // Find row where piece would land
            let row = -1;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (this.board[r][col] === EMPTY) {
                    row = r;
                    break;
                }
            }

            if (row !== -1) {
                const piece = isMaximizing ? YELLOW : RED;
                this.board[row][col] = piece;

                const result = this.minimax(depth - 1, !isMaximizing);

                this.board[row][col] = EMPTY;

                if (isMaximizing) {
                    if (result.score > bestScore) {
                        bestScore = result.score;
                        bestCol = col;
                    }
                } else {
                    if (result.score < bestScore) {
                        bestScore = result.score;
                        bestCol = col;
                    }
                }
            }
        }

        return { score: bestScore, col: bestCol };
    }

    aiMove() {
        if (!this.gameRunning) return;

        let col;

        if (this.difficulty === 'easy') {
            // Random valid move
            const validMoves = [];
            for (let c = 0; c < COLS; c++) {
                if (this.board[0][c] === EMPTY) validMoves.push(c);
            }
            col = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
            const depth = this.difficulty === 'normal' ? 4 : 6;
            const result = this.minimax(depth, true);
            col = result.col;
        }

        this.dropPiece(col);

        if (this.gameRunning && this.currentPlayer === RED) {
            this.updateStatus('Red to play');
        }
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'c4-cell';

                const piece = this.board[row][col];
                if (piece !== EMPTY) {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = `c4-piece ${piece === RED ? 'red' : 'yellow'}`;
                    cell.appendChild(pieceEl);
                }

                if (row === 0) {
                    cell.classList.add('droppable');
                    cell.addEventListener('click', () => {
                        if (this.gameRunning && this.currentPlayer === RED) {
                            this.dropPiece(col);
                            setTimeout(() => {
                                if (this.gameRunning && this.currentPlayer === YELLOW) {
                                    this.aiMove();
                                }
                            }, 500);
                        }
                    });
                }

                this.gameBoard.appendChild(cell);
            }
        }

        this.currentPlayerDisplay.textContent = this.currentPlayer === RED ? 'Red' : 'Yellow';
    }

    updateStatus(message) {
        this.statusDisplay.textContent = message;
    }

    undo() {
        if (this.gameHistory.length === 0) return;
        this.board = this.gameHistory.pop();
        this.currentPlayer = this.currentPlayer === RED ? YELLOW : RED;
        this.gameRunning = true;
        this.updateStatus(`${this.currentPlayer === RED ? 'Red' : 'Yellow'} to play`);
        this.renderBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ConnectFourGame();
});
