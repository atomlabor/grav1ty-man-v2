// Grav1ty Man v2 - Rabbit R1 Edition
// Canvas-only implementation with sensor controls

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants for Rabbit R1 (240x282)
const CANVAS_WIDTH = 240;
const CANVAS_HEIGHT = 282;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const PLAYER_SIZE = 20;

// Game state
let gameRunning = false;
let player = {
    x: 50,
    y: CANVAS_HEIGHT / 2,
    velocityY: 0,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE
};

let obstacles = [];
let score = 0;
let gameSpeed = 2;

// Game initialization
function init() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Start game loop
    gameRunning = true;
    gameLoop();
    
    // Add touch/click event listeners for Rabbit R1
    canvas.addEventListener('touchstart', handleInput);
    canvas.addEventListener('click', handleInput);
    document.addEventListener('keydown', handleKeyInput);
}

// Handle input (touch, click, keyboard)
function handleInput(event) {
    event.preventDefault();
    if (gameRunning) {
        jump();
    } else {
        restart();
    }
}

// Handle keyboard input
function handleKeyInput(event) {
    if (event.code === 'Space' || event.key === ' ') {
        handleInput(event);
    }
}

// Player jump
function jump() {
    player.velocityY = JUMP_FORCE;
}

// Update game state
function update() {
    if (!gameRunning) return;
    
    // Update player physics
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    
    // Keep player in bounds
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }
    if (player.y + player.height > CANVAS_HEIGHT) {
        player.y = CANVAS_HEIGHT - player.height;
        player.velocityY = 0;
        gameOver();
    }
    
    // Spawn obstacles
    if (Math.random() < 0.01) {
        obstacles.push({
            x: CANVAS_WIDTH,
            y: Math.random() * (CANVAS_HEIGHT - 100) + 50,
            width: 20,
            height: 60
        });
    }
    
    // Update obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        
        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score += 10;
        }
        
        // Check collision
        if (checkCollision(player, obstacle)) {
            gameOver();
        }
    });
    
    // Increase game speed gradually
    gameSpeed += 0.001;
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (!gameRunning) {
        // Game over screen
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        ctx.fillText('Score: ' + score, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.fillText('Tap to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        return;
    }
    
    // Render player
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Render obstacles
    ctx.fillStyle = '#FF0000';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Render score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 25);
    
    // Render instructions
    ctx.font = '12px Arial';
    ctx.fillText('Tap to jump', 10, CANVAS_HEIGHT - 10);
}

// Game over
function gameOver() {
    gameRunning = false;
}

// Restart game
function restart() {
    player = {
        x: 50,
        y: CANVAS_HEIGHT / 2,
        velocityY: 0,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE
    };
    obstacles = [];
    score = 0;
    gameSpeed = 2;
    gameRunning = true;
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game when page loads
window.addEventListener('load', init);
