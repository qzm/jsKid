/**
 * Tetris Game - 使用 jsKid 引擎重构版本
 *
 * 展示功能：
 * - jsKid 游戏循环和渲染系统
 * - 粒子系统 (消除行特效)
 * - 游戏状态管理
 * - 难度递增系统
 */

import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';
import { ParticleEmitter, ParticlePresets } from '../../packages/sprite/src/particle/index';

// 游戏常量
const BLOCK_SIZE = 30;
const COLS = 10;
const ROWS = 20;
const CANVAS_WIDTH = COLS * BLOCK_SIZE;
const CANVAS_HEIGHT = ROWS * BLOCK_SIZE;

// 方块形状定义
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [1, 1, 1],
    [0, 1, 0],
  ], // T
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // L
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // J
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
];

const COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];

/**
 * 方块片段接口
 */
interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

/**
 * Tetris 游戏类
 */
class TetrisGame {
  private engine;
  private renderer: CanvasRenderer;
  private canvas: HTMLCanvasElement;

  // 游戏数据
  private board: number[][] = [];
  private currentPiece: Piece | null = null;
  private nextPiece: Piece | null = null;
  private ghostPiece: Piece | null = null; // 预览落点

  // 粒子系统
  private particleEmitters: ParticleEmitter[] = [];

  // 游戏状态
  private score = 0;
  private lines = 0;
  private level = 1;
  private gameRunning = false;
  private gameOver = false;
  private dropTimer = 0;
  private dropInterval = 1.0; // 秒

  // 输入状态
  private keys: { [key: string]: boolean } = {};
  private moveDelay = 0.15; // 秒
  private moveTimer = 0;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.renderer = new CanvasRenderer({ canvas: this.canvas });

    this.engine = createJskid({
      debug: false,
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
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'Space' && !this.gameRunning) {
        this.startGame();
        return;
      }

      if (!this.gameRunning || this.gameOver) return;

      switch (e.code) {
        case 'ArrowUp':
        case 'KeyX':
          this.rotatePiece();
          break;
        case 'Space':
          this.hardDrop();
          break;
        case 'ArrowDown':
          this.drop();
          break;
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  private createBoard(): void {
    this.board = Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(0));
  }

  private createPiece(): Piece {
    const index = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[index],
      color: COLORS[index],
      x: Math.floor(COLS / 2) - Math.floor(SHAPES[index][0].length / 2),
      y: 0,
    };
  }

  private reset(): void {
    this.createBoard();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = 1.0;
    this.gameOver = false;
    this.gameRunning = false;
    this.currentPiece = this.createPiece();
    this.nextPiece = this.createPiece();
    this.updateGhostPiece();
    this.updateUI();
  }

  private startGame(): void {
    this.gameRunning = true;
    this.dropTimer = 0;
  }

