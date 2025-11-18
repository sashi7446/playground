const GAME_ID = '073';
const pads = document.querySelectorAll('.pad');
const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let playingSequence = false;

function startGame() {
    gameActive = true;
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';

    pads.forEach(pad => {
        pad.onclick = () => handlePadClick(parseInt(pad.dataset.sound));
    });

    nextLevel();
}

function nextLevel() {
    playerSequence = [];
    sequence.push(Math.floor(Math.random() * 4));
    playSequence();
}

async function playSequence() {
    playingSequence = true;

    for (let i = 0; i < sequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        flashPad(sequence[i]);
    }

    playingSequence = false;
}

function flashPad(index) {
    const pad = pads[index];
    pad.classList.add('active');
    setTimeout(() => pad.classList.remove('active'), 300);
}

function handlePadClick(index) {
    if (!gameActive || playingSequence) return;

    flashPad(index);
    playerSequence.push(index);

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
