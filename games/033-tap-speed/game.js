const GAME_ID = '033';
let score = 0;
let timeLeft = 10;
let gameActive = true;

function tap() {
    if (!gameActive) return;
    score++;
    document.getElementById('score').textContent = score;
}

// Start timer
const timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        gameActive = false;
        document.getElementById('tapBtn').disabled = true;
        document.getElementById('result').textContent = `Game Over! You tapped ${score} times!`;
        GameStorage.recordPlay(GAME_ID, score, 'play', 10);
    }
}, 1000);
