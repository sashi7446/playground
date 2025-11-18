const GAME_ID = '045';
const gameArea = document.getElementById('gameArea');
const basket = document.getElementById('basket');
const caughtDisplay = document.getElementById('caught');
const timerDisplay = document.getElementById('timer');

const AREA_WIDTH = gameArea.offsetWidth;
const AREA_HEIGHT = gameArea.offsetHeight;
const BASKET_WIDTH = 60;
const OBJECT_SIZE = 40;
const objects_emoji = ['🍎', '🍊', '🍋', '🍌', '🍉'];

let caught = 0;
let timeLeft = 30;
let basketX = AREA_WIDTH / 2 - BASKET_WIDTH / 2;
let gameActive = true;
let fallingObjects = [];

gameArea.addEventListener('mousemove', (e) => {
    const rect = gameArea.getBoundingClientRect();
    basketX = Math.max(0, Math.min(e.clientX - rect.left - BASKET_WIDTH / 2, AREA_WIDTH - BASKET_WIDTH));
    basket.style.left = basketX + 'px';
});

class FallingObject {
    constructor() {
        this.x = Math.random() * (AREA_WIDTH - OBJECT_SIZE);
        this.y = -OBJECT_SIZE;
        this.speed = 3 + Math.random() * 2;
        this.emoji = objects_emoji[Math.floor(Math.random() * objects_emoji.length)];
        this.element = document.createElement('div');
        this.element.className = 'object';
        this.element.textContent = this.emoji;
        gameArea.appendChild(this.element);
        this.update();
    }

    update() {
        this.y += this.speed;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    checkCollision() {
        return this.x + OBJECT_SIZE > basketX &&
               this.x < basketX + BASKET_WIDTH &&
               this.y + OBJECT_SIZE > AREA_HEIGHT - BASKET_WIDTH;
    }

    isOutOfBounds() {
        return this.y > AREA_HEIGHT;
    }

    remove() {
        this.element.remove();
    }
}

const gameLoop = setInterval(() => {
    if (!gameActive) return;

    // Spawn new objects randomly
    if (Math.random() < 0.02) {
        fallingObjects.push(new FallingObject());
    }

    // Update objects
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const obj = fallingObjects[i];
        obj.update();

        if (obj.checkCollision()) {
            caught++;
            caughtDisplay.textContent = caught;
            GameStorage.recordPlay(GAME_ID, caught, 'play', 1);
            obj.remove();
            fallingObjects.splice(i, 1);
        } else if (obj.isOutOfBounds()) {
            obj.remove();
            fallingObjects.splice(i, 1);
        }
    }
}, 30);

const timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        gameActive = false;
        clearInterval(gameLoop);
        clearInterval(timer);
        basket.textContent = '🏁';
    }
}, 1000);
