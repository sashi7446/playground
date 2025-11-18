const GAME_ID = '046';
const problemDisplay = document.getElementById('problem');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submitBtn');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const resultDisplay = document.getElementById('result');

let score = 0;
let timeLeft = 30;
let gameActive = true;
let currentAnswer = 0;

function generateProblem() {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];

    let result = 0;
    if (op === '+') result = a + b;
    else if (op === '-') result = a - b;
    else result = a * b;

    currentAnswer = result;
    problemDisplay.textContent = `${a} ${op} ${b} = ?`;
    answerInput.value = '';
    answerInput.focus();
    resultDisplay.textContent = '';
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);

    if (userAnswer === currentAnswer) {
        score++;
        scoreDisplay.textContent = score;
        resultDisplay.textContent = '✓ Correct!';
        GameStorage.recordPlay(GAME_ID, score, 'play', 1);
        generateProblem();
    } else {
        resultDisplay.textContent = '✗ Wrong!';
        setTimeout(() => {
            generateProblem();
        }, 500);
    }
}

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

const timer = setInterval(() => {
    if (gameActive) {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            gameActive = false;
            clearInterval(timer);
            submitBtn.disabled = true;
            answerInput.disabled = true;
            resultDisplay.textContent = '⏰ Time is up!';
        }
    }
}, 1000);

generateProblem();
