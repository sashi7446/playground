const GAME_ID = '010-othello';
const BOARD_SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

class OthelloGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.blackScoreDisplay = document.getElementById('blackScore');
        this.whiteScoreDisplay = document.getElementById('whiteScore');
        this.statusDisplay = document.getElementById('status');
        this.difficultySelect = document.getElementById('difficulty');
        this.playerColorSelect = document.getElementById('playerColor');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.winsDisplay = document.getElementById('wins');
        this.lossesDisplay = document.getElementById('losses');

        // Game state
        this.board = [];
        this.currentPlayer = BLACK;
        this.gameRunning = false;
        this.playerColor = BLACK;
        this.difficulty = 'normal';
        this.gameHistory = [];
        this.wins = GameStorage.getScore(GAME_ID);
        this.losses = GameStorage.getBestScore(GAME_ID);

        this.setupEventListeners();
        this.updateStatsDisplay();
        this.startNewGame();
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.undoBtn.addEventListener('click', () => this.undo());
        this.difficultySelect.addEventListener('change', () => {
            this.difficulty = this.difficultySelect.value;
            this.startNewGame();
        });
        this.playerColorSelect.addEventListener('change', () => {
            this.playerColor = this.playerColorSelect.value === 'black' ? BLACK : WHITE;
            this.startNewGame();
        });
    }

    initializeBoard() {
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));

        // Initial positions
        this.board[3][3] = WHITE;
        this.board[3][4] = BLACK;
        this.board[4][3] = BLACK;
        this.board[4][4] = WHITE;

        this.currentPlayer = BLACK;
        this.gameHistory = [];
    }

    startNewGame() {
        this.initializeBoard();
        this.gameRunning = true;
        this.undoBtn.disabled = true;
        this.renderBoard();
        this.updateScore();

        if (this.playerColor === WHITE) {
            setTimeout(() => this.aiMove(), 500);
        } else {
            this.updateStatus('黒（あなた）のターンです');
        }
    }

    getValidMoves(player) {
        const moves = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.board[i][j] !== EMPTY) continue;

                if (this.canPlaceStone(i, j, player)) {
                    moves.push({ row: i, col: j });
                }
            }
        }

        return moves;
    }

    canPlaceStone(row, col, player) {
        const opponent = player === BLACK ? WHITE : BLACK;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (let [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            let found = false;

            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                if (this.board[r][c] === EMPTY) break;
                if (this.board[r][c] === opponent) {
                    found = true;
                } else if (found) {
                    return true;
                } else {
                    break;
                }

                r += dr;
                c += dc;
            }
        }

        return false;
    }

    placeStone(row, col, player) {
        if (this.board[row][col] !== EMPTY) return false;

        this.gameHistory.push(JSON.parse(JSON.stringify(this.board)));

        this.board[row][col] = player;
        this.flipStones(row, col, player);

        return true;
    }

    flipStones(row, col, player) {
        const opponent = player === BLACK ? WHITE : BLACK;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (let [dr, dc] of directions) {
            const toFlip = [];
            let r = row + dr;
            let c = col + dc;
            let found = false;

            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                if (this.board[r][c] === EMPTY) break;
                if (this.board[r][c] === opponent) {
                    toFlip.push([r, c]);
                    found = true;
                } else if (found) {
                    for (let [fr, fc] of toFlip) {
                        this.board[fr][fc] = player;
                    }
                    break;
                } else {
                    break;
                }

                r += dr;
                c += dc;
            }
        }
    }

    calculateScore() {
        let black = 0, white = 0;

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (this.board[i][j] === BLACK) black++;
                else if (this.board[i][j] === WHITE) white++;
            }
        }

        return { black, white };
    }

    evaluatePosition(player) {
        const opponent = player === BLACK ? WHITE : BLACK;

        // 石の数
        const score = this.calculateScore();
        const stoneCount = player === BLACK ? score.black - score.white : score.white - score.black;

        // コーナーの価値（非常に重要）
        let cornerBonus = 0;
        const corners = [[0, 0], [0, 7], [7, 0], [7, 7]];
        for (let [r, c] of corners) {
            if (this.board[r][c] === player) cornerBonus += 25;
            else if (this.board[r][c] === opponent) cornerBonus -= 25;
        }

        // エッジの価値
        let edgeBonus = 0;
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (this.board[0][i] === player) edgeBonus += 5;
            else if (this.board[0][i] === opponent) edgeBonus -= 5;
            if (this.board[7][i] === player) edgeBonus += 5;
            else if (this.board[7][i] === opponent) edgeBonus -= 5;
            if (this.board[i][0] === player) edgeBonus += 5;
            else if (this.board[i][0] === opponent) edgeBonus -= 5;
            if (this.board[i][7] === player) edgeBonus += 5;
            else if (this.board[i][7] === opponent) edgeBonus -= 5;
        }

        // モビリティ（打てる手の多さ）
        const playerMoves = this.getValidMoves(player).length;
        const opponentMoves = this.getValidMoves(opponent).length;
        const mobility = (playerMoves - opponentMoves) * 2;

        return stoneCount + cornerBonus + edgeBonus + mobility;
    }

    minimax(depth, isMaximizing, player, alpha = -Infinity, beta = Infinity) {
        const opponent = player === BLACK ? WHITE : BLACK;

        if (depth === 0) {
            return { score: this.evaluatePosition(player), move: null };
        }

        const moves = this.getValidMoves(isMaximizing ? player : opponent);

        if (moves.length === 0) {
            const opponentMoves = this.getValidMoves(isMaximizing ? opponent : player);
            if (opponentMoves.length === 0) {
                // Game over
                const score = this.calculateScore();
                const finalScore = player === BLACK ? score.black - score.white : score.white - score.black;
                return { score: finalScore * 1000, move: null };
            }
            // Pass
            return this.minimax(depth - 1, !isMaximizing, player, alpha, beta);
        }

        let bestMove = moves[0];
        let bestScore = isMaximizing ? -Infinity : Infinity;

        for (let move of moves) {
            const oldBoard = JSON.parse(JSON.stringify(this.board));

            this.board[move.row][move.col] = isMaximizing ? player : opponent;
            this.flipStones(move.row, move.col, isMaximizing ? player : opponent);

            const result = this.minimax(depth - 1, !isMaximizing, player, alpha, beta);

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

            if (beta <= alpha) break; // Alpha-beta pruning
        }

        return { score: bestScore, move: bestMove };
    }

    aiMove() {
        const moves = this.getValidMoves(this.currentPlayer);

        if (moves.length === 0) {
            const opponentMoves = this.getValidMoves(this.currentPlayer === BLACK ? WHITE : BLACK);
            if (opponentMoves.length === 0) {
                this.endGame();
                return;
            }

            this.updateStatus('パス（打つ手がありません）');
            this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
            setTimeout(() => this.aiMove(), 1000);
            return;
        }

        let move;

        if (this.difficulty === 'easy') {
            move = moves[Math.floor(Math.random() * moves.length)];
        } else {
            const depth = this.difficulty === 'normal' ? 4 : 6;
            const result = this.minimax(depth, true, this.currentPlayer);
            move = result.move;
        }

        this.placeStone(move.row, move.col, this.currentPlayer);
        this.renderBoard();
        this.updateScore();

        this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;

        const playerMoves = this.getValidMoves(this.currentPlayer);
        if (playerMoves.length === 0) {
            const opponentMoves = this.getValidMoves(this.currentPlayer === BLACK ? WHITE : BLACK);
            if (opponentMoves.length === 0) {
                this.endGame();
                return;
            }

            this.updateStatus('パス（打つ手がありません）');
            this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
            setTimeout(() => this.aiMove(), 1000);
        } else {
            this.updateStatus(this.playerColor === this.currentPlayer ?
                'あなたのターンです' : 'AIが考え中...');
        }
    }

    playerMove(row, col) {
        if (this.currentPlayer !== this.playerColor) return;
        if (!this.canPlaceStone(row, col, this.currentPlayer)) return;

        this.placeStone(row, col, this.currentPlayer);
        this.renderBoard();
        this.updateScore();

        this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;

        const playerMoves = this.getValidMoves(this.currentPlayer);
        if (playerMoves.length === 0) {
            const opponentMoves = this.getValidMoves(this.currentPlayer === BLACK ? WHITE : BLACK);
            if (opponentMoves.length === 0) {
                this.endGame();
                return;
            }

            this.updateStatus('パス（打つ手がありません）');
            this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
        }

        setTimeout(() => this.aiMove(), 800);
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        const validMoves = this.getValidMoves(this.currentPlayer);
        const validMovesSet = new Set(validMoves.map(m => `${m.row},${m.col}`));

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'othello-cell';

                if (validMovesSet.has(`${i},${j}`)) {
                    cell.classList.add('possible');
                    if (this.currentPlayer === this.playerColor) {
                        cell.addEventListener('click', () => this.playerMove(i, j));
                    }
                } else {
                    cell.classList.add('no-move');
                }

                if (this.board[i][j] !== EMPTY) {
                    const stone = document.createElement('div');
                    stone.className = `stone ${this.board[i][j] === BLACK ? 'black' : 'white'} new`;
                    cell.appendChild(stone);
                }

                this.gameBoard.appendChild(cell);
            }
        }
    }

    updateScore() {
        const score = this.calculateScore();
        this.blackScoreDisplay.textContent = score.black;
        this.whiteScoreDisplay.textContent = score.white;
    }

    updateStatus(message) {
        this.statusDisplay.textContent = message;
        this.statusDisplay.className = 'status-text';

        if (message.includes('あなた')) {
            this.statusDisplay.classList.add('player-turn');
        } else if (message.includes('AIが')) {
            this.statusDisplay.classList.add('ai-turn');
        }
    }

    endGame() {
        this.gameRunning = false;
        const score = this.calculateScore();

        let message = '';
        let resultClass = '';

        if (this.playerColor === BLACK) {
            if (score.black > score.white) {
                message = `あなたの勝ち！ (黒: ${score.black} - 白: ${score.white})`;
                this.wins++;
                resultClass = 'player-win';
                GameStorage.setScore(GAME_ID, this.wins);
            } else if (score.black < score.white) {
                message = `AIの勝ち (黒: ${score.black} - 白: ${score.white})`;
                this.losses++;
                resultClass = 'player-lose';
                GameStorage.setBestScore(GAME_ID, this.losses);
            } else {
                message = `引き分け (${score.black} - ${score.white})`;
                resultClass = 'draw';
            }
        } else {
            if (score.white > score.black) {
                message = `あなたの勝ち！ (白: ${score.white} - 黒: ${score.black})`;
                this.wins++;
                resultClass = 'player-win';
                GameStorage.setScore(GAME_ID, this.wins);
            } else if (score.white < score.black) {
                message = `AIの勝ち (白: ${score.white} - 黒: ${score.black})`;
                this.losses++;
                resultClass = 'player-lose';
                GameStorage.setBestScore(GAME_ID, this.losses);
            } else {
                message = `引き分け (${score.white} - ${score.black})`;
                resultClass = 'draw';
            }
        }

        this.statusDisplay.textContent = message;
        this.statusDisplay.className = `status-text game-over ${resultClass}`;

        GameStats.recordGame(GAME_ID, {
            playerScore: this.playerColor === BLACK ? score.black : score.white,
            aiScore: this.playerColor === BLACK ? score.white : score.black,
            result: resultClass,
            difficulty: this.difficulty
        });

        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        this.winsDisplay.textContent = this.wins;
        this.lossesDisplay.textContent = this.losses;
    }

    undo() {
        if (this.gameHistory.length === 0) return;

        this.board = this.gameHistory.pop();
        this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
        this.renderBoard();
        this.updateScore();
        this.undoBtn.disabled = this.gameHistory.length === 0;
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    new OthelloGame();
});
