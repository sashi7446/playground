const GAME_ID = '025';
let currentCard;
let nextCard;
let streak = 0;
let isProcessing = false;

function newRound() {
    currentCard = Math.floor(Math.random() * 13) + 1;
    nextCard = Math.floor(Math.random() * 13) + 1;
    document.getElementById('cardValue').textContent = currentCard;
    document.getElementById('result').textContent = '';
}

function guess(direction) {
    if (isProcessing) return;
    isProcessing = true;

    const correct = (direction === 'higher' && nextCard > currentCard) ||
                   (direction === 'lower' && nextCard < currentCard);

    setTimeout(() => {
        document.getElementById('cardValue').textContent = nextCard;

        if (correct) {
            streak++;
            document.getElementById('result').textContent = '✓ Correct!';
            document.getElementById('streak').textContent = streak;
            GameStorage.recordPlay(GAME_ID, streak, 'win', 3);
            setTimeout(newRound, 1500);
        } else {
            document.getElementById('result').textContent = `✗ Wrong! Streak: ${streak}`;
            GameStorage.recordPlay(GAME_ID, streak, 'loss', 3);
            streak = 0;
            document.getElementById('streak').textContent = streak;
            setTimeout(newRound, 1500);
        }
        isProcessing = false;
    }, 800);
}

newRound();
