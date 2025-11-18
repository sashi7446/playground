const GAME_ID = '030';
let score = 0;
let currentNumber;
let timeLeft = 3;
let gameState = 'showing'; // showing, remembering, input

function startRound() {
    currentNumber = Math.floor(Math.random() * 1000000);
    document.getElementById('number').textContent = currentNumber;
    document.getElementById('result').textContent = '';
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    gameState = 'showing';

    setTimeout(() => {
        document.getElementById('number').textContent = '?';
        gameState = 'remembering';
        timeLeft = 3;
        startTimer();
    }, 2000);
}

function startTimer() {
    timeLeft = 3;
    document.getElementById('timeLeft').textContent = timeLeft;

    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('number').textContent = '';
            document.getElementById('answerInput').disabled = false;
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('answerInput').focus();
            gameState = 'input';
        }
    }, 1000);
}

function submitAnswer() {
    const answer = document.getElementById('answerInput').value;

    if (answer == currentNumber) {
        score++;
        document.getElementById('result').textContent = '✓ Correct!';
        document.getElementById('score').textContent = score;
        GameStorage.recordPlay(GAME_ID, score, 'win', 5);
    } else {
        document.getElementById('result').textContent = `✗ Wrong! Answer was ${currentNumber}`;
        GameStorage.recordPlay(GAME_ID, score, 'loss', 5);
    }

    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;

    setTimeout(startRound, 2000);
}

startRound();
