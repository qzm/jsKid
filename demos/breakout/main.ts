/**
 * Breakout Game - 使用 jsKid 引擎重构版本
 *
 * 展示功能：
 * - Matter.js 物理引擎集成
 * - 粒子系统和特效
 * - 四叉树优化碰撞检测
 * - 音频系统集成（预留）
 */

import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';
import { createPhysicsPlugin, RigidBodyFactory, RigidBodyHelper } from '../../packages/physics/src/index';
import { ParticleEmitter, ParticlePresets } from '../../packages/sprite/src/particle/index';
import { Quadtree } from '../../packages/core/src/collision/quadtree';
import type { Collidable, Bounds } from '../../packages/core/src/collision/quadtree';
import type Matter from 'matter-js';

// 游戏常量
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_WIDTH = CANVAS_WIDTH / BRICK_COLS;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 2;
const PADDLE_SPEED = 500;
const BALL_INITIAL_SPEED = 350;

// 砖块颜色配置
const BRICK_COLORS = ['#e74c3c', '#e67e22', '#f39c12', '#2ecc71', '#3498db'];

/**
 * 砖块类 - 实现 Collidable 接口用于四叉树优化
 */
class Brick implements Collidable {
  body: Matter.Body;
  hits: number = 0;
  maxHits: number;
  visible: boolean = true;
  color: string;
  id: number;

  constructor(x: number, y: number, width: number, height: number, maxHits: number, id: number) {
    this.maxHits = maxHits;
    this.color = BRICK_COLORS[maxHits - 1];
    this.id = id;

    // 创建静态物理刚体
    this.body = RigidBodyFactory.createRectangle(x + width / 2, y + height / 2, width, height, {
      type: 'static',
      friction: 0,
      restitution: 1.0,
      collisionFilter: { category: 0x0004, mask: 0x0002 },
      userData: { type: 'brick', brick: this },
    });
  }

  getBounds(): Bounds {
    const pos = this.body.position;
    const width = (this.body.bounds.max.x - this.body.bounds.min.x);
    const height = (this.body.bounds.max.y - this.body.bounds.min.y);
    return {
      x: pos.x - width / 2,
      y: pos.y - height / 2,
      width,
      height,
    };
  }

  hit(): boolean {
    this.hits++;
    if (this.hits >= this.maxHits) {
      this.visible = false;
      return true; // 砖块被摧毁
    } else {
      this.color = BRICK_COLORS[this.maxHits - this.hits - 1];
      return false; // 砖块还在
    }
  }
}

/**
 * Breakout 游戏类
 */
class BreakoutGame {
  private engine;
  private renderer: CanvasRenderer;
  private canvas: HTMLCanvasElement;
  private quadtree: Quadtree<Brick>;

  // 游戏对象
  private paddle!: Matter.Body;
  private ball!: Matter.Body;
  private walls: Matter.Body[] = [];
  private bricks: Brick[] = [];

  // 粒子系统
  private particleEmitters: ParticleEmitter[] = [];

  // 游戏状态
  private score = 0;
  private lives = 3;
  private level = 1;
  private gameRunning = false;
  private gameOver = false;

  // 输入状态
  private keys: { [key: string]: boolean } = {};
  private mouseX = CANVAS_WIDTH / 2;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.renderer = new CanvasRenderer(this.canvas);
    this.quadtree = new Quadtree({ x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }, 8);

    this.engine = createJskid({
      debug: false,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      fps: 60,
      autoStart: false,
    });

    // 安装物理插件
    const physicsPlugin = createPhysicsPlugin({
      gravity: { x: 0, y: 0 },
      pixelRatio: 1,
      enableSleeping: false,
    });
    this.engine.installPlugin(physicsPlugin);

