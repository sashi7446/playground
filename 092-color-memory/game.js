const GAME_ID = '092';
const colorBtns = document.querySelectorAll('.color-btn');
const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let playingSequence = false;

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

function startGame() {
    gameActive = true;
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';

    colorBtns.forEach(btn => {
        btn.onclick = () => handleColorClick(btn.dataset.color);
    });

    nextLevel();
}

function nextLevel() {
    playerSequence = [];
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    playSequence();
}

async function playSequence() {
    playingSequence = true;

    for (let i = 0; i < sequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        flashColor(sequence[i]);
    }

    playingSequence = false;
}

function flashColor(color) {
    const btn = document.querySelector(`[data-color="${color}"]`);
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 300);
}

function handleColorClick(color) {
    if (!gameActive || playingSequence) return;

    flashColor(color);
    playerSequence.push(color);

    const currentIndex = playerSequence.length - 1;

    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        endGame(false);
        return;
    }

    if (playerSequence.length === sequence.length) {
        score += level * 10;
        scoreDisplay.textContent = score;
        level++;
        levelDisplay.textContent = level;

        setTimeout(nextLevel, 1000);
    }
}

function endGame(won) {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, score, score >= 50 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nLevel: ${level}\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
