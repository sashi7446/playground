const GAME_ID = '087';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const currentDisplay = document.getElementById('current');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let currentNumber = 1;
let startTime;
let timerInterval;

function startGame() {
    gameActive = true;
    currentNumber = 1;
    currentDisplay.textContent = currentNumber;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';
    startTime = Date.now();

    const numbers = Array.from({length: 20}, (_, i) => i + 1);
    numbers.sort(() => Math.random() - 0.5);

    numbers.forEach(num => {
        const numberEl = document.createElement('div');
        numberEl.className = 'number';
        numberEl.textContent = num;
        numberEl.dataset.value = num;
        numberEl.onclick = () => clickNumber(num, numberEl);
        gameArea.appendChild(numberEl);
    });

    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    timeDisplay.textContent = elapsed.toFixed(1);
}

function clickNumber(num, element) {
    if (!gameActive) return;

    if (num === currentNumber) {
        element.classList.add('painted');
        currentNumber++;
        currentDisplay.textContent = currentNumber;

        if (currentNumber > 20) {
            endGame(true);
        }
    }
}

function endGame(won) {
    gameActive = false;
    clearInterval(timerInterval);
    const finalTime = parseFloat(timeDisplay.textContent);
    const score = won ? Math.max(0, 2000 - Math.floor(finalTime * 20)) : 0;

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Complete!\nTime: ${finalTime}s\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
