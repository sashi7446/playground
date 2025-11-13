const GAME_ID = '005-shooting-game';

class ShootingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('score');
        this.waveDisplay = document.getElementById('wave');
        this.newGameBtn = document.getElementById('newGameBtn');

        // Game state
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 40,
            width: 30,
            height: 30,
            speed: 5
        };
        this.keys = {};
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.score = 0;
        this.wave = 1;
        this.gameRunning = true;
        this.gameLoop = null;
        this.best = GameStorage.getBestScore(GAME_ID);

        this.init();
        this.setupEventListeners();
        this.startGameLoop();
    }

    init() {
        this.bullets = [];
        this.enemyBullets = [];
        this.createWave();
    }

    createWave() {
        this.enemies = [];
        const enemyCount = 3 + this.wave;

        for (let i = 0; i < enemyCount; i++) {
            this.enemies.push({
                x: (i % 4) * 120 + 80,
                y: (Math.floor(i / 4)) * 60 + 30,
                width: 25,
                height: 25,
                health: 1,
                shootTimer: 0
            });
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            if (e.code === 'Space') {
                e.preventDefault();
                this.shoot();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    shoot() {
        if (!this.gameRunning) return;

        this.bullets.push({
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            speed: 8
        });
    }

    update() {
        if (!this.gameRunning) return;

        // Player movement
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }

        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > 0;
        });

        // Enemy shooting
        for (let enemy of this.enemies) {
            enemy.shootTimer++;
            if (enemy.shootTimer > 60 && Math.random() < 0.02) {
                enemy.shootTimer = 0;
                this.enemyBullets.push({
                    x: enemy.x + enemy.width / 2 - 2,
                    y: enemy.y + enemy.height,
                    width: 4,
                    height: 10,
                    speed: 4
                });
            }
        }

        // Update enemy bullets
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.y += bullet.speed;
            return bullet.y < this.canvas.height;
        });

        // Check collisions: bullets vs enemies
        for (let bullet of this.bullets) {
            for (let enemy of this.enemies) {
                if (this.isColliding(bullet, enemy)) {
                    enemy.health--;
                    bullet.y = -100; // Remove bullet

                    if (enemy.health <= 0) {
                        this.score += 10;
                        this.enemies = this.enemies.filter(e => e !== enemy);
                    }
                    break;
                }
            }
        }

        // Check collisions: enemy bullets vs player
        for (let bullet of this.enemyBullets) {
            if (this.isColliding(bullet, this.player)) {
                this.gameOver();
                return;
            }
        }

        // Wave complete
        if (this.enemies.length === 0) {
            this.wave++;
            this.waveDisplay.textContent = this.wave;
            this.createWave();
        }

        this.scoreDisplay.textContent = this.score;
        this.render();
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 20, 40, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw player
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.fillStyle = '#00cc00';
        this.ctx.fillRect(this.player.x + 8, this.player.y - 10, 14, 10);

        // Draw bullets
        this.ctx.fillStyle = '#ffff00';
        for (let bullet of this.bullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }

        // Draw enemies
        this.ctx.fillStyle = '#ff0000';
        for (let enemy of this.enemies) {
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            this.ctx.fillStyle = '#ff6666';
            this.ctx.fillRect(enemy.x + 5, enemy.y + 5, 15, 15);
            this.ctx.fillStyle = '#ff0000';
        }

        // Draw enemy bullets
        this.ctx.fillStyle = '#ff6600';
        for (let bullet of this.enemyBullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
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
            wave: this.wave
        });

        GameModal.show(
            'ゲームオーバー',
            `スコア: ${this.score}<br>ウェーブ: ${this.wave}`,
            () => {
                this.newGame();
            }
        );
    }

    newGame() {
        this.stopGameLoop();
        this.score = 0;
        this.wave = 1;
        this.gameRunning = true;
        this.init();
        this.scoreDisplay.textContent = this.score;
        this.waveDisplay.textContent = this.wave;
        this.startGameLoop();
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    new ShootingGame();
});
