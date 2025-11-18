const GAME_ID = '061';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let currentNumber = 1;
let startTime;
let timerInterval;

function startGame() {
    gameActive = true;
    currentNumber = 1;
    startTime = Date.now();
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    // Create numbers 1-5 at random positions
    for (let i = 1; i <= 5; i++) {
        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = i;
        number.style.left = Math.random() * 280 + 'px';
        number.style.top = Math.random() * 280 + 'px';
        number.onclick = () => clickNumber(i, number);
        gameArea.appendChild(number);
    }

    timerInterval = setInterval(updateTimer, 50);
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    timeDisplay.textContent = elapsed.toFixed(1);
}

function clickNumber(num, element) {
    if (!gameActive) return;

    if (num === currentNumber) {
        element.classList.add('found');
        currentNumber++;

        if (currentNumber > 5) {
            endGame(true);
        }
    }
}

function endGame(won) {
    gameActive = false;
    clearInterval(timerInterval);
    const finalTime = parseFloat(timeDisplay.textContent);
    const score = won ? Math.max(0, 1000 - Math.floor(finalTime * 100)) : 0;

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(won ? `Complete! Time: ${finalTime}s\nScore: ${score}` : 'Try again!');
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
