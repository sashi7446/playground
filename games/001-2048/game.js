class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.best = localStorage.getItem('best2048') ? parseInt(localStorage.getItem('best2048')) : 0;
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreDisplay = document.getElementById('score');
        this.bestDisplay = document.getElementById('best');
        this.newGameBtn = document.getElementById('newGameBtn');

        this.init();
        this.setupEventListeners();
        this.updateDisplay();
    }

    init() {
        this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
        this.score = 0;
        this.addNewTile();
        this.addNewTile();
        this.render();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    handleKeyPress(e) {
        const key = e.key;

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

    addNewTile() {
        const emptyTiles = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyTiles.push({ x: i, y: j });
                }
            }
        }

        if (emptyTiles.length === 0) return;

        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        this.board[randomTile.x][randomTile.y] = value;
    }

    move(getLine, setLine) {
        let moved = false;

        for (let i = 0; i < this.size; i++) {
            let line = getLine(i);
            const originalLine = [...line];

            // 空きスペースを詰める
            line = line.filter(val => val !== 0);

            // 同じ数字を合体
            for (let j = 0; j < line.length - 1; j++) {
                if (line[j] === line[j + 1]) {
                    line[j] *= 2;
                    this.score += line[j];
                    line.splice(j + 1, 1);
                }
            }

            // 0で埋める
            while (line.length < this.size) {
                line.push(0);
            }

            setLine(i, line);

            // 変更があったか確認
            if (JSON.stringify(originalLine) !== JSON.stringify(line)) {
                moved = true;
            }
        }

        return moved;
    }

    moveLeft() {
        const moved = this.move(
            (i) => this.board[i],
            (i, line) => {
                this.board[i] = line;
            }
        );

        if (moved) {
            this.addNewTile();
            this.render();
            this.checkGameState();
        }
    }

    moveRight() {
        const moved = this.move(
            (i) => this.board[i].reverse(),
            (i, line) => {
                this.board[i] = line.reverse();
            }
        );

        if (moved) {
            this.addNewTile();
            this.render();
            this.checkGameState();
        }
    }

    moveUp() {
        const moved = this.move(
            (j) => this.board.map(row => row[j]),
            (j, line) => {
                for (let i = 0; i < this.size; i++) {
                    this.board[i][j] = line[i];
                }
            }
        );

        if (moved) {
            this.addNewTile();
            this.render();
            this.checkGameState();
        }
    }

    moveDown() {
        const moved = this.move(
            (j) => this.board.map(row => row[j]).reverse(),
            (j, line) => {
                for (let i = 0; i < this.size; i++) {
                    this.board[i][j] = line[this.size - 1 - i];
                }
            }
        );

        if (moved) {
            this.addNewTile();
            this.render();
            this.checkGameState();
        }
    }

    canMove() {
        // 空きがあるかチェック
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) return true;
            }
        }

        // 隣同士で同じ数字があるかチェック
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.board[i][j];
                if (
                    (j < this.size - 1 && current === this.board[i][j + 1]) ||
                    (i < this.size - 1 && current === this.board[i + 1][j])
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    checkGameState() {
        // 2048に到達
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 2048) {
                    this.showModal('🎉 成功！', `2048に到達しました！\nスコア: ${this.score}`);
                    return;
                }
            }
        }

        // ゲームオーバー
        if (!this.canMove()) {
            this.showModal('ゲームオーバー', `スコア: ${this.score}`);
        }
    }

    showModal(title, message) {
        const modal = document.createElement('div');
        modal.className = 'game-over';
        modal.innerHTML = `
            <div class="modal">
                <h2>${title}</h2>
                <p>${message}</p>
                <button onclick="location.reload()">もう一度プレイ</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.bestDisplay.textContent = this.best;
    }

    render() {
        this.gameBoard.innerHTML = '';

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.board[i][j];
                const tile = document.createElement('div');
                tile.className = 'tile';

                if (value === 0) {
                    tile.classList.add('empty');
                } else {
                    tile.classList.add(`tile-${value}`);
                    tile.textContent = value;
                    tile.classList.add('new');
                }

                this.gameBoard.appendChild(tile);
            }
        }

        this.updateDisplay();

        // スコアを保存
        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('best2048', this.best);
        }
    }

    newGame() {
        this.init();
    }
}

// ゲーム開始
window.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
