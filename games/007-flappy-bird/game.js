const GAME_ID = '007-flappy-bird';
const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const PIPE_SPEED = 5;
const PIPE_INTERVAL = 120; // フレーム数

class FlappyBirdGame {
    constructor() {
        this.score = 0;
        this.best = GameStorage.getBestScore(GAME_ID);
        this.gameBoard = document.getElementById('gameBoard');
        this.bird = document.getElementById('bird');
        this.scoreDisplay = document.getElementById('score');
        this.bestDisplay = document.getElementById('best');
        this.newGameBtn = document.getElementById('newGameBtn');

        // ゲーム状態
        this.birdY = this.gameBoard.offsetHeight / 2;
        this.birdVelocity = 0;
        this.pipes = [];
        this.gameRunning = true;
        this.gameLoop = null;
        this.pipeCounter = 0;
        this.pipesPassed = new Set();

        this.init();
        this.setupEventListeners();
        this.updateDisplay();
        this.startGameLoop();
    }

    init() {
        this.updateBirdPosition();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('click', () => this.jump());
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    handleKeyPress(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            this.jump();
        }
    }

    jump() {
        if (!this.gameRunning) return;
        this.birdVelocity = JUMP_STRENGTH;
    }

    update() {
        if (!this.gameRunning) return;

        // 重力を適用
        this.birdVelocity += GRAVITY;
        this.birdY += this.birdVelocity;

        // 画面下の境界判定
        const boardHeight = this.gameBoard.offsetHeight;
        if (this.birdY + 20 >= boardHeight) {
            this.gameOver();
            return;
        }

        // 画面上の境界判定
        if (this.birdY - 20 <= 0) {
            this.gameOver();
            return;
        }

        // パイプを生成
        this.pipeCounter++;
        if (this.pipeCounter >= PIPE_INTERVAL) {
            this.createPipe();
            this.pipeCounter = 0;
        }

        // パイプを更新
        this.pipes = this.pipes.filter(pipe => {
            pipe.x -= PIPE_SPEED;

            // パイプがスコア判定ラインを通過
            if (pipe.x === 50 && !this.pipesPassed.has(pipe.id)) {
                this.pipesPassed.add(pipe.id);
                this.score += 1;
                this.updateDisplay();
            }

            // パイプが画面外に出たか判定
            return pipe.x > -80;
        });

        // 衝突判定
        this.checkCollision();

        this.updateBirdPosition();
        this.renderPipes();
    }

    createPipe() {
        const boardHeight = this.gameBoard.offsetHeight;
        const gapHeight = 100;
        const minPipeHeight = 50;
        const maxPipeHeight = boardHeight - gapHeight - minPipeHeight;

        const topPipeHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
        const bottomPipeY = topPipeHeight + gapHeight;

        const pipeId = Math.random();

        const topPipe = {
            x: this.gameBoard.offsetWidth,
            y: 0,
            height: topPipeHeight,
            type: 'top',
            id: pipeId
        };

        const bottomPipe = {
            x: this.gameBoard.offsetWidth,
            y: bottomPipeY,
            height: boardHeight - bottomPipeY,
            type: 'bottom',
            id: pipeId
        };

        this.pipes.push(topPipe, bottomPipe);
    }

    checkCollision() {
        const birdRadius = 20;
        const birdX = 50;

        for (let pipe of this.pipes) {
            // パイプのX座標が鳥と重なるかチェック
            if (pipe.x < birdX + birdRadius && pipe.x + 60 > birdX - birdRadius) {
                // Y座標がパイプと重なるかチェック
                if (this.birdY - birdRadius < pipe.y + pipe.height &&
                    this.birdY + birdRadius > pipe.y) {
                    this.gameOver();
                    return;
                }
            }
        }
    }

    updateBirdPosition() {
        this.bird.style.top = (this.birdY - 20) + 'px';

        // 鳥の回転を追加（視覚効果）
        const rotationAngle = Math.min(this.birdVelocity * 3, 30);
        this.bird.style.transform = `translateY(0) rotate(${rotationAngle}deg)`;
    }

    renderPipes() {
        // 既存のパイプを削除
        document.querySelectorAll('.pipe').forEach(el => el.remove());

        // パイプを再描画
        for (let pipe of this.pipes) {
            const pipeElement = document.createElement('div');
            pipeElement.className = `pipe ${pipe.type}`;
            pipeElement.style.left = pipe.x + 'px';
            pipeElement.style.top = pipe.y + 'px';
            pipeElement.style.height = pipe.height + 'px';
            this.gameBoard.appendChild(pipeElement);
        }
    }

    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.bestDisplay.textContent = this.best;
    }

    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, 1000 / 60); // 60 FPS
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

        // ハイスコア更新
        if (this.score > this.best) {
            this.best = this.score;
            GameStorage.setBestScore(GAME_ID, this.best);
        }

        // 統計を記録
        GameStats.recordGame(GAME_ID, {
            score: this.score
        });

        GameModal.show(
            'ゲームオーバー',
            `スコア: ${this.score}`,
            () => {
                this.newGame();
            }
        );
    }

    newGame() {
        this.stopGameLoop();
        this.birdY = this.gameBoard.offsetHeight / 2;
        this.birdVelocity = 0;
        this.pipes = [];
        this.score = 0;
        this.gameRunning = true;
        this.pipeCounter = 0;
        this.pipesPassed.clear();
        this.gameBoard.classList.remove('game-over');
        this.updateDisplay();
        this.updateBirdPosition();
        this.startGameLoop();
    }
}

// ゲーム開始
window.addEventListener('DOMContentLoaded', () => {
    new FlappyBirdGame();
});
