const GAME_ID = '015-matching-game';
const CARDS_EMOJI = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

class MatchingGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreDisplay = document.getElementById('score');
        this.movesDisplay = document.getElementById('moves');
        this.newGameBtn = document.getElementById('newGameBtn');

        // Game state
        this.cards = [];
        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        this.gameRunning = true;
        this.lockBoard = false;

        this.init();
        this.setupEventListeners();
    }

    init() {
        // Create shuffled cards
        const cardPairs = [...CARDS_EMOJI, ...CARDS_EMOJI];
        this.cards = this.shuffle(cardPairs).map((emoji, index) => ({
            id: index,
            emoji: emoji,
            flipped: false,
            matched: false
        }));

        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        this.gameRunning = true;
        this.lockBoard = false;

        this.render();
        this.updateDisplay();
    }

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    handleCardClick(index) {
        if (!this.gameRunning || this.lockBoard) return;
        if (this.cards[index].matched || this.cards[index].flipped) return;

        // Flip card
        this.cards[index].flipped = true;
        this.flipped.push(index);
        this.render();

        // Check for match
        if (this.flipped.length === 2) {
            this.lockBoard = true;
            this.moves++;
            this.updateDisplay();

            setTimeout(() => {
                this.checkMatch();
            }, 600);
        }
    }

    checkMatch() {
        const [idx1, idx2] = this.flipped;
        const match = this.cards[idx1].emoji === this.cards[idx2].emoji;

        if (match) {
            this.cards[idx1].matched = true;
            this.cards[idx2].matched = true;
            this.matched++;

            if (this.matched === CARDS_EMOJI.length) {
                this.gameWon();
            }
        } else {
            // Unflip cards
            this.cards[idx1].flipped = false;
            this.cards[idx2].flipped = false;

            // Add shake animation
            const card1El = this.gameBoard.children[idx1];
            const card2El = this.gameBoard.children[idx2];
            card1El.classList.add('shake');
            card2El.classList.add('shake');

            setTimeout(() => {
                card1El.classList.remove('shake');
                card2El.classList.remove('shake');
            }, 300);
        }

        this.flipped = [];
        this.lockBoard = false;
        this.render();
    }

    render() {
        this.gameBoard.innerHTML = '';

        this.cards.forEach((card, index) => {
            const cardEl = document.createElement('button');
            cardEl.className = 'card';

            if (card.matched) {
                cardEl.classList.add('matched');
                cardEl.textContent = card.emoji;
                cardEl.disabled = true;
            } else if (card.flipped) {
                cardEl.classList.add('flipped');
                cardEl.textContent = card.emoji;
            } else {
                cardEl.textContent = '?';
            }

            cardEl.addEventListener('click', () => this.handleCardClick(index));
            this.gameBoard.appendChild(cardEl);
        });
    }

    updateDisplay() {
        this.scoreDisplay.textContent = this.matched;
        this.movesDisplay.textContent = this.moves;
    }

    gameWon() {
        this.gameRunning = false;

        GameStats.recordGame(GAME_ID, {
            moves: this.moves,
            result: 'won'
        });

        GameModal.show(
            'クリア！',
            `${this.moves} 手でクリア！`,
            () => {
                this.newGame();
            }
        );
    }

    newGame() {
        this.init();
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    new MatchingGame();
});
