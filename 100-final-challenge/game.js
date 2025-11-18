const GAME_ID = '100';
const challengeTitle = document.getElementById('challengeTitle');
const challengeArea = document.getElementById('challengeArea');
const startBtn = document.getElementById('startBtn');
const challengeDisplay = document.getElementById('challenge');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let currentChallenge = 0;
let score = 0;
let challengeData = {};

const challenges = [
    { name: 'Speed Click', task: 'Click 20 times!', type: 'click' },
    { name: 'Number Chain', task: 'Click 1-10 in order', type: 'numbers' },
    { name: 'Memory', task: 'Remember 3 colors', type: 'memory' },
    { name: 'Reaction', task: 'Click when green', type: 'reaction' },
    { name: 'Final Sprint', task: 'Click 30 times fast!', type: 'sprint' }
];

function startGame() {
    gameActive = true;
    currentChallenge = 0;
    score = 0;
    scoreDisplay.textContent = score;
    startBtn.style.display = 'none';

    nextChallenge();
}

function nextChallenge() {
    if (currentChallenge >= 5) {
        endGame(true);
        return;
    }

    const challenge = challenges[currentChallenge];
    currentChallenge++;
    challengeDisplay.textContent = currentChallenge;

    challengeTitle.textContent = challenge.name;
    challengeArea.innerHTML = '';

    switch (challenge.type) {
        case 'click':
            startClickChallenge(20);
            break;
        case 'numbers':
            startNumbersChallenge();
            break;
        case 'memory':
            startMemoryChallenge();
            break;
        case 'reaction':
            startReactionChallenge();
            break;
        case 'sprint':
            startClickChallenge(30);
            break;
    }
}

function startClickChallenge(target) {
    challengeData.clicks = 0;
    challengeData.target = target;

    const btn = document.createElement('button');
    btn.className = 'challenge-btn';
    btn.textContent = `0/${target}`;
    btn.onclick = () => {
        challengeData.clicks++;
        btn.textContent = `${challengeData.clicks}/${target}`;
        if (challengeData.clicks >= target) {
            score += 100;
            scoreDisplay.textContent = score;
            setTimeout(nextChallenge, 500);
        }
    };
    challengeArea.appendChild(btn);
}

function startNumbersChallenge() {
    challengeData.current = 1;
    const grid = document.createElement('div');
    grid.className = 'number-grid';

    const numbers = Array.from({length: 10}, (_, i) => i + 1).sort(() => Math.random() - 0.5);

    numbers.forEach(num => {
        const cell = document.createElement('div');
        cell.className = 'number-cell';
        cell.textContent = num;
        cell.onclick = () => {
            if (num === challengeData.current) {
                cell.classList.add('correct');
                challengeData.current++;
                if (challengeData.current > 10) {
                    score += 100;
                    scoreDisplay.textContent = score;
                    setTimeout(nextChallenge, 500);
                }
            }
        };
        grid.appendChild(cell);
    });

    challengeArea.appendChild(grid);
}

function startMemoryChallenge() {
    const colors = ['🔴', '🔵', '🟢'];
    const sequence = [];
    for (let i = 0; i < 3; i++) {
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }

    const display = document.createElement('div');
    display.style.fontSize = '60px';
    display.textContent = sequence.join(' ');
    challengeArea.appendChild(display);

    setTimeout(() => {
        display.textContent = '???';
        challengeData.sequence = sequence;
        challengeData.input = [];

        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'challenge-btn';
            btn.textContent = color;
            btn.onclick = () => {
                challengeData.input.push(color);
                if (challengeData.input.length === 3) {
                    if (JSON.stringify(challengeData.input) === JSON.stringify(challengeData.sequence)) {
                        score += 100;
                        scoreDisplay.textContent = score;
                    }
                    setTimeout(nextChallenge, 500);
                }
            };
            challengeArea.appendChild(btn);
        });
    }, 2000);
}

function startReactionChallenge() {
    const box = document.createElement('div');
    box.className = 'challenge-btn';
    box.textContent = 'Wait...';
    box.style.background = '#ff4444';
    box.style.cursor = 'default';

    const delay = Math.random() * 2000 + 1000;

    setTimeout(() => {
        box.textContent = 'CLICK NOW!';
        box.style.background = '#4caf50';
        box.style.cursor = 'pointer';
        const start = Date.now();

        box.onclick = () => {
            const time = Date.now() - start;
            score += Math.max(50, 150 - time / 10);
            scoreDisplay.textContent = Math.floor(score);
            setTimeout(nextChallenge, 500);
        };
    }, delay);

    challengeArea.appendChild(box);
}

function endGame(won) {
    gameActive = false;

    GameStorage.recordPlay(GAME_ID, Math.floor(score), won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`🎉 FINAL CHALLENGE COMPLETE! 🎉\n\nTotal Score: ${Math.floor(score)}\n\nCongratulations on completing\nall 100 games!`);
        startBtn.style.display = 'block';
    }, 100);
}

startBtn.onclick = startGame;
