const GAME_ID = '066';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const roundDisplay = document.getElementById('round');

const items = [
    { normal: '🔴', odd: '🔵' },
    { normal: '⭐', odd: '🌟' },
    { normal: '😀', odd: '😎' },
    { normal: '🍎', odd: '🍊' },
    { normal: '🟦', odd: '🟥' },
    { normal: '🐶', odd: '🐱' },
    { normal: '🌸', odd: '🌺' },
    { normal: '⚡', odd: '🔥' },
    { normal: '💙', odd: '❤️' },
    { normal: '🎵', odd: '🎶' }
];

let gameActive = false;
let score = 0;
let round = 0;

function startGame() {
    gameActive = true;
    score = 0;
    round = 0;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';
    nextRound();
}

function nextRound() {
    if (round >= 10) {
        endGame(true);
        return;
    }

    round++;
    roundDisplay.textContent = round;
    gameArea.innerHTML = '';

    const itemSet = items[round - 1];
    const oddPosition = Math.floor(Math.random() * 3);

    for (let i = 0; i < 3; i++) {
        const item = document.createElement('div');
        item.className = 'item';
        item.textContent = i === oddPosition ? itemSet.odd : itemSet.normal;
        item.dataset.isOdd = i === oddPosition;
        item.onclick = () => selectItem(item);
        gameArea.appendChild(item);
    }
}

function selectItem(item) {
    if (!gameActive) return;

    if (item.dataset.isOdd === 'true') {
        score += 100;
        scoreDisplay.textContent = score;
        item.style.background = '#4caf50';
        setTimeout(nextRound, 500);
    } else {
        item.style.background = '#ff4444';
        setTimeout(() => endGame(false), 500);
    }
}

function endGame(won) {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}\nRounds: ${round}/10`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
