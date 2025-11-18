const GAME_ID = '097';
const card = document.getElementById('card');
const question = document.getElementById('question');
const answers = document.getElementById('answers');
const startBtn = document.getElementById('startBtn');
const roundDisplay = document.getElementById('round');
const scoreDisplay = document.getElementById('score');

const cards = [
    { symbol: '🐶', name: 'Dog' },
    { symbol: '🐱', name: 'Cat' },
    { symbol: '🐘', name: 'Elephant' },
    { symbol: '🦁', name: 'Lion' },
    { symbol: '🐼', name: 'Panda' },
    { symbol: '🦊', name: 'Fox' },
    { symbol: '🐸', name: 'Frog' },
    { symbol: '🦋', name: 'Butterfly' }
];

let gameActive = false;
let round = 0;
let score = 0;
let currentCard = null;

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
    if (round >= 5) {
        endGame(true);
        return;
    }

    round++;
    roundDisplay.textContent = round;

    currentCard = cards[Math.floor(Math.random() * cards.length)];

    card.style.display = 'block';
    question.style.display = 'none';
    answers.style.display = 'none';

    card.textContent = currentCard.symbol;

    setTimeout(showQuestion, 2000);
}

function showQuestion() {
    card.style.display = 'none';
    question.style.display = 'block';
    answers.style.display = 'flex';

    question.textContent = 'What was the animal?';
    answers.innerHTML = '';

    const options = [currentCard.name];
    while (options.length < 3) {
        const random = cards[Math.floor(Math.random() * cards.length)].name;
        if (!options.includes(random)) {
            options.push(random);
        }
    }

    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option);
        answers.appendChild(btn);
    });
}

function checkAnswer(answer) {
    if (!gameActive) return;

    if (answer === currentCard.name) {
        score += 100;
        scoreDisplay.textContent = score;
        question.textContent = 'Correct! ✓';
        question.style.color = '#4caf50';
    } else {
        question.textContent = 'Wrong! ✗';
        question.style.color = '#ff4444';
    }

    answers.style.display = 'none';

    setTimeout(() => {
        question.style.color = '#333';
        nextRound();
    }, 1000);
}

function endGame(won) {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, score, score >= 400 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Complete!\nScore: ${score}/500`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
