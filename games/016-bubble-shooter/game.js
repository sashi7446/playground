const GAME_ID = '016-bubble-shooter';
const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
const BUBBLE_RADIUS = 15;

class BubbleShooterGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.best = GameStorage.getBestScore(GAME_ID);
        this.scoreDisplay = document.getElementById('score');
        this.bestDisplay = document.getElementById('best');
        this.newGameBtn = document.getElementById('newGameBtn');

        // Game state
        this.bubbles = [];
        this.shooter = { x: this.canvas.width / 2, y: this.canvas.height - 30, angle: 0 };
        this.gameRunning = true;
        this.gameLoop = null;
        this.mouseX = this.canvas.width / 2;

        this.init();
        this.setupEventListeners();
        this.updateDisplay();
        this.startGameLoop();
    }

    init() {
        // Create initial bubbles
        this.bubbles = [];
        const cols = Math.floor(this.canvas.width / (BUBBLE_RADIUS * 2));
        const rows = 4;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS + 10;
                const y = r * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS + 20;
                const colorIndex = Math.floor(Math.random() * COLORS.length);

                this.bubbles.push({
                    x: x,
                    y: y,
                    radius: BUBBLE_RADIUS,
                    color: COLORS[colorIndex],
                    vx: 0,
                    vy: 0,
                    active: true,
                    isShot: false
                });
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('click', () => this.shoot());
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;

        // Calculate angle
        const dx = this.mouseX - this.shooter.x;
        const dy = -60; // Fixed distance
        this.shooter.angle = Math.atan2(dy, dx);
    }

    shoot() {
        if (!this.gameRunning) return;

        // Create shot bubble
        const bubble = {
            x: this.shooter.x,
            y: this.shooter.y,
            radius: BUBBLE_RADIUS,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            vx: Math.cos(this.shooter.angle) * 8,
            vy: Math.sin(this.shooter.angle) * 8,
            active: true,
            isShot: true
        };

        this.bubbles.push(bubble);
    }

    update() {
        if (!this.gameRunning) return;

        // Update shot bubbles
        for (let bubble of this.bubbles) {
            if (!bubble.isShot) continue;

            bubble.x += bubble.vx;
            bubble.y += bubble.vy;

            // Wall collision
            if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > this.canvas.width) {
                bubble.vx = -bubble.vx;
                bubble.x = Math.max(bubble.radius, Math.min(this.canvas.width - bubble.radius, bubble.x));
            }

            // Top collision
            if (bubble.y - bubble.radius < 0) {
                bubble.vy = -bubble.vy;
                bubble.y = bubble.radius;
            }

            // Out of bounds (bottom)
            if (bubble.y > this.canvas.height) {
                bubble.active = false;
                continue;
            }

            // Collision with other bubbles
            for (let other of this.bubbles) {
                if (bubble === other || !other.active) continue;

                const dx = other.x - bubble.x;
                const dy = other.y - bubble.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = bubble.radius + other.radius;

                if (dist < minDist) {
                    if (bubble.isShot && !other.isShot) {
                        // Collision with static bubble
                        bubble.active = false;

                        // Find connected same-color bubbles
                        const connected = this.findConnected(other);
                        if (connected.length >= 3) {
                            for (let b of connected) {
                                b.active = false;
                            }
                            this.score += connected.length * 10;
                            this.updateDisplay();
                        }
                    }
                }
            }
        }

        // Check win condition
        const staticBubbles = this.bubbles.filter(b => b.active && !b.isShot);
        if (staticBubbles.length === 0) {
            this.gameWon();
            return;
        }

        this.render();
    }

    findConnected(bubble, visited = new Set(), color = bubble.color) {
        if (visited.has(bubble)) return [];

        visited.add(bubble);
        let connected = [bubble];

        for (let other of this.bubbles) {
            if (!other.active || other.isShot || visited.has(other)) continue;
            if (other.color !== color) continue;

            const dx = other.x - bubble.x;
            const dy = other.y - bubble.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < bubble.radius + other.radius + 5) {
                connected = connected.concat(this.findConnected(other, visited, color));
            }
        }

        return connected;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bubbles
        for (let bubble of this.bubbles) {
            if (!bubble.active) continue;

            this.ctx.fillStyle = bubble.color;
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            this.ctx.fill();

            if (bubble.isShot) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }

        // Draw shooter line
        const shooterLength = 60;
        const endX = this.shooter.x + Math.cos(this.shooter.angle) * shooterLength;
        const endY = this.shooter.y + Math.sin(this.shooter.angle) * shooterLength;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.shooter.x, this.shooter.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // Draw shooter circle
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.shooter.x, this.shooter.y, 8, 0, Math.PI * 2);
        this.ctx.fill();
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
    new BubbleShooterGame();
});
