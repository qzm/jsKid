/**
 * Pong Game - 使用 jsKid 引擎重构版本
 *
 * 展示功能：
 * - Matter.js 物理引擎集成
 * - 碰撞检测和响应
 * - 游戏循环管理
 */

// 导入必要的模块
import type { JskidEngine } from '../../packages/core/src/engine';
import { createJskid } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';
import { createPhysicsPlugin, RigidBodyFactory, RigidBodyHelper } from '../../packages/physics/src/index';
import type Matter from 'matter-js';

// 游戏常量
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 400;
const BALL_INITIAL_SPEED = 300;

/**
 * Pong 游戏类
 */
class PongGame {
  private engine: JskidEngine;
  private renderer: CanvasRenderer;
  private canvas: HTMLCanvasElement;

  // 游戏对象
  private playerPaddle!: Matter.Body;
  private aiPaddle!: Matter.Body;
  private ball!: Matter.Body;
  private walls: Matter.Body[] = [];

  // 游戏状态
  private playerScore = 0;
  private aiScore = 0;
  private gameStarted = false;

  // 输入状态
  private keys: { [key: string]: boolean } = {};

  constructor(canvasId: string) {
    // 获取 Canvas
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas element "${canvasId}" not found`);
    }

    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    // 创建渲染器
    this.renderer = new CanvasRenderer(this.canvas);

    // 创建引擎
    this.engine = createJskid({
      debug: false,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      fps: 60,
      autoStart: false,
    });

    // 安装物理插件
    const physicsPlugin = createPhysicsPlugin({
      gravity: { x: 0, y: 0 }, // 无重力
      pixelRatio: 1,
      enableSleeping: false,
    });
    this.engine.installPlugin(physicsPlugin);

    // 绑定事件
    this.bindEvents();
    this.setupPhysics();
    this.bindKeyboard();
  }

  /**
   * 绑定引擎事件
   */
  private bindEvents(): void {
    this.engine.on('engine:update', (deltaTime: number) => {
      this.update(deltaTime);
    });

    this.engine.on('engine:render', () => {
      this.render();
    });
  }

  /**
   * 设置物理世界
   */
  private setupPhysics(): void {
    const physics = this.engine.physics;
    if (!physics) return;

    // 创建玩家挡板
    this.playerPaddle = RigidBodyFactory.createRectangle(
      30,
      CANVAS_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      {
        type: 'kinematic',
        friction: 0,
        restitution: 1.0,
        collisionFilter: { category: 0x0001, mask: 0x0002 },
        userData: { type: 'paddle', isPlayer: true },
      }
    );

    // 创建 AI 挡板
    this.aiPaddle = RigidBodyFactory.createRectangle(
      CANVAS_WIDTH - 30,
      CANVAS_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      {
        type: 'kinematic',
        friction: 0,
        restitution: 1.0,
        collisionFilter: { category: 0x0001, mask: 0x0002 },
        userData: { type: 'paddle', isPlayer: false },
      }
    );

    // 创建球
    this.ball = RigidBodyFactory.createCircle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      BALL_RADIUS,
      {
        type: 'dynamic',
        density: 0.001,
        friction: 0,
        frictionAir: 0,
        restitution: 1.0,
        collisionFilter: { category: 0x0002, mask: 0x0001 | 0x0004 },
        userData: { type: 'ball' },
      }
    );

    // 创建墙壁（上下边界）
    const wallTop = RigidBodyFactory.createRectangle(
      CANVAS_WIDTH / 2,
      -10,
      CANVAS_WIDTH,
      20,
      {
        type: 'static',
        friction: 0,
        restitution: 1.0,
        collisionFilter: { category: 0x0004, mask: 0x0002 },
      }
    );

    const wallBottom = RigidBodyFactory.createRectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT + 10,
      CANVAS_WIDTH,
      20,
      {
        type: 'static',
        friction: 0,
        restitution: 1.0,
        collisionFilter: { category: 0x0004, mask: 0x0002 },
      }
    );

    this.walls.push(wallTop, wallBottom);

    // 添加到物理世界
    physics.addBody([this.playerPaddle, this.aiPaddle, this.ball, ...this.walls]);
  }

  /**
   * 绑定键盘输入
   */
  private bindKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' && !this.gameStarted) {
        this.startGame();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  /**
   * 开始游戏
   */
  startGame(): void {
    this.gameStarted = true;
    this.resetBall();
  }

  /**
   * 重置球
   */
  resetBall(): void {
    const angle = (Math.random() - 0.5) * Math.PI / 3;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const vx = Math.cos(angle) * BALL_INITIAL_SPEED * direction;
    const vy = Math.sin(angle) * BALL_INITIAL_SPEED;

    RigidBodyHelper.setPosition(this.ball, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    RigidBodyHelper.setVelocity(this.ball, vx, vy);
  }

  /**
   * 更新游戏逻辑
   */
  private update(deltaTime: number): void {
    if (!this.gameStarted) return;

    // 玩家控制
    const playerPos = RigidBodyHelper.getPosition(this.playerPaddle);
    if (this.keys['KeyW'] && playerPos.y > PADDLE_HEIGHT / 2) {
      RigidBodyHelper.setPosition(
        this.playerPaddle,
        playerPos.x,
        playerPos.y - PADDLE_SPEED * deltaTime
      );
    }
    if (this.keys['KeyS'] && playerPos.y < CANVAS_HEIGHT - PADDLE_HEIGHT / 2) {
      RigidBodyHelper.setPosition(
        this.playerPaddle,
        playerPos.x,
        playerPos.y + PADDLE_SPEED * deltaTime
      );
    }

    // AI 控制
    const aiPos = RigidBodyHelper.getPosition(this.aiPaddle);
    const ballPos = RigidBodyHelper.getPosition(this.ball);
    const aiTarget = ballPos.y;

    if (Math.abs(aiTarget - aiPos.y) > 10) {
      const moveDirection = aiTarget > aiPos.y ? 1 : -1;
      const newY = aiPos.y + moveDirection * PADDLE_SPEED * deltaTime * 0.8;
      const clampedY = Math.max(
        PADDLE_HEIGHT / 2,
        Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT / 2, newY)
      );
      RigidBodyHelper.setPosition(this.aiPaddle, aiPos.x, clampedY);
    }

    // 限制球速度
    const ballVel = RigidBodyHelper.getVelocity(this.ball);
    const speed = Math.sqrt(ballVel.x * ballVel.x + ballVel.y * ballVel.y);
    if (speed > BALL_INITIAL_SPEED * 2) {
      const scale = (BALL_INITIAL_SPEED * 2) / speed;
      RigidBodyHelper.setVelocity(this.ball, ballVel.x * scale, ballVel.y * scale);
    }

    // 检查得分
    if (ballPos.x < 0) {
      this.aiScore++;
      this.updateScoreDisplay();
      this.resetBall();
    } else if (ballPos.x > CANVAS_WIDTH) {
      this.playerScore++;
      this.updateScoreDisplay();
      this.resetBall();
    }
  }

  /**
   * 渲染游戏
   */
  private render(): void {
    const ctx = this.renderer.getContext();

    // 清空画布
    this.renderer.clear('#000000');

    // 绘制中线
    ctx.save();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.restore();

    // 绘制挡板
    this.drawPaddle(this.playerPaddle, '#00ff00');
    this.drawPaddle(this.aiPaddle, '#ff0000');

    // 绘制球
    this.drawBall();

    // 绘制分数
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.playerScore.toString(), CANVAS_WIDTH / 4, 60);
    ctx.fillText(this.aiScore.toString(), (CANVAS_WIDTH * 3) / 4, 60);

    // 开始提示
    if (!this.gameStarted) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px monospace';
      ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '16px monospace';
      ctx.fillText('W/S to move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }

    // FPS 显示
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`jsKid Engine`, 10, 20);
  }

  /**
   * 绘制挡板
   */
  private drawPaddle(paddle: Matter.Body, color: string): void {
    const ctx = this.renderer.getContext();
    const pos = paddle.position;

    ctx.fillStyle = color;
    ctx.fillRect(
      pos.x - PADDLE_WIDTH / 2,
      pos.y - PADDLE_HEIGHT / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
  }

  /**
   * 绘制球
   */
  private drawBall(): void {
    const ctx = this.renderer.getContext();
    const pos = this.ball.position;

    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 更新分数显示
   */
  private updateScoreDisplay(): void {
    const playerScoreEl = document.getElementById('player-score');
    const aiScoreEl = document.getElementById('ai-score');
    if (playerScoreEl) playerScoreEl.textContent = this.playerScore.toString();
    if (aiScoreEl) aiScoreEl.textContent = this.aiScore.toString();
  }

  /**
   * 启动游戏
   */
  start(): void {
    console.log('🏓 Pong Game - jsKid 引擎版本');
    console.log('✅ 物理引擎已集成 (Matter.js)');
    console.log('🎮 按空格开始，W/S 控制挡板');
    this.engine.start();
  }

  /**
   * 销毁游戏
   */
  destroy(): void {
    this.engine.destroy();
  }
}

// 启动游戏
const game = new PongGame('gameCanvas');
game.start();
