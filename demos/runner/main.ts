/**
 * Runner Game - 使用 jsKid 引擎重构版本
 *
 * 展示功能：
 * - jsKid 游戏循环
 * - 简单物理模拟 (跳跃)
 * - 碰撞检测
 * - 难度递增
 */

import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = CANVAS_HEIGHT - 40;

class Runner {
  private engine;
  private renderer: CanvasRenderer;
  private canvas: HTMLCanvasElement;

  // 游戏对象
  private player = { x: 100, y: GROUND_Y - 60, width: 40, height: 60, dy: 0, jumping: false };
  private obstacles: Array<{ x: number; y: number; width: number; height: number }> = [];

  // 游戏状态
  private score = 0;
  private gameSpeed = 5;
  private gameRunning = false;
  private gameOver = false;
  private frame = 0;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.renderer = new CanvasRenderer(this.canvas);

    this.engine = createJskid({
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      fps: 60,
      autoStart: false,
    });

    this.bindEvents();
    this.bindKeyboard();
  }

  private bindEvents(): void {
    this.engine.on('engine:update', () => {
      this.update();
    });

    this.engine.on('engine:render', () => {
      this.render();
    });
  }

  private bindKeyboard(): void {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();

        if (!this.gameRunning) {
          this.startGame();
        } else if (!this.player.jumping) {
          this.jump();
        }
      }
    });
  }

  private startGame(): void {
    this.player.y = GROUND_Y - 60;
    this.player.dy = 0;
    this.player.jumping = false;
    this.obstacles = [];
    this.score = 0;
    this.gameSpeed = 5;
    this.frame = 0;
    this.gameRunning = true;
    this.gameOver = false;
    document.getElementById('game-over')!.classList.remove('active');
    this.updateUI();
  }

  private jump(): void {
    this.player.jumping = true;
    this.player.dy = -15;
  }

  private update(): void {
    if (!this.gameRunning || this.gameOver) return;

    // 更新玩家跳跃
    if (this.player.jumping) {
      this.player.dy += 0.8; // 重力
      this.player.y += this.player.dy;

      if (this.player.y >= GROUND_Y - 60) {
        this.player.y = GROUND_Y - 60;
        this.player.jumping = false;
        this.player.dy = 0;
      }
    }

    // 生成障碍物
    if (this.frame % 100 === 0) {
      this.obstacles.push({
        x: CANVAS_WIDTH,
        y: GROUND_Y - 60,
        width: 30,
        height: 60,
      });
    }

    // 更新障碍物
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.gameSpeed;

      // 移除离开屏幕的障碍物
      if (obs.x + obs.width < 0) {
        this.obstacles.splice(i, 1);
        this.score += 10;
        this.updateUI();
      }

      // 碰撞检测
      if (
        this.player.x < obs.x + obs.width &&
        this.player.x + this.player.width > obs.x &&
        this.player.y < obs.y + obs.height &&
        this.player.y + this.player.height > obs.y
      ) {
        this.endGame();
      }
    }

    // 难度递增
    if (this.frame % 500 === 0) {
      this.gameSpeed += 0.5;
    }

    this.frame++;
  }

  private render(): void {
    const ctx = this.renderer.getContext();

    // 天空背景
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#e0f6ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 地面
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 40);

    // 地面装饰
    ctx.fillStyle = '#654321';
    for (let x = 0; x < CANVAS_WIDTH; x += 20) {
      ctx.fillRect(x, GROUND_Y, 15, 5);
    }

    // 玩家
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

    // 玩家眼睛
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.player.x + 10, this.player.y + 15, 5, 5);
    ctx.fillRect(this.player.x + 25, this.player.y + 15, 5, 5);

    // 障碍物
    for (const obs of this.obstacles) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

      // 障碍物装饰
      ctx.fillStyle = '#aa0000';
      ctx.fillRect(obs.x + 5, obs.y + 10, obs.width - 10, obs.height - 20);
    }

    // 提示信息
    if (!this.gameRunning && !this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Runner', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
      ctx.font = '20px Arial';
      ctx.fillText('按空格键开始/跳跃', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
    }

    // 引擎标识
    ctx.fillStyle = '#000000';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('jsKid Engine', CANVAS_WIDTH - 10, 20);
  }

  private endGame(): void {
    this.gameOver = true;
    this.gameRunning = false;
    document.getElementById('game-over')!.classList.add('active');
    document.getElementById('final-score')!.textContent = this.score.toString();
  }

  private updateUI(): void {
    document.getElementById('score')!.textContent = this.score.toString();
  }

  start(): void {
    console.log('🏃 Runner Game - jsKid 引擎版本');
    console.log('🎮 按空格跳跃');
    this.engine.start();
  }
}

const game = new Runner('gameCanvas');
game.start();

document.getElementById('restart-btn')?.addEventListener('click', () => {
  window.location.reload();
});
