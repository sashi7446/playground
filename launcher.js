// ゲーム一覧の定義
const GAMES_LIST = [
    {
        id: '001-2048',
        number: 1,
        name: '2048',
        emoji: '🎮',
        description: 'タイルを合わせて2048を目指そう',
        path: 'games/001-2048/',
        status: 'available',
        difficulty: 'normal',
        genre: 'puzzle'
    },
    // ゲーム002: Solitaire
    {
        id: '002-solitaire',
        number: 2,
        name: 'Solitaire',
        emoji: '🎴',
        description: 'カードゲーム - 組札に全カード移す',
        path: 'games/002-solitaire/',
        status: 'available',
        difficulty: 'hard',
        genre: 'puzzle'
    },
    // ゲーム003: Slide Puzzle
    {
        id: '003-slide-puzzle',
        number: 3,
        name: 'Slide Puzzle',
        emoji: '🧩',
        description: 'ピースをスライドさせてパズル完成',
        path: 'games/003-slide-puzzle/',
        status: 'available',
        difficulty: 'easy',
        genre: 'puzzle'
    },
    // ゲーム004: Sudoku
    {
        id: '004-sudoku',
        number: 4,
        name: 'Sudoku',
        emoji: '🔢',
        description: '数字パズル - 数独',
        path: 'games/004-sudoku/',
        status: 'available',
        difficulty: 'hard',
        genre: 'puzzle'
    },
    // ゲーム005: Shooting Game
    {
        id: '005-shooting-game',
        number: 5,
        name: 'Shooting Game',
        emoji: '🎯',
        description: 'シューティング - 敵を撃ち落とす',
        path: 'games/005-shooting-game/',
        status: 'available',
        difficulty: 'normal',
        genre: 'action'
    },
    // ゲーム006: Snake
    {
        id: '006-snake',
        number: 6,
        name: 'Snake',
        emoji: '🐍',
        description: 'クラシックなヘビゲーム',
        path: 'games/006-snake/',
        status: 'available',
        difficulty: 'easy',
        genre: 'action'
    },
    // ゲーム007: Flappy Bird
    {
        id: '007-flappy-bird',
        number: 7,
        name: 'Flappy Bird',
        emoji: '🐦',
        description: '有名なカジュアルゲーム',
        path: 'games/007-flappy-bird/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム008: Chess
    {
        id: '008-chess',
        number: 8,
        name: 'Chess',
        emoji: '♟️',
        description: 'チェス - AIと対戦',
        path: 'games/008-chess/',
        status: 'available',
        difficulty: 'hard',
        genre: 'strategy'
    },
    // ゲーム009: Shogi
    {
        id: '009-shogi',
        number: 9,
        name: 'Shogi',
        emoji: '♞',
        description: '将棋 - 日本の戦略ゲーム',
        path: 'games/009-shogi/',
        status: 'available',
        difficulty: 'hard',
        genre: 'strategy'
    },
    // ゲーム010: Othello
    {
        id: '010-othello',
        number: 10,
        name: 'Othello',
        emoji: '⚫',
        description: '戦略ボードゲーム - AIと対戦',
        path: 'games/010-othello/',
        status: 'available',
        difficulty: 'hard',
        genre: 'strategy'
    },
    // ゲーム011: Card Games
    {
        id: '011-card-games',
        number: 11,
        name: 'Black Jack',
        emoji: '♠️',
        description: 'カードゲーム - 21に近づけろ！',
        path: 'games/011-card-games/',
        status: 'available',
        difficulty: 'normal',
        genre: 'casual'
    },
    // ゲーム012: Connect Four
    {
        id: '012-connect-four',
        number: 12,
        name: 'Connect Four',
        emoji: '🔵',
        description: '4目並べ - AIと対戦',
        path: 'games/012-connect-four/',
        status: 'available',
        difficulty: 'normal',
        genre: 'strategy'
    },
    // ゲーム013: Turn-based Battle
    {
        id: '013-turn-based-battle',
        number: 13,
        name: 'Turn-based Battle',
        emoji: '⚔️',
        description: 'RPG - ターン制バトル',
        path: 'games/013-turn-based-battle/',
        status: 'available',
        difficulty: 'normal',
        genre: 'rpg'
    },
    // ゲーム014: Block Breaker
    {
        id: '014-block-breaker',
        number: 14,
        name: 'Block Breaker',
        emoji: '🧱',
        description: 'ブロック崩し - ブロックを全破壊',
        path: 'games/014-block-breaker/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム015: Matching Game
    {
        id: '015-matching-game',
        number: 15,
        name: 'Matching Game',
        emoji: '🎴',
        description: 'ペアを見つけよう！',
        path: 'games/015-matching-game/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム016: Bubble Shooter
    {
        id: '016-bubble-shooter',
        number: 16,
        name: 'Bubble Shooter',
        emoji: '🫧',
        description: 'バブルを撃って消す',
        path: 'games/016-bubble-shooter/',
        status: 'available',
        difficulty: 'normal',
        genre: 'action'
    },
    // ゲーム017: Tic Tac Toe
    {
        id: '017-tic-tac-toe',
        number: 17,
        name: 'Tic Tac Toe',
        emoji: '⭕',
        description: '三目並べ - 完全AI',
        path: 'games/017-tic-tac-toe/',
        status: 'available',
        difficulty: 'hard',
        genre: 'strategy'
    },
    // ゲーム018: Pong
    {
        id: '018-pong',
        number: 18,
        name: 'Pong',
        emoji: '🏓',
        description: 'ポン - レトロアーケード',
        path: 'games/018-pong/',
        status: 'available',
        difficulty: 'normal',
        genre: 'action'
    },
    // ゲーム019: Pong Volley
    {
        id: '019-pong-volley',
        number: 19,
        name: 'Pong Volley',
        emoji: '🎾',
        description: 'ポンの応用 - インゾーンルール',
        path: 'games/019-pong-volley/',
        status: 'available',
        difficulty: 'hard',
        genre: 'action'
    },
    // ゲーム020: Rock Paper Scissors
    {
        id: '020-rock-paper-scissors',
        number: 20,
        name: 'Rock Paper Scissors',
        emoji: '✌️',
        description: 'じゃんけん - AIと対戦',
        path: 'games/020-rock-paper-scissors/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム021: Coin Flip
    {
        id: '021-coin-flip',
        number: 21,
        name: 'Coin Flip',
        emoji: '🪙',
        description: 'コイン投げ - 表か裏か予想',
        path: 'games/021-coin-flip/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム22～100は Coming Soon
    ...Array.from({ length: 79 }, (_, i) => ({
        id: `${String(i + 22).padStart(3, '0')}-game`,
        number: i + 22,
        name: `Game ${i + 22}`,
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