    this.bindEvents();
    this.bindKeyboard();
    this.bindMouse();
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
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'Space' && !this.gameRunning && !this.gameOver && this.lives > 0) {
        this.startGame();
      }

      if (e.code === 'KeyR' && this.gameOver) {
        this.restart();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  private bindMouse(): void {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
    });
  }

  private setupPhysics(): void {
    const physics = this.engine.physics;
    if (!physics) return;

    // 创建挡板
    this.paddle = RigidBodyFactory.createRectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 40,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      {
        type: 'kinematic',
        friction: 0,
        restitution: 1.0,
        collisionFilter: { category: 0x0001, mask: 0x0002 },
        userData: { type: 'paddle' },
      }
    );

    // 创建球
    this.ball = RigidBodyFactory.createCircle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, BALL_RADIUS, {
      type: 'dynamic',
      density: 0.001,
      friction: 0,
      frictionAir: 0,
      restitution: 1.0,
      collisionFilter: { category: 0x0002, mask: 0x0001 | 0x0004 | 0x0008 },
      userData: { type: 'ball' },
    });

    // 创建墙壁
    const wallLeft = RigidBodyFactory.createRectangle(-10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, {
      type: 'static',
      friction: 0,
      restitution: 1.0,
      collisionFilter: { category: 0x0008, mask: 0x0002 },
    });

    const wallRight = RigidBodyFactory.createRectangle(
      CANVAS_WIDTH + 10,
      CANVAS_HEIGHT / 2,
      20,
      CANVAS_HEIGHT,
      {
        type: 'static',
        friction: 0,
        restitution: 1.0,
        collisionFilter: { category: 0x0008, mask: 0x0002 },
      }
    );

    const wallTop = RigidBodyFactory.createRectangle(CANVAS_WIDTH / 2, -10, CANVAS_WIDTH, 20, {
      type: 'static',
      friction: 0,
      restitution: 1.0,
      collisionFilter: { category: 0x0008, mask: 0x0002 },
    });

    this.walls.push(wallLeft, wallRight, wallTop);

    // 添加碰撞事件监听
    physics.on('collision:start', (pairs: any) => {
      for (const pair of pairs) {
        const { bodyA, bodyB } = pair;

        // 检查球与砖块的碰撞
        if (
          (bodyA.userData?.type === 'ball' && bodyB.userData?.type === 'brick') ||
          (bodyA.userData?.type === 'brick' && bodyB.userData?.type === 'ball')
        ) {
          const brick: Brick =
            bodyA.userData?.type === 'brick' ? bodyA.userData.brick : bodyB.userData.brick;

          if (brick && brick.visible) {
            const destroyed = brick.hit();
            if (destroyed) {
              this.score += brick.maxHits * 10;
              this.createExplosion(brick.body.position.x, brick.body.position.y);
              this.removeBrick(brick);

              // 检查是否通关
              if (this.bricks.filter((b) => b.visible).length === 0) {
                this.levelComplete();
              }
            } else {
              this.score += 5;
              this.createSparkle(brick.body.position.x, brick.body.position.y);
            }
            this.updateUI();
          }
        }

        // 球与挡板碰撞 - 添加旋转效果
        if (
          (bodyA.userData?.type === 'ball' && bodyB.userData?.type === 'paddle') ||
          (bodyA.userData?.type === 'paddle' && bodyB.userData?.type === 'ball')
        ) {
          const ballBody = bodyA.userData?.type === 'ball' ? bodyA : bodyB;
          const paddleBody = bodyA.userData?.type === 'paddle' ? bodyA : bodyB;

          // 根据击球位置改变反弹角度
          const hitPos = (ballBody.position.x - paddleBody.position.x) / PADDLE_WIDTH;
          const angle = (hitPos - 0.5) * Math.PI * 0.6; // -54° 到 +54°

          const speed = BALL_INITIAL_SPEED;
          const vx = Math.sin(angle) * speed;
          const vy = -Math.abs(Math.cos(angle) * speed);

          RigidBodyHelper.setVelocity(ballBody, vx, vy);
        }
      }
    });

    physics.addBody([this.paddle, this.ball, ...this.walls]);
  }

  private reset(): void {
    // 清除旧砖块
    if (this.engine.physics) {
      for (const brick of this.bricks) {
        this.engine.physics.removeBody(brick.body);
      }
    }

    // 创建砖块
    this.bricks = [];
    this.quadtree.clear();
    this.createBricks();

    // 重置球
    this.resetBall();

    // 重置状态
    this.gameRunning = false;
    this.updateUI();
  }

  private createBricks(): void {
    const offsetY = 60;
    let id = 0;

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const maxHits = BRICK_ROWS - row;
        const x = col * BRICK_WIDTH + BRICK_PADDING;
        const y = row * BRICK_HEIGHT + offsetY + BRICK_PADDING;
        const width = BRICK_WIDTH - BRICK_PADDING * 2;
        const height = BRICK_HEIGHT - BRICK_PADDING * 2;

        const brick = new Brick(x, y, width, height, maxHits, id++);
        this.bricks.push(brick);
        this.quadtree.insert(brick);

        if (this.engine.physics) {
          this.engine.physics.addBody(brick.body);
        }
      }
    }
  }

  private removeBrick(brick: Brick): void {
    if (this.engine.physics) {
      this.engine.physics.removeBody(brick.body);
    }
  }

  private resetBall(): void {
    RigidBodyHelper.setPosition(this.ball, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    RigidBodyHelper.setVelocity(this.ball, 0, 0);
  }

  private startGame(): void {
    this.gameRunning = true;

    // 发射球
    const angle = (Math.random() - 0.5) * Math.PI / 3;
    const vx = Math.sin(angle) * BALL_INITIAL_SPEED;
    const vy = -Math.cos(angle) * BALL_INITIAL_SPEED;
    RigidBodyHelper.setVelocity(this.ball, vx, vy);
  }

  private levelComplete(): void {
    this.gameRunning = false;
    this.level++;

    setTimeout(() => {
      this.reset();
      this.startGame();
    }, 2000);
  }

  private restart(): void {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    document.getElementById('game-over')!.classList.remove('active');
    this.reset();
  }

  private update(deltaTime: number): void {
    if (!this.gameRunning || this.gameOver) return;

    // 挡板控制 - 键盘
    const paddlePos = RigidBodyHelper.getPosition(this.paddle);
    if (this.keys['ArrowLeft'] && paddlePos.x > PADDLE_WIDTH / 2) {
      RigidBodyHelper.setPosition(
        this.paddle,
        paddlePos.x - PADDLE_SPEED * deltaTime,
        paddlePos.y
      );
    }
    if (this.keys['ArrowRight'] && paddlePos.x < CANVAS_WIDTH - PADDLE_WIDTH / 2) {
      RigidBodyHelper.setPosition(
        this.paddle,
        paddlePos.x + PADDLE_SPEED * deltaTime,
        paddlePos.y
      );
    }

    // 挡板控制 - 鼠标
    const targetX = Math.max(PADDLE_WIDTH / 2, Math.min(CANVAS_WIDTH - PADDLE_WIDTH / 2, this.mouseX));
    RigidBodyHelper.setPosition(this.paddle, targetX, paddlePos.y);

    // 限制球速度
    const ballVel = RigidBodyHelper.getVelocity(this.ball);
    const speed = Math.sqrt(ballVel.x * ballVel.x + ballVel.y * ballVel.y);
    const maxSpeed = BALL_INITIAL_SPEED * 1.5;

    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      RigidBodyHelper.setVelocity(this.ball, ballVel.x * scale, ballVel.y * scale);
    }

    // 球掉落检测
    const ballPos = RigidBodyHelper.getPosition(this.ball);
    if (ballPos.y > CANVAS_HEIGHT + BALL_RADIUS) {
      this.lives--;
      this.updateUI();

      if (this.lives <= 0) {
        this.endGame();
      } else {
        this.resetBall();
        this.gameRunning = false;
      }
    }

    // 更新粒子系统
    for (let i = this.particleEmitters.length - 1; i >= 0; i--) {
      const emitter = this.particleEmitters[i];
      emitter.update(deltaTime);

      // 移除已完成的发射器
      if (emitter.getParticleCount() === 0 && !emitter.isEmitting()) {
        this.particleEmitters.splice(i, 1);
      }
    }
  }

  private render(): void {
    const ctx = this.renderer.getContext();

    // 清空画布
    this.renderer.clear('#0a0a1a');

    // 绘制背景星星
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 137 + Date.now() * 0.01) % CANVAS_WIDTH;
      const y = (i * 197) % CANVAS_HEIGHT;
      ctx.fillRect(x, y, 2, 2);
    }

    // 绘制砖块
    for (const brick of this.bricks) {
      if (!brick.visible) continue;

      const pos = brick.body.position;
      const bounds = brick.body.bounds;
      const width = bounds.max.x - bounds.min.x;
      const height = bounds.max.y - bounds.min.y;

      // 砖块主体
      ctx.fillStyle = brick.color;
      ctx.fillRect(pos.x - width / 2, pos.y - height / 2, width, height);

      // 高光效果
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(pos.x - width / 2, pos.y - height / 2, width, 5);

      // 显示剩余耐久度
      if (brick.maxHits > 1) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((brick.maxHits - brick.hits).toString(), pos.x, pos.y);
      }
    }

    // 绘制挡板
    const paddlePos = this.paddle.position;
    const gradient = ctx.createLinearGradient(
      paddlePos.x - PADDLE_WIDTH / 2,
      paddlePos.y - PADDLE_HEIGHT / 2,
      paddlePos.x - PADDLE_WIDTH / 2,
      paddlePos.y + PADDLE_HEIGHT / 2
    );
    gradient.addColorStop(0, '#3498db');
    gradient.addColorStop(1, '#2980b9');

    ctx.fillStyle = gradient;
    ctx.fillRect(
      paddlePos.x - PADDLE_WIDTH / 2,
      paddlePos.y - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    // 挡板高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(
      paddlePos.x - PADDLE_WIDTH / 2,
      paddlePos.y - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      3
    );

    // 绘制球
    const ballPos = this.ball.position;
    ctx.fillStyle = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffd700';
    ctx.beginPath();
    ctx.arc(ballPos.x, ballPos.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 球的轨迹效果
    const ballVel = RigidBodyHelper.getVelocity(this.ball);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(ballPos.x - ballVel.x * 0.05, ballPos.y - ballVel.y * 0.05, BALL_RADIUS * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // 渲染粒子
    for (const emitter of this.particleEmitters) {
      emitter.render(ctx);
    }

    // 提示信息
    if (!this.gameRunning && !this.gameOver && this.lives > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('按空格键开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    // 引擎标识
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('jsKid Engine + Matter.js + Particles', CANVAS_WIDTH - 10, 20);
  }

  private createExplosion(x: number, y: number): void {
    const emitter = new ParticleEmitter(ParticlePresets.explosionPreset(x, y));
    this.particleEmitters.push(emitter);
  }

  private createSparkle(x: number, y: number): void {
    const preset = ParticlePresets.sparklePreset(x, y);
    preset.duration = 0.1;
    preset.maxParticles = 10;
    const emitter = new ParticleEmitter(preset);
    this.particleEmitters.push(emitter);
  }

  private endGame(): void {
    this.gameOver = true;
    this.gameRunning = false;
    document.getElementById('game-over')!.classList.add('active');
    document.getElementById('final-score')!.textContent = this.score.toString();
    document.getElementById('final-level')!.textContent = this.level.toString();
  }

  private updateUI(): void {
    document.getElementById('score')!.textContent = this.score.toString();
    document.getElementById('lives')!.textContent = this.lives.toString();
    document.getElementById('level')!.textContent = this.level.toString();
  }

  start(): void {
    console.log('🧱 Breakout Game - jsKid 引擎版本');
    console.log('✅ 物理引擎已集成 (Matter.js)');
    console.log('✅ 粒子系统已启用');
    console.log('✅ 四叉树优化碰撞检测');
    console.log('🎮 按空格开始，方向键或鼠标控制挡板');
    this.engine.start();
  }

  destroy(): void {
    this.engine.destroy();
  }
}

// 启动游戏
const game = new BreakoutGame('gameCanvas');
game.start();

// 重新开始按钮
document.getElementById('restart-btn')?.addEventListener('click', () => {
  window.location.reload();
});
