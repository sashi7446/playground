const GAME_ID = '096';
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameActive = true;

// Initialize game
gameArea.innerHTML = '<button class="game-btn" onclick="playGame()">Start Game</button>';

function playGame() {
    if (!gameActive) return;
    score++;
    scoreDisplay.textContent = score;
    GameStorage.recordPlay(GAME_ID, score, 'play', 1);
    gameArea.innerHTML = score > 5 ? '🎉 Great!' : '👍 Good!';
    setTimeout(() => {
        gameArea.innerHTML = '<button class="game-btn" onclick="playGame()">Next</button>';
    }, 1000);
}
