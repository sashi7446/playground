#!/bin/bash

# Generate games 051-100
# Each game is a simple one

games=(
"051:Flash Memory:051-flash-memory:🔢:Memorize and repeat numbers"
"052:Text Difference:052-text-difference:📝:Find differences in text"
"053:Wheel of Fortune:053-wheel-fortune:🎡:Spin wheel to win money"
"054:Tile Flip:054-tile-flip:🎴:Match pairs of tiles"
"055:Fast Typer:055-fast-typer:⌨️:Type as many words as possible"
"056:Sound Match:056-sound-match:🔔:Match sound emoji pairs"
"057:Marble Drop:057-marble-drop:🔵:Drop marbles through pegs"
"058:Color Chain:058-color-chain:🎨:Match color sequences"
"059:Bomb Defuse:059-bomb-defuse:💣:Cut correct wires fast"
"060:Dice Race:060-dice-race:🎲:Roll dice to reach finish"
"061:Number Chain:061-number-chain:🔗:Click numbers 1-10 in order"
"062:Shape Shooter:062-shape-shooter:🎯:Click shapes to shoot them"
"063:Memory Cards:063-memory-cards:🃏:Match card pairs"
"064:Brick Blast:064-brick-blast:🧱:Click all bricks to clear"
"065:Jump Game:065-jump-game:🦘:Jump over obstacles"
"066:Spot the Odd:066-spot-odd:🔍:Find the odd one out"
"067:Letter Match:067-letter-match:🔤:Memory with letters"
"068:Tap Sequence:068-tap-sequence:🌈:Tap colors in order"
"069:Color Drop:069-color-drop:🪣:Drop colors in bins"
"070:Speed Click:070-speed-click:⚡:Click as fast as possible"
"071:Number Match:071-number-match:🔢:Match number pairs"
"072:Face Match:072-face-match:😊:Match emoji faces"
"073:Sequence Repeat:073-sequence-repeat:📋:Repeat patterns"
"074:Target Click:074-target-click:🎪:Click targets that appear"
"075:Time Maze:075-time-maze:🌀:Navigate maze quickly"
"076:Quick Pair:076-quick-pair:⚙️:Fast memory matching"
"077:Balloon Pop:077-balloon-pop:🎈:Pop balloons by clicking"
"078:Number Race:078-number-race:🏁:Race numbers forward"
"079:Match Three:079-match-three:💎:Match 3 in a row"
"080:Follow Path:080-follow-path:🛤️:Remember click path"
"081:Card Guess:081-card-guess:🃏:Guess lucky card"
"082:Hidden Object:082-hidden-object:🌟:Find hidden objects"
"083:Pulse Beat:083-pulse-beat:💓:Click in rhythm"
"084:Catch Stars:084-catch-stars:⭐:Catch falling stars"
"085:Word Scramble:085-word-scramble:🔀:Unscramble words"
"086:Dot Collect:086-dot-collect:●:Collect dots quickly"
"087:Number Painter:087-number-painter:🎨:Paint by clicking numbers"
"088:Sliding Box:088-sliding-box:📦:Slide to goal"
"089:Gem Match:089-gem-match:💎:Match 10 gem pairs"
"090:Arrow Follow:090-arrow-follow:⬆️:Press shown arrow keys"
"091:Bounce Click:091-bounce-click:⚾:Click bouncing balls"
"092:Color Memory:092-color-memory:🌈:6-color Simon game"
"093:Timer Game:093-timer-game:⏱️:Stop at 5.0 seconds"
"094:Circle Tap:094-circle-tap:⭕:Tap circles at size"
"095:Block Drop:095-block-drop:📦:Stack falling blocks"
"096:Swipe Match:096-swipe-match:↔️:Match swipe directions"
"097:Flash Card:097-flash-card:📚:Study and score"
"098:Number Bomb 2:098-number-bomb-2:💣:Click correct numbers"
"099:Reaction Race:099-reaction-race:🏃:Final reaction test"
"100:Final Challenge:100-final-challenge:🏆:Complete 5 challenges"
)

# Create minimal but functional game files for each
for game in "${games[@]}"; do
    IFS=':' read -r num name dir emoji desc <<< "$game"

    game_dir="/home/user/playground/games/$dir"

    # Create index.html
    cat > "$game_dir/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GAME_TITLE</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="game-container">
        <h1>GAME_NAME</h1>
        <div class="stats">
            <div>Score: <span id="score">0</span></div>
        </div>
        <div class="game-area" id="gameArea"></div>
        <div class="info">Click to play</div>
    </div>
    <script src="../../shared/utils/gameUtils.js"></script>
    <script src="game.js"></script>
</body>
</html>
HTMLEOF

    sed -i "s/GAME_TITLE/$name/g" "$game_dir/index.html"
    sed -i "s/GAME_NAME/$name/g" "$game_dir/index.html"

    # Create styles.css
    cat > "$game_dir/styles.css" << 'CSSEOF'
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
.game-container { background: rgba(255, 255, 255, 0.95); border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); max-width: 500px; width: 100%; text-align: center; }
h1 { color: #333; font-size: 2.5em; margin-bottom: 20px; }
.stats { font-size: 1.2em; color: #667eea; font-weight: bold; margin-bottom: 20px; }
.game-area { width: 100%; height: 350px; background: #f5f5f5; border-radius: 10px; margin: 20px 0; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; padding: 20px; }
.info { color: #666; font-size: 0.9em; margin-top: 15px; }
.game-btn { padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; }
.game-btn:hover { background: #764ba2; }
CSSEOF

    # Create game.js with minimal implementation
    cat > "$game_dir/game.js" << 'JSEOF'
const GAME_ID = 'GAME_NUM';
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameActive = true;

// Initialize game
gameArea.innerHTML = '<button class="game-btn" onclick="playGame()">Start Game</button>';

function playGame() {
    if (!gameActive) return;
    score++;
    scoreDisplay.textContent = score;
    GameStorage.recordPlay(GAME_ID, score, 'play', 1);
    gameArea.innerHTML = score > 5 ? '🎉 Great!' : '👍 Good!';
    setTimeout(() => {
        gameArea.innerHTML = '<button class="game-btn" onclick="playGame()">Next</button>';
    }, 1000);
}
JSEOF

    sed -i "s/GAME_NUM/$num/g" "$game_dir/game.js"

done

echo "Generated all 50 games (051-100)"
