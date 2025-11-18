const GAME_ID = '020';
let scores = { player: 0, ai: 0 };

function playGame(playerMove) {
    // AI random choice
    const choices = ['rock', 'paper', 'scissors'];
    const aiMove = choices[Math.floor(Math.random() * 3)];

    // Display choices
    document.getElementById('playerChoice').textContent = getEmoji(playerMove);
    document.getElementById('aiChoice').textContent = getEmoji(aiMove);

    // Determine winner
    const result = determineWinner(playerMove, aiMove);

    // Update scores
    if (result === 'player') {
        scores.player++;
        document.getElementById('gameStatus').textContent = '🎉 You Win!';
    } else if (result === 'ai') {
        scores.ai++;
        document.getElementById('gameStatus').textContent = '😔 AI Wins!';
    } else {
        document.getElementById('gameStatus').textContent = '🤝 Draw!';
    }

    // Update display
    updateScoreDisplay();

    // Record play
    const duration = 10;
    GameStorage.recordPlay(GAME_ID, scores.player, result === 'player' ? 'win' : 'loss', duration);
}

function determineWinner(player, ai) {
    if (player === ai) return 'draw';

    if (player === 'rock' && ai === 'scissors') return 'player';
    if (player === 'paper' && ai === 'rock') return 'player';
    if (player === 'scissors' && ai === 'paper') return 'player';

    return 'ai';
}

function getEmoji(move) {
    const emojis = {
        'rock': '✊',
        'paper': '✋',
        'scissors': '✌️'
    };
    return emojis[move] || '-';
}

function updateScoreDisplay() {
    document.getElementById('playerScore').textContent = scores.player;
    document.getElementById('aiScore').textContent = scores.ai;
}

function resetGame() {
    scores = { player: 0, ai: 0 };
    document.getElementById('playerChoice').textContent = '-';
    document.getElementById('aiChoice').textContent = '-';
    document.getElementById('gameStatus').textContent = 'Choose your move!';
    updateScoreDisplay();
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    updateScoreDisplay();
});
