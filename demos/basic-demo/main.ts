/**
 * jsKid基础演示
 * 展示引擎核心功能
 */

import { JskidEngine } from '../../packages/core/src/engine';
import { CanvasRenderer } from '../../packages/renderer/src/canvas-renderer';
import { Vector2, Color } from '../../packages/utils/src';

// 创建渲染器
const renderer = new CanvasRenderer({
  canvas: 'game-canvas',
  width: 800,
  height: 600,
  backgroundColor: '#0a0a0a',
  antialias: false
});

console.log('✓ 渲染器创建成功');

// 创建引擎实例
const engine = new JskidEngine({
  debug: true,
  canvasWidth: 800,
  canvasHeight: 600,
  fps: 60,
  autoStart: false
});

console.log('✓ 引擎创建成功');

// 游戏状态
let time = 0;
let fps = 0;
let frameCount = 0;
let lastFpsUpdate = 0;

// 简单的演示对象
class DemoObject {
  position: Vector2;
  velocity: Vector2;
  color: Color;
  size: number;

  constructor(x: number, y: number) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(
      Math.random() * 200 - 100,
      Math.random() * 200 - 100
    );
    this.color = Color.random();
    this.size = 20 + Math.random() * 30;
  }

  update(deltaTime: number, width: number, height: number): void {
    // 更新位置
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // 边界反弹
    if (this.position.x < 0 || this.position.x > width) {
      this.velocity.x *= -1;
      this.position.x = Math.max(0, Math.min(width, this.position.x));
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = Math.max(0, Math.min(height, this.position.y));
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color.toRGBA();
    ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

// 创建演示对象
const demoObjects: DemoObject[] = [];
for (let i = 0; i < 20; i++) {
  demoObjects.push(new DemoObject(
    Math.random() * 800,
    Math.random() * 600
  ));
}

console.log(`✓ 创建了 ${demoObjects.length} 个演示对象`);

// 游戏循环
function gameLoop(currentTime: number): void {
  requestAnimationFrame(gameLoop);

  const deltaTime = time > 0 ? (currentTime - time) / 1000 : 0;
  time = currentTime;

  // 更新FPS计数
  frameCount++;
  if (currentTime - lastFpsUpdate >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFpsUpdate = currentTime;

    // 更新UI
    updateFPSDisplay(fps);
  }

  // 清空画布
  renderer.clear();

  const ctx = renderer.getContext();
  ctx.save();

  // 更新并渲染所有对象
  demoObjects.forEach(obj => {
    obj.update(deltaTime, 800, 600);
    obj.render(ctx);
  });

  // 绘制FPS信息
  ctx.font = '16px monospace';
  ctx.fillStyle = '#4CAF50';
  ctx.fillText(`FPS: ${fps}`, 10, 25);
  ctx.fillText(`对象数量: ${demoObjects.length}`, 10, 45);
  ctx.fillText(`时间: ${(time / 1000).toFixed(1)}s`, 10, 65);

  // 绘制标题
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('jsKid现代化游戏引擎演示', 400, 40);

  ctx.restore();
}

// 更新FPS显示
function updateFPSDisplay(currentFps: number): void {
  const statusElements = document.querySelectorAll('.status');
  if (statusElements[1]) {
    statusElements[1].textContent = `${currentFps} FPS`;
  }
}

// 启动演示
console.log('🚀 启动演示...');
requestAnimationFrame(gameLoop);

// 监听引擎事件
engine.on('engine:update', ({ deltaTime }) => {
  // 这里可以添加更多游戏逻辑
});

engine.on('engine:error', ({ error }) => {
  console.error('引擎错误:', error);
});

// 添加键盘交互
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    // 空格键添加新对象
    demoObjects.push(new DemoObject(
      Math.random() * 800,
      Math.random() * 600
    ));
    console.log(`添加对象，当前数量: ${demoObjects.length}`);
  } else if (event.code === 'KeyC') {
    // C键清空对象
    demoObjects.length = 0;
    console.log('清空所有对象');
  }
});

console.log('✓ 演示启动完成');
console.log('💡 按空格键添加对象，按C键清空对象');
