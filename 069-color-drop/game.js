const GAME_ID = '069';
const gameArea = document.getElementById('gameArea');
const bins = document.querySelectorAll('.bin');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const missesDisplay = document.getElementById('misses');

let gameActive = false;
let score = 0;
let misses = 0;
let currentDrop = null;
let dropInterval;

const colors = ['red', 'blue', 'green'];

function startGame() {
    gameActive = true;
    score = 0;
    misses = 0;
    scoreDisplay.textContent = score;
    missesDisplay.textContent = misses;
    startBtn.style.display = 'none';
    document.querySelectorAll('.drop').forEach(d => d.remove());

    bins.forEach(bin => {
        bin.onclick = () => catchDrop(bin.dataset.color);
    });

    dropInterval = setInterval(createDrop, 2000);
    createDrop();
}

function createDrop() {
    if (!gameActive) return;

    const color = colors[Math.floor(Math.random() * colors.length)];
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.background = color;
    drop.dataset.color = color;
    gameArea.appendChild(drop);

    currentDrop = { element: drop, color: color, y: 30 };

    const fallInterval = setInterval(() => {
        if (!gameActive || !drop.parentNode) {
            clearInterval(fallInterval);
            return;
        }

        currentDrop.y += 5;
        drop.style.top = currentDrop.y + 'px';

        if (currentDrop.y > 370) {
            clearInterval(fallInterval);
            drop.remove();
            if (currentDrop === currentDrop) {
                misses++;
                missesDisplay.textContent = misses;
                if (misses >= 5) {
                    endGame(false);
                }
            }
            currentDrop = null;
        }
    }, 50);
}

function catchDrop(binColor) {
    if (!gameActive || !currentDrop) return;

    const bin = document.querySelector(`.bin[data-color="${binColor}"]`);
    bin.classList.add('active');
    setTimeout(() => bin.classList.remove('active'), 200);

    if (currentDrop.color === binColor && currentDrop.y > 340) {
        score += 10;
        scoreDisplay.textContent = score;
        currentDrop.element.remove();
        currentDrop = null;
    }
}

function endGame(won) {
    gameActive = false;
    clearInterval(dropInterval);

    GameStorage.recordPlay(GAME_ID, score, score >= 50 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}`);
        startBtn.style.display = 'block';
        document.querySelectorAll('.drop').forEach(d => d.remove());
    }, 100);
}

startBtn.onclick = startGame;
