const GAME_ID = '022';
let score = 0;
let rolls = [];

const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function rollDice() {
    const dice = document.getElementById('dice');
    const result = document.getElementById('result');

    // Animation
    dice.style.animation = 'none';
    setTimeout(() => {
        dice.style.animation = 'spin 0.5s ease-in-out';
    }, 10);

    let count = 0;
    const interval = setInterval(() => {
        dice.textContent = diceEmojis[Math.floor(Math.random() * 6)];
        count++;
        if (count > 10) {
            clearInterval(interval);

            const num = Math.floor(Math.random() * 6) + 1;
            dice.textContent = diceEmojis[num - 1];
            score += num;

            result.textContent = `You rolled ${num}! Total: ${score}`;
            rolls.push(num);
            updateHistory();

            GameStorage.recordPlay(GAME_ID, score, 'play', 5);
        }
    }, 50);
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.textContent = rolls.slice(-10).join(' ');
    document.getElementById('score').textContent = score;
}

function resetGame() {
    score = 0;
    rolls = [];
    document.getElementById('dice').textContent = '🎲';
    document.getElementById('result').textContent = '';
    updateHistory();
}

// CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotateZ(0deg); }
        100% { transform: rotateZ(360deg); }
    }
    #dice {
        display: inline-block;
        font-size: 4em;
        margin: 20px;
    }
`;
document.head.appendChild(style);
