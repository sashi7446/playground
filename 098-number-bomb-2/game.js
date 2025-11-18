const GAME_ID = '098';
const targetNum = document.getElementById('targetNum');
const numbersDiv = document.getElementById('numbers');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let score = 0;
let timeLeft = 30;
let currentTarget = 0;
let timerInterval;

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';

    nextTarget();
    timerInterval = setInterval(updateTimer, 1000);
}

function nextTarget() {
    if (!gameActive) return;

    currentTarget = Math.floor(Math.random() * 50) + 1;
    targetNum.textContent = currentTarget;
    numbersDiv.innerHTML = '';

    const numbers = [currentTarget];
    while (numbers.length < 15) {
        const num = Math.floor(Math.random() * 50) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }

    numbers.sort(() => Math.random() - 0.5);

    numbers.forEach(num => {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = num;
        btn.onclick = () => clickNumber(num, btn);
        numbersDiv.appendChild(btn);
    });
}

function clickNumber(num, btn) {
    if (!gameActive) return;

    if (num === currentTarget) {
        btn.classList.add('correct');
        score += 10;
        scoreDisplay.textContent = score;

        setTimeout(nextTarget, 300);
    } else {
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 300);
    }
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);

    GameStorage.recordPlay(GAME_ID, score, score >= 100 ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`Game Over!\nFinal Score: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
