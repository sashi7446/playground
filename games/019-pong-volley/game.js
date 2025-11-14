const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const NET_Y = CANVAS_HEIGHT / 2;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const BALL_SIZE = 8;

// In-Zone dimensions (positioned in middle of each court, away from walls)
const IN_ZONE_WIDTH = 120;
const IN_ZONE_HEIGHT = 100;
const IN_ZONE_MARGIN_FROM_NET = 80;  // Distance from net
const IN_ZONE_X = (CANVAS_WIDTH - IN_ZONE_WIDTH) / 2;

// Player in-zone (player's side, below net) - Player is at bottom
const PLAYER_IN_ZONE = {
    x: IN_ZONE_X,
    y: NET_Y + IN_ZONE_MARGIN_FROM_NET,
    width: IN_ZONE_WIDTH,
    height: IN_ZONE_HEIGHT
};

// AI in-zone (opponent's side, above net) - AI is at top
const OPPONENT_IN_ZONE = {
    x: IN_ZONE_X,
    y: NET_Y - IN_ZONE_MARGIN_FROM_NET - IN_ZONE_HEIGHT,
    width: IN_ZONE_WIDTH,
    height: IN_ZONE_HEIGHT
};

class PongVolley {
    constructor(difficulty = 'normal') {
        this.difficulty = difficulty;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.initGame();
        this.setupControls();
        this.startGame();
    }

    initGame() {
        // Player (human) - starts in player's zone at BOTTOM
        this.player = {
            x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
            y: CANVAS_HEIGHT - 80,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            vx: 0,
            vy: 0,
            speed: 5
        };

        // AI - starts in AI's zone at TOP
        this.ai = {
            x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
            y: 50,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            vx: 0,
            vy: 0,
            speed: this.getAISpeed()
        };

        // Ball
        this.ball = {
            x: CANVAS_WIDTH / 2,
            y: NET_Y,
            prevX: CANVAS_WIDTH / 2,
            prevY: NET_Y,
            vx: -3,  // Start going left
            vy: 4,   // Going towards player (downward)
            speed: 1,
            size: BALL_SIZE,
            lastHitBy: 'ai'  // Track who hit it last
        };

        this.scores = { player: 0, ai: 0 };
        this.gameRunning = true;
        this.keys = {};

        // Track if ball passed through in-zone (for scoring)
        this.ballPassedThroughInZone = false;
    }

