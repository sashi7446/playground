const GAME_ID = '031';
const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
const hexColors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFA07A', '#DDA0DD', '#FFB347'];
let score = 0;
let correctColor;
let isAnswered = false;

function newRound() {
    isAnswered = false;
    correctColor = Math.floor(Math.random() * colors.length);
    document.getElementById('colorName').textContent = colors[correctColor];
    document.getElementById('result').textContent = '';

    const colorIndices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5).slice(0, 4);
    const buttons = document.querySelectorAll('.color-btn');
    buttons.forEach((btn, index) => {
        btn.style.background = hexColors[colorIndices[index]];
        btn.disabled = false;
        btn.textContent = colors[colorIndices[index]];
        btn.onclick = () => guess(colorIndices[index]);
    });
}

function guess(colorIndex) {
    if (isAnswered) return;
    isAnswered = true;

    document.querySelectorAll('.color-btn').forEach(btn => btn.disabled = true);

    if (colorIndex === correctColor) {
        score++;
        document.getElementById('result').textContent = '✓ Correct!';
        document.getElementById('score').textContent = score;
        GameStorage.recordPlay(GAME_ID, score, 'win', 3);
    } else {
        document.getElementById('result').textContent = `✗ Wrong! Correct: ${colors[correctColor]}`;
        GameStorage.recordPlay(GAME_ID, score, 'loss', 3);
    }

    setTimeout(newRound, 1500);
}

newRound();
