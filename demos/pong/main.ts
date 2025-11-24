/**
 * 乒乓球游戏 - 双人对战
 */

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const PADDLE_WIDTH = 15, PADDLE_HEIGHT = 100, BALL_SIZE = 15;
const player = { x: 20, y: canvas.height / 2 - PADDLE_HEIGHT / 2, score: 0 };
const ai = { x: canvas.width - 35, y: canvas.height / 2 - PADDLE_HEIGHT / 2, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 5, dy: 5 };

let gameRunning = false;
let keys: any = {};

function update(): void {
  if (!gameRunning) return;
  
  if (keys['KeyW'] && player.y > 0) player.y -= 6;
  if (keys['KeyS'] && player.y < canvas.height - PADDLE_HEIGHT) player.y += 6;

  // 简单AI
  const aiCenter = ai.y + PADDLE_HEIGHT / 2;
  if (ball.y < aiCenter - 10) ai.y -= 4;
  if (ball.y > aiCenter + 10) ai.y += 4;
  ai.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, ai.y));

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y <= 0 || ball.y >= canvas.height - BALL_SIZE) ball.dy *= -1;

  if (ball.x <= player.x + PADDLE_WIDTH && ball.y + BALL_SIZE >= player.y && ball.y <= player.y + PADDLE_HEIGHT) {
    ball.dx = Math.abs(ball.dx);
  }
  if (ball.x + BALL_SIZE >= ai.x && ball.y + BALL_SIZE >= ai.y && ball.y <= ai.y + PADDLE_HEIGHT) {
    ball.dx = -Math.abs(ball.dx);
  }

  if (ball.x < 0) {
    ai.score++;
    updateUI();
    resetBall();
  }
  if (ball.x > canvas.width) {
    player.score++;
    updateUI();
    resetBall();
  }
}

function resetBall(): void {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = (Math.random() > 0.5 ? 5 : -5);
  ball.dy = (Math.random() > 0.5 ? 3 : -3);
}

function render(): void {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#0f0';
  ctx.fillRect(player.x, player.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(ai.x, ai.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
}

function gameLoop(): void {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function updateUI(): void {
  document.getElementById('player-score')!.textContent = player.score.toString();
  document.getElementById('ai-score')!.textContent = ai.score.toString();
}

document.addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'Space' && !gameRunning) gameRunning = true; });
document.addEventListener('keyup', e => keys[e.code] = false);

gameLoop();
console.log('🏓 Pong游戏加载完成！');
