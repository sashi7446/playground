const GAME_ID = '027';
const prizes = [50, 100, 25, 75, 200, 150];
let total = 0;
let isSpinning = false;

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;

    const wheel = document.getElementById('wheel');
    const spins = Math.random() * 360 + 1440;
    wheel.style.transition = 'transform 2s ease-out';
    wheel.style.transform = `rotate(${spins}deg)`;

    setTimeout(() => {
        const index = Math.floor((spins % 360) / 60);
        const prize = prizes[index];
        total += prize;

        document.getElementById('prizeDisplay').textContent = `🎉 Won ${prize}! Total: ${total}`;
        document.getElementById('total').textContent = total;

        GameStorage.recordPlay(GAME_ID, total, 'play', 5);

        wheel.style.transition = 'none';
        isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
    }, 2000);
}
