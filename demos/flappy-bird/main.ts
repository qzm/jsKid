/**
 * Flappy Bird Game - 使用 jsKid 引擎重构版本
 *
 * 展示功能：
 * - Matter.js 物理引擎 (重力系统)
 * - 粒子系统 (飞行轨迹、碰撞特效)
 * - 碰撞检测
 * - 关卡难度递增
 */

import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';
import { createPhysicsPlugin, RigidBodyFactory, RigidBodyHelper } from '../../packages/physics/src/index';
import { ParticleEmitter, ParticlePresets } from '../../packages/sprite/src/particle/index';
import type Matter from 'matter-js';

// 游戏常量
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 180; // 像素/秒
const PIPE_INTERVAL = 1.5; // 秒
const JUMP_FORCE = -400;
const GRAVITY = 800;

/**
 * 管道类
 */
class Pipe {
  topBody: Matter.Body;
  bottomBody: Matter.Body;
  x: number;
  topHeight: number;
  scored: boolean = false;

  constructor(x: number, topHeight: number, gap: number) {
    this.x = x;
    this.topHeight = topHeight;

    // 创建上管道
    this.topBody = RigidBodyFactory.createRectangle(
      x + PIPE_WIDTH / 2,
      topHeight / 2,
      PIPE_WIDTH,
      topHeight,
      {
        type: 'kinematic',
        friction: 0,
        collisionFilter: { category: 0x0002, mask: 0x0001 },
        userData: { type: 'pipe', pipe: this },
      }
    );

    // 创建下管道
    const bottomHeight = CANVAS_HEIGHT - topHeight - gap;
    this.bottomBody = RigidBodyFactory.createRectangle(
      x + PIPE_WIDTH / 2,
      topHeight + gap + bottomHeight / 2,
      PIPE_WIDTH,
      bottomHeight,
      {
        type: 'kinematic',
        friction: 0,
        collisionFilter: { category: 0x0002, mask: 0x0001 },
        userData: { type: 'pipe', pipe: this },
      }
    );
  }

  update(deltaTime: number): void {
    const dx = -PIPE_SPEED * deltaTime;
    this.x += dx;

    RigidBodyHelper.setPosition(
      this.topBody,
      this.topBody.position.x + dx,
      this.topBody.position.y
    );

    RigidBodyHelper.setPosition(
      this.bottomBody,
      this.bottomBody.position.x + dx,
      this.bottomBody.position.y
    );
  }

  isOffScreen(): boolean {
    return this.x + PIPE_WIDTH < 0;
  }
}

/**
 * Flappy Bird 游戏类
 */
class FlappyBirdGame {
  private engine;
  private renderer: CanvasRenderer;
  private canvas: HTMLCanvasElement;

  // 游戏对象
  private bird!: Matter.Body;
  private pipes: Pipe[] = [];

  // 粒子系统
  private trailEmitter!: ParticleEmitter;
  private particleEmitters: ParticleEmitter[] = [];

  // 游戏状态
  private score = 0;
  private gameRunning = false;
  private gameOver = false;
  private pipeTimer = 0;
  private frame = 0;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.renderer = new CanvasRenderer(this.canvas);

    this.engine = createJskid({
      debug: false,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      fps: 60,
      autoStart: false,
    });

    // 安装物理插件 - 带重力
    const physicsPlugin = createPhysicsPlugin({
      gravity: { x: 0, y: GRAVITY / 60 }, // 转换为每帧的重力
      pixelRatio: 1,
      enableSleeping: false,
    });
    this.engine.installPlugin(physicsPlugin);

