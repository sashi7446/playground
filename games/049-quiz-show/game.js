const GAME_ID = '049';
const scoreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById('question');
const optionBtns = document.querySelectorAll('.option-btn');

const quizzes = [
    { q: 'What is 5 + 5?', a: '10', w: ['8', '12', '15'] },
    { q: 'What is the capital of France?', a: 'Paris', w: ['London', 'Berlin', 'Madrid'] },
    { q: 'What is 10 - 3?', a: '7', w: ['5', '9', '13'] },
    { q: 'What color is the sky?', a: 'Blue', w: ['Red', 'Green', 'Yellow'] },
    { q: 'What is 2 * 6?', a: '12', w: ['10', '14', '8'] }
];

let score = 0;
let isAnswered = false;
let currentQuiz;

function nextQuestion() {
    isAnswered = false;
    currentQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    questionDisplay.textContent = currentQuiz.q;

    const choices = [currentQuiz.a, ...currentQuiz.w].sort(() => Math.random() - 0.5);
    optionBtns.forEach((btn, i) => {
        btn.textContent = choices[i];
        btn.disabled = false;
        btn.className = 'option-btn';
        btn.onclick = () => selectAnswer(choices[i] === currentQuiz.a);
    });
}

function selectAnswer(isCorrect) {
    if (isAnswered) return;
    isAnswered = true;
    optionBtns.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        score++;
        scoreDisplay.textContent = score;
        GameStorage.recordPlay(GAME_ID, score, 'win', 1);
        optionBtns.forEach(btn => {
            if (btn.textContent === currentQuiz.a) btn.className = 'option-btn correct';
        });
    } else {
        optionBtns.forEach(btn => {
            if (btn.textContent === currentQuiz.a) btn.className = 'option-btn correct';
            else if (btn.className === 'option-btn') btn.className = 'option-btn wrong';
        });
    }

    setTimeout(nextQuestion, 1500);
}

nextQuestion();
