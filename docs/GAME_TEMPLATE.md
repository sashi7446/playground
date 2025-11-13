# ゲーム開発テンプレート

新しいゲームを作成するときのテンプレートとガイドです。

## フォルダ構造

```
games/XXX-gamename/
├── index.html      # ゲームのHTMLファイル
├── game.js         # ゲームロジック
└── styles.css      # ゲーム固有のスタイル（必要に応じて）
```

## index.html テンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ゲーム名</title>
    <!-- 共有スタイル -->
    <link rel="stylesheet" href="../../shared/styles/common.css">
    <!-- ゲーム固有のスタイル -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="game-container">
        <div class="game-header">
            <h1 class="game-title">ゲーム名</h1>
            <p class="game-description">ゲームの説明</p>

            <div class="score-board">
                <div class="score-item">
                    <span class="label">Score</span>
                    <span class="value" id="score">0</span>
                </div>
                <div class="score-item">
                    <span class="label">Best</span>
                    <span class="value" id="best">0</span>
                </div>
            </div>
        </div>

        <div class="game-info">
            <button id="newGameBtn" class="btn">New Game</button>
        </div>

        <!-- ゲームボード -->
        <div id="gameBoard">
            <!-- ゲーム要素がここに挿入されます -->
        </div>

        <div class="how-to-play">
            <h3>遊び方</h3>
            <ul>
                <li>操作方法1</li>
                <li>操作方法2</li>
                <li>ゴール説明</li>
            </ul>
        </div>
    </div>

    <!-- 共有ユーティリティ -->
    <script src="../../shared/utils/gameUtils.js"></script>
    <!-- ゲームロジック -->
    <script src="game.js"></script>
</body>
</html>
```

## game.js テンプレート

```javascript
// ゲーム設定
const GAME_ID = '002-gamename'; // ゲームのID（XXX-gamename）

class MyGame {
    constructor() {
        this.score = 0;
        this.best = GameStorage.getBestScore(GAME_ID);
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreDisplay = document.getElementById('score');
        this.bestDisplay = document.getElementById('best');
        this.newGameBtn = document.getElementById('newGameBtn');

        this.init();
        this.setupEventListeners();
        this.updateDisplay();
    }

    /**
     * ゲーム初期化
     */
    init() {
        // ゲーム状態のリセット
        this.score = 0;
        // ゲームボードの初期化
        this.render();
    }

    /**
     * イベントリスナーのセットアップ
     */
    setupEventListeners() {
        // キーボード操作
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // ボタン操作
        this.newGameBtn.addEventListener('click', () => this.newGame());

        // その他のイベント
    }

    /**
     * キー入力の処理
     * @param {KeyboardEvent} e - キーボードイベント
     */
    handleKeyPress(e) {
        const key = e.key;

        // 各キーに対応した処理を実装
        if (key === 'ArrowUp') {
            e.preventDefault();
            this.moveUp();
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            this.moveDown();
        } else if (key === 'ArrowLeft') {
            e.preventDefault();
            this.moveLeft();
        } else if (key === 'ArrowRight') {
            e.preventDefault();
            this.moveRight();
        }
    }

    /**
     * スコアを更新
     * @param {number} points - 加算ポイント
     */
    addScore(points) {
        this.score += points;

        // ハイスコアを更新
        if (this.score > this.best) {
            this.best = this.score;
            GameStorage.setBestScore(GAME_ID, this.best);
        }

        this.updateDisplay();
    }

    /**
     * ゲーム終了を処理
     * @param {string} message - メッセージ
     */
    gameOver(message) {
        // 統計を記録
        GameStats.recordGame(GAME_ID, {
            score: this.score
        });

        // モーダルを表示
        GameModal.show(
            'ゲームオーバー',
            `${message}\nスコア: ${this.score}`,
            () => {
                this.newGame();
            }
        );
    }

    /**
     * ゲーム成功を処理
     * @param {string} message - メッセージ
     */
    gameWon(message) {
        GameStats.recordGame(GAME_ID, {
            score: this.score,
            result: 'won'
        });

        GameModal.show(
            'クリア！',
            `${message}\nスコア: ${this.score}`,
            () => {
                this.newGame();
            }
        );
    }

