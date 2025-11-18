const GAME_ID = '035';
const AREA_WIDTH = 500;
const AREA_HEIGHT = 400;
const PLAYER_SIZE = 40;

let score = 0;
let playerX = AREA_WIDTH / 2 - PLAYER_SIZE / 2;
let obstacleY = -50;
let obstacleX = Math.random() * (AREA_WIDTH - PLAYER_SIZE);
let gameActive = true;
let keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

setInterval(() => {
    // Move player
    if (keys['arrowleft'] || keys['a']) {
        playerX = Math.max(0, playerX - 10);
    }
    if (keys['arrowright'] || keys['d']) {
        playerX = Math.min(AREA_WIDTH - PLAYER_SIZE, playerX + 10);
    }

    document.getElementById('player').style.left = playerX + 'px';

    // Move obstacle
    if (gameActive) {
        obstacleY += 5;
        document.getElementById('obstacle').style.top = obstacleY + 'px';

        // Collision detection
        if (obstacleY > AREA_HEIGHT - PLAYER_SIZE - 20) {
            if (obstacleX > playerX && obstacleX < playerX + PLAYER_SIZE) {
                // Collision
                gameActive = false;
                alert(`Game Over! Score: ${score}`);
                location.reload();
            }
        }

        // Reset obstacle
        if (obstacleY > AREA_HEIGHT) {
            score++;
            document.getElementById('score').textContent = score;
            GameStorage.recordPlay(GAME_ID, score, 'play', 1);
            obstacleY = -50;
            obstacleX = Math.random() * (AREA_WIDTH - PLAYER_SIZE);
        }

        document.getElementById('obstacle').style.left = obstacleX + 'px';
    }
}, 20);
