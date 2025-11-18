const GAME_ID = '023';
let secretNumber;
let attempts;
let score = 0;

function newGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('numberInput').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('hint').textContent = 'Guess a number...';
    document.getElementById('attempts').textContent = '';
    document.getElementById('numberInput').focus();
}

function guess() {
    const input = document.getElementById('numberInput');
    const num = parseInt(input.value);

    if (!num || num < 1 || num > 100) {
        document.getElementById('result').textContent = 'Please enter a number between 1-100';
        return;
    }

    attempts++;

    if (num === secretNumber) {
        document.getElementById('result').textContent = '🎉 Correct!';
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
        GameStorage.recordPlay(GAME_ID, score, 'win', attempts * 2);
        setTimeout(newGame, 2000);
    } else if (num < secretNumber) {
        document.getElementById('hint').textContent = '↑ Too low!';
    } else {
        document.getElementById('hint').textContent = '↓ Too high!';
    }
}

// Enter key support
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('numberInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') guess();
    });
    newGame();
});
