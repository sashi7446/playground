const GAME_ID = '037';
const words = ['CAT', 'DOG', 'BIRD', 'FISH', 'TREE', 'CLOUD', 'MOON', 'STAR', 'APPLE', 'BOOK'];
const wordDisplay = document.getElementById('wordDisplay');
const choiceButtons = document.querySelectorAll('.choice-btn');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');

let score = 0;
let streak = 0;
let currentWord = '';
let isAnswered = false;

function newRound() {
    isAnswered = false;
    currentWord = words[Math.floor(Math.random() * words.length)];

    // Show word for 2 seconds
    wordDisplay.textContent = currentWord;
    choiceButtons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        // Hide word and show choices
        wordDisplay.textContent = '?';
        const choices = generateChoices(currentWord);
        choiceButtons.forEach((btn, index) => {
            btn.textContent = choices[index];
            btn.disabled = false;
            btn.className = 'choice-btn';
            btn.onclick = () => guess(choices[index] === currentWord);
        });
    }, 2000);
}

function generateChoices(correctWord) {
    const choices = [correctWord];
    while (choices.length < 4) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (!choices.includes(randomWord)) {
            choices.push(randomWord);
        }
    }
    return choices.sort(() => Math.random() - 0.5);
}

function guess(isCorrect) {
    if (isAnswered) return;
    isAnswered = true;

    choiceButtons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        score++;
        streak++;
        scoreDisplay.textContent = score;
        streakDisplay.textContent = streak;
        GameStorage.recordPlay(GAME_ID, score, 'win', 1);
        choiceButtons.forEach(btn => {
            if (btn.textContent === currentWord) {
                btn.className = 'choice-btn correct';
            }
        });
    } else {
        streak = 0;
        streakDisplay.textContent = streak;
        GameStorage.recordPlay(GAME_ID, score, 'loss', 1);
        choiceButtons.forEach(btn => {
            if (btn.textContent === currentWord) {
                btn.className = 'choice-btn correct';
            } else if (btn.className === 'choice-btn') {
                btn.className = 'choice-btn wrong';
            }
        });
    }

    setTimeout(newRound, 1500);
}

newRound();
