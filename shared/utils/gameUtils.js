// 共通ゲームユーティリティ関数

// ローカルストレージ操作
const GameStorage = {
    /**
     * スコアを保存
     * @param {string} gameId - ゲームID（例: "001-2048"）
     * @param {number} score - スコア
     */
    setScore: (gameId, score) => {
        const key = `game_${gameId}_score`;
        localStorage.setItem(key, score);
    },

    /**
     * スコアを取得
     * @param {string} gameId - ゲームID
     * @returns {number} スコア
     */
    getScore: (gameId) => {
        const key = `game_${gameId}_score`;
        return parseInt(localStorage.getItem(key)) || 0;
    },

    /**
     * ハイスコアを保存
     * @param {string} gameId - ゲームID
     * @param {number} score - スコア
     */
    setBestScore: (gameId, score) => {
        const key = `game_${gameId}_best`;
        localStorage.setItem(key, score);
    },

    /**
     * ハイスコアを取得
     * @param {string} gameId - ゲームID
     * @returns {number} ハイスコア
     */
    getBestScore: (gameId) => {
        const key = `game_${gameId}_best`;
        return parseInt(localStorage.getItem(key)) || 0;
    },

    /**
     * ゲームデータ全削除
     * @param {string} gameId - ゲームID
     */
    clearGameData: (gameId) => {
        localStorage.removeItem(`game_${gameId}_score`);
        localStorage.removeItem(`game_${gameId}_best`);
    }
};

// モーダル操作
const GameModal = {
    /**
     * モーダルを表示
     * @param {string} title - タイトル
     * @param {string} message - メッセージ
     * @param {function} onOk - OKボタンクリック時のコールバック
     */
    show: (title, message, onOk) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <h2>${title}</h2>
                <p>${message}</p>
                <button class="btn" id="modalOkBtn">OK</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('modalOkBtn').addEventListener('click', () => {
            overlay.remove();
            if (onOk) onOk();
        });
    },

    /**
     * 確認ダイアログを表示
     * @param {string} title - タイトル
     * @param {string} message - メッセージ
     * @param {function} onYes - Yesボタンクリック時のコールバック
     * @param {function} onNo - Noボタンクリック時のコールバック
     */
    confirm: (title, message, onYes, onNo) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <h2>${title}</h2>
                <p>${message}</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn btn-secondary" id="modalNoBtn">いいえ</button>
                    <button class="btn" id="modalYesBtn">はい</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('modalYesBtn').addEventListener('click', () => {
            overlay.remove();
            if (onYes) onYes();
        });

        document.getElementById('modalNoBtn').addEventListener('click', () => {
            overlay.remove();
            if (onNo) onNo();
        });
    }
};

// ゲーム統計
const GameStats = {
    /**
     * ゲーム統計を記録
     * @param {string} gameId - ゲームID
     * @param {object} data - 統計データ
     */
    recordGame: (gameId, data) => {
        const key = `game_${gameId}_stats`;
        let stats = JSON.parse(localStorage.getItem(key)) || [];
        stats.push({
            date: new Date().toISOString(),
            score: data.score,
            duration: data.duration,
            ...data
        });
        // 最新100レコードのみ保存
        if (stats.length > 100) {
            stats = stats.slice(-100);
        }
        localStorage.setItem(key, JSON.stringify(stats));
    },

    /**
     * ゲーム統計を取得
     * @param {string} gameId - ゲームID
     * @returns {array} 統計データ配列
     */
    getStats: (gameId) => {
        const key = `game_${gameId}_stats`;
        return JSON.parse(localStorage.getItem(key)) || [];
    }
};

// デバイス判定
const DeviceDetect = {
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isTablet: () => {
        return /iPad|Android(?!.*Mobi)|Windows Phone/i.test(navigator.userAgent);
    },

    isDesktop: () => {
        return !DeviceDetect.isMobile();
    }
};

// アニメーション補助
const GameAnimation = {
    /**
     * フェードイン効果
     * @param {HTMLElement} element - 対象要素
     * @param {number} duration - 期間（ms）
     */
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    },

    /**
     * スケーレーション効果
     * @param {HTMLElement} element - 対象要素
     * @param {number} duration - 期間（ms）
     */
    popIn: (element, duration = 200) => {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms ease-out`;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 10);
    }
};
