const GAME_ID = '014-block-breaker';

class BlockBreakerGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.best = GameStorage.getBestScore(GAME_ID);
        this.scoreDisplay = document.getElementById('score');
        this.bestDisplay = document.getElementById('best');
        this.newGameBtn = document.getElementById('newGameBtn');

        // Game state
        this.paddle = { x: 175, y: 460, width: 50, height: 10 };
        this.ball = { x: 200, y: 440, radius: 5, vx: 0, vy: 0 };
        this.bricks = [];
        this.gameRunning = true;
        this.gameLoop = null;
        this.mouseX = this.canvas.width / 2;

        this.init();
        this.setupEventListeners();
        this.updateDisplay();
        this.startGameLoop();
    }

    init() {
        // Create bricks
        this.bricks = [];
        const brickWidth = 40;
        const brickHeight = 15;
        const padding = 5;
        const cols = 9;
        const rows = 4;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * (brickWidth + padding) + 10;
                const y = r * (brickHeight + padding) + 30;
                this.bricks.push({
                    x: x,
                    y: y,
                    width: brickWidth,
                    height: brickHeight,
                    active: true
                });
            }
        }

        // Reset ball
        this.ball.x = this.canvas.width / 2;
        this.ball.y = 440;
        this.ball.vx = 0;
        this.ball.vy = 0;
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        document.addEventListener('click', () => this.startBall());
        document.addEventListener('touchstart', () => this.startBall());
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
    }

    handleTouchMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.touches[0].clientX - rect.left;
        e.preventDefault();
    }

    startBall() {
        if (this.ball.vx === 0 && this.ball.vy === 0) {
            this.ball.vx = 3;
            this.ball.vy = -5;
        }
    }

    update() {
        if (!this.gameRunning) return;

        // Update paddle position
        this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.mouseX - this.paddle.width / 2));

        // Update ball position
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Wall collision
        if (this.ball.x - this.ball.radius < 0 || this.ball.x + this.ball.radius > this.canvas.width) {
            this.ball.vx = -this.ball.vx;
            this.ball.x = Math.max(this.ball.radius, Math.min(this.canvas.width - this.ball.radius, this.ball.x));
        }

        if (this.ball.y - this.ball.radius < 0) {
            this.ball.vy = -this.ball.vy;
            this.ball.y = this.ball.radius;
        }

        // Bottom collision (game over)
        if (this.ball.y > this.canvas.height) {
            this.gameOver();
            return;
        }

        // Paddle collision
        if (this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.y - this.ball.radius < this.paddle.y + this.paddle.height &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width) {
            this.ball.vy = -Math.abs(this.ball.vy);
            this.ball.y = this.paddle.y - this.ball.radius;

            // Add spin based on paddle position
            const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
            this.ball.vx = (hitPos - 0.5) * 6;
        }

        // Brick collision
        for (let brick of this.bricks) {
            if (!brick.active) continue;

            if (this.ball.x > brick.x &&
                this.ball.x < brick.x + brick.width &&
                this.ball.y > brick.y &&
                this.ball.y < brick.y + brick.height) {

                brick.active = false;
                this.score += 10;
                this.updateDisplay();

                // Simple bounce
                this.ball.vy = -this.ball.vy;

                // Check win condition
                if (this.bricks.every(b => !b.active)) {
                    this.gameWon();
                    return;
                }

                break;
            }
        }

        this.render();
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw paddle
        this.ctx.fillStyle = '#667eea';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#667eea';

        // Draw ball
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Draw bricks
        for (let brick of this.bricks) {
            if (brick.active) {
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                this.ctx.strokeStyle = '#ff4444';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        }

        // Draw status text
        if (this.ball.vx === 0 && this.ball.vy === 0) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Click to start', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.bestDisplay.textContent = this.best;
    }

    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, 1000 / 60);
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

        if (this.score > this.best) {
            this.best = this.score;
            GameStorage.setBestScore(GAME_ID, this.best);
        }

        GameStats.recordGame(GAME_ID, {
            score: this.score,
            bricksDestroyed: this.bricks.filter(b => !b.active).length
        });

        GameModal.show(
            'ゲームオーバー',
            `スコア: ${this.score}`,
            () => {
                this.newGame();
            }
        );
    }

    gameWon() {
        this.gameRunning = false;
        this.stopGameLoop();

        if (this.score > this.best) {
            this.best = this.score;
            GameStorage.setBestScore(GAME_ID, this.best);
        }

        GameStats.recordGame(GAME_ID, {
            score: this.score,
            result: 'won'
        });

        GameModal.show(
            'クリア！',
            `スコア: ${this.score}`,
            () => {
                this.newGame();
            }
        );
    }

    newGame() {
        this.stopGameLoop();
        this.score = 0;
        this.gameRunning = true;
        this.init();
        this.updateDisplay();
        this.startGameLoop();
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    new BlockBreakerGame();
});
