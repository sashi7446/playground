const GAME_ID = '044';
const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const colorPads = document.querySelectorAll('.color-pad');

let sequence = [];
let userSequence = [];
let level = 1;
let gameActive = false;

colorPads.forEach((pad, index) => {
    pad.addEventListener('click', () => {
        if (!gameActive) return;
        userSequence.push(index);
        highlightPad(index);
        checkSequence();
    });
});

function highlightPad(index) {
    colorPads[index].classList.add('active');
    setTimeout(() => {
        colorPads[index].classList.remove('active');
    }, 200);
}

function playSequence() {
    gameActive = false;
    let i = 0;

    const interval = setInterval(() => {
        highlightPad(sequence[i]);
        i++;

        if (i >= sequence.length) {
            clearInterval(interval);
            userSequence = [];
            gameActive = true;
        }
    }, 600);
}

function checkSequence() {
    if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
        alert('Game Over! Level: ' + level);
        startGame();
        return;
    }

    if (userSequence.length === sequence.length) {
        level++;
        scoreDisplay.textContent = level - 1;
        levelDisplay.textContent = level;
        GameStorage.recordPlay(GAME_ID, level, 'play', 1);
        sequence.push(Math.floor(Math.random() * 4));
        setTimeout(playSequence, 1000);
    }
}

function startGame() {
    level = 1;
    sequence = [Math.floor(Math.random() * 4)];
    userSequence = [];
    levelDisplay.textContent = level;
    scoreDisplay.textContent = '0';
    startBtn.disabled = true;
    playSequence();
}

startBtn.addEventListener('click', startGame);
