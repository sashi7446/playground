const GAME_ID = '021';
let score = 0;
let isFlipping = false;

function guessResult(guess) {
    if (isFlipping) return;

    isFlipping = true;
    const coin = document.getElementById('coin');
    const result = document.getElementById('result');

    // Flip animation
    coin.style.animation = 'none';
    setTimeout(() => {
        coin.style.animation = 'flip 1s ease-in-out';
    }, 10);

    // Random result
    const flip = Math.random() > 0.5 ? 'heads' : 'tails';

    setTimeout(() => {
        coin.textContent = flip === 'heads' ? '👤' : '🦅';

        if (guess === flip) {
            score++;
            result.textContent = '✓ Correct!';
            result.style.color = '#4CAF50';
        } else {
            result.textContent = '✗ Wrong!';
            result.style.color = '#f44336';
        }

        document.getElementById('score').textContent = score;
        GameStorage.recordPlay(GAME_ID, score, guess === flip ? 'win' : 'loss', 5);

        setTimeout(() => {
            isFlipping = false;
            coin.textContent = '🪙';
            result.textContent = '';
        }, 1500);
    }, 1000);
}
