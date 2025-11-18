const GAME_ID = '068';
const buttons = document.querySelectorAll('.button');
const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;

const colors = ['red', 'blue', 'green', 'yellow'];

function startGame() {
    gameActive = true;
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';

    buttons.forEach(btn => {
        btn.onclick = () => handlePlayerInput(btn.dataset.color);
    });

    nextLevel();
}

function nextLevel() {
    playerSequence = [];
    sequence.push(colors[Math.floor(Math.random() * 4)]);
    playSequence();
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            return;
        }

        const color = sequence[i];
        const button = document.querySelector(`[data-color="${color}"]`);
        flashButton(button);
        i++;
    }, 600);
}

function flashButton(button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 300);
}

function handlePlayerInput(color) {
    if (!gameActive) return;

    const button = document.querySelector(`[data-color="${color}"]`);
    flashButton(button);

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
