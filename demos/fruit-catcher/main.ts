/**
 * Fruit Catcher - 使用 jsKid 引擎重构版本
 */

import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const FRUITS = ['🍎', '🍊', '🍌', '🍇', '🍓', '🍑', '🍉', '🍒'];

class FruitCatcher {
  private engine;
  private renderer: CanvasRenderer;
  private basket = { x: CANVAS_WIDTH / 2 - 50, y: CANVAS_HEIGHT - 50, width: 100, height: 30 };
  private fruits: Array<{ x: number; y: number; size: number; speed: number; emoji: string }> = [];
  private score = 0;
  private missed = 0;
  private gameRunning = false;
  private keys: { [key: string]: boolean } = {};

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    this.renderer = new CanvasRenderer({ canvas });
    this.engine = createJskid({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT, fps: 60, autoStart: false });

    this.engine.on('engine:update', () => this.update());
    this.engine.on('engine:render', () => this.render());

    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' && !this.gameRunning) this.startGame();
    });
    document.addEventListener('keyup', (e) => (this.keys[e.code] = false));
  }

  private startGame(): void {
    this.score = 0;
    this.missed = 0;
    this.fruits = [];
    this.gameRunning = true;
    document.getElementById('game-over')!.classList.remove('active');
    this.updateUI();
  }

  private update(): void {
    if (!this.gameRunning) return;

    // 移动篮子
    if (this.keys['ArrowLeft'] && this.basket.x > 0) this.basket.x -= 8;
    if (this.keys['ArrowRight'] && this.basket.x < CANVAS_WIDTH - this.basket.width) this.basket.x += 8;

    // 生成水果
    if (Math.random() < 0.02) {
      this.fruits.push({
        x: Math.random() * (CANVAS_WIDTH - 30),
        y: -30,
        size: 30,
        speed: 2 + Math.random() * 3,
        emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
      });
    }

    // 更新水果
    for (let i = this.fruits.length - 1; i >= 0; i--) {
      const f = this.fruits[i];
      f.y += f.speed;

      // 接到水果
      if (
        f.y + f.size > this.basket.y &&
        f.x + f.size > this.basket.x &&
        f.x < this.basket.x + this.basket.width
      ) {
        this.fruits.splice(i, 1);
        this.score += 10;
        this.updateUI();
      }
      // 漏掉水果
      else if (f.y > CANVAS_HEIGHT) {
        this.fruits.splice(i, 1);
        this.missed++;
        this.updateUI();
        if (this.missed >= 10) this.endGame();
      }
    }
  }

  private render(): void {
    const ctx = this.renderer.getContext();
    this.renderer.clear('#e8f5e9');

    // 篮子
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(this.basket.x, this.basket.y, this.basket.width, this.basket.height);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.basket.x, this.basket.y, this.basket.width, this.basket.height);

    // 水果
    this.fruits.forEach((f) => {
      ctx.font = `${f.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(f.emoji, f.x + f.size / 2, f.y + f.size);
    });

    // 提示
    if (!this.gameRunning) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Fruit Catcher', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '18px Arial';
      ctx.fillText('按空格开始,方向键移动', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }

    ctx.fillStyle = '#000';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('jsKid Engine', CANVAS_WIDTH - 10, 20);
  }

  private endGame(): void {
    this.gameRunning = false;
    document.getElementById('game-over')!.classList.add('active');
    document.getElementById('final-score')!.textContent = this.score.toString();
  }

  private updateUI(): void {
    document.getElementById('score')!.textContent = this.score.toString();
    document.getElementById('missed')!.textContent = this.missed.toString();
  }

  start(): void {
    console.log('🍎 Fruit Catcher - jsKid引擎版本');
    this.engine.start();
  }
}

new FruitCatcher('gameCanvas').start();
document.getElementById('restart-btn')?.addEventListener('click', () => window.location.reload());
