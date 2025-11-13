# 🎮 Game Collection - 100 Games Project

100個のゲームを作成するプロジェクトです。楽しくて面白いゲームをどんどん追加していきます！

---

## 🎮 ゲームをプレイ

### 📱 オンラインプレイ（GitHub Pages）
👉 **[Game Collection をプレイする](https://sashi7446.github.io/playground/launcher.html)**

### 💻 ローカルプレイ
```bash
# ローカルサーバーで実行
python3 -m http.server 8000

# launcher.htmlを開く
open http://localhost:8000/launcher.html
```

---

## プロジェクト構成（ハイブリッド型）

```
playground/
├── README.md                  # このファイル
├── launcher.html              # メインランチャーページ
├── launcher.js                # ランチャー機能
├── launcher-styles.css        # ランチャースタイル
│
├── games/                     # すべてのゲーム
│   ├── 001-2048/             # ゲーム1: 2048
│   │   ├── index.html
│   │   ├── game.js
│   │   └── styles.css
│   ├── 002-game/              # ゲーム2（coming soon）
│   └── ...100-game/           # ゲーム100
│
├── shared/                    # 共有リソース
│   ├── styles/
│   │   └── common.css         # すべてのゲームの共通スタイル
│   ├── utils/
│   │   └── gameUtils.js       # 共通ユーティリティ
│   └── assets/                # 画像やアイコン
│
└── docs/                      # ドキュメント
    └── GAME_TEMPLATE.md       # ゲーム開発テンプレート
```

## 特徴

### ✨ 組織化された構造
- **ゲーム番号制**（001～100）で管理しやすい
- **共有リソース**でコード重複を削減
- **拡張性が高い**ハイブリッド設計

### 🚀 スケーラビリティ
- 100個のゲームに対応可能
- 共通CSSとユーティリティで効率的な開発
- 各ゲームは独立して動作

### 🎨 デザイン統一
- 共通スタイル（common.css）で統一感
- レスポンシブ対応
- モダンなUI/UXデザイン

## クイックスタート

### 1. ランチャーを開く
```bash
# ブラウザで開く
open launcher.html

# またはローカルサーバーで実行
python3 -m http.server 8000
# http://localhost:8000/launcher.html にアクセス
```

### 2. ゲームをプレイ
ランチャーページから好きなゲームをクリック！

### 3. 新しいゲームを追加
`games/XXX-gamename/` フォルダを作成して、以下を配置：
- `index.html` - ゲームのHTMLファイル
- `game.js` - ゲームロジック
- `styles.css` - ゲーム固有のスタイル

## 現在利用可能なゲーム

### 001 - 2048
4×4グリッドでタイルを動かし、同じ数字を合わせて2048を目指すパズルゲーム

**特徴:**
- シンプルで中毒性がある
- タイル合体システム
- スコア自動保存
- レスポンシブ対応

**操作方法:**
- 矢印キー（↑↓←→）でタイルを移動
- 同じ数字が当たると2倍になる
- 2048作成でクリア！

**プレイ:** [games/001-2048/index.html](games/001-2048/index.html)

---

## 開発ガイド

### 新しいゲームを作成するには

#### ステップ1: フォルダ構造を作成
```bash
mkdir -p games/002-snake
cd games/002-snake
```

#### ステップ2: テンプレートファイルを準備
`docs/GAME_TEMPLATE.md` を参照して、以下のファイルを作成：
- `index.html`
- `game.js`
- `styles.css`（必要に応じて）

#### ステップ3: 共有リソースを活用
```html
<!-- common.cssを使用 -->
<link rel="stylesheet" href="../../shared/styles/common.css">

<!-- gameUtils.jsを使用 -->
<script src="../../shared/utils/gameUtils.js"></script>
```

#### ステップ4: launcher.jsにゲームを登録
```javascript
// launcher.jsの GAMES_LIST に追加
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

### 共有リソースの使用

#### 共有スタイル（common.css）
```html
<link rel="stylesheet" href="../../shared/styles/common.css">
```

利用可能なクラス：
- `.game-container` - ゲームコンテナ
- `.btn` - ボタンスタイル
- `.modal-overlay` - モーダルオーバーレイ
- `.modal` - モーダルボックス

#### 共有ユーティリティ（gameUtils.js）

**スコア管理:**
```javascript
// スコアを保存
GameStorage.setScore('002-snake', 100);

// スコアを取得
const score = GameStorage.getScore('002-snake');

// ハイスコアを保存
GameStorage.setBestScore('002-snake', 500);

// ハイスコアを取得
const best = GameStorage.getBestScore('002-snake');
```

**モーダル表示:**
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

**ゲーム統計:**
```javascript
// ゲームを記録
GameStats.recordGame('002-snake', {
    score: 100,
    duration: 300
});

// 統計を取得
const stats = GameStats.getStats('002-snake');
```

**デバイス判定:**
```javascript
if (DeviceDetect.isMobile()) {
    // モバイル対応処理
}
```

## ゲーム開発チェックリスト

新しいゲームを追加するときのチェックリスト：

- [ ] フォルダ `games/XXX-gamename/` を作成
- [ ] `index.html`, `game.js` を実装
- [ ] `shared/styles/common.css` をインポート
- [ ] `shared/utils/gameUtils.js` をインポート
- [ ] ゲームロジックを実装
- [ ] スコア保存機能を追加
- [ ] launcher.js に登録
- [ ] launcher.htmlでリンク確認
- [ ] テスト完了

## 技術スタック

- **HTML5** - 構造
- **CSS3** - スタイル（グラデーション、アニメーション）
- **JavaScript（ES6+）** - ロジック
- **LocalStorage** - データ永続化

## ブラウザサポート

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- モバイルブラウザ（iOS Safari, Chrome Android）

## パフォーマンス

- 軽量（共有リソースで最小化）
- オフライン対応（LocalStorageを使用）
- レスポンシブデザイン

## ライセンス

MIT License - 自由に使用、修正、配布可能

## 作成者

Created with ❤️ for fun and learning

---

## 今後の予定

- [ ] ゲーム001: 2048 ✅ 完了
- [ ] ゲーム002～100: 順次追加予定
- [ ] ランチャーに検索機能を追加
- [ ] ゲーム統計ダッシュボード
- [ ] マルチプレイヤー対応
- [ ] サウンド機能

## 質問・フィードバック

楽しいゲーム開発の旅を始めましょう！ 🚀

---

**最終更新:** 2024年11月13日
**バージョン:** 1.0.0