    this.bindEvents();
    this.bindKeyboard();
    this.setupPhysics();
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
      if (e.code === 'Space') {
        e.preventDefault();

        if (!this.gameRunning && !this.gameOver) {
          this.startGame();
        } else if (this.gameRunning) {
          this.jump();
        } else if (this.gameOver) {
          this.restart();
        }
      }
    });

    this.canvas.addEventListener('click', () => {
      if (!this.gameRunning && !this.gameOver) {
        this.startGame();
      } else if (this.gameRunning) {
        this.jump();
      }
    });
  }

  private setupPhysics(): void {
    const physics = this.engine.physics;
    if (!physics) return;

    // 创建小鸟
    this.bird = RigidBodyFactory.createRectangle(
      100,
      CANVAS_HEIGHT / 2,
      BIRD_SIZE,
      BIRD_SIZE,
      {
        type: 'dynamic',
        friction: 0,
        frictionAir: 0,
        collisionFilter: { category: 0x0001, mask: 0x0002 },
        userData: { type: 'bird' },
      }
    );

    // 禁用旋转
    RigidBodyHelper.setAngularVelocity(this.bird, 0);

    // 添加碰撞事件监听
    physics.on('collision:start', (pairs: any) => {
      for (const pair of pairs) {
        const { bodyA, bodyB } = pair;

        // 检查小鸟与管道的碰撞
        if (
          (bodyA.userData?.type === 'bird' && bodyB.userData?.type === 'pipe') ||
          (bodyA.userData?.type === 'pipe' && bodyB.userData?.type === 'bird')
        ) {
          const birdPos = this.bird.position;
          this.createExplosion(birdPos.x, birdPos.y);
          this.endGame();
        }
      }
    });

    physics.addBody(this.bird);
  }

  private reset(): void {
    // 清除旧管道
    if (this.engine.physics) {
      for (const pipe of this.pipes) {
        this.engine.physics.removeBody([pipe.topBody, pipe.bottomBody]);
      }
    }

    this.pipes = [];
    this.score = 0;
    this.pipeTimer = 0;
    this.frame = 0;
    this.gameOver = false;

    // 重置小鸟位置
    RigidBodyHelper.setPosition(this.bird, 100, CANVAS_HEIGHT / 2);
    RigidBodyHelper.setVelocity(this.bird, 0, 0);

    // 创建飞行轨迹粒子发射器
    this.trailEmitter = new ParticleEmitter(ParticlePresets.trailPreset(100, CANVAS_HEIGHT / 2));
    this.trailEmitter.stop(); // 初始停止

    this.updateUI();
  }

  private startGame(): void {
    this.gameRunning = true;
    this.trailEmitter.start();
  }

  private jump(): void {
    RigidBodyHelper.setVelocity(this.bird, 0, JUMP_FORCE / 60); // 转换为每帧速度

    // 创建跳跃特效
    const pos = this.bird.position;
    const jumpEffect = ParticlePresets.sparklePreset(pos.x, pos.y);
    jumpEffect.maxParticles = 5;
    jumpEffect.duration = 0.05;
    this.particleEmitters.push(new ParticleEmitter(jumpEffect));
  }

  private restart(): void {
    document.getElementById('game-over')!.classList.remove('active');
    this.gameRunning = false;
    this.reset();
  }

  private update(deltaTime: number): void {
    this.frame++;

    // 更新飞行轨迹位置
    const birdPos = this.bird.position;
    this.trailEmitter.setPosition(birdPos.x - BIRD_SIZE / 2, birdPos.y);
    this.trailEmitter.update(deltaTime);

    // 更新其他粒子
    for (let i = this.particleEmitters.length - 1; i >= 0; i--) {
      const emitter = this.particleEmitters[i];
      emitter.update(deltaTime);

      if (emitter.getParticleCount() === 0 && !emitter.isEmitting()) {
        this.particleEmitters.splice(i, 1);
      }
    }

    if (!this.gameRunning || this.gameOver) return;

    // 检查边界碰撞
    if (birdPos.y - BIRD_SIZE / 2 < 0 || birdPos.y + BIRD_SIZE / 2 > CANVAS_HEIGHT) {
      this.createExplosion(birdPos.x, birdPos.y);
      this.endGame();
      return;
    }

    // 生成管道
    this.pipeTimer += deltaTime;
    if (this.pipeTimer >= PIPE_INTERVAL) {
      this.pipeTimer = 0;
      this.createPipe();
    }

    // 更新管道
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.update(deltaTime);

      // 检查得分
      if (!pipe.scored && birdPos.x > pipe.x + PIPE_WIDTH) {
        pipe.scored = true;
        this.score++;
        this.updateUI();

        // 得分特效
        const scoreEffect = ParticlePresets.sparklePreset(pipe.x + PIPE_WIDTH, CANVAS_HEIGHT / 2);
        scoreEffect.maxParticles = 15;
        scoreEffect.duration = 0.1;
        this.particleEmitters.push(new ParticleEmitter(scoreEffect));
      }

      // 移除离开屏幕的管道
      if (pipe.isOffScreen()) {
        if (this.engine.physics) {
          this.engine.physics.removeBody([pipe.topBody, pipe.bottomBody]);
        }
        this.pipes.splice(i, 1);
      }
    }

    // 限制小鸟旋转
    RigidBodyHelper.setAngularVelocity(this.bird, 0);
  }

  private render(): void {
    const ctx = this.renderer.getContext();

    // 天空背景
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#70c5ce');
    gradient.addColorStop(1, '#a8e6cf');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制云朵装饰
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 5; i++) {
      const x = ((i * 200 + this.frame * 0.5) % (CANVAS_WIDTH + 100)) - 50;
      const y = 50 + i * 50;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
      ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // 渲染飞行轨迹粒子
    this.trailEmitter.render(ctx);

    // 绘制管道
    for (const pipe of this.pipes) {
      // 管道主体
      ctx.fillStyle = '#27ae60';
      ctx.strokeStyle = '#229954';
      ctx.lineWidth = 3;

      // 上管道
      const topPos = pipe.topBody.position;
      const topBounds = pipe.topBody.bounds;
      const topWidth = topBounds.max.x - topBounds.min.x;
      const topHeight = topBounds.max.y - topBounds.min.y;

      ctx.fillRect(topPos.x - topWidth / 2, topPos.y - topHeight / 2, topWidth, topHeight);
      ctx.strokeRect(topPos.x - topWidth / 2, topPos.y - topHeight / 2, topWidth, topHeight);

      // 管道口
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(topPos.x - topWidth / 2 - 5, topPos.y + topHeight / 2 - 20, topWidth + 10, 20);

      // 下管道
      const bottomPos = pipe.bottomBody.position;
      const bottomBounds = pipe.bottomBody.bounds;
      const bottomWidth = bottomBounds.max.x - bottomBounds.min.x;
      const bottomHeight = bottomBounds.max.y - bottomBounds.min.y;

      ctx.fillStyle = '#27ae60';
      ctx.fillRect(
        bottomPos.x - bottomWidth / 2,
        bottomPos.y - bottomHeight / 2,
        bottomWidth,
        bottomHeight
      );
      ctx.strokeRect(
        bottomPos.x - bottomWidth / 2,
        bottomPos.y - bottomHeight / 2,
        bottomWidth,
        bottomHeight
      );

      // 管道口
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(bottomPos.x - bottomWidth / 2 - 5, bottomPos.y - bottomHeight / 2, bottomWidth + 10, 20);
    }

    // 绘制小鸟
    const birdPos = this.bird.position;
    const birdVel = RigidBodyHelper.getVelocity(this.bird);

    // 根据速度计算旋转角度
    const angle = Math.max(-0.5, Math.min(0.5, birdVel.y * 0.01));

    ctx.save();
    ctx.translate(birdPos.x, birdPos.y);
    ctx.rotate(angle);

    // 小鸟身体
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);

    // 小鸟眼睛
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(BIRD_SIZE / 4, -BIRD_SIZE / 4, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(BIRD_SIZE / 4 + 2, -BIRD_SIZE / 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // 小鸟嘴巴
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2, 0);
    ctx.lineTo(BIRD_SIZE / 2 + 10, -3);
    ctx.lineTo(BIRD_SIZE / 2 + 10, 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 渲染其他粒子
    for (const emitter of this.particleEmitters) {
      emitter.render(ctx);
    }

    // 提示信息
    if (!this.gameRunning && !this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Flappy Bird', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

      ctx.font = '20px Arial';
      ctx.fillText('按空格或点击鼠标开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '16px Arial';
      ctx.fillText('空格/点击跳跃', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    // 引擎标识
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('jsKid Engine + Physics + Particles', CANVAS_WIDTH - 10, 20);
  }

  private createPipe(): void {
    const minHeight = 80;
    const maxHeight = CANVAS_HEIGHT - PIPE_GAP - 80;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    const pipe = new Pipe(CANVAS_WIDTH, topHeight, PIPE_GAP);
    this.pipes.push(pipe);

    if (this.engine.physics) {
      this.engine.physics.addBody([pipe.topBody, pipe.bottomBody]);
    }
  }

  private createExplosion(x: number, y: number): void {
    const emitter = new ParticleEmitter(ParticlePresets.explosionPreset(x, y));
    this.particleEmitters.push(emitter);
  }

  private endGame(): void {
    this.gameOver = true;
    this.gameRunning = false;
    this.trailEmitter.stop();

    document.getElementById('game-over')!.classList.add('active');
    document.getElementById('final-score')!.textContent = this.score.toString();
  }

  private updateUI(): void {
    document.getElementById('score')!.textContent = this.score.toString();
  }

  start(): void {
    console.log('🐦 Flappy Bird Game - jsKid 引擎版本');
    console.log('✅ 物理引擎已集成 (重力系统)');
    console.log('✅ 粒子系统已启用 (飞行轨迹)');
    console.log('🎮 按空格或点击跳跃');
    this.engine.start();
  }

  destroy(): void {
    this.engine.destroy();
  }
}

// 启动游戏
const game = new FlappyBirdGame('gameCanvas');
game.start();

// 重新开始按钮
document.getElementById('restart-btn')?.addEventListener('click', () => {
  window.location.reload();
});
