const GAME_ID = '028';
const quizzes = [
    { q: 'What is 5 + 3?', a: '8', w: ['10', '7', '9'] },
    { q: 'What is the capital of France?', a: 'Paris', w: ['London', 'Berlin', 'Madrid'] },
    { q: 'Which planet is closest to the Sun?', a: 'Mercury', w: ['Venus', 'Earth', 'Mars'] },
    { q: 'What is 12 × 3?', a: '36', w: ['35', '37', '40'] },
    { q: 'What color is the sky?', a: 'Blue', w: ['Red', 'Green', 'Yellow'] },
];

let score = 0;
let currentQuestion = 0;
let answered = false;

function loadQuestion() {
    const quiz = quizzes[currentQuestion];
    document.getElementById('question').textContent = quiz.q;
    document.getElementById('result').textContent = '';

    const answers = [quiz.a, ...quiz.w].sort(() => Math.random() - 0.5);
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = ans;
        btn.onclick = () => checkAnswer(ans, quiz.a, btn);
        answersDiv.appendChild(btn);
    });

    answered = false;
    document.getElementById('nextBtn').style.display = 'none';
}

function checkAnswer(selected, correct, btn) {
    if (answered) return;
    answered = true;

    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        score++;
        btn.classList.add('correct');
        document.getElementById('result').textContent = '✓ Correct!';
        GameStorage.recordPlay(GAME_ID, score, 'win', 5);
    } else {
        btn.classList.add('wrong');
        document.getElementById('result').textContent = `✗ Wrong! Answer: ${correct}`;
        GameStorage.recordPlay(GAME_ID, score, 'loss', 5);
    }

    document.getElementById('score').textContent = score;

    if (currentQuestion < quizzes.length - 1) {
        document.getElementById('nextBtn').style.display = 'block';
    } else {
        setTimeout(() => {
            alert(`Quiz Complete! Final Score: ${score}/${quizzes.length}`);
            currentQuestion = 0;
            score = 0;
            document.getElementById('score').textContent = score;
            loadQuestion();
        }, 1500);
    }
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

loadQuestion();
