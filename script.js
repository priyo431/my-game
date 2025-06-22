const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const gameOverBox = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const scoreSound = document.getElementById('scoreSound');
const crashSound = document.getElementById('crashSound');

const lanes = [30, 120, 210];
let currentLane = 1;
let score = 0;
let speed = 5;
let gameRunning = true;
let gameLoop;
let speedInterval;

let highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = "High Score: " + highScore;

// Helper to play sound
function playSound(audioElement) {
  const clone = audioElement.cloneNode();
  clone.play().catch(err => console.error('Audio play failed:', err));
}

// Movement
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;

  if (e.key === 'ArrowLeft' && currentLane > 0) {
    currentLane--;
  } else if (e.key === 'ArrowRight' && currentLane < 2) {
    currentLane++;
  }
  player.style.left = lanes[currentLane] + "px";
});

// Create Obstacle
function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  const lane = Math.floor(Math.random() * 3);
  obstacle.style.left = lanes[lane] + 'px';
  obstacle.style.top = '0px';
  gameArea.appendChild(obstacle);

  let top = 0;
  const interval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(interval);
      obstacle.remove();
      return;
    }

    top += speed;
    obstacle.style.top = top + 'px';

    if (checkCollision(player, obstacle)) {
      playSound(crashSound);
      endGame();
    }

    if (top > 600) {
      clearInterval(interval);
      obstacle.remove();
      score++;
      updateScore();
      playSound(scoreSound);
    }
  }, 20);
}

// Check collision
function checkCollision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return (
    aRect.left < bRect.left + bRect.width &&
    aRect.left + aRect.width > bRect.left &&
    aRect.top < bRect.top + bRect.height &&
    aRect.height + aRect.top > bRect.top
  );
}

// Update score
function updateScore() {
  scoreDisplay.textContent = "Score: " + score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreDisplay.textContent = "High Score: " + highScore;
  }
}

// Game loop start
function startGame() {
  gameRunning = true;
  gameLoop = setInterval(createObstacle, 1000);

  // Speed increases every 5 seconds
  speedInterval = setInterval(() => {
    speed += 1.5;
  }, 5000);
}

// End game
function endGame() {
  gameRunning = false;
  clearInterval(gameLoop);
  clearInterval(speedInterval);
  finalScore.textContent = score;
  gameOverBox.style.display = 'block';
}

// Restart game
function restartGame() {
  gameOverBox.style.display = 'none';
  score = 0;
  speed = 5;
  currentLane = 1;
  player.style.left = lanes[currentLane] + 'px';
  scoreDisplay.textContent = "Score: 0";

  document.querySelectorAll('.obstacle').forEach(el => el.remove());
  startGame();
}

startGame();