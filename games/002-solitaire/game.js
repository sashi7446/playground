const GAME_ID = '002-solitaire';
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUIT_COLORS = { '♠': 'black', '♥': 'red', '♦': 'red', '♣': 'black' };

class SolitaireGame {
    constructor() {
        this.foundationsDiv = document.getElementById('foundations');
        this.tableauDiv = document.getElementById('tableau');
        this.stockDiv = document.getElementById('stock');
        this.wasteDiv = document.getElementById('waste');
        this.movesDisplay = document.getElementById('moves');
        this.bestDisplay = document.getElementById('best');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.undoBtn = document.getElementById('undoBtn');

        this.deck = [];
        this.stock = [];
        this.waste = [];
        this.foundations = [[], [], [], []];
        this.tableau = [[], [], [], [], [], [], []];
        this.moves = 0;
        this.best = GameStorage.getBestScore(GAME_ID);
        this.history = [];
        this.draggedCard = null;
        this.draggedFrom = null;

        this.init();
        this.setupEventListeners();
    }

    init() {
        this.createDeck();
        this.shuffle();
        this.dealCards();
        this.render();
        this.updateDisplay();
    }

    createDeck() {
        this.deck = [];
        for (let suit of SUITS) {
            for (let rank of RANKS) {
                this.deck.push({ suit, rank });
            }
        }
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        let cardIndex = 0;

        // Deal tableau
        for (let col = 0; col < 7; col++) {
            for (let row = col; row < 7; row++) {
                this.tableau[row].push(this.deck[cardIndex++]);
            }
        }

        // Stock
        this.stock = this.deck.slice(cardIndex);
        this.waste = [];
        this.foundations = [[], [], [], []];
        this.moves = 0;
        this.history = [];
    }

    setupEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.undoBtn.addEventListener('click', () => this.undo());
        this.stockDiv.addEventListener('click', () => this.drawFromStock());
    }

    getRankValue(rank) {
        return RANKS.indexOf(rank);
    }

    canPlaceOnTableau(card, targetCol) {
        if (this.tableau[targetCol].length === 0) {
            return card.rank === 'K';
        }

        const topCard = this.tableau[targetCol][this.tableau[targetCol].length - 1];
        return SUIT_COLORS[card.suit] !== SUIT_COLORS[topCard.suit] &&
               this.getRankValue(card.rank) === this.getRankValue(topCard.rank) - 1;
    }

    canPlaceOnFoundation(card, foundationIndex) {
        const foundation = this.foundations[foundationIndex];

        if (card.suit !== SUITS[foundationIndex]) return false;

        if (foundation.length === 0) {
            return card.rank === 'A';
        }

        const topCard = foundation[foundation.length - 1];
        return this.getRankValue(card.rank) === this.getRankValue(topCard.rank) + 1;
    }

    moveToFoundation(card) {
        for (let i = 0; i < 4; i++) {
            if (this.canPlaceOnFoundation(card, i)) {
                this.saveHistory();
                this.foundations[i].push(card);
                this.moves++;
                this.checkWin();
                this.render();
                this.updateDisplay();
                return true;
            }
        }
        return false;
    }

    drawFromStock() {
        if (this.stock.length === 0) {
            if (this.waste.length === 0) return;
            this.saveHistory();
            this.stock = this.waste.reverse();
            this.waste = [];
        } else {
            this.saveHistory();
            this.waste.push(this.stock.pop());
        }

        this.moves++;
        this.render();
        this.updateDisplay();
    }

    saveHistory() {
        this.history.push({
            stock: JSON.parse(JSON.stringify(this.stock)),
            waste: JSON.parse(JSON.stringify(this.waste)),
            foundations: JSON.parse(JSON.stringify(this.foundations)),
            tableau: JSON.parse(JSON.stringify(this.tableau)),
            moves: this.moves
        });

        if (this.history.length > 20) {
            this.history.shift();
        }
    }

    undo() {
        if (this.history.length === 0) return;

        const state = this.history.pop();
        this.stock = state.stock;
        this.waste = state.waste;
        this.foundations = state.foundations;
        this.tableau = state.tableau;
        this.moves = state.moves;

        this.render();
        this.updateDisplay();
    }

    render() {
        this.renderFoundations();
        this.renderStock();
        this.renderTableau();
        this.undoBtn.disabled = this.history.length === 0;
    }

    renderFoundations() {
        this.foundationsDiv.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            const div = document.createElement('div');
            div.className = 'foundation-pile';

            if (this.foundations[i].length > 0) {
                const card = this.createCardElement(this.foundations[i][this.foundations[i].length - 1]);
                div.appendChild(card);
            } else {
                div.textContent = SUITS[i];
            }

            this.foundationsDiv.appendChild(div);
        }
    }

    renderStock() {
        this.stockDiv.innerHTML = '';
        if (this.stock.length > 0) {
            this.stockDiv.textContent = '📚 ' + this.stock.length;
        } else {
            this.stockDiv.textContent = '♻️';
        }

        this.wasteDiv.innerHTML = '';
        if (this.waste.length > 0) {
            const card = this.createCardElement(this.waste[this.waste.length - 1]);
            card.addEventListener('click', () => this.startDrag(this.waste[this.waste.length - 1], 'waste'));
            this.wasteDiv.appendChild(card);
        }
    }

    renderTableau() {
        this.tableauDiv.innerHTML = '';

        for (let col = 0; col < 7; col++) {
            const colDiv = document.createElement('div');
            colDiv.className = 'tableau-column';
            colDiv.style.minHeight = (this.tableau[col].length * 20 + 90) + 'px';

            if (this.tableau[col].length === 0) {
                const slot = document.createElement('div');
                slot.className = 'tableau-slot';
                slot.addEventListener('drop', (e) => this.handleDrop(e, 'tableau', col));
                slot.addEventListener('dragover', (e) => e.preventDefault());
                colDiv.appendChild(slot);
            } else {
                for (let row = 0; row < this.tableau[col].length; row++) {
                    const card = this.createCardElement(this.tableau[col][row]);
                    card.style.position = 'absolute';
                    card.style.top = (row * 20) + 'px';
                    card.style.left = '0';
                    card.addEventListener('mousedown', () => this.startDrag(this.tableau[col][row], 'tableau', col, row));
                    colDiv.appendChild(card);
                }
            }

            this.tableauDiv.appendChild(colDiv);
        }
    }

    createCardElement(card) {
        const div = document.createElement('div');
        div.className = `card ${SUIT_COLORS[card.suit]}`;
        div.innerHTML = `<div class="card-rank">${card.rank}</div><div class="card-suit">${card.suit}</div>`;
        return div;
    }

    startDrag(card, source, sourceIndex, cardIndex) {
        this.draggedCard = card;
        this.draggedFrom = { source, sourceIndex, cardIndex };
    }

    handleDrop(e, target, targetIndex) {
        e.preventDefault();

        if (!this.draggedCard) return;

        // Remove from source
        if (this.draggedFrom.source === 'waste') {
            const card = this.waste.pop();
            if (target === 'tableau') {
                if (this.canPlaceOnTableau(card, targetIndex)) {
                    this.saveHistory();
                    this.tableau[targetIndex].push(card);
                    this.moves++;
                } else {
                    this.waste.push(card);
                }
            } else if (target === 'foundation') {
                if (this.canPlaceOnFoundation(card, targetIndex)) {
                    this.saveHistory();
                    this.foundations[targetIndex].push(card);
                    this.moves++;
                    this.checkWin();
                } else {
                    this.waste.push(card);
                }
            } else {
                this.waste.push(card);
            }
        } else if (this.draggedFrom.source === 'tableau') {
            const sourceCol = this.draggedFrom.sourceIndex;
            const card = this.tableau[sourceCol].pop();

            if (target === 'tableau' && sourceCol !== targetIndex) {
                if (this.canPlaceOnTableau(card, targetIndex)) {
                    this.saveHistory();
                    this.tableau[targetIndex].push(card);
                    this.moves++;
                } else {
                    this.tableau[sourceCol].push(card);
                }
            } else if (target === 'foundation') {
                if (this.canPlaceOnFoundation(card, targetIndex)) {
                    this.saveHistory();
                    this.foundations[targetIndex].push(card);
                    this.moves++;
                    this.checkWin();
                } else {
                    this.tableau[sourceCol].push(card);
                }
            } else {
                this.tableau[sourceCol].push(card);
            }
        }

        this.draggedCard = null;
        this.draggedFrom = null;
        this.render();
        this.updateDisplay();
    }

    checkWin() {
        if (this.foundations.every(f => f.length === 13)) {
            setTimeout(() => {
                if (this.moves < this.best || this.best === 0) {
                    this.best = this.moves;
                    GameStorage.setBestScore(GAME_ID, this.best);
                }

                GameStats.recordGame(GAME_ID, {
                    moves: this.moves,
                    result: 'won'
                });

                GameModal.show(
                    'クリア！',
                    `${this.moves}手でクリア！`,
                    () => this.newGame()
                );
            }, 500);
        }
    }

    updateDisplay() {
        this.movesDisplay.textContent = this.moves;
        this.bestDisplay.textContent = this.best;
    }

    newGame() {
        this.deck = [];
        this.createDeck();
        this.shuffle();
        this.dealCards();
        this.render();
        this.updateDisplay();
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    new SolitaireGame();
});
