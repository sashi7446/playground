const GAME_ID = '080';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let level = 1;
let score = 0;
let path = [];
let currentIndex = 0;
let tiles = [];

function startGame() {
    gameActive = true;
    level = 1;
    score = 0;
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';

    nextLevel();
}

function nextLevel() {
    gameArea.innerHTML = '';
    tiles = [];
    path = [];
    currentIndex = 0;

    // Create path
    const pathLength = Math.min(3 + level, 10);
    for (let i = 0; i < pathLength; i++) {
        let next;
        do {
            next = Math.floor(Math.random() * 25);
        } while (path.includes(next));
        path.push(next);
    }

    // Create tiles
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.index = i;

        const pathIndex = path.indexOf(i);
        if (pathIndex !== -1) {
            tile.textContent = pathIndex + 1;
        }

        tile.onclick = () => clickTile(i, tile);
        gameArea.appendChild(tile);
        tiles.push(tile);
    }

    // Show path briefly
    path.forEach(i => tiles[i].classList.add('path'));
    setTimeout(() => {
        tiles.forEach(t => {
            t.classList.remove('path');
            t.textContent = '';
        });
    }, 2000);
}

function clickTile(index, tile) {
    if (!gameActive || tile.classList.contains('clicked')) return;

    if (path[currentIndex] === index) {
        tile.classList.add('clicked');
        tile.textContent = currentIndex + 1;
        currentIndex++;

        if (currentIndex === path.length) {
            score += level * 50;
            scoreDisplay.textContent = score;
            level++;
            levelDisplay.textContent = level;

            setTimeout(nextLevel, 1000);
        }
    } else {
        tile.classList.add('wrong');
        setTimeout(() => endGame(false), 500);
    }
}

function endGame(won) {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, score, score >= 100 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nLevel: ${level}\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
