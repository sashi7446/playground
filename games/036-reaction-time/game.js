const GAME_ID = '036';
const reactionBox = document.getElementById('reactionBox');
const startBtn = document.getElementById('startBtn');
const averageDisplay = document.getElementById('average');
const bestDisplay = document.getElementById('best');

let reactions = [];
let bestTime = Infinity;
let gameStarted = false;
let reactionStarted = false;
let reactionStart = 0;

startBtn.addEventListener('click', startTest);
reactionBox.addEventListener('click', handleClick);

function startTest() {
    if (gameStarted) return;

    gameStarted = true;
    startBtn.disabled = true;
    reactionBox.className = 'reaction-box waiting';
    reactionBox.textContent = 'Wait...';

    const delay = Math.random() * 3000 + 1000; // 1-4 seconds

    setTimeout(() => {
        reactionBox.className = 'reaction-box go';
        reactionBox.textContent = 'GO!';
        reactionStart = Date.now();
        reactionStarted = true;
    }, delay);

    // Timeout after 10 seconds
    setTimeout(() => {
        if (gameStarted && reactionStarted) {
            endTest(null);
        }
    }, delay + 10000);
}

function handleClick() {
    if (!gameStarted) return;

    if (!reactionStarted) {
        // Clicked too early
        reactionBox.className = 'reaction-box clicked';
        reactionBox.textContent = 'Too early!';
        endTest(null);
    } else {
        // Valid reaction
        const reactionTime = Date.now() - reactionStart;
        reactions.push(reactionTime);

        if (reactionTime < bestTime) {
            bestTime = reactionTime;
            bestDisplay.textContent = bestTime;
        }

        const average = Math.round(reactions.reduce((a, b) => a + b) / reactions.length);
        averageDisplay.textContent = average;

        reactionBox.className = 'reaction-box clicked';
        reactionBox.textContent = reactionTime + 'ms';

        GameStorage.recordPlay(GAME_ID, reactions.length, 'play', 1);

        endTest(reactionTime);
    }
}

function endTest(time) {
    gameStarted = false;
    reactionStarted = false;
    startBtn.disabled = false;

    if (time === null) {
        reactionBox.className = 'reaction-box';
        reactionBox.textContent = 'Ready?';
    }
}
