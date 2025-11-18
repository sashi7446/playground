const GAME_ID = '034';
const sequences = [
    { seq: [2, 4, 6, 8], next: 10 },
    { seq: [1, 1, 2, 3, 5], next: 8 },
    { seq: [10, 20, 30, 40], next: 50 },
    { seq: [1, 3, 5, 7, 9], next: 11 },
    { seq: [5, 10, 15, 20], next: 25 },
];

let score = 0;
let currentSeq;
let answered = false;

function newRound() {
    answered = false;
    currentSeq = sequences[Math.floor(Math.random() * sequences.length)];
    document.getElementById('sequence').textContent = currentSeq.seq.join(', ') + ', ?';
    document.getElementById('answerInput').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('answerInput').focus();
}

function checkAnswer() {
    if (answered) return;
    answered = true;

    const answer = parseInt(document.getElementById('answerInput').value);

    if (answer === currentSeq.next) {
        score++;
        document.getElementById('result').textContent = '✓ Correct!';
        document.getElementById('score').textContent = score;
        GameStorage.recordPlay(GAME_ID, score, 'win', 5);
    } else {
        document.getElementById('result').textContent = `✗ Wrong! Answer: ${currentSeq.next}`;
        GameStorage.recordPlay(GAME_ID, score, 'loss', 5);
    }

    setTimeout(newRound, 1500);
}

document.getElementById('answerInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

newRound();
