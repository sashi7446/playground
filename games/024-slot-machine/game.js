const GAME_ID = '024';
const symbols = ['🍎', '🍊', '🍋', '⭐', '💎', '🎯'];
let balance = 100;
let isSpinning = false;

function spin() {
    if (isSpinning || balance < 10) return;

    isSpinning = true;
    balance -= 10;

    const slots = [
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3')
    ];

    // Spin animation
    let spins = 0;
    const interval = setInterval(() => {
        slots.forEach(slot => {
            slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            slot.style.transform = 'rotateY(360deg)';
        });
        spins++;
        if (spins > 15) {
            clearInterval(interval);

            // Final result
            const results = [
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)]
            ];

            slots[0].textContent = results[0];
            slots[1].textContent = results[1];
            slots[2].textContent = results[2];

            // Check win
            if (results[0] === results[1] && results[1] === results[2]) {
                balance += 100;
                document.getElementById('result').textContent = '🎉 JACKPOT!';
                GameStorage.recordPlay(GAME_ID, 100, 'win', 5);
            } else if (results[0] === results[1] || results[1] === results[2]) {
                balance += 30;
                document.getElementById('result').textContent = '✓ Match!';
                GameStorage.recordPlay(GAME_ID, 30, 'win', 5);
            } else {
                document.getElementById('result').textContent = '✗ No match';
                GameStorage.recordPlay(GAME_ID, 0, 'loss', 5);
            }

            updateDisplay();
            isSpinning = false;
        }
    }, 50);

    document.getElementById('result').textContent = 'Spinning...';
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('balance').textContent = balance;
    document.getElementById('spinBtn').disabled = balance < 10;
}

updateDisplay();
