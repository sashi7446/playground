const GAME_ID = '038';
const numberGrid = document.getElementById('numberGrid');
const resultDisplay = document.getElementById('result');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');

let wins = 0;
let losses = 0;
let luckyNumber = 0;
let gameActive = true;

function initializeGame() {
    gameActive = true;
    luckyNumber = Math.floor(Math.random() * 10) + 1;
    resultDisplay.textContent = '';
    numberGrid.innerHTML = '';

    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = i;
        btn.onclick = () => selectNumber(i, btn);
        numberGrid.appendChild(btn);
    }
}

function selectNumber(num, btn) {
    if (!gameActive) return;

    gameActive = false;
    const allButtons = document.querySelectorAll('.number-btn');
    allButtons.forEach(b => b.disabled = true);

    // Reveal all numbers
    allButtons.forEach((b, index) => {
        const number = index + 1;
        b.classList.add('revealed');
        if (number === luckyNumber) {
            b.classList.add('lucky');
            b.classList.remove('revealed');
        } else {
            b.classList.add('unlucky');
        }
    });

    if (num === luckyNumber) {
        wins++;
        winsDisplay.textContent = wins;
        resultDisplay.textContent = '🎉 Lucky! You Won!';
        GameStorage.recordPlay(GAME_ID, wins, 'win', 1);
    } else {
        losses++;
        lossesDisplay.textContent = losses;
        resultDisplay.textContent = `😢 Unlucky! The number was ${luckyNumber}`;
        GameStorage.recordPlay(GAME_ID, wins, 'loss', 1);
    }

    setTimeout(initializeGame, 2000);
}

initializeGame();
