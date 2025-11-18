const GAME_ID = '076';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const pairsDisplay = document.getElementById('pairs');
const timeDisplay = document.getElementById('time');

const symbols = ['🌟', '💎', '🎯', '🎨', '🎵', '⚡'];
let gameActive = false;
let flippedCards = [];
let matchedPairs = 0;
let timeLeft = 30;
let timerInterval;

function startGame() {
    gameActive = true;
    flippedCards = [];
    matchedPairs = 0;
    timeLeft = 30;
    pairsDisplay.textContent = matchedPairs;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = symbol;
        card.textContent = symbol;
        card.onclick = () => flipCard(card);
        gameArea.appendChild(card);
    });

    timerInterval = setInterval(updateTimer, 1000);
}

function flipCard(card) {
    if (!gameActive || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(card)) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        pairsDisplay.textContent = matchedPairs;

        if (matchedPairs === 6) {
            endGame(true);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame(false);
    }
}

function endGame(won) {
    gameActive = false;
    clearInterval(timerInterval);

    const score = matchedPairs * 100 + (won ? timeLeft * 20 : 0);

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`${won ? 'Complete!' : 'Time Up!'}\nPairs: ${matchedPairs}/6\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
