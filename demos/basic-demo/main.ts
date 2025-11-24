/**
 * jsKid基础演示 - 使用 jsKid 引擎重构版本
 * 展示引擎核心功能:
 * - 游戏循环和事件系统
 * - 渲染器使用
 * - 向量和颜色工具
 * - 键盘交互
 */

import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';
import { Vector2, Color } from '../../packages/utils/src/index';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

/**
 * 演示对象类
 */
class DemoObject {
  position: Vector2;
  velocity: Vector2;
  color: Color;
  size: number;

  constructor(x: number, y: number) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(Math.random() * 200 - 100, Math.random() * 200 - 100);
    this.color = Color.random();
    this.size = 20 + Math.random() * 30;
  }

  update(deltaTime: number, width: number, height: number): void {
    // 更新位置
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // 边界反弹
    if (this.position.x < this.size / 2 || this.position.x > width - this.size / 2) {
      this.velocity.x *= -1;
      this.position.x = Math.max(this.size / 2, Math.min(width - this.size / 2, this.position.x));
    }
    if (this.position.y < this.size / 2 || this.position.y > height - this.size / 2) {
      this.velocity.y *= -1;
      this.position.y = Math.max(this.size / 2, Math.min(height - this.size / 2, this.position.y));
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // 绘制主体
    ctx.fillStyle = this.color.toRGBA();
    ctx.fillRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);

    // 绘制高光效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(this.position.x - this.size / 2 + 2, this.position.y - this.size / 2 + 2, this.size / 2, this.size / 2);
  }
}

/**
 * 基础演示类
 */
class BasicDemo {
  private engine;
  private renderer: CanvasRenderer;
  private canvas: HTMLCanvasElement;
  private demoObjects: DemoObject[] = [];
  private fps = 0;
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private totalTime = 0;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.renderer = new CanvasRenderer({ canvas: this.canvas });

    this.engine = createJskid({
      debug: true,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      fps: 60,
      autoStart: false,
    });

    this.bindEvents();
    this.bindKeyboard();
    this.createDemoObjects(20);
  }

  private bindEvents(): void {
    this.engine.on('engine:update', (deltaTime: number) => {
      this.update(deltaTime);
    });

    this.engine.on('engine:render', () => {
      this.render();
    });

    this.engine.on('engine:error', (error: Error) => {
      console.error('引擎错误:', error);
    });
  }

  private bindKeyboard(): void {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        // 空格键添加新对象
        this.demoObjects.push(
          new DemoObject(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT)
        );
        console.log(`添加对象，当前数量: ${this.demoObjects.length}`);
      } else if (event.code === 'KeyC') {
        // C键清空对象
        this.demoObjects.length = 0;
        console.log('清空所有对象');
      } else if (event.code === 'KeyR') {
        // R键重置为默认数量
        this.demoObjects.length = 0;
        this.createDemoObjects(20);
        console.log('重置对象数量');
      }
    });
  }

  private createDemoObjects(count: number): void {
    for (let i = 0; i < count; i++) {
      this.demoObjects.push(
        new DemoObject(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT)
      );
    }
    console.log(`✓ 创建了 ${count} 个演示对象`);
  }

  private update(deltaTime: number): void {
    this.totalTime += deltaTime;

    // 更新FPS计数
    this.frameCount++;
    if (this.totalTime - this.lastFpsUpdate >= 1.0) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = this.totalTime;
      this.updateFPSDisplay(this.fps);
    }

    // 更新所有演示对象
    for (const obj of this.demoObjects) {
      obj.update(deltaTime, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }

  private render(): void {
    const ctx = this.renderer.getContext();

    // 清空画布
    this.renderer.clear('#0a0a0a');

    // 绘制所有演示对象
    for (const obj of this.demoObjects) {
      obj.render(ctx);
    }

    // 绘制标题
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('jsKid 现代化游戏引擎演示', CANVAS_WIDTH / 2, 40);

    // 绘制信息
    ctx.font = '16px monospace';
    ctx.fillStyle = '#4CAF50';
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${this.fps}`, 10, CANVAS_HEIGHT - 60);
    ctx.fillText(`对象数量: ${this.demoObjects.length}`, 10, CANVAS_HEIGHT - 40);
    ctx.fillText(`运行时间: ${this.totalTime.toFixed(1)}s`, 10, CANVAS_HEIGHT - 20);

    // 绘制操作提示
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('空格: 添加对象 | C: 清空 | R: 重置', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);

    // 引擎标识
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('jsKid Engine', CANVAS_WIDTH - 10, 20);
  }

  private updateFPSDisplay(currentFps: number): void {
    const statusElements = document.querySelectorAll('.status');
    if (statusElements[1]) {
      statusElements[1].textContent = `${currentFps} FPS`;
    }
  }

  start(): void {
    console.log('🚀 jsKid基础演示启动');
    console.log('✓ 引擎初始化完成');
    console.log('✓ 渲染器就绪');
    console.log('💡 操作提示:');
    console.log('   - 按空格键添加对象');
    console.log('   - 按C键清空所有对象');
    console.log('   - 按R键重置对象数量');
    this.engine.start();
  }

  destroy(): void {
    this.engine.destroy();
  }
}

// 启动演示
const demo = new BasicDemo('game-canvas');
demo.start();