    getAISpeed() {
        switch(this.difficulty) {
            case 'easy': return 2.5;
            case 'normal': return 3.5;
            case 'hard': return 4.5;
            default: return 3.5;
        }
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.ai.speed = this.getAISpeed();
        });
    }

    startGame() {
        setInterval(() => this.update(), 1000 / 60);
        setInterval(() => this.draw(), 1000 / 60);
    }

    update() {
        if (!this.gameRunning) return;

        this.updatePlayerMovement();
        this.updateAIMovement();
        this.updateBall();
        this.checkCollisions();
    }

    updatePlayerMovement() {
        const moveX =
            (this.keys['arrowleft'] || this.keys['a'] ? -1 : 0) +
            (this.keys['arrowright'] || this.keys['d'] ? 1 : 0);
        const moveY =
            (this.keys['arrowup'] || this.keys['w'] ? -1 : 0) +
            (this.keys['arrowdown'] || this.keys['s'] ? 1 : 0);

        this.player.x += moveX * this.player.speed;
        this.player.y += moveY * this.player.speed;

        // Keep player in their own court (below net, at bottom)
        this.player.x = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, this.player.x));
        this.player.y = Math.max(NET_Y + 10, Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, this.player.y));
    }

    updateAIMovement() {
        // AI tracks ball with some variation based on difficulty
        const targetX = this.ball.x - PLAYER_WIDTH / 2;
        const targetY = this.ball.y - PLAYER_HEIGHT / 2;

        let aiX = this.ai.x;
        let aiY = this.ai.y;

        // Add reaction delay for easier difficulties
        let delayFactor = 1;
        if (this.difficulty === 'easy') {
            delayFactor = 0.5 + Math.random() * 0.3;
        } else if (this.difficulty === 'normal') {
            delayFactor = 0.7 + Math.random() * 0.2;
        }

        // Move towards target
        if (Math.abs(targetX - aiX) > 2) {
            this.ai.x += Math.sign(targetX - aiX) * this.ai.speed * delayFactor;
        }
        if (Math.abs(targetY - aiY) > 2) {
            this.ai.y += Math.sign(targetY - aiY) * this.ai.speed * delayFactor;
        }

        // Keep AI in their own court (above net, at top)
        this.ai.x = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, this.ai.x));
        this.ai.y = Math.max(0, Math.min(NET_Y - PLAYER_HEIGHT - 10, this.ai.y));
    }

    updateBall() {
        // Save previous position for in-zone detection
        this.ball.prevX = this.ball.x;
        this.ball.prevY = this.ball.y;

        this.ball.x += this.ball.vx * this.ball.speed;
        this.ball.y += this.ball.vy * this.ball.speed;

        // Top and bottom wall bouncing
        if (this.ball.y - this.ball.size / 2 < 0) {
            this.ball.y = this.ball.size / 2;
            this.ball.vy = Math.abs(this.ball.vy);
        }
        if (this.ball.y + this.ball.size / 2 > CANVAS_HEIGHT) {
            this.ball.y = CANVAS_HEIGHT - this.ball.size / 2;
            this.ball.vy = -Math.abs(this.ball.vy);
        }

        // Side wall collision - Calculate score based on in-zone passage
        if (this.ball.x - this.ball.size / 2 < 0 || this.ball.x + this.ball.size / 2 > CANVAS_WIDTH) {
            this.scorePoint();
            this.resetBall();
        }
    }

    checkCollisions() {
        // Collision with player
        if (this.rectCircleCollision(this.player, this.ball)) {
            this.ball.vx = Math.abs(this.ball.vx);
            this.ball.x = this.player.x + PLAYER_WIDTH + this.ball.size / 2;
            this.ball.lastHitBy = 'player';
            this.ballPassedThroughInZone = false;  // Reset zone tracking
            this.ball.speed = Math.min(this.ball.speed + 0.02, 2);

            // Add spin based on hit location
            const hitPos = (this.ball.y - this.player.y) / this.player.height;
            this.ball.vy += (hitPos - 0.5) * 3;
        }

        // Collision with AI
        if (this.rectCircleCollision(this.ai, this.ball)) {
            this.ball.vx = -Math.abs(this.ball.vx);
            this.ball.x = this.ai.x - this.ball.size / 2;
            this.ball.lastHitBy = 'ai';
            this.ballPassedThroughInZone = false;  // Reset zone tracking
            this.ball.speed = Math.min(this.ball.speed + 0.02, 2);

            // Add spin based on hit location
            const hitPos = (this.ball.y - this.ai.y) / this.ai.height;
            this.ball.vy += (hitPos - 0.5) * 3;
        }

        // Check if ball passes through in-zone
        this.checkInZonePassage();
    }

    checkInZonePassage() {
        // Check if ball passes through opponent's in-zone (when player hits)
        if (this.ball.lastHitBy === 'player') {
            // More robust detection: check if trajectory crossed the zone
            const ballInZoneNow = this.isPointInZone(this.ball.x, this.ball.y, OPPONENT_IN_ZONE);
            const ballInZonePrev = this.isPointInZone(this.ball.prevX, this.ball.prevY, OPPONENT_IN_ZONE);

            // If now in zone OR trajectory crossed into zone
            if (ballInZoneNow) {
                this.ballPassedThroughInZone = true;
            }
            // Also check for line intersection with zone for fast balls
            else if (!ballInZonePrev && this.lineIntersectsZone(this.ball.prevX, this.ball.prevY, this.ball.x, this.ball.y, OPPONENT_IN_ZONE)) {
                this.ballPassedThroughInZone = true;
            }
        }
        // Check if ball passes through player's in-zone (when AI hits)
        else if (this.ball.lastHitBy === 'ai') {
            const ballInZoneNow = this.isPointInZone(this.ball.x, this.ball.y, PLAYER_IN_ZONE);
            const ballInZonePrev = this.isPointInZone(this.ball.prevX, this.ball.prevY, PLAYER_IN_ZONE);

            if (ballInZoneNow) {
                this.ballPassedThroughInZone = true;
            }
            else if (!ballInZonePrev && this.lineIntersectsZone(this.ball.prevX, this.ball.prevY, this.ball.x, this.ball.y, PLAYER_IN_ZONE)) {
                this.ballPassedThroughInZone = true;
            }
        }
    }

    scorePoint() {
        if (this.ball.lastHitBy === 'player') {
            // Player hit it
            if (this.ballPassedThroughInZone) {
                // Ball passed through opponent's in-zone → player scores
                this.scores.player++;
            } else {
                // Ball didn't pass through → AI scores
                this.scores.ai++;
            }
        } else if (this.ball.lastHitBy === 'ai') {
            // AI hit it
            if (this.ballPassedThroughInZone) {
                // Ball passed through player's in-zone → AI scores
                this.scores.ai++;
            } else {
                // Ball didn't pass through → player scores
                this.scores.player++;
            }
        }

        this.updateScoreDisplay();

        // Check win condition (first to 11)
        if (this.scores.player >= 11 || this.scores.ai >= 11) {
            this.endGame();
        }
    }

    resetBall() {
        this.ball.x = CANVAS_WIDTH / 2;
        this.ball.y = NET_Y;
        this.ball.prevX = CANVAS_WIDTH / 2;
        this.ball.prevY = NET_Y;

        // Consistent serve-like reset: always towards player
        // Direction alternates based on total points
        const totalPoints = this.scores.player + this.scores.ai;
        this.ball.vx = (totalPoints % 2 === 0) ? -3 : 3;  // Alternate left/right
        this.ball.vy = 4;   // Always towards player (downward)

        this.ball.speed = 1;
        this.ball.lastHitBy = 'ai';  // Start as if AI just served
        this.ballPassedThroughInZone = false;
    }

    updateScoreDisplay() {
        document.getElementById('playerScore').textContent = this.scores.player;
        document.getElementById('aiScore').textContent = this.scores.ai;
    }

    endGame() {
        this.gameRunning = false;
        const winner = this.scores.player > this.scores.ai ? 'Player' : 'AI';
        document.getElementById('gameStatus').textContent = `Game Over! ${winner} Wins!`;

        // Record play
        const duration = Math.random() * 300 + 60;
        const score = this.scores.player;
        const result = this.scores.player > this.scores.ai ? 'win' : 'loss';
        GameStorage.recordPlay('019', score, result, duration);
    }

    rectCircleCollision(rect, circle) {
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

        const dx = circle.x - closestX;
        const dy = circle.y - closestY;

        return (dx * dx + dy * dy) < (circle.size / 2) * (circle.size / 2);
    }

    isPointInZone(x, y, zone) {
        return x >= zone.x && x <= zone.x + zone.width &&
               y >= zone.y && y <= zone.y + zone.height;
    }

    lineIntersectsZone(x1, y1, x2, y2, zone) {
        // Check if line segment from (x1,y1) to (x2,y2) intersects with zone rectangle
        // Using parametric line equation and AABB intersection

        const dx = x2 - x1;
        const dy = y2 - y1;

        // Check if line crosses zone boundaries
        const zoneLeft = zone.x;
        const zoneRight = zone.x + zone.width;
        const zoneTop = zone.y;
        const zoneBottom = zone.y + zone.height;

        // Find t values where line crosses zone boundaries
        let tMin = -Infinity;
        let tMax = Infinity;

        // Check X axis
        if (dx !== 0) {
            const t1 = (zoneLeft - x1) / dx;
            const t2 = (zoneRight - x1) / dx;
            tMin = Math.max(tMin, Math.min(t1, t2));
            tMax = Math.min(tMax, Math.max(t1, t2));
        } else if (x1 < zoneLeft || x1 > zoneRight) {
            return false;  // Line is vertical and outside zone X range
        }

        // Check Y axis
        if (dy !== 0) {
            const t1 = (zoneTop - y1) / dy;
            const t2 = (zoneBottom - y1) / dy;
            tMin = Math.max(tMin, Math.min(t1, t2));
            tMax = Math.min(tMax, Math.max(t1, t2));
        } else if (y1 < zoneTop || y1 > zoneBottom) {
            return false;  // Line is horizontal and outside zone Y range
        }

        // Check if segment (t in [0,1]) intersects with zone (t in [tMin, tMax])
        return tMin <= 1 && tMax >= 0 && tMin <= tMax;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw net
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, NET_Y);
        this.ctx.lineTo(CANVAS_WIDTH, NET_Y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw court divider text
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("AI COURT", CANVAS_WIDTH / 2, NET_Y / 2);
        this.ctx.fillText("PLAYER COURT", CANVAS_WIDTH / 2, NET_Y + NET_Y / 2);

        // Draw in-zones
        this.drawInZone(PLAYER_IN_ZONE, '#00ff00', 'Your Zone');
        this.drawInZone(OPPONENT_IN_ZONE, '#ff3366', 'Target Zone');

        // Draw player
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.player.x, this.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

        // Draw AI
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(this.ai.x, this.ai.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.ai.x, this.ai.y, PLAYER_WIDTH, PLAYER_HEIGHT);

        // Draw ball
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw zone passage indicator
        if (this.ball.lastHitBy === 'player' && this.ballPassedThroughInZone) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText("✓ Zone Active", CANVAS_WIDTH / 2, 30);
        }

        // Draw debug information
        this.drawDebugInfo();
    }

    drawDebugInfo() {
        // Draw debug info in top-left corner
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        const debugInfo = [
            `Last Hit: ${this.ball.lastHitBy === 'player' ? '🟢 PLAYER' : '🔴 AI'}`,
            `Zone State: ${this.ballPassedThroughInZone ? '✓ IN (イン状態)' : '✗ OUT (アウト状態)'}`,
            `Ball Speed: ${this.ball.speed.toFixed(2)}`
        ];

        let y = 15;
        for (const line of debugInfo) {
            this.ctx.fillText(line, 10, y);
            y += 20;
        }
    }

    drawInZone(zone, color, label) {
        // Semi-transparent fill
        this.ctx.fillStyle = color + '33';  // 33 = 20% opacity
        this.ctx.fillRect(zone.x, zone.y, zone.width, zone.height);

        // Border
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

        // Label
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, zone.x + zone.width / 2, zone.y + zone.height / 2 + 5);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    new PongVolley('normal');
});
