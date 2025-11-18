const GAME_ID = '085';
const scrambledDisplay = document.getElementById('scrambled');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submitBtn');
const startBtn = document.getElementById('startBtn');
const roundDisplay = document.getElementById('round');
const scoreDisplay = document.getElementById('score');

const words = ['TIGER', 'PIANO', 'ROBOT', 'BEACH', 'STORM', 'CANDY', 'MAGIC', 'DREAM'];
let gameActive = false;
let round = 0;
let score = 0;
let currentWord = '';

function startGame() {
    gameActive = true;
    round = 0;
    score = 0;
    roundDisplay.textContent = round + 1;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';
    answerInput.value = '';

    nextRound();
}

function nextRound() {
    if (round >= 5) {
        endGame(true);
        return;
    }

    round++;
    roundDisplay.textContent = round;
    answerInput.value = '';
    answerInput.focus();

    currentWord = words[Math.floor(Math.random() * words.length)];
    const scrambled = currentWord.split('').sort(() => Math.random() - 0.5).join('');
    scrambledDisplay.textContent = scrambled;
}

function checkAnswer() {
    if (!gameActive) return;

    const answer = answerInput.value.toUpperCase().trim();

    if (answer === currentWord) {
        score += 100;
        scoreDisplay.textContent = score;
        scrambledDisplay.style.color = '#4caf50';
        setTimeout(() => {
            scrambledDisplay.style.color = '#ff9a9e';
            nextRound();
        }, 500);
    } else {
        scrambledDisplay.style.color = '#ff4444';
        setTimeout(() => {
            scrambledDisplay.style.color = '#ff9a9e';
            answerInput.value = '';
        }, 500);
    }
}

function endGame(won) {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, score, score >= 400 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Complete!\nScore: ${score}/500`);
        startBtn.style.display = 'block';
    }, 100);
}

submitBtn.onclick = checkAnswer;
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

startBtn.onclick = startGame;
