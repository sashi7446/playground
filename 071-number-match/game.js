const GAME_ID = '071';
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const pairsDisplay = document.getElementById('pairs');
const timeDisplay = document.getElementById('time');

let gameActive = false;
let selectedNumber = null;
let pairs = 0;
let timeLeft = 30;
let timerInterval;

function startGame() {
    gameActive = true;
    selectedNumber = null;
    pairs = 0;
    timeLeft = 30;
    pairsDisplay.textContent = pairs;
    timeDisplay.textContent = timeLeft;
    startBtn.style.display = 'none';
    gameArea.innerHTML = '';

    // Create pairs of numbers 1-10
    const numbers = [];
    for (let i = 1; i <= 10; i++) {
        numbers.push(i, i);
    }
    numbers.sort(() => Math.random() - 0.5);

    numbers.forEach(num => {
        const numberEl = document.createElement('div');
        numberEl.className = 'number';
        numberEl.textContent = num;
        numberEl.dataset.value = num;
        numberEl.onclick = () => selectNumber(numberEl);
        gameArea.appendChild(numberEl);
    });

    timerInterval = setInterval(updateTimer, 1000);
}

function selectNumber(element) {
    if (!gameActive || element.classList.contains('matched')) return;

    if (selectedNumber) {
        if (selectedNumber === element) return;

        if (selectedNumber.dataset.value === element.dataset.value) {
            // Match!
            selectedNumber.classList.add('matched');
            element.classList.add('matched');
            pairs++;
            pairsDisplay.textContent = pairs;

            if (pairs === 10) {
                endGame(true);
            }
        } else {
            // No match
            setTimeout(() => {
                selectedNumber.classList.remove('selected');
            }, 500);
        }
        selectedNumber = null;
    } else {
        selectedNumber = element;
        element.classList.add('selected');
    }
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame(false);
    }
}

function endGame(won) {
    gameActive = false;
    clearInterval(timerInterval);

    const score = pairs * 100 + (won ? timeLeft * 10 : 0);

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`${won ? 'Complete!' : 'Time Up!'}\nPairs: ${pairs}/10\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