  private collide(piece: Piece): boolean {
    return piece.shape.some((row, dy) => {
      return row.some((value, dx) => {
        if (!value) return false;
        const x = piece.x + dx;
        const y = piece.y + dy;
        return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && this.board[y][x]);
      });
    });
  }

  private merge(): void {
    this.currentPiece!.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = this.currentPiece!.y + y;
          const boardX = this.currentPiece!.x + x;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            this.board[boardY][boardX] = COLORS.indexOf(this.currentPiece!.color) + 1;
          }
        }
      });
    });
  }

  private clearLines(): void {
    let linesCleared = 0;
    const clearedRows: number[] = [];

    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.board[y].every((cell) => cell !== 0)) {
        // 创建消除特效
        this.createLineClearEffect(y);
        clearedRows.push(y);
        linesCleared++;
      }
    }

    // 移除已清除的行
    for (const y of clearedRows) {
      this.board.splice(y, 1);
      this.board.unshift(Array(COLS).fill(0));
    }

    if (linesCleared > 0) {
      this.lines += linesCleared;
      this.score += [0, 100, 300, 500, 800][linesCleared] * this.level;
      this.level = Math.floor(this.lines / 10) + 1;
      this.dropInterval = Math.max(0.1, 1.0 - (this.level - 1) * 0.1);
      this.updateUI();
    }
  }

  private rotate(piece: Piece): number[][] {
    const newShape = piece.shape[0].map((_, i) => piece.shape.map((row) => row[i]).reverse());
    return newShape;
  }

  private move(dx: number): void {
    if (!this.currentPiece) return;
    this.currentPiece.x += dx;
    if (this.collide(this.currentPiece)) {
      this.currentPiece.x -= dx;
    } else {
      this.updateGhostPiece();
    }
  }

  private drop(): void {
    if (!this.currentPiece) return;
    this.currentPiece.y++;
    if (this.collide(this.currentPiece)) {
      this.currentPiece.y--;
      this.merge();
      this.clearLines();
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.createPiece();
      this.updateGhostPiece();

      if (this.collide(this.currentPiece!)) {
        this.endGame();
      }
    }
    this.dropTimer = 0;
  }

  private hardDrop(): void {
    if (!this.currentPiece) return;
    while (!this.collide(this.currentPiece)) {
      this.currentPiece.y++;
    }
    this.currentPiece.y--;
    this.drop();
  }

  private rotatePiece(): void {
    if (!this.currentPiece) return;
    const originalShape = this.currentPiece.shape;
    this.currentPiece.shape = this.rotate(this.currentPiece);

    // 尝试墙踢（Wall Kick）
    const kicks = [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
    ];

    let success = false;
    for (const kick of kicks) {
      this.currentPiece.x += kick.x;
      this.currentPiece.y += kick.y;
      if (!this.collide(this.currentPiece)) {
        success = true;
        break;
      }
      this.currentPiece.x -= kick.x;
      this.currentPiece.y -= kick.y;
    }

    if (!success) {
      this.currentPiece.shape = originalShape;
    } else {
      this.updateGhostPiece();
    }
  }

  private updateGhostPiece(): void {
    if (!this.currentPiece) return;

    this.ghostPiece = {
      ...this.currentPiece,
      shape: this.currentPiece.shape.map((row) => [...row]),
    };

    while (!this.collide(this.ghostPiece)) {
      this.ghostPiece.y++;
    }
    this.ghostPiece.y--;
  }

  private update(deltaTime: number): void {
    // 更新粒子
    for (let i = this.particleEmitters.length - 1; i >= 0; i--) {
      const emitter = this.particleEmitters[i];
      emitter.update(deltaTime);

      if (emitter.getParticleCount() === 0 && !emitter.isEmitting()) {
        this.particleEmitters.splice(i, 1);
      }
    }

    if (!this.gameRunning || this.gameOver) return;

    // 自动下落
    this.dropTimer += deltaTime;
    if (this.dropTimer >= this.dropInterval) {
      this.drop();
    }

    // 处理持续按键
    this.moveTimer += deltaTime;
    if (this.moveTimer >= this.moveDelay) {
      if (this.keys['ArrowLeft']) {
        this.move(-1);
        this.moveTimer = 0;
      }
      if (this.keys['ArrowRight']) {
        this.move(1);
        this.moveTimer = 0;
      }
      if (this.keys['ArrowDown']) {
        this.drop();
        this.moveTimer = 0;
      }
    }
  }

  private render(): void {
    const ctx = this.renderer.getContext();

    // 背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制网格
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * BLOCK_SIZE);
      ctx.stroke();
    }

    // 绘制已放置的方块
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (this.board[y][x]) {
          this.drawBlock(ctx, x, y, COLORS[this.board[y][x] - 1]);
        }
      }
    }

    // 绘制幽灵方块（预览落点）
    if (this.ghostPiece && this.gameRunning) {
      ctx.globalAlpha = 0.3;
      this.drawPiece(ctx, this.ghostPiece);
      ctx.globalAlpha = 1.0;
    }

    // 绘制当前方块
    if (this.currentPiece) {
      this.drawPiece(ctx, this.currentPiece);
    }

    // 渲染粒子
    for (const emitter of this.particleEmitters) {
      emitter.render(ctx);
    }

    // 提示信息
    if (!this.gameRunning && !this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Tetris', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

      ctx.font = '16px Arial';
      ctx.fillText('按空格键开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '12px Arial';
      ctx.fillText('方向键移动/旋转', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
      ctx.fillText('空格键快速下落', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }

    // 引擎标识
    ctx.fillStyle = '#00ff00';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('jsKid Engine', CANVAS_WIDTH - 5, 12);
  }

  private drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    // 方块主体
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

    // 高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, 4);
    ctx.fillRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, 4, BLOCK_SIZE - 4);

    // 阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + BLOCK_SIZE - 6, BLOCK_SIZE - 4, 4);
    ctx.fillRect(x * BLOCK_SIZE + BLOCK_SIZE - 6, y * BLOCK_SIZE + 2, 4, BLOCK_SIZE - 4);

    // 边框
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  private drawPiece(ctx: CanvasRenderingContext2D, piece: Piece): void {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.drawBlock(ctx, piece.x + x, piece.y + y, piece.color);
        }
      });
    });
  }

  private createLineClearEffect(row: number): void {
    // 为每个方块创建爆炸效果
    for (let x = 0; x < COLS; x++) {
      const centerX = x * BLOCK_SIZE + BLOCK_SIZE / 2;
      const centerY = row * BLOCK_SIZE + BLOCK_SIZE / 2;

      const explosion = ParticlePresets.explosionPreset(centerX, centerY);
      explosion.maxParticles = 10;
      explosion.particleConfig.startColor = COLORS[this.board[row][x] - 1];
      explosion.particleConfig.endColor = '#ffffff';

      this.particleEmitters.push(new ParticleEmitter(explosion));
    }
  }

  private endGame(): void {
    this.gameOver = true;
    this.gameRunning = false;

    document.getElementById('game-over')!.classList.add('active');
    document.getElementById('final-score')!.textContent = this.score.toString();
  }

  private updateUI(): void {
    document.getElementById('score')!.textContent = this.score.toString();
    document.getElementById('lines')!.textContent = this.lines.toString();
    document.getElementById('level')!.textContent = this.level.toString();
  }

  start(): void {
    console.log('🧩 Tetris Game - jsKid 引擎版本');
    console.log('✅ 粒子系统已启用 (消除特效)');
    console.log('✅ 幽灵方块预览');
    console.log('🎮 按空格开始，方向键控制');
    this.engine.start();
  }

  destroy(): void {
    this.engine.destroy();
  }
}

// 启动游戏
const game = new TetrisGame('gameCanvas');
game.start();

// 重新开始按钮
document.getElementById('restart-btn')?.addEventListener('click', () => {
  window.location.reload();
});
