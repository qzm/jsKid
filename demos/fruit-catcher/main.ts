/**
 * 接水果游戏
 */
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const basket = { x: canvas.width / 2 - 50, y: canvas.height - 40, width: 100, height: 30, speed: 8 };
const fruits: any[] = [];
const FRUITS = ['🍎', '🍊', '🍌', '🍇', '🍓'];
let score = 0, missed = 0, gameRunning = false, keys: any = {};

function createFruit() {
  fruits.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    size: 30,
    speed: 2 + Math.random() * 3,
    emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)]
  });
}

function update() {
  if (!gameRunning) return;
  if (keys['ArrowLeft'] && basket.x > 0) basket.x -= basket.speed;
  if (keys['ArrowRight'] && basket.x < canvas.width - basket.width) basket.x += basket.speed;

  fruits.forEach((f, i) => {
    f.y += f.speed;
    if (f.y + f.size > basket.y && f.x + f.size > basket.x && f.x < basket.x + basket.width) {
      fruits.splice(i, 1);
      score += 10;
      updateUI();
    } else if (f.y > canvas.height) {
      fruits.splice(i, 1);
      missed++;
      updateUI();
      if (missed >= 10) gameOver();
    }
  });

  if (Math.random() < 0.02) createFruit();
}

function render() {
  ctx.fillStyle = '#e8f5e9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
  fruits.forEach(f => {
    ctx.font = `${f.size}px Arial`;
    ctx.fillText(f.emoji, f.x, f.y);
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
  document.getElementById('missed')!.textContent = missed.toString();
}

document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space' && !gameRunning) {
    score = 0; missed = 0; fruits.length = 0; gameRunning = true;
    document.getElementById('game-over')!.classList.remove('active');
    updateUI();
  }
});
document.addEventListener('keyup', e => keys[e.code] = false);

gameLoop();
console.log('🍎 接水果游戏加载完成！');
