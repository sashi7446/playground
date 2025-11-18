const GAME_ID = '026';
const symbols = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍓'];
let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let isLocked = false;

function initGame() {
    // Create card pairs
    const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    cards = deck.map((symbol, index) => ({
        id: index,
        symbol: symbol,
        flipped: false,
        matched: false
    }));

    renderBoard();
}

function renderBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';

    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.textContent = card.flipped || card.matched ? card.symbol : '?';
        cardEl.onclick = () => flipCard(card.id);
        board.appendChild(cardEl);
    });
}

function flipCard(id) {
    if (isLocked || cards[id].flipped || cards[id].matched) return;

    cards[id].flipped = true;
    flipped.push(id);
    renderBoard();

    if (flipped.length === 2) {
        isLocked = true;
        moves++;
        document.getElementById('moves').textContent = moves;

        const [first, second] = flipped;
        if (cards[first].symbol === cards[second].symbol) {
            cards[first].matched = true;
            cards[second].matched = true;
            matched++;
            document.getElementById('matches').textContent = matched;

            flipped = [];
            isLocked = false;

            if (matched === 6) {
                GameStorage.recordPlay(GAME_ID, 6, 'win', moves);
                setTimeout(() => {
                    alert(`✓ Won in ${moves} moves!`);
                    resetGame();
                }, 300);
            }
        } else {
            setTimeout(() => {
                cards[first].flipped = false;
                cards[second].flipped = false;
                flipped = [];
                isLocked = false;
                renderBoard();
            }, 800);
        }

        renderBoard();
    }
}

function resetGame() {
    matched = 0;
    moves = 0;
    flipped = [];
    isLocked = false;
    document.getElementById('matches').textContent = matched;
    document.getElementById('moves').textContent = moves;
    initGame();
}

initGame();
