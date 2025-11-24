/**
 * Snake Game - 使用 jsKid 引擎重构版本
 *
 * 展示功能：
 * - 游戏循环和更新机制
 * - 渲染系统
 * - 输入处理
 * - 碰撞检测（使用四叉树优化）
 */

import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';
import { Quadtree } from '../../packages/core/src/collision/quadtree';
import type { Collidable, Bounds } from '../../packages/core/src/collision/quadtree';

// 游戏常量
const GRID_SIZE = 20;
const COLS = 40;
const ROWS = 30;
const CANVAS_WIDTH = COLS * GRID_SIZE;
const CANVAS_HEIGHT = ROWS * GRID_SIZE;
const INITIAL_SPEED = 0.15; // 秒/格

// 方向枚举
enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

// 位置接口
interface Position {
  x: number;
  y: number;
}

// 蛇身体片段（实现 Collidable）
class SnakeSegment implements Collidable {
  constructor(public x: number, public y: number, public id: number) {}

  getBounds(): Bounds {
    return {
      x: this.x * GRID_SIZE,
      y: this.y * GRID_SIZE,
      width: GRID_SIZE,
      height: GRID_SIZE,
    };
  }
}

/**
 * Snake 游戏类
 */
class SnakeGame {
  private engine;
  private renderer: CanvasRenderer;
  private canvas: HTMLCanvasElement;
  private quadtree: Quadtree<SnakeSegment>;

  // 蛇
  private snake: SnakeSegment[] = [];
  private direction: Direction = Direction.RIGHT;
  private nextDirection: Direction = Direction.RIGHT;

  // 食物
  private food: Position = { x: 0, y: 0 };

  // 游戏状态
  private gameRunning = false;
  private gameOver = false;
  private score = 0;
  private moveTimer = 0;
  private speed = INITIAL_SPEED;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.renderer = new CanvasRenderer({ canvas: this.canvas });
    this.quadtree = new Quadtree({ x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }, 8);

    this.engine = createJskid({
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      fps: 60,
      autoStart: false,
    });

    this.bindEvents();
    this.bindKeyboard();
    this.reset();
  }

  private bindEvents(): void {
    this.engine.on('engine:update', (deltaTime: number) => {
      this.update(deltaTime);
    });

    this.engine.on('engine:render', () => {
      this.render();
    });
  }

  private bindKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.gameRunning) {
        this.startGame();
        return;
      }

      if (e.code === 'KeyR' && this.gameOver) {
        this.reset();
        return;
      }

      // 方向控制
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          if (this.direction !== Direction.DOWN) this.nextDirection = Direction.UP;
          break;
        case 'ArrowDown':
        case 'KeyS':
          if (this.direction !== Direction.UP) this.nextDirection = Direction.DOWN;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          if (this.direction !== Direction.RIGHT) this.nextDirection = Direction.LEFT;
          break;
        case 'ArrowRight':
        case 'KeyD':
          if (this.direction !== Direction.LEFT) this.nextDirection = Direction.RIGHT;
          break;
      }
    });
  }

  private reset(): void {
    // 初始化蛇
    this.snake = [
      new SnakeSegment(Math.floor(COLS / 2), Math.floor(ROWS / 2), 0),
      new SnakeSegment(Math.floor(COLS / 2) - 1, Math.floor(ROWS / 2), 1),
      new SnakeSegment(Math.floor(COLS / 2) - 2, Math.floor(ROWS / 2), 2),
    ];

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.gameRunning = false;
    this.gameOver = false;
    this.score = 0;
    this.speed = INITIAL_SPEED;
    this.moveTimer = 0;

    this.spawnFood();
    this.updateQuadtree();
  }

  private startGame(): void {
    this.gameRunning = true;
  }

  private spawnFood(): void {
    let validPosition = false;
    while (!validPosition) {
      this.food = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };

      // 检查是否与蛇身重叠
      validPosition = !this.snake.some((seg) => seg.x === this.food.x && seg.y === this.food.y);
    }
  }

  private updateQuadtree(): void {
    this.quadtree.clear();
    for (const segment of this.snake) {
      this.quadtree.insert(segment);
    }
  }

  private update(deltaTime: number): void {
    if (!this.gameRunning || this.gameOver) return;

    this.moveTimer += deltaTime;

    if (this.moveTimer >= this.speed) {
      this.moveTimer = 0;
      this.direction = this.nextDirection;
      this.moveSnake();
    }
  }

  private moveSnake(): void {
    const head = this.snake[0];
    let newX = head.x;
    let newY = head.y;

    // 根据方向移动
    switch (this.direction) {
      case Direction.UP:
        newY--;
        break;
      case Direction.DOWN:
        newY++;
        break;
      case Direction.LEFT:
        newX--;
        break;
      case Direction.RIGHT:
        newX++;
        break;
    }

    // 检查边界碰撞
    if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) {
      this.endGame();
      return;
    }

    // 检查自身碰撞（使用四叉树优化）
    const newHead = new SnakeSegment(newX, newY, -1);
    const nearby = this.quadtree.query(newHead.getBounds());
    if (nearby.length > 0) {
      this.endGame();
      return;
    }

    // 添加新头部
    this.snake.unshift(new SnakeSegment(newX, newY, 0));

    // 检查食物碰撞
    if (newX === this.food.x && newY === this.food.y) {
      this.score++;
      this.speed = Math.max(0.05, this.speed * 0.95); // 加速
      this.spawnFood();
    } else {
      // 移除尾部
      this.snake.pop();
    }

    // 更新四叉树
    this.updateQuadtree();
  }

  private endGame(): void {
    this.gameOver = true;
    this.gameRunning = false;
  }

  private render(): void {
    const ctx = this.renderer.getContext();

    // 清空画布
    this.renderer.clear('#000000');

    // 绘制网格
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * GRID_SIZE, 0);
      ctx.lineTo(x * GRID_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * GRID_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * GRID_SIZE);
      ctx.stroke();
    }

    // 绘制食物
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.food.x * GRID_SIZE, this.food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // 绘制蛇
    this.snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#00ff00';
      } else {
        const alpha = 1 - index / this.snake.length * 0.5;
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
      }
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });

    // 绘制分数
    ctx.fillStyle = '#00ff00';
    ctx.font = '20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.score}`, 10, 25);

    // 提示信息
    if (!this.gameRunning && !this.gameOver) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '16px monospace';
      ctx.fillText('Arrow Keys or WASD to move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    if (this.gameOver) {
      ctx.fillStyle = '#ff0000';
      ctx.font = '32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '20px monospace';
      ctx.fillText(`Final Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
      ctx.font = '16px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Press R to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
    }

    // 引擎标识
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('jsKid Engine + Quadtree', CANVAS_WIDTH - 10, 20);
  }

  start(): void {
    console.log('🐍 Snake Game - jsKid 引擎版本');
    console.log('✅ 使用四叉树优化碰撞检测');
    console.log('🎮 按空格开始，方向键或WASD控制');
    this.engine.start();
  }
}

// 启动游戏
const game = new SnakeGame('gameCanvas');
game.start();
