/**
 * Flappy Bird游戏
 */
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const bird = { x: 100, y: 300, dy: 0, size: 30, gravity: 0.5, jump: -10 };
const pipes: any[] = [];
let score = 0, gameRunning = false, frame = 0;

function createPipe() {
  const gap = 150, minHeight = 50, maxHeight = canvas.height - gap - minHeight;
  const height = Math.random() * (maxHeight - minHeight) + minHeight;
  pipes.push({ x: canvas.width, top: height, bottom: height + gap });
}

function update() {
  if (!gameRunning) return;
  bird.dy += bird.gravity;
  bird.y += bird.dy;
  if (bird.y < 0 || bird.y > canvas.height - bird.size) gameOver();

  if (frame % 90 === 0) createPipe();
  pipes.forEach((pipe, i) => {
    pipe.x -= 3;
    if (pipe.x + 60 < 0) pipes.splice(i, 1);
    if (bird.x < pipe.x + 60 && bird.x + bird.size > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)) gameOver();
    if (pipe.x + 30 === bird.x) { score++; updateUI(); }
  });
  frame++;
}

function render() {
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f39c12';
  ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
  ctx.fillStyle = '#27ae60';
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, 60, p.top);
    ctx.fillRect(p.x, p.bottom, 60, canvas.height - p.bottom);
  });
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
      bird.y = 300; bird.dy = 0; pipes.length = 0; score = 0; frame = 0;
      gameRunning = true;
      document.getElementById('game-over')!.classList.remove('active');
      updateUI();
    } else {
      bird.dy = bird.jump;
    }
  }
});

gameLoop();
console.log('🐦 Flappy Bird加载完成！');
