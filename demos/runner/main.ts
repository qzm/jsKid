/**
 * 跑酷游戏
 */
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const player = { x: 100, y: canvas.height - 100, width: 40, height: 60, dy: 0, jumping: false };
const obstacles: any[] = [];
let score = 0, gameSpeed = 5, gameRunning = false, frame = 0;

function createObstacle() {
  obstacles.push({ x: canvas.width, y: canvas.height - 60, width: 30, height: 60 });
}

function update() {
  if (!gameRunning) return;
  
  if (player.jumping) {
    player.dy += 0.8;
    player.y += player.dy;
    if (player.y >= canvas.height - 100) {
      player.y = canvas.height - 100;
      player.jumping = false;
      player.dy = 0;
    }
  }

  if (frame % 100 === 0) createObstacle();
  
  obstacles.forEach((obs, i) => {
    obs.x -= gameSpeed;
    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      score += 10;
      updateUI();
    }
    
    if (player.x < obs.x + obs.width && player.x + player.width > obs.x &&
        player.y < obs.y + obs.height && player.y + player.height > obs.y) {
      gameOver();
    }
  });

  if (frame % 500 === 0) gameSpeed += 0.5;
  frame++;
}

function render() {
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  ctx.fillStyle = '#ff0';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = '#f00';
  obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function gameOver() {
  gameRunning = false;
  document.getElementById('game-over')!.classList.add('active');
  document.getElementById('final-score')!.textContent = score.toString();
}

function updateUI() {
  document.getElementById('score')!.textContent = score.toString();
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameRunning) {
      player.y = canvas.height - 100; player.dy = 0; player.jumping = false;
      obstacles.length = 0; score = 0; gameSpeed = 5; frame = 0;
      gameRunning = true;
      document.getElementById('game-over')!.classList.remove('active');
      updateUI();
    } else if (!player.jumping) {
      player.jumping = true;
      player.dy = -15;
    }
  }
});

gameLoop();
console.log('🏃 跑酷游戏加载完成！');
