const GAME_ID = '042';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');

canvas.width = 300;
canvas.height = 300;

let level = 1;
let score = 0;
let gameActive = false;
let shapes = [];
let drawnShapes = [];
let memoryPhase = true;

const shapes_options = [
    { type: 'circle', x: 75, y: 75, r: 40 },
    { type: 'square', x: 150, y: 75, w: 80, h: 80 },
    { type: 'triangle', x: 225, y: 75, size: 40 },
    { type: 'circle', x: 75, y: 225, r: 40 },
    { type: 'square', x: 150, y: 225, w: 80, h: 80 }
];

function startLevel() {
    gameActive = true;
    memoryPhase = true;
    startBtn.disabled = true;

    shapes = [];
    drawnShapes = [];

    // Select shapes for this level
    for (let i = 0; i < Math.min(level + 1, shapes_options.length); i++) {
        shapes.push(shapes_options[i]);
    }

    // Show shapes for 2 seconds
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(drawShape);

    setTimeout(() => {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Draw the shapes you saw', canvas.width / 2, canvas.height / 2);
        memoryPhase = false;
    }, 2000);
}

function drawShape(shape) {
    ctx.fillStyle = '#f5576c';
    ctx.strokeStyle = '#f5576c';
    ctx.lineWidth = 2;

    if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
        ctx.fill();
    } else if (shape.type === 'square') {
        ctx.fillRect(shape.x - shape.w / 2, shape.y - shape.h / 2, shape.w, shape.h);
    } else if (shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y - shape.size);
        ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
        ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
        ctx.closePath();
        ctx.fill();
    }
}

canvas.addEventListener('click', (e) => {
    if (!gameActive || memoryPhase) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is near a shape
    let found = false;
    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        let distance = 0;

        if (shape.type === 'circle') {
            distance = Math.hypot(x - shape.x, y - shape.y);
            if (distance < shape.r) {
                found = true;
                break;
            }
        }
    }

    if (found) {
        score++;
        scoreDisplay.textContent = score;

        if (score % 3 === 0) {
            level++;
            levelDisplay.textContent = level;
            GameStorage.recordPlay(GAME_ID, level, 'win', 1);
            gameActive = false;
            startBtn.disabled = false;
        }
    }
});

startBtn.addEventListener('click', startLevel);
