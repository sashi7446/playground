const GAME_ID = '095';
const gameArea = document.getElementById('gameArea');
const movingBlock = document.getElementById('movingBlock');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const blocksDisplay = document.getElementById('blocks');

let gameActive = false;
let score = 0;
let blocksPlaced = 0;
let blockX = 0;
let direction = 2;
let stackHeight = 470;
let animationFrame;

function startGame() {
    gameActive = true;
    score = 0;
    blocksPlaced = 0;
    stackHeight = 470;
    scoreDisplay.textContent = score;
    blocksDisplay.textContent = blocksPlaced;
    startBtn.style.display = 'none';
    document.querySelectorAll('.dropped').forEach(b => b.remove());

    movingBlock.style.display = 'block';
    moveBlock();
}

function moveBlock() {
    if (!gameActive) return;

    blockX += direction;

    if (blockX <= 0 || blockX >= 240) {
        direction *= -1;
    }

    movingBlock.style.left = blockX + 'px';
    animationFrame = requestAnimationFrame(moveBlock);
}

function dropBlock() {
    if (!gameActive) return;

    cancelAnimationFrame(animationFrame);

    const dropped = document.createElement('div');
    dropped.className = 'dropped';
    dropped.style.left = blockX + 'px';
    dropped.style.top = stackHeight + 'px';
    gameArea.appendChild(dropped);

    blocksPlaced++;
    blocksDisplay.textContent = blocksPlaced;
    score += 10;
    scoreDisplay.textContent = score;

    stackHeight -= 30;

    if (blocksPlaced >= 10) {
        endGame(true);
        return;
    }

    if (stackHeight < 0) {
        endGame(false);
        return;
    }

    blockX = 0;
    direction = 2;
    moveBlock();
}

function endGame(won) {
    gameActive = false;
    cancelAnimationFrame(animationFrame);
    movingBlock.style.display = 'none';

    GameStorage.recordPlay(GAME_ID, score, won ? 'win' : 'loss', 1);

    setTimeout(() => {
        alert(`${won ? 'Success!' : 'Game Over!'}\nBlocks: ${blocksPlaced}/10\nScore: ${score}`);
        startBtn.style.display = 'block';
    }, 100);
}

gameArea.onclick = dropBlock;
startBtn.onclick = startGame;
