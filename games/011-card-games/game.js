const GAME_ID = '011-card-games';
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

class BlackJackGame {
    constructor() {
        this.dealerCards = document.getElementById('dealerCards');
        this.playerCards = document.getElementById('playerCards');
        this.dealerScore = document.getElementById('dealerScore');
        this.playerScore = document.getElementById('playerScore');
        this.scoreDisplay = document.getElementById('score');
        this.moneyDisplay = document.getElementById('best');
        this.resultDiv = document.getElementById('result');
        this.hitBtn = document.getElementById('hitBtn');
        this.standBtn = document.getElementById('standBtn');
        this.newGameBtn = document.getElementById('newGameBtn');

        // Game state
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.wins = 0;
        this.gameRunning = false;
        this.dealerRevealed = false;

        this.wins = GameStorage.getScore(GAME_ID);
        this.setupEventListeners();
        this.newGame();
    }

    setupEventListeners() {
        this.hitBtn.addEventListener('click', () => this.hit());
        this.standBtn.addEventListener('click', () => this.stand());
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    createDeck() {
        const deck = [];
        for (let suit of SUITS) {
            for (let rank of RANKS) {
                deck.push({ suit, rank });
            }
        }

        // Fisher-Yates shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        return deck;
    }

    getCardValue(card) {
        if (card.rank === 'A') return 11;
        if (['J', 'Q', 'K'].includes(card.rank)) return 10;
        return parseInt(card.rank);
    }

    calculateScore(hand) {
        let score = 0;
        let aces = 0;

        for (let card of hand) {
            const value = this.getCardValue(card);
            if (card.rank === 'A') aces++;
            score += value;
        }

        // Adjust for aces
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }

        return score;
    }

    drawCard() {
        if (this.deck.length === 0) {
            this.deck = this.createDeck();
        }
        return this.deck.pop();
    }

    newGame() {
        this.deck = this.createDeck();
        this.playerHand = [];
        this.dealerHand = [];
        this.gameRunning = true;
        this.dealerRevealed = false;
        this.resultDiv.innerHTML = '';
        this.resultDiv.className = '';

        // Initial deal
        this.playerHand.push(this.drawCard());
        this.dealerHand.push(this.drawCard());
        this.playerHand.push(this.drawCard());
        this.dealerHand.push(this.drawCard());

        this.hitBtn.disabled = false;
        this.standBtn.disabled = false;

        // Check for blackjack
        const playerScore = this.calculateScore(this.playerHand);
        if (playerScore === 21) {
            this.stand();
        } else {
            this.render();
        }
    }

    hit() {
        if (!this.gameRunning) return;

        this.playerHand.push(this.drawCard());
        const score = this.calculateScore(this.playerHand);

        if (score > 21) {
            this.gameRunning = false;
            this.dealerRevealed = true;
            this.endGame();
        } else {
            this.render();
        }
    }

    stand() {
        if (!this.gameRunning) return;

        this.gameRunning = false;
        this.dealerRevealed = true;

        // Dealer plays
        while (this.calculateScore(this.dealerHand) < 17) {
            this.dealerHand.push(this.drawCard());
        }

        this.endGame();
    }

    endGame() {
        const playerScore = this.calculateScore(this.playerHand);
        const dealerScore = this.calculateScore(this.dealerHand);

        let result = '';
        let resultClass = '';

        if (playerScore > 21) {
            result = 'バスト - ディーラーの勝ち！';
            resultClass = 'lose';
        } else if (dealerScore > 21) {
            result = 'あなたの勝ち！';
            resultClass = 'win';
            this.wins++;
            GameStorage.setScore(GAME_ID, this.wins);
        } else if (playerScore > dealerScore) {
            result = 'あなたの勝ち！';
            resultClass = 'win';
            this.wins++;
            GameStorage.setScore(GAME_ID, this.wins);
        } else if (playerScore < dealerScore) {
            result = 'ディーラーの勝ち！';
            resultClass = 'lose';
        } else {
            result = '引き分け！';
            resultClass = 'draw';
        }

        this.resultDiv.textContent = result;
        this.resultDiv.className = `result-message ${resultClass}`;
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;

        GameStats.recordGame(GAME_ID, {
            playerScore: playerScore,
            dealerScore: dealerScore,
            result: resultClass
        });

        this.render();
        this.scoreDisplay.textContent = this.wins;
    }

    renderHand(container, hand, hideFirst = false) {
        container.innerHTML = '';

        hand.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';

            if (hideFirst && index === 0 && !this.dealerRevealed) {
                cardEl.classList.add('hidden');
                cardEl.textContent = '?';
            } else {
                cardEl.textContent = card.rank + card.suit;
            }

            container.appendChild(cardEl);
        });
    }

    render() {
        this.renderHand(this.playerCards, this.playerHand);
        this.renderHand(this.dealerCards, this.dealerHand, true);

        const playerScore = this.calculateScore(this.playerHand);
        const dealerScore = this.dealerRevealed ?
            this.calculateScore(this.dealerHand) :
            this.calculateScore([this.dealerHand[1]]);

        this.playerScore.textContent = `Score: ${playerScore}`;
        this.dealerScore.textContent = `Score: ${dealerScore}${!this.dealerRevealed ? ' (?)' : ''}`;
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    new BlackJackGame();
});
