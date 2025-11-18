const GAME_ID = '081';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const roundDisplay = document.getElementById('round');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let round = 0;
let score = 0;
let luckyCard = 0;

function startGame() {
    gameActive = true;
    round = 0;
    score = 0;
    roundDisplay.textContent = round + 1;
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
    luckyCard = Math.floor(Math.random() * 3);

    for (let i = 0; i < 3; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = '🎴';
        card.dataset.index = i;
        card.onclick = () => selectCard(i);
        gameArea.appendChild(card);
    }
}

function selectCard(index) {
    if (!gameActive) return;

    const cards = document.querySelectorAll('.card');

    cards.forEach((card, i) => {
        card.onclick = null;
        if (i === luckyCard) {
            card.classList.add('winner');
            card.textContent = '⭐';
        } else {
            card.classList.add('loser');
            card.textContent = '❌';
        }
    });

    if (index === luckyCard) {
        score += 100;
        scoreDisplay.textContent = score;
    }

    setTimeout(nextRound, 1500);
}

function endGame(won) {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, score, score >= 500 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Complete!\nCorrect: ${score/100}/10\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
