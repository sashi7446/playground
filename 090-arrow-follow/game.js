const GAME_ID = '090';
const arrow = document.getElementById('arrow');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');

const arrows = {
    'ArrowUp': '⬆️',
    'ArrowDown': '⬇️',
    'ArrowLeft': '⬅️',
    'ArrowRight': '➡️'
};

let gameActive = false;
let score = 0;
let streak = 0;
let currentArrow = '';
let rounds = 0;

function startGame() {
    gameActive = true;
    score = 0;
    streak = 0;
    rounds = 0;
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    startBtn.style.display = 'none';

    nextArrow();
}

function nextArrow() {
    if (rounds >= 30) {
        endGame(true);
        return;
    }

    rounds++;
    const keys = Object.keys(arrows);
    currentArrow = keys[Math.floor(Math.random() * keys.length)];
    arrow.textContent = arrows[currentArrow];
}

function handleKeyPress(e) {
    if (!gameActive) return;

    if (e.key === currentArrow) {
        score += 10 + streak;
        streak++;
        scoreDisplay.textContent = score;
        streakDisplay.textContent = streak;
        arrow.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            arrow.style.filter = 'brightness(1)';
            nextArrow();
        }, 200);
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        streak = 0;
        streakDisplay.textContent = streak;
        arrow.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            arrow.style.filter = 'brightness(1)';
            endGame(false);
        }, 500);
    }

    e.preventDefault();
}

function endGame(won) {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, score, score >= 200 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nScore: ${score}\nBest Streak: ${streak}`);
        startBtn.style.display = 'block';
    }, 100);
}

document.addEventListener('keydown', handleKeyPress);
startBtn.onclick = startGame;
