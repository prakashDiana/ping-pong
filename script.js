// Ping Pong Game

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game Constants
const paddleWidth = 15, paddleHeight = 100, ballRadius = 10;
const playerX = 10;
const aiX = canvas.width - paddleWidth - 10;
const winScore = 5;

// Game State
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let playerScore = 0, aiScore = 0;

let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 5;

// Control
let upPressed = false, downPressed = false, wPressed = false, sPressed = false;

// Draw Functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color, size=40) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2-1, i, 2, 20, "#fff");
    }
}

// Main Draw
function draw() {
    // background
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawNet();
    // scores
    drawText(playerScore, canvas.width/4, 50, "#fff");
    drawText(aiScore, 3*canvas.width/4, 50, "#fff");
    // paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#09f");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#f39");
    // ball
    drawCircle(ballX, ballY, ballRadius, "#fff");
}

// Update Functions
function movePlayer() {
    if (upPressed || wPressed) playerY -= 7;
    if (downPressed || sPressed) playerY += 7;
    // clamp
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
}

function moveAI() {
    // Simple AI: follows the ball with some speed
    let center = aiY + paddleHeight / 2;
    if (center < ballY - 20) aiY += 6;
    else if (center > ballY + 20) aiY -= 6;

    // clamp
    if (aiY < 0) aiY = 0;
    if (aiY + paddleHeight > canvas.height) aiY = canvas.height - paddleHeight;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // top and bottom
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // left (player) paddle
    if (ballX - ballRadius < playerX + paddleWidth &&
        ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        let collidePoint = ballY - (playerY + paddleHeight/2);
        collidePoint = collidePoint / (paddleHeight/2);
        let angleRad = (Math.PI/4) * collidePoint;
        ballSpeedY = 5 * Math.sin(angleRad);
        ballSpeedX = 5 * Math.cos(angleRad) * (ballSpeedX > 0 ? 1 : -1);
    }

    // right (AI) paddle
    if (ballX + ballRadius > aiX &&
        ballY > aiY && ballY < aiY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        let collidePoint = ballY - (aiY + paddleHeight/2);
        collidePoint = collidePoint / (paddleHeight/2);
        let angleRad = (Math.PI/4) * collidePoint;
        ballSpeedY = 5 * Math.sin(angleRad);
        ballSpeedX = 5 * Math.cos(angleRad) * (ballSpeedX > 0 ? 1 : -1);
    }

    // left wall (AI scores)
    if (ballX - ballRadius < 0) {
        aiScore++;
        resetBall();
    }
    // right wall (Player scores)
    if (ballX + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Keyboard
document.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowUp') upPressed = true;
    if (e.key == 'ArrowDown') downPressed = true;
    if (e.key == 'w' || e.key == 'W') wPressed = true;
    if (e.key == 's' || e.key == 'S') sPressed = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowUp') upPressed = false;
    if (e.key == 'ArrowDown') downPressed = false;
    if (e.key == 'w' || e.key == 'W') wPressed = false;
    if (e.key == 's' || e.key == 'S') sPressed = false;
});

// Main Loop
let gameOver = false;
function game() {
    if (!gameOver) {
        movePlayer();
        moveAI();
        updateBall();
        draw();
        if (playerScore >= winScore || aiScore >= winScore) {
            gameOver = true;
            setTimeout(showGameOver, 500);
        } else {
            requestAnimationFrame(game);
        }
    }
}
function showGameOver() {
    draw();
    ctx.fillStyle = "#ff0";
    ctx.font = "48px Arial";
    ctx.fillText(
      playerScore > aiScore ? "You Win!" : "AI Wins!",
      canvas.width/2 - 120, canvas.height/2
    );
    ctx.font = "24px Arial";
    ctx.fillText("Refresh to play again", canvas.width/2 - 110, canvas.height/2 + 40);
}

game();
