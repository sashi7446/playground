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
    },

    /**
     * ランキング用のプレイ記録を保存
     * @param {string} gameId - ゲームID
     * @param {number} score - スコア
     * @param {string} result - 結果 ('won', 'lost', 'completed', 'score', etc)
     * @param {number} duration - プレイ時間（秒）
     */
    recordPlay: (gameId, score, result, duration = 0) => {
        const key = 'ranking_all_plays';
        let plays = JSON.parse(localStorage.getItem(key)) || [];

        plays.push({
            gameId: gameId,
            score: score,
            result: result,
            duration: duration,
            timestamp: Date.now()
        });

        // 最新1000レコードのみ保存（メモリ節約）
        if (plays.length > 1000) {
            plays = plays.slice(-1000);
        }

        localStorage.setItem(key, JSON.stringify(plays));
    },

    /**
     * グローバルランキングを取得（全ゲーム、スコア順）
     * @param {number} limit - 取得件数
     * @returns {array} ランキング配列
     */
    getGlobalRanking: (limit = 100) => {
        const key = 'ranking_all_plays';
        const plays = JSON.parse(localStorage.getItem(key)) || [];

        // スコア順（降順）でソート
        return plays
            .filter(p => p.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    },

    /**
     * ゲーム別ランキングを取得
     * @param {string} gameId - ゲームID
     * @param {number} limit - 取得件数
     * @returns {array} ランキング配列
     */
    getGameRanking: (gameId, limit = 50) => {
        const key = 'ranking_all_plays';
        const plays = JSON.parse(localStorage.getItem(key)) || [];

        return plays
            .filter(p => p.gameId === gameId && p.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    },

    /**
     * ゲームのプレイ統計を取得
     * @param {string} gameId - ゲームID
     * @returns {object} 統計情報
     */
    getGameStats: (gameId) => {
        const key = 'ranking_all_plays';
        const plays = JSON.parse(localStorage.getItem(key)) || [];
        const gamePlays = plays.filter(p => p.gameId === gameId);

        if (gamePlays.length === 0) {
            return { playCount: 0, winCount: 0, bestScore: 0, totalPlayTime: 0 };
        }

        const winCount = gamePlays.filter(p => p.result === 'won').length;
        const bestScore = Math.max(...gamePlays.map(p => p.score || 0));
        const totalPlayTime = gamePlays.reduce((sum, p) => sum + (p.duration || 0), 0);

        return {
            playCount: gamePlays.length,
            winCount: winCount,
            bestScore: bestScore,
            totalPlayTime: totalPlayTime,
            winRate: ((winCount / gamePlays.length) * 100).toFixed(1)
        };
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
