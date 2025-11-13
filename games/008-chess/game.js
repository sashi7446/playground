const GAME_ID = '008-chess';
const BOARD_SIZE = 8;

// Piece types
const EMPTY = 0;
const PAWN = 1;
const KNIGHT = 2;
const BISHOP = 3;
const ROOK = 4;
const QUEEN = 5;
const KING = 6;

const WHITE = 1;
const BLACK = -1;

class ChessGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.statusDisplay = document.getElementById('status');
        this.difficultySelect = document.getElementById('difficulty');
        this.playerColorDisplay = document.getElementById('playerColor');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.capturedWhiteDisplay = document.getElementById('capturedWhite');
        this.capturedBlackDisplay = document.getElementById('capturedBlack');

        this.board = [];
        this.currentPlayer = WHITE;
        this.gameRunning = false;
        this.playerColor = WHITE;
        this.difficulty = 'normal';
        this.selectedSquare = null;
        this.gameHistory = [];
        this.capturedPieces = { white: [], black: [] };

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
        // 8x8 empty board
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));

        // Black pieces (top)
        this.board[0] = [-ROOK, -KNIGHT, -BISHOP, -QUEEN, -KING, -BISHOP, -KNIGHT, -ROOK];
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = -PAWN;
        }

        // White pieces (bottom)
        for (let i = 0; i < 8; i++) {
            this.board[6][i] = PAWN;
        }
        this.board[7] = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];

        this.currentPlayer = WHITE;
        this.gameHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.selectedSquare = null;
    }

    startNewGame() {
        this.initializeBoard();
        this.gameRunning = true;
        this.playerColor = WHITE;
        this.playerColorDisplay.textContent = 'White';
        this.updateStatus('White to move');
        this.renderBoard();

        if (this.playerColor !== WHITE) {
            setTimeout(() => this.aiMove(), 800);
        }
    }

    getPieceChar(piece) {
        const chars = {
            [PAWN]: '♟',
            [KNIGHT]: '♞',
            [BISHOP]: '♝',
            [ROOK]: '♜',
            [QUEEN]: '♛',
            [KING]: '♚'
        };
        return chars[Math.abs(piece)] || '';
    }

    getPieceName(piece) {
        const names = {
            [PAWN]: 'Pawn',
            [KNIGHT]: 'Knight',
            [BISHOP]: 'Bishop',
            [ROOK]: 'Rook',
            [QUEEN]: 'Queen',
            [KING]: 'King'
        };
        return names[Math.abs(piece)] || '';
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (piece === EMPTY || (piece > 0 && this.currentPlayer === BLACK) || (piece < 0 && this.currentPlayer === WHITE)) {
            return [];
        }

        const moves = [];
        const type = Math.abs(piece);

        if (type === PAWN) {
            this.getPawnMoves(row, col, piece, moves);
        } else if (type === KNIGHT) {
            this.getKnightMoves(row, col, piece, moves);
        } else if (type === BISHOP) {
            this.getBishopMoves(row, col, piece, moves);
        } else if (type === ROOK) {
            this.getRookMoves(row, col, piece, moves);
        } else if (type === QUEEN) {
            this.getQueenMoves(row, col, piece, moves);
        } else if (type === KING) {
            this.getKingMoves(row, col, piece, moves);
        }

        // Filter out moves that leave king in check
        return moves.filter(move => !this.wouldLeaveKingInCheck(row, col, move.row, move.col));
    }

    getPawnMoves(row, col, piece, moves) {
        const direction = piece > 0 ? -1 : 1;
        const startRow = piece > 0 ? 6 : 1;

        // Forward one square
        const newRow = row + direction;
        if (newRow >= 0 && newRow < BOARD_SIZE && this.board[newRow][col] === EMPTY) {
            moves.push({ row: newRow, col: col });

            // Forward two squares from starting position
            if (row === startRow && this.board[row + 2 * direction][col] === EMPTY) {
                moves.push({ row: row + 2 * direction, col: col });
            }
        }

        // Capture diagonally
        for (let dc of [-1, 1]) {
            const newCol = col + dc;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                const target = this.board[newRow][newCol];
                if (target !== EMPTY && (target > 0) !== (piece > 0)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
    }

    getKnightMoves(row, col, piece, moves) {
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (let [dr, dc] of knightMoves) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                const target = this.board[newRow][newCol];
                if (target === EMPTY || (target > 0) !== (piece > 0)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
    }

    getBishopMoves(row, col, piece, moves) {
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        this.getSlidingMoves(row, col, piece, moves, directions);
    }

    getRookMoves(row, col, piece, moves) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        this.getSlidingMoves(row, col, piece, moves, directions);
    }

    getQueenMoves(row, col, piece, moves) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        this.getSlidingMoves(row, col, piece, moves, directions);
    }

    getSlidingMoves(row, col, piece, moves, directions) {
        for (let [dr, dc] of directions) {
            let newRow = row + dr;
            let newCol = col + dc;

            while (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                const target = this.board[newRow][newCol];
                if (target === EMPTY) {
                    moves.push({ row: newRow, col: newCol });
                } else if ((target > 0) !== (piece > 0)) {
                    moves.push({ row: newRow, col: newCol });
                    break;
                } else {
                    break;
                }

                newRow += dr;
                newCol += dc;
            }
        }
    }

    getKingMoves(row, col, piece, moves) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;

                const newRow = row + dr;
                const newCol = col + dc;

                if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                    const target = this.board[newRow][newCol];
                    if (target === EMPTY || (target > 0) !== (piece > 0)) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        }
    }

    wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol) {
        // Simulate move
        const oldBoard = JSON.parse(JSON.stringify(this.board));
        const capturedPiece = this.board[toRow][toCol];

        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = EMPTY;

        // Find king position
        let kingRow = -1, kingCol = -1;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const piece = this.board[i][j];
                if (Math.abs(piece) === KING && (piece > 0) === (this.currentPlayer > 0)) {
                    kingRow = i;
                    kingCol = j;
                }
            }
        }

        // Check if king is in check
        const inCheck = this.isSquareUnderAttack(kingRow, kingCol, this.currentPlayer);

        // Restore board
        this.board = oldBoard;

        return inCheck;
    }

    isSquareUnderAttack(row, col, byPlayer) {
        const opponent = byPlayer === WHITE ? BLACK : WHITE;

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const piece = this.board[i][j];
                if (piece === EMPTY || (piece > 0) !== (opponent > 0)) continue;

                const moves = [];
                const type = Math.abs(piece);

                if (type === PAWN) {
                    this.getPawnAttacks(i, j, piece, moves);
                } else if (type === KNIGHT) {
                    this.getKnightMoves(i, j, piece, moves);
                } else if (type === BISHOP) {
                    this.getBishopMoves(i, j, piece, moves);
                } else if (type === ROOK) {
                    this.getRookMoves(i, j, piece, moves);
                } else if (type === QUEEN) {
                    this.getQueenMoves(i, j, piece, moves);
                } else if (type === KING) {
                    this.getKingMoves(i, j, piece, moves);
                }

                if (moves.some(m => m.row === row && m.col === col)) {
                    return true;
                }
            }
        }

        return false;
    }

    getPawnAttacks(row, col, piece, moves) {
        const direction = piece > 0 ? -1 : 1;
        const newRow = row + direction;

        for (let dc of [-1, 1]) {
            const newCol = col + dc;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }

    isInCheckmate(player) {
        // Check if any piece has valid moves
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const piece = this.board[i][j];
                if (piece !== EMPTY && (piece > 0) === (player > 0)) {
                    if (this.getValidMoves(i, j).length > 0) {
                        return false;
                    }
                }
            }
        }

        return this.isSquareUnderAttack(this.findKing(player)[0], this.findKing(player)[1], -player);
    }

    findKing(player) {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (Math.abs(this.board[i][j]) === KING && (this.board[i][j] > 0) === (player > 0)) {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        if (this.board[fromRow][fromCol] === EMPTY) return false;

        const validMoves = this.getValidMoves(fromRow, fromCol);
        if (!validMoves.some(m => m.row === toRow && m.col === toCol)) {
            return false;
        }

        // Save history
        this.gameHistory.push(JSON.parse(JSON.stringify(this.board)));

        // Handle capture
        if (this.board[toRow][toCol] !== EMPTY) {
            const captured = this.board[toRow][toCol];
            if (this.currentPlayer === WHITE) {
                this.capturedPieces.white.push(Math.abs(captured));
            } else {
                this.capturedPieces.black.push(Math.abs(captured));
            }
        }

        // Make move
        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = EMPTY;

        // Pawn promotion
        if (Math.abs(this.board[toRow][toCol]) === PAWN) {
            if ((this.currentPlayer === WHITE && toRow === 0) || (this.currentPlayer === BLACK && toRow === 7)) {
                this.board[toRow][toCol] = this.currentPlayer * QUEEN; // Promote to Queen
            }
        }

        return true;
    }

    playerMove(fromRow, fromCol, toRow, toCol) {
        if (this.currentPlayer !== this.playerColor) return;

        if (this.makeMove(fromRow, fromCol, toRow, toCol)) {
            this.renderBoard();
            this.currentPlayer = this.currentPlayer === WHITE ? BLACK : WHITE;

            if (this.isInCheckmate(this.currentPlayer)) {
                const winner = this.currentPlayer === WHITE ? 'Black' : 'White';
                this.updateStatus(`Checkmate! ${winner} wins!`);
                GameStorage.recordPlay(GAME_ID, 1, 'won', 0);
                this.gameRunning = false;
            } else {
                this.updateStatus(`${this.currentPlayer === WHITE ? 'White' : 'Black'} to move`);
                setTimeout(() => this.aiMove(), 800);
            }
        }

        this.selectedSquare = null;
    }

    aiMove() {
        if (!this.gameRunning || this.currentPlayer === this.playerColor) return;

        const depth = this.difficulty === 'easy' ? 2 : this.difficulty === 'normal' ? 3 : 4;
        const result = this.minimax(depth, true, this.currentPlayer);

        if (!result.move) {
            this.updateStatus('No valid moves - Game Over');
            this.gameRunning = false;
            return;
        }

        const { fromRow, fromCol, toRow, toCol } = result.move;
        this.makeMove(fromRow, fromCol, toRow, toCol);
        this.renderBoard();
        this.currentPlayer = this.currentPlayer === WHITE ? BLACK : WHITE;

        if (this.isInCheckmate(this.currentPlayer)) {
            const winner = this.currentPlayer === WHITE ? 'Black' : 'White';
            this.updateStatus(`Checkmate! ${winner} wins!`);
            this.gameRunning = false;
        } else {
            this.updateStatus(`${this.currentPlayer === WHITE ? 'White' : 'Black'} to move`);
        }
    }

    minimax(depth, isMaximizing, player, alpha = -Infinity, beta = Infinity) {
        if (depth === 0) {
            return { score: this.evaluatePosition(player), move: null };
        }

        const moves = this.getAllValidMoves(player);

        if (moves.length === 0) {
            if (this.isInCheckmate(player)) {
                return { score: isMaximizing ? -10000 : 10000, move: null };
            }
            return { score: 0, move: null };
        }

        let bestMove = null;
        let bestScore = isMaximizing ? -Infinity : Infinity;

        for (let move of moves) {
            const oldBoard = JSON.parse(JSON.stringify(this.board));

            this.board[move.toRow][move.toCol] = this.board[move.fromRow][move.fromCol];
            this.board[move.fromRow][move.fromCol] = EMPTY;

            const result = this.minimax(depth - 1, !isMaximizing, isMaximizing ? -player : player, alpha, beta);

            this.board = oldBoard;

            if (isMaximizing) {
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                alpha = Math.max(alpha, bestScore);
            } else {
                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                beta = Math.min(beta, bestScore);
            }

            if (beta <= alpha) break;
        }

        return { score: bestScore, move: bestMove };
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

    evaluatePosition(player) {
        let score = 0;

        // Material value
        const pieceValues = {
            [PAWN]: 1,
            [KNIGHT]: 3,
            [BISHOP]: 3,
            [ROOK]: 5,
            [QUEEN]: 9,
            [KING]: 0
        };

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const piece = this.board[i][j];
                if (piece === EMPTY) continue;

                const value = pieceValues[Math.abs(piece)];
                const isPlayer = (piece > 0) === (player > 0);

                score += isPlayer ? value : -value;

                // Position bonus (simpler version)
                if (Math.abs(piece) === PAWN) {
                    const rank = piece > 0 ? 6 - i : i - 1;
                    score += isPlayer ? rank * 0.1 : -rank * 0.1;
                }
            }
        }

        return score;
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        this.updateCapturedDisplay();

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const square = document.createElement('div');
                square.className = `chess-square ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;

                if (this.selectedSquare && this.selectedSquare.row === i && this.selectedSquare.col === j) {
                    square.classList.add('selected');
                }

                const piece = this.board[i][j];
                if (piece !== EMPTY) {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = `chess-piece ${piece > 0 ? 'white' : 'black'}`;
                    pieceEl.textContent = this.getPieceChar(piece);
                    square.appendChild(pieceEl);
                }

                const moves = this.selectedSquare && this.selectedSquare.row === i && this.selectedSquare.col === j
                    ? this.getValidMoves(i, j)
                    : [];

                if (this.currentPlayer === this.playerColor) {
                    square.addEventListener('click', () => this.handleSquareClick(i, j));
                }

                // Show valid moves
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
        this.capturedWhiteDisplay.innerHTML = this.capturedPieces.white
            .map(piece => `<span class="captured-piece">${this.getPieceChar(-piece)}</span>`)
            .join('');

        this.capturedBlackDisplay.innerHTML = this.capturedPieces.black
            .map(piece => `<span class="captured-piece">${this.getPieceChar(piece)}</span>`)
            .join('');
    }

    updateStatus(message) {
        this.statusDisplay.textContent = message;
    }

    undo() {
        if (this.gameHistory.length === 0) return;
        this.board = this.gameHistory.pop();
        this.currentPlayer = this.currentPlayer === WHITE ? BLACK : WHITE;
        this.selectedSquare = null;
        this.renderBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});
