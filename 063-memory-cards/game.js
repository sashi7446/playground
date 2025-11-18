const GAME_ID = '063';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');

const emojis = ['🎨', '🎭', '🎪', '🎯', '🎸', '🎮'];
let gameActive = false;
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

function startGame() {
    gameActive = true;
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    movesDisplay.textContent = moves;
    pairsDisplay.textContent = matchedPairs;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerHTML = `
            <span class="back">❓</span>
            <span class="front">${emoji}</span>
        `;
        card.onclick = () => flipCard(card);
        gameArea.appendChild(card);
    });
}

function flipCard(card) {
    if (!gameActive || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        pairsDisplay.textContent = matchedPairs;
        flippedCards = [];

        if (matchedPairs === 6) {
            endGame(true);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function endGame(won) {
    gameActive = false;
    const score = won ? Math.max(0, 1000 - moves * 20) : 0;

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Complete!\nMoves: ${moves}\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 500);
}

startBtn.onclick = startGame;
