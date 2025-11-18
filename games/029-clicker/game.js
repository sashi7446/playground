const GAME_ID = '029';
let score = 0;
let workers = 0;
let factories = 0;
let perSecond = 0;

function click() {
    score++;
    document.getElementById('score').textContent = score;
    GameStorage.recordPlay(GAME_ID, score, 'play', 1);
}

function buyUpgrade(type) {
    if (type === 1) {
        if (score >= 10) {
            score -= 10;
            workers++;
            perSecond += 0.1;
            document.getElementById('w1').textContent = workers;
            updateDisplay();
        }
    } else if (type === 10) {
        if (score >= 100) {
            score -= 100;
            factories++;
            perSecond += 1;
            document.getElementById('w10').textContent = factories;
            updateDisplay();
        }
    }
}

function updateDisplay() {
    document.getElementById('score').textContent = Math.floor(score);
    document.getElementById('perSecond').textContent = perSecond.toFixed(1);
    document.querySelector('.upgrade-btn:nth-child(2)').disabled = score < 10;
    document.querySelector('.upgrade-btn:nth-child(3)').disabled = score < 100;
}

// Auto-increment
setInterval(() => {
    score += perSecond / 10;
    document.getElementById('score').textContent = Math.floor(score);
}, 100);

// Check upgrade buttons
setInterval(updateDisplay, 100);

updateDisplay();
