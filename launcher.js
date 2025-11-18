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
    // ゲーム022: Dice Rolling
    {
        id: '022-dice-rolling',
        number: 22,
        name: 'Dice Rolling',
        emoji: '🎲',
        description: 'サイコロを振ってスコア獲得',
        path: 'games/022-dice-rolling/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム023: Number Guessing
    {
        id: '023-number-guessing',
        number: 23,
        name: 'Number Guessing',
        emoji: '🔢',
        description: '1-100の数字を当てる',
        path: 'games/023-number-guessing/',
        status: 'available',
        difficulty: 'easy',
        genre: 'puzzle'
    },
    // ゲーム024: Slot Machine
    {
        id: '024-slot-machine',
        number: 24,
        name: 'Slot Machine',
        emoji: '🎰',
        description: 'スロットマシン - 運試し',
        path: 'games/024-slot-machine/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム025: Higher or Lower
    {
        id: '025-higher-lower',
        number: 25,
        name: 'Higher or Lower',
        emoji: '🃏',
        description: 'カード - 次の数字を予想',
        path: 'games/025-higher-lower/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム026: Memory Game
    {
        id: '026-memory-game',
        number: 26,
        name: 'Memory Game',
        emoji: '🧠',
        description: 'ペアを見つけるメモリーゲーム',
        path: 'games/026-memory-game/',
        status: 'available',
        difficulty: 'easy',
        genre: 'puzzle'
    },
    // ゲーム027: Spin the Wheel
    {
        id: '027-spin-wheel',
        number: 27,
        name: 'Spin the Wheel',
        emoji: '🎡',
        description: 'ルーレット - 賞品を獲得',
        path: 'games/027-spin-wheel/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム028: Quiz Game
    {
        id: '028-quiz',
        number: 28,
        name: 'Quiz Game',
        emoji: '❓',
        description: 'クイズに答えてスコア獲得',
        path: 'games/028-quiz/',
        status: 'available',
        difficulty: 'easy',
        genre: 'puzzle'
    },
    // ゲーム029: Clicker Game
    {
        id: '029-clicker',
        number: 29,
        name: 'Cookie Clicker',
        emoji: '🍪',
        description: 'クリッカー - クッキーを集める',
        path: 'games/029-clicker/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム030: Memory Timer
    {
        id: '030-memory-timer',
        number: 30,
        name: 'Memory Timer',
        emoji: '🧩',
        description: '数字を覚えて入力',
        path: 'games/030-memory-timer/',
        status: 'available',
        difficulty: 'easy',
        genre: 'puzzle'
    },
    // ゲーム031: Color Match
    {
        id: '031-color-match',
        number: 31,
        name: 'Color Match',
        emoji: '🎨',
        description: '色の名前を当てる',
        path: 'games/031-color-match/',
        status: 'available',
        difficulty: 'easy',
        genre: 'puzzle'
    },
    // ゲーム032: Drop Catch
    {
        id: '032-drop-catch',
        number: 32,
        name: 'Drop Catch',
        emoji: '🧺',
        description: '落ちてくるものをキャッチ',
        path: 'games/032-drop-catch/',
        status: 'available',
        difficulty: 'easy',
        genre: 'action'
    },
    // ゲーム033: Tap Speed
    {
        id: '033-tap-speed',
        number: 33,
        name: 'Tap Speed',
        emoji: '⚡',
        description: '10秒間タップの回数を競う',
        path: 'games/033-tap-speed/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム034: Number Sequence
    {
        id: '034-number-sequence',
        number: 34,
        name: 'Number Sequence',
        emoji: '📊',
        description: 'パターンを認識して次の数字を当てる',
        path: 'games/034-number-sequence/',
        status: 'available',
        difficulty: 'normal',
        genre: 'puzzle'
    },
    // ゲーム035: Avoid Obstacles
    {
        id: '035-avoid-obstacles',
        number: 35,
        name: 'Avoid Obstacles',
        emoji: '🚗',
        description: '障害物を避けてスコア獲得',
        path: 'games/035-avoid-obstacles/',
        status: 'available',
        difficulty: 'easy',
        genre: 'action'
    },
    // ゲーム036: Reaction Time
    {
        id: '036-reaction-time',
        number: 36,
        name: 'Reaction Time',
        emoji: '⚡',
        description: '反応速度をテスト',
        path: 'games/036-reaction-time/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム037: Word Flash
    {
        id: '037-word-flash',
        number: 37,
        name: 'Word Flash',
        emoji: '💬',
        description: '表示された単語を当てる',
        path: 'games/037-word-flash/',
        status: 'available',
        difficulty: 'easy',
        genre: 'puzzle'
    },
    // ゲーム038: Lucky Number
    {
        id: '038-lucky-number',
        number: 38,
        name: 'Lucky Number',
        emoji: '🍀',
        description: 'ラッキーナンバーを選ぶ',
        path: 'games/038-lucky-number/',
        status: 'available',
        difficulty: 'easy',
        genre: 'casual'
    },
    // ゲーム039: Bounce Ball
    {
        id: '039-bounce-ball',
        number: 39,
        name: 'Bounce Ball',
        emoji: '🎾',
        description: 'ボールをクリックしてスコア',
        path: 'games/039-bounce-ball/',
        status: 'available',
        difficulty: 'easy',
        genre: 'action'
    },
    // ゲーム040: Minesweeper
    {
        id: '040-minesweeper',
        number: 40,
        name: 'Minesweeper',
        emoji: '💣',
        description: '地雷を避けてセルを開く',
        path: 'games/040-minesweeper/',
        status: 'available',
        difficulty: 'normal',
        genre: 'puzzle'
    },
    // ゲーム041: Typing Speed
    { id: '041-typing-speed', number: 41, name: 'Typing Speed', emoji: '⌨️', description: 'タイピング速度テスト', path: 'games/041-typing-speed/', status: 'available', difficulty: 'easy', genre: 'casual' },
    // ゲーム042: Shape Memory
    { id: '042-shape-memory', number: 42, name: 'Shape Memory', emoji: '🔷', description: '図形を覚えて再現', path: 'games/042-shape-memory/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    // ゲーム043: Gravity Ball
    { id: '043-gravity-ball', number: 43, name: 'Gravity Ball', emoji: '🎱', description: 'パドルでボールをバウンス', path: 'games/043-gravity-ball/', status: 'available', difficulty: 'easy', genre: 'action' },
    // ゲーム044: Simon Says
    { id: '044-simon-says', number: 44, name: 'Simon Says', emoji: '🌈', description: '色の順序をコピー', path: 'games/044-simon-says/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    // ゲーム045: Catch Objects
    { id: '045-catch-objects', number: 45, name: 'Catch Objects', emoji: '🧺', description: 'バスケットで落ちてくるものをキャッチ', path: 'games/045-catch-objects/', status: 'available', difficulty: 'easy', genre: 'action' },
    // ゲーム046: Speed Math
    { id: '046-speed-math', number: 46, name: 'Speed Math', emoji: '🧮', description: 'サクサク数学問題を解く', path: 'games/046-speed-math/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    // ゲーム047: Spin to Win
    { id: '047-spin-win', number: 47, name: 'Spin to Win', emoji: '🎡', description: 'ホイールを回して賞品を獲得', path: 'games/047-spin-win/', status: 'available', difficulty: 'easy', genre: 'casual' },
    // ゲーム048: Number Bomb
    { id: '048-number-bomb', number: 48, name: 'Number Bomb', emoji: '💣', description: '爆弾の前にタップ', path: 'games/048-number-bomb/', status: 'available', difficulty: 'easy', genre: 'casual' },
    // ゲーム049: Quiz Show
    { id: '049-quiz-show', number: 49, name: 'Quiz Show', emoji: '❓', description: 'クイズに答える', path: 'games/049-quiz-show/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    // ゲーム050: Pattern Finder
    { id: '050-pattern-finder', number: 50, name: 'Pattern Finder', emoji: '🔍', description: 'パターンを見つける', path: 'games/050-pattern-finder/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    // ゲーム051: Flash Memory
    { id: '051-flash-memory', number: 51, name: 'Flash Memory', emoji: '🔢', description: 'Memorize and repeat numbers', path: 'games/051-flash-memory/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    // ゲーム052: Text Difference
    { id: '052-text-difference', number: 52, name: 'Text Difference', emoji: '📝', description: 'Find differences in text', path: 'games/052-text-difference/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    // ゲーム053: Wheel of Fortune
    { id: '053-wheel-fortune', number: 53, name: 'Wheel of Fortune', emoji: '🎡', description: 'Spin wheel to win money', path: 'games/053-wheel-fortune/', status: 'available', difficulty: 'easy', genre: 'casual' },
    // ゲーム054: Tile Flip
    { id: '054-tile-flip', number: 54, name: 'Tile Flip', emoji: '🎴', description: 'Match pairs of tiles', path: 'games/054-tile-flip/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    // ゲーム055: Fast Typer
    { id: '055-fast-typer', number: 55, name: 'Fast Typer', emoji: '⌨️', description: 'Type as many words as possible', path: 'games/055-fast-typer/', status: 'available', difficulty: 'normal', genre: 'casual' },
    // ゲーム056: Sound Match
    { id: '056-sound-match', number: 56, name: 'Sound Match', emoji: '🔔', description: 'Match sound emoji pairs', path: 'games/056-sound-match/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    // ゲーム057: Marble Drop
    { id: '057-marble-drop', number: 57, name: 'Marble Drop', emoji: '🔵', description: 'Drop marbles through pegs', path: 'games/057-marble-drop/', status: 'available', difficulty: 'normal', genre: 'action' },
    // ゲーム058: Color Chain
    { id: '058-color-chain', number: 58, name: 'Color Chain', emoji: '🎨', description: 'Match color sequences', path: 'games/058-color-chain/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    // ゲーム059: Bomb Defuse
    { id: '059-bomb-defuse', number: 59, name: 'Bomb Defuse', emoji: '💣', description: 'Cut correct wires fast', path: 'games/059-bomb-defuse/', status: 'available', difficulty: 'hard', genre: 'action' },
    // ゲーム060: Dice Race
    { id: '060-dice-race', number: 60, name: 'Dice Race', emoji: '🎲', description: 'Roll dice to reach finish', path: 'games/060-dice-race/', status: 'available', difficulty: 'easy', genre: 'casual' },
    // ゲーム061-100 (abbreviated for space)
    { id: '061-number-chain', number: 61, name: 'Number Chain', emoji: '🔗', description: 'Click numbers 1-10 in order', path: 'games/061-number-chain/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    { id: '062-shape-shooter', number: 62, name: 'Shape Shooter', emoji: '🎯', description: 'Click shapes to shoot them', path: 'games/062-shape-shooter/', status: 'available', difficulty: 'easy', genre: 'action' },
    { id: '063-memory-cards', number: 63, name: 'Memory Cards', emoji: '🃏', description: 'Match card pairs', path: 'games/063-memory-cards/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    { id: '064-brick-blast', number: 64, name: 'Brick Blast', emoji: '🧱', description: 'Click all bricks to clear', path: 'games/064-brick-blast/', status: 'available', difficulty: 'easy', genre: 'action' },
    { id: '065-jump-game', number: 65, name: 'Jump Game', emoji: '🦘', description: 'Jump over obstacles', path: 'games/065-jump-game/', status: 'available', difficulty: 'normal', genre: 'action' },
    { id: '066-spot-odd', number: 66, name: 'Spot the Odd', emoji: '🔍', description: 'Find the odd one out', path: 'games/066-spot-odd/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    { id: '067-letter-match', number: 67, name: 'Letter Match', emoji: '🔤', description: 'Memory with letters', path: 'games/067-letter-match/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    { id: '068-tap-sequence', number: 68, name: 'Tap Sequence', emoji: '🌈', description: 'Tap colors in order', path: 'games/068-tap-sequence/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '069-color-drop', number: 69, name: 'Color Drop', emoji: '🪣', description: 'Drop colors in bins', path: 'games/069-color-drop/', status: 'available', difficulty: 'easy', genre: 'casual' },
    { id: '070-speed-click', number: 70, name: 'Speed Click', emoji: '⚡', description: 'Click as fast as possible', path: 'games/070-speed-click/', status: 'available', difficulty: 'easy', genre: 'casual' },
    { id: '071-number-match', number: 71, name: 'Number Match', emoji: '🔢', description: 'Match number pairs', path: 'games/071-number-match/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    { id: '072-face-match', number: 72, name: 'Face Match', emoji: '😊', description: 'Match emoji faces', path: 'games/072-face-match/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    { id: '073-sequence-repeat', number: 73, name: 'Sequence Repeat', emoji: '📋', description: 'Repeat patterns', path: 'games/073-sequence-repeat/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '074-target-click', number: 74, name: 'Target Click', emoji: '🎪', description: 'Click targets that appear', path: 'games/074-target-click/', status: 'available', difficulty: 'easy', genre: 'action' },
    { id: '075-time-maze', number: 75, name: 'Time Maze', emoji: '🌀', description: 'Navigate maze quickly', path: 'games/075-time-maze/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '076-quick-pair', number: 76, name: 'Quick Pair', emoji: '⚙️', description: 'Fast memory matching', path: 'games/076-quick-pair/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '077-balloon-pop', number: 77, name: 'Balloon Pop', emoji: '🎈', description: 'Pop balloons by clicking', path: 'games/077-balloon-pop/', status: 'available', difficulty: 'easy', genre: 'casual' },
    { id: '078-number-race', number: 78, name: 'Number Race', emoji: '🏁', description: 'Race numbers forward', path: 'games/078-number-race/', status: 'available', difficulty: 'easy', genre: 'casual' },
    { id: '079-match-three', number: 79, name: 'Match Three', emoji: '💎', description: 'Match 3 in a row', path: 'games/079-match-three/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '080-follow-path', number: 80, name: 'Follow Path', emoji: '🛤️', description: 'Remember click path', path: 'games/080-follow-path/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '081-card-guess', number: 81, name: 'Card Guess', emoji: '🃏', description: 'Guess lucky card', path: 'games/081-card-guess/', status: 'available', difficulty: 'easy', genre: 'casual' },
    { id: '082-hidden-object', number: 82, name: 'Hidden Object', emoji: '🌟', description: 'Find hidden objects', path: 'games/082-hidden-object/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '083-pulse-beat', number: 83, name: 'Pulse Beat', emoji: '💓', description: 'Click in rhythm', path: 'games/083-pulse-beat/', status: 'available', difficulty: 'normal', genre: 'casual' },
    { id: '084-catch-stars', number: 84, name: 'Catch Stars', emoji: '⭐', description: 'Catch falling stars', path: 'games/084-catch-stars/', status: 'available', difficulty: 'easy', genre: 'action' },
    { id: '085-word-scramble', number: 85, name: 'Word Scramble', emoji: '🔀', description: 'Unscramble words', path: 'games/085-word-scramble/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '086-dot-collect', number: 86, name: 'Dot Collect', emoji: '●', description: 'Collect dots quickly', path: 'games/086-dot-collect/', status: 'available', difficulty: 'easy', genre: 'casual' },
    { id: '087-number-painter', number: 87, name: 'Number Painter', emoji: '🎨', description: 'Paint by clicking numbers', path: 'games/087-number-painter/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '088-sliding-box', number: 88, name: 'Sliding Box', emoji: '📦', description: 'Slide to goal', path: 'games/088-sliding-box/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '089-gem-match', number: 89, name: 'Gem Match', emoji: '💎', description: 'Match 10 gem pairs', path: 'games/089-gem-match/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    { id: '090-arrow-follow', number: 90, name: 'Arrow Follow', emoji: '⬆️', description: 'Press shown arrow keys', path: 'games/090-arrow-follow/', status: 'available', difficulty: 'easy', genre: 'casual' },
    { id: '091-bounce-click', number: 91, name: 'Bounce Click', emoji: '⚾', description: 'Click bouncing balls', path: 'games/091-bounce-click/', status: 'available', difficulty: 'easy', genre: 'action' },
    { id: '092-color-memory', number: 92, name: 'Color Memory', emoji: '🌈', description: '6-color Simon game', path: 'games/092-color-memory/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '093-timer-game', number: 93, name: 'Timer Game', emoji: '⏱️', description: 'Stop at 5.0 seconds', path: 'games/093-timer-game/', status: 'available', difficulty: 'normal', genre: 'casual' },
    { id: '094-circle-tap', number: 94, name: 'Circle Tap', emoji: '⭕', description: 'Tap circles at size', path: 'games/094-circle-tap/', status: 'available', difficulty: 'easy', genre: 'casual' },
    { id: '095-block-drop', number: 95, name: 'Block Drop', emoji: '📦', description: 'Stack falling blocks', path: 'games/095-block-drop/', status: 'available', difficulty: 'normal', genre: 'casual' },
    { id: '096-swipe-match', number: 96, name: 'Swipe Match', emoji: '↔️', description: 'Match swipe directions', path: 'games/096-swipe-match/', status: 'available', difficulty: 'normal', genre: 'puzzle' },
    { id: '097-flash-card', number: 97, name: 'Flash Card', emoji: '📚', description: 'Study and score', path: 'games/097-flash-card/', status: 'available', difficulty: 'easy', genre: 'puzzle' },
    { id: '098-number-bomb-2', number: 98, name: 'Number Bomb 2', emoji: '💣', description: 'Click correct numbers', path: 'games/098-number-bomb-2/', status: 'available', difficulty: 'normal', genre: 'casual' },
    { id: '099-reaction-race', number: 99, name: 'Reaction Race', emoji: '🏃', description: 'Final reaction test', path: 'games/099-reaction-race/', status: 'available', difficulty: 'normal', genre: 'casual' },
    { id: '100-final-challenge', number: 100, name: 'Final Challenge', emoji: '🏆', description: 'Complete 5 challenges', path: 'games/100-final-challenge/', status: 'available', difficulty: 'hard', genre: 'casual' }
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
