// ゲーム一覧の定義
const GAMES_LIST = [
    {
        id: '001-2048',
        number: 1,
        name: '2048',
        emoji: '🎮',
        description: 'タイルを合わせて2048を目指そう',
        path: 'games/001-2048/',
        status: 'available'
    },
    // ゲーム002: Solitaire (Coming Soon)
    {
        id: '002-solitaire',
        number: 2,
        name: 'Solitaire',
        emoji: '🎴',
        description: 'Coming Soon',
        path: null,
        status: 'coming-soon'
    },
    // ゲーム003: Slide Puzzle
    {
        id: '003-slide-puzzle',
        number: 3,
        name: 'Slide Puzzle',
        emoji: '🧩',
        description: 'ピースをスライドさせてパズル完成',
        path: 'games/003-slide-puzzle/',
        status: 'available'
    },
    // ゲーム004-005: Coming Soon
    ...Array.from({ length: 2 }, (_, i) => ({
        id: `${String(i + 4).padStart(3, '0')}-game`,
        number: i + 4,
        name: `Game ${i + 4}`,
        emoji: '🎯',
        description: 'Coming Soon',
        path: null,
        status: 'coming-soon'
    })),
    // ゲーム006: Snake
    {
        id: '006-snake',
        number: 6,
        name: 'Snake',
        emoji: '🐍',
        description: 'クラシックなヘビゲーム',
        path: 'games/006-snake/',
        status: 'available'
    },
    // ゲーム007: Flappy Bird
    {
        id: '007-flappy-bird',
        number: 7,
        name: 'Flappy Bird',
        emoji: '🐦',
        description: '有名なカジュアルゲーム',
        path: 'games/007-flappy-bird/',
        status: 'available'
    },
    // ゲーム008-010: Coming Soon
    ...Array.from({ length: 3 }, (_, i) => ({
        id: `${String(i + 8).padStart(3, '0')}-game`,
        number: i + 8,
        name: `Game ${i + 8}`,
        emoji: '🎯',
        description: 'Coming Soon',
        path: null,
        status: 'coming-soon'
    })),
    // ゲーム011: Card Games
    {
        id: '011-card-games',
        number: 11,
        name: 'Black Jack',
        emoji: '♠️',
        description: 'カードゲーム - 21に近づけろ！',
        path: 'games/011-card-games/',
        status: 'available'
    },
    // ゲーム012-013: Coming Soon
    ...Array.from({ length: 2 }, (_, i) => ({
        id: `${String(i + 12).padStart(3, '0')}-game`,
        number: i + 12,
        name: `Game ${i + 12}`,
        emoji: '🎯',
        description: 'Coming Soon',
        path: null,
        status: 'coming-soon'
    })),
    // ゲーム014: Block Breaker
    {
        id: '014-block-breaker',
        number: 14,
        name: 'Block Breaker',
        emoji: '🧱',
        description: 'ブロック崩し - ブロックを全破壊',
        path: 'games/014-block-breaker/',
        status: 'available'
    },
    // ゲーム015: Matching Game
    {
        id: '015-matching-game',
        number: 15,
        name: 'Matching Game',
        emoji: '🎴',
        description: 'ペアを見つけよう！',
        path: 'games/015-matching-game/',
        status: 'available'
    },
    // ゲーム016: Bubble Shooter
    {
        id: '016-bubble-shooter',
        number: 16,
        name: 'Bubble Shooter',
        emoji: '🫧',
        description: 'バブルを撃って消す',
        path: 'games/016-bubble-shooter/',
        status: 'available'
    },
    // ゲーム17～100は Coming Soon
    ...Array.from({ length: 84 }, (_, i) => ({
        id: `${String(i + 17).padStart(3, '0')}-game`,
        number: i + 17,
        name: `Game ${i + 17}`,
        emoji: '🎯',
        description: 'Coming Soon',
        path: null,
        status: 'coming-soon'
    }))
];

// ランチャーの初期化
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
});

/**
 * ゲーム一覧をレンダリング
 */
function renderGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';

    GAMES_LIST.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

/**
 * ゲームカードを作成
 * @param {object} game - ゲーム情報
 * @returns {HTMLElement} ゲームカード要素
 */
function createGameCard(game) {
    const card = document.createElement('a');
    card.className = `game-card ${game.status === 'coming-soon' ? 'disabled' : ''}`;
    card.href = game.status === 'available' ? `${game.path}index.html` : '#';
    card.target = game.status === 'available' ? '_self' : '';

    const statusText = game.status === 'coming-soon' ? 'Coming Soon' : 'Play';
    const statusClass = game.status === 'coming-soon' ? 'coming-soon' : '';

    card.innerHTML = `
        <div class="game-card-number">#${String(game.number).padStart(3, '0')}</div>
        <div class="game-card-emoji">${game.emoji}</div>
        <div class="game-card-name">${game.name}</div>
        <div class="game-card-description">${game.description}</div>
        <div class="game-card-status ${statusClass}">${statusText}</div>
    `;

    return card;
}

/**
 * ゲームを追加（開発用）
 * @param {object} gameData - ゲーム情報
 */
function addGame(gameData) {
    const defaultData = {
        id: null,
        number: GAMES_LIST.length + 1,
        name: 'New Game',
        emoji: '🎮',
        description: 'A new game',
        path: null,
        status: 'coming-soon'
    };

    const game = { ...defaultData, ...gameData };
    GAMES_LIST.push(game);
    renderGames();
}

/**
 * ゲームを更新
 * @param {string} gameId - ゲームID
 * @param {object} updates - 更新内容
 */
function updateGame(gameId, updates) {
    const game = GAMES_LIST.find(g => g.id === gameId);
    if (game) {
        Object.assign(game, updates);
        renderGames();
    }
}
