const GAME_ID = '032';
const AREA_WIDTH = 500;
const AREA_HEIGHT = 400;
const BASKET_WIDTH = 60;
const BASKET_HEIGHT = 60;

let score = 0;
let missed = 0;
let basketX = AREA_WIDTH / 2 - BASKET_WIDTH / 2;
let keys = {};

class FallingItem {
    constructor() {
        this.x = Math.random() * (AREA_WIDTH - 40);
        this.y = -40;
        this.speed = 3 + Math.random() * 2;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        const item = document.getElementById('fallingItem');
        item.style.left = this.x + 'px';
        item.style.top = this.y + 'px';
    }

    isOutOfBounds() {
        return this.y > AREA_HEIGHT;
    }

    checkCollision(basketX) {
        return this.x + 40 > basketX && this.x < basketX + BASKET_WIDTH && this.y + 40 > AREA_HEIGHT - BASKET_HEIGHT;
    }
}

let currentItem = new FallingItem();

// Keyboard controls
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Game loop
setInterval(() => {
    // Move basket
    if (keys['arrowleft'] || keys['a']) {
        basketX = Math.max(0, basketX - 8);
    }
    if (keys['arrowright'] || keys['d']) {
        basketX = Math.min(AREA_WIDTH - BASKET_WIDTH, basketX + 8);
    }

    document.getElementById('basket').style.left = basketX + 'px';

    // Update falling item
    currentItem.update();

    if (currentItem.checkCollision(basketX)) {
        score++;
        document.getElementById('score').textContent = score;
        GameStorage.recordPlay(GAME_ID, score, 'win', 1);
        currentItem = new FallingItem();
    } else if (currentItem.isOutOfBounds()) {
        missed++;
        document.getElementById('missed').textContent = missed;
        GameStorage.recordPlay(GAME_ID, score, 'loss', 1);
        currentItem = new FallingItem();
    }

    currentItem.draw();
}, 20);
