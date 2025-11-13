const GAME_ID = '006-snake';
const GRID_SIZE = 20;
const INITIAL_SPEED = 100; // ms

class SnakeGame {
    constructor() {
        this.gridSize = GRID_SIZE;
        this.score = 0;
        this.best = GameStorage.getBestScore(GAME_ID);
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreDisplay = document.getElementById('score');
        this.bestDisplay = document.getElementById('best');
        this.newGameBtn = document.getElementById('newGameBtn');

        // ゲーム状態
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.gameRunning = true;
        this.gameLoop = null;

        this.init();
        this.setupEventListeners();
        this.updateDisplay();
        this.startGameLoop();
    }

    init() {
        this.render();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    handleKeyPress(e) {
        const key = e.key;

        // 方向を変更（逆方向に進まないようにチェック）
        if (key === 'ArrowUp' && this.direction.y === 0) {
            e.preventDefault();
            this.nextDirection = { x: 0, y: -1 };
        } else if (key === 'ArrowDown' && this.direction.y === 0) {
            e.preventDefault();
            this.nextDirection = { x: 0, y: 1 };
        } else if (key === 'ArrowLeft' && this.direction.x === 0) {
            e.preventDefault();
            this.nextDirection = { x: -1, y: 0 };
        } else if (key === 'ArrowRight' && this.direction.x === 0) {
            e.preventDefault();
            this.nextDirection = { x: 1, y: 0 };
        }
    }

    generateFood() {
        let food;
        let validPosition = false;

        // ヘビの体と重ならない位置に食べ物を生成
        while (!validPosition) {
            food = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };

            validPosition = !this.snake.some(segment => segment.x === food.x && segment.y === food.y);
        }

        return food;
    }

    update() {
        if (!this.gameRunning) return;

        // 方向を更新
        this.direction = this.nextDirection;

        // ヘビの頭の新しい位置を計算
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // 壁の衝突判定
        if (newHead.x < 0 || newHead.x >= this.gridSize || newHead.y < 0 || newHead.y >= this.gridSize) {
            this.gameOver();
            return;
        }

        // ヘビ自身との衝突判定
        if (this.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            this.gameOver();
            return;
        }

        // ヘビに新しい頭を追加
        this.snake.unshift(newHead);

        // 食べ物を食べたかチェック
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();

            // ハイスコア更新
            if (this.score > this.best) {
                this.best = this.score;
                GameStorage.setBestScore(GAME_ID, this.best);
            }

            this.updateDisplay();
        } else {
            // 食べ物を食べていない場合、尾を削除
            this.snake.pop();
        }

        this.render();
    }

    render() {
        this.gameBoard.innerHTML = '';

        // グリッド作成
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'snake-cell';

                // ヘビの判定
                if (this.snake[0].x === x && this.snake[0].y === y) {
                    cell.classList.add('snake-head');
                } else if (this.snake.some(segment => segment.x === x && segment.y === y)) {
                    cell.classList.add('snake-body');
                }

                // 食べ物の判定
                if (this.food.x === x && this.food.y === y) {
                    cell.classList.add('snake-food');
                }

                this.gameBoard.appendChild(cell);
            }
        }
    }

    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.bestDisplay.textContent = this.best;
    }

    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, INITIAL_SPEED);
    }

    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    gameOver() {
        this.gameRunning = false;
        this.stopGameLoop();
        this.gameBoard.classList.add('game-over');

        // 統計を記録
        GameStats.recordGame(GAME_ID, {
            score: this.score,
            snakeLength: this.snake.length
        });

        GameModal.show(
            'ゲームオーバー',
            `スコア: ${this.score}<br>ヘビの長さ: ${this.snake.length}`,
            () => {
                this.newGame();
            }
        );
    }

    newGame() {
        this.stopGameLoop();
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = true;
        this.gameBoard.classList.remove('game-over');
        this.updateDisplay();
        this.render();
        this.startGameLoop();
    }
}

// ゲーム開始
window.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