    /**
     * 画面を更新
     */
    render() {
        // ゲームボードの描画
        this.gameBoard.innerHTML = '';

        // ゲーム要素を追加
        // this.gameBoard.appendChild(element);
    }

    /**
     * スコア表示を更新
     */
    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.bestDisplay.textContent = this.best;
    }

    /**
     * 新しいゲームを開始
     */
    newGame() {
        this.init();
    }
}

// ゲーム開始
window.addEventListener('DOMContentLoaded', () => {
    new MyGame();
});
```

## styles.css テンプレート

```css
/* ゲーム固有のスタイル */

/* ゲームボード */
#gameBoard {
    width: 100%;
    min-height: 300px;
    background: #f5f5f5;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
}

/* ゲーム要素 */
.game-element {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.game-element:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* アニメーション */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.game-element.new {
    animation: slideIn 0.3s ease-out;
}

/* レスポンシブ */
@media (max-width: 600px) {
    #gameBoard {
        min-height: 250px;
        padding: 15px;
    }

    .game-element {
        padding: 8px;
        margin: 3px;
    }
}
```

## 開発チェックリスト

新しいゲームを作成するときのチェックリスト：

- [ ] フォルダ `games/XXX-gamename/` を作成
- [ ] `index.html` を作成
- [ ] `game.js` を実装
- [ ] `styles.css` を実装（必要に応じて）
- [ ] 共有リソース（common.css, gameUtils.js）をインポート
- [ ] ゲームロジックを実装
- [ ] スコア保存機能を実装
- [ ] 共有スタイルを活用
- [ ] レスポンシブデザインを確認
- [ ] launcher.js に登録

### launcher.js への登録例

```javascript
{
    id: '002-snake',
    number: 2,
    name: 'Snake',
    emoji: '🐍',
    description: 'Classic snake game',
    path: 'games/002-snake/',
    status: 'available'
}
```

## 便利な共有関数

### スコア管理
```javascript
// スコアを保存
GameStorage.setScore(GAME_ID, 100);

// スコアを取得
const score = GameStorage.getScore(GAME_ID);

// ハイスコアを保存
GameStorage.setBestScore(GAME_ID, 500);

// ハイスコアを取得
const best = GameStorage.getBestScore(GAME_ID);

// ゲームデータ全削除
GameStorage.clearGameData(GAME_ID);
```

### モーダル表示
```javascript
// 通知モーダル
GameModal.show('Game Over', `Your score: ${score}`, () => {
    // OKボタンクリック時の処理
});

// 確認ダイアログ
GameModal.confirm(
    'Confirm',
    'Are you sure?',
    () => { /* Yes */ },
    () => { /* No */ }
);
```

### ゲーム統計
```javascript
// ゲームを記録
GameStats.recordGame(GAME_ID, {
    score: 100,
    duration: 300
});

// 統計を取得
const stats = GameStats.getStats(GAME_ID);
```

### デバイス判定
```javascript
if (DeviceDetect.isMobile()) {
    // モバイル対応処理
}

if (DeviceDetect.isTablet()) {
    // タブレット対応処理
}

if (DeviceDetect.isDesktop()) {
    // デスクトップ対応処理
}
```

## デバッグのヒント

### ブラウザコンソールでテスト

```javascript
// スコアをテスト
GameStorage.setScore('002-snake', 100);
console.log(GameStorage.getScore('002-snake')); // 100

// モーダルをテスト
GameModal.show('Test', 'This is a test modal');
```

### LocalStorage の確認

```javascript
// すべてのLocalStorageデータを表示
console.table(localStorage);

// 特定のゲームのデータを削除
GameStorage.clearGameData('002-snake');
```

## パフォーマンス最適化のコツ

1. **DOM操作を最小化** - 複数の操作をまとめて実行
2. **EventDelegation を使用** - 多数のリスナーの代わりに親要素にリスナーを設定
3. **requestAnimationFrame を活用** - アニメーション処理に使用
4. **メモリリークを防ぐ** - イベントリスナーは必ず削除
5. **画像最適化** - 使用する画像をWebP形式に

---

**テンプレート作成日:** 2024年11月13日
