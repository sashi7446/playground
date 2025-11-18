const GAME_ID = '047';
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const totalDisplay = document.getElementById('total');
const spinsDisplay = document.getElementById('spins');

const prizes = [100, 200, 50, 500, 300, 150];
let total = 1000;
let spins = 0;
let spinning = false;

spinBtn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;

    const spinAmount = Math.random() * 360 + 1440;
    const prizeIndex = Math.floor((spinAmount % 360) / 60);
    const prize = prizes[prizeIndex];

    wheel.style.transform = `rotate(${spinAmount}deg)`;

    setTimeout(() => {
        total += prize;
        spins++;
        totalDisplay.textContent = '$' + total;
        spinsDisplay.textContent = spins;
        GameStorage.recordPlay(GAME_ID, total, 'play', 1);
        spinning = false;
        spinBtn.disabled = false;
    }, 2000);
});
