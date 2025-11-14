const GAME_ID = '009-shogi';
const BOARD_SIZE = 9;

// Piece types
const EMPTY = 0;
const PAWN = 1, PROMOTED_PAWN = 11;
const LANCE = 2, PROMOTED_LANCE = 12;
const KNIGHT = 3, PROMOTED_KNIGHT = 13;
const SILVER = 4, PROMOTED_SILVER = 14;
const GOLD = 5;
const BISHOP = 6, PROMOTED_BISHOP = 16;
const ROOK = 7, PROMOTED_ROOK = 17;
const KING = 8;

const BLACK = 1;
const WHITE = -1;

const pieceChars = {
    [PAWN]: '歩', [PROMOTED_PAWN]: 'と',
    [LANCE]: '香', [PROMOTED_LANCE]: '成',
    [KNIGHT]: '桂', [PROMOTED_KNIGHT]: '圭',
    [SILVER]: '銀', [PROMOTED_SILVER]: '全',
    [GOLD]: '金',
    [BISHOP]: '角', [PROMOTED_BISHOP]: '馬',
    [ROOK]: '飛', [PROMOTED_ROOK]: '竜',
    [KING]: '玉'
};

class ShogiGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.statusDisplay = document.getElementById('status');
        this.currentTurnDisplay = document.getElementById('currentTurn');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.capturedBlackDisplay = document.getElementById('capturedBlack');
        this.capturedWhiteDisplay = document.getElementById('capturedWhite');

        this.board = [];
        this.currentPlayer = BLACK;
        this.gameRunning = false;
        this.playerColor = BLACK;
        this.difficulty = 'normal';
        this.selectedSquare = null;
        this.gameHistory = [];
        this.capturedPieces = { [BLACK]: [], [WHITE]: [] };

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
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));

        // Black pieces (top) - 先手（黒）
        this.board[0] = [-ROOK, -BISHOP, -SILVER, -GOLD, -KING, -GOLD, -SILVER, -BISHOP, -ROOK];
        this.board[1] = [EMPTY, -LANCE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, -LANCE, EMPTY];
        for (let i = 0; i < 9; i++) {
            this.board[2][i] = -PAWN;
        }

        // White pieces (bottom) - 後手（白）
        for (let i = 0; i < 9; i++) {
            this.board[6][i] = PAWN;
        }
        this.board[7] = [LANCE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, LANCE];
        this.board[8] = [ROOK, BISHOP, SILVER, GOLD, KING, GOLD, SILVER, BISHOP, ROOK];

        this.currentPlayer = BLACK;
        this.gameHistory = [];
        this.capturedPieces = { [BLACK]: [], [WHITE]: [] };
        this.selectedSquare = null;
    }

    startNewGame() {
        this.initializeBoard();
        this.gameRunning = true;
        this.playerColor = BLACK;
        this.updateStatus('Game started - Black to move');
        this.updateCurrentTurn();
        this.renderBoard();

        if (this.playerColor !== BLACK) {
            setTimeout(() => this.aiMove(), 800);
        }
    }

    getPieceChar(piece) {
        return pieceChars[Math.abs(piece)] || '';
    }

    getPieceName(piece) {
        const names = {
            [PAWN]: 'Pawn', [PROMOTED_PAWN]: 'Promoted Pawn',
            [LANCE]: 'Lance', [PROMOTED_LANCE]: 'Promoted Lance',
            [KNIGHT]: 'Knight', [PROMOTED_KNIGHT]: 'Promoted Knight',
            [SILVER]: 'Silver', [PROMOTED_SILVER]: 'Promoted Silver',
            [GOLD]: 'Gold',
            [BISHOP]: 'Bishop', [PROMOTED_BISHOP]: 'Horse',
            [ROOK]: 'Rook', [PROMOTED_ROOK]: 'Dragon',
            [KING]: 'King'
        };
        return names[Math.abs(piece)] || '';
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (piece === EMPTY) return [];

        const isBlack = piece > 0;
        const pieceName = Math.abs(piece);
        const moves = [];

        if (pieceName === PAWN) {
            const dir = isBlack ? 1 : -1;
            const newRow = row + dir;
            if (newRow >= 0 && newRow < BOARD_SIZE && this.board[newRow][col] === EMPTY) {
                moves.push({ row: newRow, col: col });
            }
        } else if (pieceName === LANCE) {
            const dir = isBlack ? 1 : -1;
            for (let i = row + dir; i >= 0 && i < BOARD_SIZE; i += dir) {
                if (this.board[i][col] === EMPTY) {
                    moves.push({ row: i, col: col });
                } else if ((this.board[i][col] > 0) !== isBlack) {
                    moves.push({ row: i, col: col });
                    break;
                } else break;
            }
        } else if (pieceName === KNIGHT) {
            const dir = isBlack ? 1 : -1;
            const deltas = [[-2, -1], [-2, 1], [2, -1], [2, 1]];
            for (let [dr, dc] of deltas) {
                const nr = row + dr * dir;
                const nc = col + dc;
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                    const target = this.board[nr][nc];
                    if (target === EMPTY || (target > 0) !== isBlack) {
                        moves.push({ row: nr, col: nc });
                    }
                }
            }
        } else if (pieceName === SILVER) {
            const dir = isBlack ? 1 : -1;
            const deltas = [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 1]];
            for (let [dr, dc] of deltas) {
                const nr = row + dr * dir;
                const nc = col + dc;
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                    const target = this.board[nr][nc];
                    if (target === EMPTY || (target > 0) !== isBlack) {
                        moves.push({ row: nr, col: nc });
                    }
                }
            }
        } else if (pieceName === GOLD || pieceName === PROMOTED_PAWN || pieceName === PROMOTED_LANCE ||
                   pieceName === PROMOTED_KNIGHT || pieceName === PROMOTED_SILVER) {
            const dir = isBlack ? 1 : -1;
            const deltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0]];
            for (let [dr, dc] of deltas) {
                const nr = row + dr * dir;
                const nc = col + dc;
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                    const target = this.board[nr][nc];
                    if (target === EMPTY || (target > 0) !== isBlack) {
                        moves.push({ row: nr, col: nc });
                    }
                }
            }
        } else if (pieceName === BISHOP || pieceName === PROMOTED_BISHOP) {
            const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            for (let [dr, dc] of dirs) {
                for (let i = 1; i < BOARD_SIZE; i++) {
                    const nr = row + dr * i;
                    const nc = col + dc * i;
                    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
                    const target = this.board[nr][nc];
                    if (target === EMPTY) {
                        moves.push({ row: nr, col: nc });
                    } else if ((target > 0) !== isBlack) {
                        moves.push({ row: nr, col: nc });
                        break;
                    } else break;
                }
            }
            if (pieceName === PROMOTED_BISHOP) {
                const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (let [dr, dc] of dirs) {
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                        const target = this.board[nr][nc];
                        if (target === EMPTY || (target > 0) !== isBlack) {
                            moves.push({ row: nr, col: nc });
                        }
                    }
                }
            }
        } else if (pieceName === ROOK || pieceName === PROMOTED_ROOK) {
            const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (let [dr, dc] of dirs) {
                for (let i = 1; i < BOARD_SIZE; i++) {
                    const nr = row + dr * i;
                    const nc = col + dc * i;
                    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
                    const target = this.board[nr][nc];
                    if (target === EMPTY) {
                        moves.push({ row: nr, col: nc });
                    } else if ((target > 0) !== isBlack) {
                        moves.push({ row: nr, col: nc });
                        break;
                    } else break;
                }
            }
            if (pieceName === PROMOTED_ROOK) {
                const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
                for (let [dr, dc] of dirs) {
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                        const target = this.board[nr][nc];
                        if (target === EMPTY || (target > 0) !== isBlack) {
                            moves.push({ row: nr, col: nc });
                        }
                    }
                }
            }
        } else if (pieceName === KING) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                        const target = this.board[nr][nc];
                        if (target === EMPTY || (target > 0) !== isBlack) {
                            moves.push({ row: nr, col: nc });
                        }
                    }
                }
            }
        }

        return moves;
    }

    makeMove(fromRow, fromCol, toRow, toCol, promote = false) {
        if (this.board[fromRow][fromCol] === EMPTY) return false;

        const piece = this.board[fromRow][fromCol];
        const validMoves = this.getValidMoves(fromRow, fromCol);
        if (!validMoves.some(m => m.row === toRow && m.col === toCol)) {
            return false;
        }

        this.gameHistory.push(JSON.parse(JSON.stringify(this.board)));

        // Capture
        if (this.board[toRow][toCol] !== EMPTY) {
            const captured = Math.abs(this.board[toRow][toCol]);
            this.capturedPieces[this.currentPlayer].push(captured);
        }

        // Make move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = EMPTY;

        // Auto-promote if needed
        const baseType = Math.abs(piece) % 10;
        const isBlack = piece > 0;
        const isInEnemyTerritory = (isBlack && toRow >= 6) || (!isBlack && toRow <= 2);
        const mustPromote = (baseType === PAWN || baseType === LANCE || baseType === KNIGHT);

        if (promote && isInEnemyTerritory && (baseType === PAWN || baseType === LANCE || baseType === KNIGHT ||
            baseType === SILVER || baseType === BISHOP || baseType === ROOK)) {
            this.board[toRow][toCol] = piece + 10 * (piece > 0 ? 1 : -1);
        } else if (mustPromote && isInEnemyTerritory) {
            this.board[toRow][toCol] = piece + 10 * (piece > 0 ? 1 : -1);
        }

        return true;
    }

    playerMove(fromRow, fromCol, toRow, toCol) {
        if (this.currentPlayer !== this.playerColor) return;

        if (this.makeMove(fromRow, fromCol, toRow, toCol)) {
            this.renderBoard();
            this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
            this.updateCurrentTurn();
            this.updateStatus(`${this.currentPlayer === BLACK ? 'Black' : 'White'} to move`);
            setTimeout(() => this.aiMove(), 800);
        }

        this.selectedSquare = null;
    }

    aiMove() {
        if (!this.gameRunning || this.currentPlayer === this.playerColor) return;

        const moves = this.getAllValidMoves(this.currentPlayer);
        if (moves.length === 0) {
            this.updateStatus('Checkmate! Game Over!');
            this.gameRunning = false;
            return;
        }

        const move = moves[Math.floor(Math.random() * moves.length)];
        this.makeMove(move.fromRow, move.fromCol, move.toRow, move.toCol);
        this.renderBoard();
        this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
        this.updateCurrentTurn();
        this.updateStatus(`${this.currentPlayer === BLACK ? 'Black' : 'White'} to move`);
    }

    getAllValidMoves(player) {
        const moves = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const piece = this.board[i][j];
                if (piece !== EMPTY && (piece > 0) === (player > 0)) {
                    const validMoves = this.getValidMoves(i, j);
                    for (let move of validMoves) {
                        moves.push({
                            fromRow: i,
                            fromCol: j,
                            toRow: move.row,
                            toCol: move.col
                        });
                    }
                }
            }
        }

        return moves;
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        this.updateCapturedDisplay();

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const square = document.createElement('div');
                square.className = `shogi-square ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;

                if (this.selectedSquare && this.selectedSquare.row === i && this.selectedSquare.col === j) {
                    square.classList.add('selected');
                }

                const piece = this.board[i][j];
                if (piece !== EMPTY) {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = `shogi-piece ${piece > 0 ? 'black' : 'white'}`;
                    pieceEl.textContent = this.getPieceChar(piece);
                    square.appendChild(pieceEl);
                }

                if (this.currentPlayer === this.playerColor) {
                    square.addEventListener('click', () => this.handleSquareClick(i, j));
                }

                const moves = this.selectedSquare && this.selectedSquare.row === i && this.selectedSquare.col === j
                    ? this.getValidMoves(i, j)
                    : [];

                for (let move of moves) {
                    if (move.row === i && move.col === j) {
                        square.classList.add('possible');
                    }
                }

                this.gameBoard.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        if (!this.gameRunning) return;

        if (this.selectedSquare) {
            if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
                this.selectedSquare = null;
            } else {
                this.playerMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
            }
        } else {
            const piece = this.board[row][col];
            if (piece !== EMPTY && (piece > 0) === (this.playerColor > 0) && this.currentPlayer === this.playerColor) {
                this.selectedSquare = { row, col };
            }
        }

        this.renderBoard();
    }

    updateCapturedDisplay() {
        this.capturedBlackDisplay.innerHTML = this.capturedPieces[BLACK]
            .map(piece => `<span class="captured-piece">${pieceChars[piece] || ''}</span>`)
            .join('');

        this.capturedWhiteDisplay.innerHTML = this.capturedPieces[WHITE]
            .map(piece => `<span class="captured-piece">${pieceChars[piece] || ''}</span>`)
            .join('');
    }

    updateCurrentTurn() {
        this.currentTurnDisplay.textContent = this.currentPlayer === BLACK ? 'Black(先手)' : 'White(後手)';
    }

    updateStatus(message) {
        this.statusDisplay.textContent = message;
    }

    undo() {
        if (this.gameHistory.length === 0) return;
        this.board = this.gameHistory.pop();
        this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
        this.selectedSquare = null;
        this.updateCurrentTurn();
        this.renderBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ShogiGame();
});
