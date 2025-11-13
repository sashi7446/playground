const GAME_ID = '013-turn-based-battle';

class TurnBasedBattle {
    constructor() {
        this.battleLog = document.getElementById('battleLog');
        this.playerHpDisplay = document.getElementById('playerHp');
        this.enemyHpDisplay = document.getElementById('enemyHp');
        this.playerHpBar = document.getElementById('playerHpBar');
        this.enemyHpBar = document.getElementById('enemyHpBar');
        this.enemyNameDisplay = document.getElementById('enemyName');
        this.winsDisplay = document.getElementById('wins');
        this.levelDisplay = document.getElementById('level');
        this.attackBtn = document.getElementById('attackBtn');
        this.skillBtn = document.getElementById('skillBtn');
        this.defendBtn = document.getElementById('defendBtn');
        this.itemBtn = document.getElementById('itemBtn');
        this.newGameBtn = document.getElementById('newGameBtn');

        // Game state
        this.player = {
            hp: 100,
            maxHp: 100,
            items: 3,
            defending: false
        };
        this.enemy = {
            hp: 50,
            maxHp: 50,
            name: 'Goblin'
        };
        this.level = 1;
        this.wins = GameStorage.getScore(GAME_ID);
        this.battleActive = true;
        this.playerTurn = true;
        this.skillCooldown = 0;

        this.setupEventListeners();
        this.startBattle();
    }

    setupEventListeners() {
        this.attackBtn.addEventListener('click', () => this.playerAttack());
        this.skillBtn.addEventListener('click', () => this.playerSkill());
        this.defendBtn.addEventListener('click', () => this.playerDefend());
        this.itemBtn.addEventListener('click', () => this.playerUseItem());
        this.newGameBtn.addEventListener('click', () => this.nextBattle());
    }

    startBattle() {
        this.level = Math.floor(this.wins / 3) + 1;
        this.enemy = {
            hp: 30 + this.level * 10,
            maxHp: 30 + this.level * 10,
            name: this.getEnemyName()
        };
        this.player.hp = 100;
        this.player.items = 3;
        this.player.defending = false;
        this.skillCooldown = 0;
        this.battleActive = true;
        this.playerTurn = true;

        this.battleLog.innerHTML = '';
        this.log(`${this.enemy.name} appeared! (Level ${this.level})`, 'info');
        this.updateDisplay();
    }

    getEnemyName() {
        const enemies = ['Goblin', 'Orc', 'Troll', 'Dragon', 'Skeleton', 'Vampire'];
        return enemies[Math.min(this.level - 1, enemies.length - 1)];
    }

    playerAttack() {
        if (!this.battleActive || !this.playerTurn) return;

        const damage = 10 + Math.floor(Math.random() * 10);
        this.enemy.hp -= damage;

        this.log(`You attack! ${damage} damage!`, 'damage');
        this.player.defending = false;
        this.skillCooldown--;

        this.endPlayerTurn();
    }

    playerSkill() {
        if (!this.battleActive || !this.playerTurn) return;
        if (this.skillCooldown > 0) {
            this.log('Skill is on cooldown!', 'info');
            return;
        }

        const damage = 25 + Math.floor(Math.random() * 15);
        this.enemy.hp -= damage;

        this.log(`You use skill! ${damage} damage!`, 'damage');
        this.player.defending = false;
        this.skillCooldown = 2;

        this.endPlayerTurn();
    }

    playerDefend() {
        if (!this.battleActive || !this.playerTurn) return;

        this.player.defending = true;
        this.log('You take a defensive stance!', 'info');
        this.skillCooldown--;

        this.endPlayerTurn();
    }

    playerUseItem() {
        if (!this.battleActive || !this.playerTurn) return;
        if (this.player.items <= 0) {
            this.log('No items left!', 'info');
            return;
        }

        const heal = 30;
        this.player.hp = Math.min(this.player.hp + heal, this.player.maxHp);
        this.player.items--;

        this.log(`You use item! Healed ${heal} HP. (${this.player.items} left)`, 'heal');
        this.player.defending = false;
        this.skillCooldown--;

        this.endPlayerTurn();
    }

    endPlayerTurn() {
        this.playerTurn = false;
        this.updateDisplay();

        setTimeout(() => {
            if (this.checkBattleEnd()) return;
            this.enemyTurn();
        }, 800);
    }

    enemyTurn() {
        if (!this.battleActive) return;

        const action = Math.random();
        let damage = 0;

        if (action < 0.7) {
            damage = 8 + Math.floor(Math.random() * 8);
            this.log(`${this.enemy.name} attacks! ${damage} damage!`, 'enemy');
        } else {
            this.log(`${this.enemy.name} rests...`, 'enemy');
            this.enemy.hp = Math.min(this.enemy.hp + 5, this.enemy.maxHp);
        }

        if (this.player.defending) {
            damage = Math.floor(damage / 2);
            this.log(`Defense reduced damage to ${damage}!`, 'info');
            this.player.defending = false;
        }

        this.player.hp -= damage;
        this.skillCooldown--;

        this.updateDisplay();

        setTimeout(() => {
            if (this.checkBattleEnd()) return;
            this.playerTurn = true;
            this.updateDisplay();
        }, 800);
    }

    checkBattleEnd() {
        if (this.enemy.hp <= 0) {
            this.battleEnd(true);
            return true;
        }

        if (this.player.hp <= 0) {
            this.battleEnd(false);
            return true;
        }

        return false;
    }

    battleEnd(playerWon) {
        this.battleActive = false;

        if (playerWon) {
            this.log('Victory!', 'heal');
            this.wins++;
            GameStorage.setScore(GAME_ID, this.wins);

            GameStats.recordGame(GAME_ID, {
                level: this.level,
                result: 'won'
            });
        } else {
            this.log('Defeat...', 'damage');

            GameStats.recordGame(GAME_ID, {
                level: this.level,
                result: 'lost'
            });
        }

        this.newGameBtn.style.display = 'inline-block';
        this.updateDisplay();
    }

    nextBattle() {
        this.newGameBtn.style.display = 'none';
        this.startBattle();
    }

    log(message, type = '') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = message;
        this.battleLog.appendChild(entry);
        this.battleLog.scrollTop = this.battleLog.scrollHeight;
    }

    updateDisplay() {
        // Player HP
        this.playerHpDisplay.textContent = Math.max(0, this.player.hp);
        const playerHpPercent = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
        this.playerHpBar.style.width = playerHpPercent + '%';

        // Enemy HP
        this.enemyHpDisplay.textContent = Math.max(0, this.enemy.hp);
        const enemyHpPercent = Math.max(0, (this.enemy.hp / this.enemy.maxHp) * 100);
        this.enemyHpBar.style.width = enemyHpPercent + '%';

        // Enemy name
        this.enemyNameDisplay.textContent = this.enemy.name;

        // Stats
        this.winsDisplay.textContent = this.wins;
        this.levelDisplay.textContent = this.level;

        // Button states
        this.attackBtn.disabled = !this.playerTurn || !this.battleActive;
        this.skillBtn.disabled = !this.playerTurn || !this.battleActive || this.skillCooldown > 0;
        this.defendBtn.disabled = !this.playerTurn || !this.battleActive;
        this.itemBtn.disabled = !this.playerTurn || !this.battleActive || this.player.items <= 0;
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    new TurnBasedBattle();
});
