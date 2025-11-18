const GAME_ID = '050';
const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');

const patterns = [
    { cells: [0, 4, 8], desc: 'Diagonal' },
    { cells: [0, 1, 2], desc: 'Top row' },
    { cells: [3, 4, 5], desc: 'Middle row' },
    { cells: [1, 4, 7], desc: 'Middle column' },
    { cells: [2, 5, 8], desc: 'Right column' }
];

let score = 0;
let currentPattern;
let isAnswered = false;

function generatePattern() {
    isAnswered = false;
    grid.innerHTML = '';
    currentPattern = patterns[Math.floor(Math.random() * patterns.length)];

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        const isPartOfPattern = currentPattern.cells.includes(i);
        cell.textContent = isPartOfPattern ? '●' : '○';
        cell.onclick = () => selectCell(i, isPartOfPattern);
        grid.appendChild(cell);
    }
}

function selectCell(index, isCorrect) {
    if (isAnswered) return;
    isAnswered = true;

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        cell.disabled = true;
        if (currentPattern.cells.includes(i)) {
            cell.className = 'cell correct';
        }
    });

    if (isCorrect) {
        score++;
        scoreDisplay.textContent = score;
        GameStorage.recordPlay(GAME_ID, score, 'win', 1);
    }

    setTimeout(generatePattern, 1500);
}

generatePattern();
