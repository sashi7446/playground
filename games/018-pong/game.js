const GAME_ID = '018-pong';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const MAX_SCORE = 11;

class PongGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.statusDisplay = document.getElementById('status');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('newGameBtn');

        // Game state
        this.gameRunning = false;
        this.difficulty = 'normal';

        // Paddles
        this.player = {
            x: 20,
            y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            dy: 0,
            score: 0
        };

        this.ai = {
            x: CANVAS_WIDTH - PADDLE_WIDTH - 20,
            y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            dy: 0,
            score: 0
        };

        // Ball
        this.ball = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            size: BALL_SIZE,
            vx: 4,
            vy: 3,
            speed: 1
        };

        // Input
        this.keys = {};

        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.startNewGame();
        });

        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
                if (!this.gameRunning) {
                    this.startGame();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    startNewGame() {
        this.player.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
        this.player.score = 0;
        this.ai.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
        this.ai.score = 0;
        this.ball.x = CANVAS_WIDTH / 2;
        this.ball.y = CANVAS_HEIGHT / 2;
        this.ball.vx = 4;
        this.ball.vy = 3;
        this.ball.speed = 1;
        this.gameRunning = false;
        this.updateStatus('Press SPACE to start');
        this.render();
    }

    startGame() {
        this.gameRunning = true;
        this.updateStatus('Game Running');
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.render();

        if (this.gameRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    update() {
        // Player controls
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
            this.player.dy = -PADDLE_SPEED;
        } else if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
            this.player.dy = PADDLE_SPEED;
        } else {
            this.player.dy = 0;
        }

        // Update player position
        this.player.y += this.player.dy;
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y + this.player.height > CANVAS_HEIGHT) {
            this.player.y = CANVAS_HEIGHT - this.player.height;
        }

        // AI movement
        this.updateAI();

        // Update AI position
        this.ai.y += this.ai.dy;
        if (this.ai.y < 0) this.ai.y = 0;
        if (this.ai.y + this.ai.height > CANVAS_HEIGHT) {
            this.ai.y = CANVAS_HEIGHT - this.ai.height;
        }

        // Update ball
        this.ball.x += this.ball.vx * this.ball.speed;
        this.ball.y += this.ball.vy * this.ball.speed;

        // Ball collision with top/bottom
        if (this.ball.y - this.ball.size / 2 < 0 || this.ball.y + this.ball.size / 2 > CANVAS_HEIGHT) {
            this.ball.vy = -this.ball.vy;
            this.ball.y = Math.max(this.ball.size / 2, Math.min(CANVAS_HEIGHT - this.ball.size / 2, this.ball.y));
        }

        // Ball collision with paddles
        this.checkPaddleCollision();

        // Scoring
        if (this.ball.x - this.ball.size / 2 < 0) {
            this.ai.score++;
            this.resetBall();
            this.checkGameOver();
        } else if (this.ball.x + this.ball.size / 2 > CANVAS_WIDTH) {
            this.player.score++;
            this.resetBall();
            this.checkGameOver();
        }
    }

    updateAI() {
        const aiCenter = this.ai.y + this.ai.height / 2;
        const ballCenter = this.ball.y;
        const difficulty = this.difficulty;

        let targetY = ballCenter;

        // Difficulty adjustments
        if (difficulty === 'easy') {
            // AI reacts slowly and imperfectly
            const offset = Math.random() * 60 - 30;
            targetY = ballCenter + offset;
            this.ai.dy = (targetY - aiCenter) > 0 ? PADDLE_SPEED * 0.5 : -PADDLE_SPEED * 0.5;
        } else if (difficulty === 'normal') {
            // AI tracks ball with slight delay
            const offset = Math.random() * 30 - 15;
            targetY = ballCenter + offset;
            this.ai.dy = (targetY - aiCenter) > 0 ? PADDLE_SPEED * 0.8 : -PADDLE_SPEED * 0.8;
        } else {
            // Hard: AI nearly perfect
            this.ai.dy = (ballCenter - aiCenter) > 0 ? PADDLE_SPEED : -PADDLE_SPEED;
        }
    }

    checkPaddleCollision() {
        // Player paddle
        if (this.ball.vx < 0 &&
            this.ball.x - this.ball.size / 2 < this.player.x + this.player.width &&
            this.ball.y > this.player.y &&
            this.ball.y < this.player.y + this.player.height) {
            this.ball.vx = -this.ball.vx;
            this.ball.x = this.player.x + this.player.width + this.ball.size / 2;

            // Add spin based on paddle movement
            const hitPos = (this.ball.y - this.player.y) / this.player.height;
            this.ball.vy += (hitPos - 0.5) * 4;
            this.ball.speed = Math.min(this.ball.speed + 0.01, 2);
        }

        // AI paddle
        if (this.ball.vx > 0 &&
            this.ball.x + this.ball.size / 2 > this.ai.x &&
            this.ball.y > this.ai.y &&
            this.ball.y < this.ai.y + this.ai.height) {
            this.ball.vx = -this.ball.vx;
            this.ball.x = this.ai.x - this.ball.size / 2;

            // Add spin based on paddle movement
            const hitPos = (this.ball.y - this.ai.y) / this.ai.height;
            this.ball.vy += (hitPos - 0.5) * 4;
            this.ball.speed = Math.min(this.ball.speed + 0.01, 2);
        }
    }

    resetBall() {
        this.ball.x = CANVAS_WIDTH / 2;
        this.ball.y = CANVAS_HEIGHT / 2;
        this.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 4;
        this.ball.vy = (Math.random() - 0.5) * 6;
        this.ball.speed = 1;
    }

    checkGameOver() {
        if (this.player.score >= MAX_SCORE) {
            this.updateStatus(`YOU WIN! ${this.player.score}-${this.ai.score}`);
            GameStorage.recordPlay(GAME_ID, 1, 'won', 0);
            this.gameRunning = false;
        } else if (this.ai.score >= MAX_SCORE) {
            this.updateStatus(`AI WINS! ${this.player.score}-${this.ai.score}`);
            GameStorage.recordPlay(GAME_ID, 0, 'lost', 0);
            this.gameRunning = false;
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw center line
        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(CANVAS_WIDTH / 2, 0);
        this.ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw paddles
        this.drawPaddle(this.player);
        this.drawPaddle(this.ai);

        // Draw ball
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw scores
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.player.score, CANVAS_WIDTH / 4, 60);
        this.ctx.fillText(this.ai.score, (CANVAS_WIDTH * 3) / 4, 60);
    }

    drawPaddle(paddle) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    updateStatus(message) {
        this.statusDisplay.textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PongGame();
});
