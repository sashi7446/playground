const GAME_ID = '041';
const textDisplay = document.getElementById('textDisplay');
const typingInput = document.getElementById('typingInput');
const wpmDisplay = document.getElementById('wpm');
const timerDisplay = document.getElementById('timer');

const sampleTexts = [
    'The quick brown fox jumps over the lazy dog',
    'JavaScript is a versatile programming language',
    'Web development requires HTML CSS and JavaScript',
    'Typing fast improves your productivity',
    'Practice makes perfect in typing speed'
];

let timeLeft = 30;
let gameActive = false;
let textIndex = 0;

function startGame() {
    gameActive = true;
    typingInput.disabled = false;
    typingInput.focus();
    textIndex = Math.floor(Math.random() * sampleTexts.length);
    textDisplay.textContent = sampleTexts[textIndex];
    timeLeft = 30;

    const timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    typingInput.disabled = true;

    const words = typingInput.value.trim().split(/\s+/).length;
    const wpm = Math.round((words / 30) * 60);
    wpmDisplay.textContent = wpm;

    GameStorage.recordPlay(GAME_ID, wpm, 'play', 1);

    setTimeout(() => {
        typingInput.value = '';
        startGame();
    }, 3000);
}

typingInput.addEventListener('focus', () => {
    if (!gameActive && timerDisplay.textContent === '30') {
        startGame();
    }
});

startGame();
