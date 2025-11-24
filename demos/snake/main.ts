/**
 * 贪吃蛇游戏
 * 经典的贪吃蛇游戏，展示网格系统和碰撞检测
 */

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// 游戏配置
const GRID_SIZE = 20;
const COLS = canvas.width / GRID_SIZE;
const ROWS = canvas.height / GRID_SIZE;
const INITIAL_SPEED = 150; // ms per move
const SPEED_INCREASE = 5; // ms decrease per food

// 方向枚举
enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

// 位置接口
interface Position {
  x: number;
  y: number;
}

// 游戏状态
let snake: Position[] = [];
let direction: Direction = Direction.RIGHT;
let nextDirection: Direction = Direction.RIGHT;
let food: Position = { x: 0, y: 0 };
let score: number = 0;
let highScore: number = 0;
let speed: number = INITIAL_SPEED;
let gameRunning: boolean = false;
let lastMoveTime: number = 0;

// 颜色主题
const COLORS = {
  background: '#1a1a2e',
  grid: '#16213e',
  snake: '#0f3460',
  snakeHead: '#e94560',
  food: '#ffd700',
  text: '#ffffff'
};

// 初始化游戏
function initGame(): void {
  // 加载最高分
  const saved = localStorage.getItem('snake-highscore');
  if (saved) {
    highScore = parseInt(saved);
  }

  resetGame();
}

// 重置游戏
function resetGame(): void {
  // 初始化蛇在中心
  const startX = Math.floor(COLS / 2);
  const startY = Math.floor(ROWS / 2);

  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY }
  ];

  direction = Direction.RIGHT;
  nextDirection = Direction.RIGHT;
  score = 0;
  speed = INITIAL_SPEED;
  spawnFood();
  updateUI();
}

// 生成食物
function spawnFood(): void {
  let validPosition = false;

  while (!validPosition) {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };

    // 确保食物不在蛇身上
    validPosition = !snake.some(segment =>
      segment.x === food.x && segment.y === food.y
    );
  }
}

// 移动蛇
function moveSnake(): void {
  // 更新方向
  direction = nextDirection;

  // 计算新头部位置
  const head = { ...snake[0] };

  switch (direction) {
    case Direction.UP:
      head.y--;
      break;
    case Direction.DOWN:
      head.y++;
      break;
    case Direction.LEFT:
      head.x--;
      break;
    case Direction.RIGHT:
      head.x++;
      break;
  }

  // 检查碰撞
  if (checkCollision(head)) {
    gameOver();
    return;
  }

  // 添加新头部
  snake.unshift(head);

  // 检查是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    speed = Math.max(50, speed - SPEED_INCREASE);
    spawnFood();
    updateUI();

    // 保存最高分
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snake-highscore', highScore.toString());
    }
  } else {
    // 移除尾部
    snake.pop();
  }
}

// 检查碰撞
function checkCollision(pos: Position): boolean {
  // 撞墙
  if (pos.x < 0 || pos.x >= COLS || pos.y < 0 || pos.y >= ROWS) {
    return true;
  }

  // 撞自己
  return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}

// 渲染游戏
function render(): void {
  // 清空画布
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制网格
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_SIZE, 0);
    ctx.lineTo(i * GRID_SIZE, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i <= ROWS; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_SIZE);
    ctx.lineTo(canvas.width, i * GRID_SIZE);
    ctx.stroke();
  }

  // 绘制食物（带动画效果）
  const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;
  ctx.fillStyle = COLORS.food;
  ctx.shadowBlur = 15;
  ctx.shadowColor = COLORS.food;
  ctx.beginPath();
  ctx.arc(
    food.x * GRID_SIZE + GRID_SIZE / 2,
    food.y * GRID_SIZE + GRID_SIZE / 2,
    (GRID_SIZE / 2 - 2) * pulse,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.shadowBlur = 0;

  // 绘制蛇
  snake.forEach((segment, index) => {
    if (index === 0) {
      // 蛇头
      ctx.fillStyle = COLORS.snakeHead;
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS.snakeHead;
    } else {
      // 蛇身（渐变色）
      const alpha = 1 - (index / snake.length) * 0.5;
      ctx.fillStyle = COLORS.snake;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 0;
    }

    ctx.fillRect(
      segment.x * GRID_SIZE + 1,
      segment.y * GRID_SIZE + 1,
      GRID_SIZE - 2,
      GRID_SIZE - 2
    );

    ctx.globalAlpha = 1;
  });

  ctx.shadowBlur = 0;

  // 如果游戏未开始，显示提示
  if (!gameRunning) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('按空格键开始', canvas.width / 2, canvas.height / 2);
    ctx.font = '16px Arial';
    ctx.fillText('使用方向键控制', canvas.width / 2, canvas.height / 2 + 40);
  }
}

// 游戏循环
function gameLoop(currentTime: number): void {
  requestAnimationFrame(gameLoop);

  render();

  if (!gameRunning) return;

  // 基于时间的移动
  if (currentTime - lastMoveTime > speed) {
    moveSnake();
    lastMoveTime = currentTime;
  }
}

// 游戏结束
function gameOver(): void {
  gameRunning = false;

  // 显示游戏结束
  document.getElementById('game-over')!.classList.add('active');
  document.getElementById('final-score')!.textContent = score.toString();
}

// 开始游戏
function startGame(): void {
  if (!gameRunning) {
    gameRunning = true;
    lastMoveTime = performance.now();
    document.getElementById('game-over')!.classList.remove('active');
  }
}

// 更新UI
function updateUI(): void {
  document.getElementById('score')!.textContent = score.toString();
  document.getElementById('high-score')!.textContent = highScore.toString();
  document.getElementById('length')!.textContent = snake.length.toString();
}

// 键盘控制
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameRunning) {
      startGame();
    }
    return;
  }

  if (!gameRunning) return;

  switch (e.code) {
    case 'ArrowUp':
      if (direction !== Direction.DOWN) {
        nextDirection = Direction.UP;
      }
      break;
    case 'ArrowDown':
      if (direction !== Direction.UP) {
        nextDirection = Direction.DOWN;
      }
      break;
    case 'ArrowLeft':
      if (direction !== Direction.RIGHT) {
        nextDirection = Direction.LEFT;
      }
      break;
    case 'ArrowRight':
      if (direction !== Direction.LEFT) {
        nextDirection = Direction.RIGHT;
      }
      break;
  }
});

// 重新开始按钮
document.getElementById('restart-btn')?.addEventListener('click', () => {
  resetGame();
  startGame();
});

// 初始化
initGame();
requestAnimationFrame(gameLoop);

console.log('🐍 贪吃蛇游戏加载完成！');
