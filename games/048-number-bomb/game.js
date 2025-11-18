const GAME_ID = '048';
const bombDisplay = document.getElementById('bombDisplay');
const tapBtn = document.getElementById('tapBtn');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let count = 10;
let gameActive = true;

const countdown = setInterval(() => {
    count--;
    bombDisplay.textContent = count;
    timerDisplay.textContent = count;

    if (count <= 0) {
        clearInterval(countdown);
        gameActive = false;
        bombDisplay.textContent = '💥';
        tapBtn.disabled = true;
    }
}, 1000);

tapBtn.addEventListener('click', () => {
    if (!gameActive) return;
    clearInterval(countdown);
    score++;
    scoreDisplay.textContent = score;
    GameStorage.recordPlay(GAME_ID, score, 'win', 1);
    count = 10;
    bombDisplay.textContent = count;
    gameActive = true;

    const newCountdown = setInterval(() => {
        count--;
        bombDisplay.textContent = count;
        timerDisplay.textContent = count;

        if (count <= 0) {
            clearInterval(newCountdown);
            gameActive = false;
            bombDisplay.textContent = '💥';
            tapBtn.disabled = true;
        }
    }, 1000);
});
