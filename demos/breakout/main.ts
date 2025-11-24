/**
 * 打砖块游戏
 * 经典的打砖块游戏，展示物理反弹和关卡系统
 */

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// 游戏配置
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_WIDTH = canvas.width / BRICK_COLS;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 2;

// 游戏对象
interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  speed: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number;
  maxHits: number;
  visible: boolean;
  color: string;
}

// 游戏状态
let paddle: Paddle;
let ball: Ball;
let bricks: Brick[] = [];
let score: number = 0;
let lives: number = 3;
let level: number = 1;
let gameRunning: boolean = false;
let keys: { [key: string]: boolean } = {};

// 颜色配置
const BRICK_COLORS = [
  '#e74c3c', // 红色 - 5次
  '#e67e22', // 橙色 - 4次
  '#f39c12', // 黄色 - 3次
  '#2ecc71', // 绿色 - 2次
  '#3498db'  // 蓝色 - 1次
];

// 初始化游戏
function initGame(): void {
  paddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: canvas.height - 40,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 6
  };

  resetBall();
  createBricks();
  updateUI();
}

// 重置球
function resetBall(): void {
  ball = {
    x: canvas.width / 2,
    y: paddle.y - BALL_RADIUS - 5,
    dx: 4,
    dy: -4,
    radius: BALL_RADIUS,
    speed: 4
  };
}

// 创建砖块
function createBricks(): void {
  bricks = [];
  const offsetY = 60;

  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      const maxHits = BRICK_ROWS - row;
      bricks.push({
        x: col * BRICK_WIDTH + BRICK_PADDING,
        y: row * BRICK_HEIGHT + offsetY + BRICK_PADDING,
        width: BRICK_WIDTH - BRICK_PADDING * 2,
        height: BRICK_HEIGHT - BRICK_PADDING * 2,
        hits: 0,
        maxHits: maxHits,
        visible: true,
        color: BRICK_COLORS[maxHits - 1]
      });
    }
  }
}

// 更新游戏逻辑
function update(): void {
  if (!gameRunning) return;

  // 移动挡板
  if (keys['ArrowLeft'] && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }
  if (keys['ArrowRight'] && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.speed;
  }

  // 移动球
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 球与墙壁碰撞
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.dx *= -1;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // 球与挡板碰撞
  if (ball.y + ball.radius > paddle.y &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width) {

    // 根据击球位置改变反弹角度
    const hitPos = (ball.x - paddle.x) / paddle.width;
    const angle = (hitPos - 0.5) * Math.PI * 0.6; // -54° 到 +54°

    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = Math.sin(angle) * speed;
    ball.dy = -Math.abs(Math.cos(angle) * speed);
  }

  // 球掉落
  if (ball.y - ball.radius > canvas.height) {
    lives--;
    updateUI();

    if (lives <= 0) {
      gameOver();
    } else {
      resetBall();
      gameRunning = false;
      setTimeout(() => {
        gameRunning = true;
      }, 1000);
    }
  }

  // 球与砖块碰撞
  bricks.forEach(brick => {
    if (!brick.visible) return;

    if (ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height) {

      // 确定碰撞方向
      const overlapX = Math.min(
        ball.x + ball.radius - brick.x,
        brick.x + brick.width - (ball.x - ball.radius)
      );
      const overlapY = Math.min(
        ball.y + ball.radius - brick.y,
        brick.y + brick.height - (ball.y - ball.radius)
      );

      if (overlapX < overlapY) {
        ball.dx *= -1;
      } else {
        ball.dy *= -1;
      }

      brick.hits++;
      if (brick.hits >= brick.maxHits) {
        brick.visible = false;
        score += brick.maxHits * 10;
        updateUI();

        // 检查是否通关
        if (bricks.every(b => !b.visible)) {
          levelComplete();
        }
      } else {
        brick.color = BRICK_COLORS[brick.maxHits - brick.hits - 1];
        score += 5;
        updateUI();
      }
    }
  });
}

// 渲染游戏
function render(): void {
  // 清空画布
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制背景星星
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 50; i++) {
    const x = (i * 137 + Date.now() * 0.01) % canvas.width;
    const y = (i * 197) % canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }

  // 绘制砖块
  bricks.forEach(brick => {
    if (!brick.visible) return;

    // 砖块主体
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

    // 高光效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(brick.x, brick.y, brick.width, 5);

    // 显示剩余耐久度
    if (brick.maxHits > 1) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        (brick.maxHits - brick.hits).toString(),
        brick.x + brick.width / 2,
        brick.y + brick.height / 2
      );
    }
  });

  // 绘制挡板
  const gradient = ctx.createLinearGradient(
    paddle.x,
    paddle.y,
    paddle.x,
    paddle.y + paddle.height
  );
  gradient.addColorStop(0, '#3498db');
  gradient.addColorStop(1, '#2980b9');

  ctx.fillStyle = gradient;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // 挡板高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, 3);

  // 绘制球
  ctx.fillStyle = '#ffd700';
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ffd700';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 球的轨迹效果
  ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.beginPath();
  ctx.arc(ball.x - ball.dx * 2, ball.y - ball.dy * 2, ball.radius * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // 如果游戏未开始，显示提示
  if (!gameRunning && lives > 0) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('按空格键开始', canvas.width / 2, canvas.height / 2);
  }
}

// 游戏循环
function gameLoop(): void {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// 关卡完成
function levelComplete(): void {
  gameRunning = false;
  level++;

  // 增加难度
  ball.speed *= 1.1;

  setTimeout(() => {
    createBricks();
    resetBall();
    gameRunning = true;
  }, 2000);

  // 显示关卡完成提示
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('关卡完成!', canvas.width / 2, canvas.height / 2);
  ctx.font = '20px Arial';
  ctx.fillText(`准备进入第 ${level} 关`, canvas.width / 2, canvas.height / 2 + 50);
}

// 游戏结束
function gameOver(): void {
  gameRunning = false;
  document.getElementById('game-over')!.classList.add('active');
  document.getElementById('final-score')!.textContent = score.toString();
  document.getElementById('final-level')!.textContent = level.toString();
}

// 开始游戏
function startGame(): void {
  if (!gameRunning && lives > 0) {
    gameRunning = true;
  }
}

// 重新开始
function restart(): void {
  score = 0;
  lives = 3;
  level = 1;
  gameRunning = false;
  document.getElementById('game-over')!.classList.remove('active');
  initGame();
}

// 更新UI
function updateUI(): void {
  document.getElementById('score')!.textContent = score.toString();
  document.getElementById('lives')!.textContent = lives.toString();
  document.getElementById('level')!.textContent = level.toString();
}

// 键盘事件
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;

  if (e.code === 'Space') {
    e.preventDefault();
    startGame();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// 鼠标控制
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddle.x = mouseX - paddle.width / 2;
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
});

// 重新开始按钮
document.getElementById('restart-btn')?.addEventListener('click', restart);

// 初始化并启动
initGame();
gameLoop();

console.log('🧱 打砖块游戏加载完成！');
