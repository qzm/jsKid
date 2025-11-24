/**
 * PhysicsEngine
 * Matter.js 物理引擎封装
 */

import Matter from 'matter-js';
import EventEmitter from 'eventemitter3';
import type {
  PhysicsConfig,
  CollisionEvent,
  DebugRenderOptions,
  RaycastHit,
} from './types';

/**
 * 默认物理配置
 */
const DEFAULT_CONFIG: Required<PhysicsConfig> = {
  gravity: { x: 0, y: 1 },
  enableSleeping: false,
  timeScale: 1.0,
  positionIterations: 6,
  velocityIterations: 4,
  constraintIterations: 2,
  pixelRatio: 50, // 1米 = 50像素
  debug: false,
};

/**
 * 物理引擎类
 * 封装 Matter.js，提供简化的 API
 */
export class PhysicsEngine extends EventEmitter {
  private engine: Matter.Engine;
  private world: Matter.World;
  private runner: Matter.Runner | null = null;
  private config: Required<PhysicsConfig>;
  private debugRender: Matter.Render | null = null;
  private isRunning: boolean = false;

  constructor(config: PhysicsConfig = {}) {
    super();

    this.config = { ...DEFAULT_CONFIG, ...config };

    // 创建 Matter.js 引擎
    this.engine = Matter.Engine.create({
      gravity: this.config.gravity,
      enableSleeping: this.config.enableSleeping,
      positionIterations: this.config.positionIterations,
      velocityIterations: this.config.velocityIterations,
      constraintIterations: this.config.constraintIterations,
    });

    this.world = this.engine.world;
    this.engine.timing.timeScale = this.config.timeScale;

    // 绑定碰撞事件
    this.bindCollisionEvents();
  }

  /**
   * 绑定碰撞事件
   */
  private bindCollisionEvents(): void {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const collisionEvent: CollisionEvent = {
          bodyA: pair.bodyA,
          bodyB: pair.bodyB,
          contacts: pair.activeContacts.map((c) => ({
            vertex: c.vertex,
            normal: pair.collision.normal,
          })),
          separation: pair.collision.depth,
        };
        this.emit('collision:start', collisionEvent);
      });
    });

    Matter.Events.on(this.engine, 'collisionActive', (event) => {
      event.pairs.forEach((pair) => {
        const collisionEvent: CollisionEvent = {
          bodyA: pair.bodyA,
          bodyB: pair.bodyB,
          contacts: pair.activeContacts.map((c) => ({
            vertex: c.vertex,
            normal: pair.collision.normal,
          })),
          separation: pair.collision.depth,
        };
        this.emit('collision:active', collisionEvent);
      });
    });

    Matter.Events.on(this.engine, 'collisionEnd', (event) => {
      event.pairs.forEach((pair) => {
        const collisionEvent: CollisionEvent = {
          bodyA: pair.bodyA,
          bodyB: pair.bodyB,
          contacts: [],
          separation: 0,
        };
        this.emit('collision:end', collisionEvent);
      });
    });
  }

  /**
   * 启动物理引擎
   */
  start(): void {
    if (this.isRunning) return;

    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
    this.isRunning = true;

    this.emit('engine:started');
  }

  /**
   * 停止物理引擎
   */
  stop(): void {
    if (!this.isRunning || !this.runner) return;

    Matter.Runner.stop(this.runner);
    this.runner = null;
    this.isRunning = false;

    this.emit('engine:stopped');
  }

  /**
   * 手动更新物理引擎（用于自定义游戏循环）
   * @param deltaTime 时间步长（毫秒）
   */
  update(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime * 1000);
  }

  /**
   * 添加刚体到物理世界
   */
  addBody(body: Matter.Body | Matter.Body[]): void {
    Matter.Composite.add(this.world, body);
  }

  /**
   * 从物理世界移除刚体
   */
  removeBody(body: Matter.Body | Matter.Body[]): void {
    Matter.Composite.remove(this.world, body);
  }

  /**
   * 添加约束
   */
  addConstraint(constraint: Matter.Constraint): void {
    Matter.Composite.add(this.world, constraint);
  }

  /**
   * 移除约束
   */
  removeConstraint(constraint: Matter.Constraint): void {
    Matter.Composite.remove(this.world, constraint);
  }

  /**
   * 获取所有刚体
   */
  getBodies(): Matter.Body[] {
    return Matter.Composite.allBodies(this.world);
  }

  /**
   * 获取指定点处的刚体
   */
  getBodyAt(x: number, y: number): Matter.Body | null {
    const bodies = Matter.Query.point(this.getBodies(), { x, y });
    return bodies.length > 0 ? bodies[0] : null;
  }

  /**
   * 获取指定区域内的刚体
   */
  getBodiesInRegion(bounds: Matter.Bounds): Matter.Body[] {
    return Matter.Query.region(this.getBodies(), bounds);
  }

  /**
   * 射线检测
   * @param startX 起点 X
   * @param startY 起点 Y
   * @param endX 终点 X
   * @param endY 终点 Y
   * @returns 命中结果
   */
  raycast(startX: number, startY: number, endX: number, endY: number): RaycastHit | null {
    const collisions = Matter.Query.ray(
      this.getBodies(),
      { x: startX, y: startY },
      { x: endX, y: endY }
    );

    if (collisions.length === 0) return null;

    // 找到最近的碰撞
    let closest: RaycastHit | null = null;
    let minDistance = Infinity;

    collisions.forEach((collision) => {
      const dx = collision.bodyA.position.x - startX;
      const dy = collision.bodyA.position.y - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closest = {
          body: collision.bodyA,
          point: collision.bodyA.position,
          distance,
          normal: { x: 0, y: -1 }, // 简化处理
        };
      }
    });

    return closest;
  }

  /**
   * 设置重力
   */
  setGravity(x: number, y: number): void {
    this.world.gravity.x = x;
    this.world.gravity.y = y;
  }

  /**
   * 设置时间缩放
   */
  setTimeScale(scale: number): void {
    this.engine.timing.timeScale = scale;
  }

  /**
   * 清空物理世界
   */
  clear(): void {
    Matter.World.clear(this.world, false);
  }

  /**
   * 像素坐标转物理坐标
   */
  pixelToPhysics(pixel: number): number {
    return pixel / this.config.pixelRatio;
  }

  /**
   * 物理坐标转像素坐标
   */
  physicsToPixel(physics: number): number {
    return physics * this.config.pixelRatio;
  }

  /**
   * 启用调试渲染
   * @param canvas Canvas 元素
   * @param options 渲染选项
   */
  enableDebugRender(canvas: HTMLCanvasElement, options: DebugRenderOptions = {}): void {
    if (this.debugRender) {
      this.disableDebugRender();
    }

    this.debugRender = Matter.Render.create({
      canvas,
      engine: this.engine,
      options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: !options.fillBodies,
        showAngleIndicator: options.showAxes ?? true,
        showCollisions: options.showCollisions ?? true,
        showVelocity: options.showVelocity ?? false,
        showBounds: options.showBounds ?? false,
      },
    });

    Matter.Render.run(this.debugRender);
  }

  /**
   * 禁用调试渲染
   */
  disableDebugRender(): void {
    if (this.debugRender) {
      Matter.Render.stop(this.debugRender);
      this.debugRender = null;
    }
  }

  /**
   * 获取 Matter.js 引擎实例
   */
  getEngine(): Matter.Engine {
    return this.engine;
  }

  /**
   * 获取物理世界实例
   */
  getWorld(): Matter.World {
    return this.world;
  }

  /**
   * 获取配置
   */
  getConfig(): Readonly<Required<PhysicsConfig>> {
    return this.config;
  }

  /**
   * 销毁物理引擎
   */
  destroy(): void {
    this.stop();
    this.disableDebugRender();
    this.clear();
    Matter.Engine.clear(this.engine);
    this.removeAllListeners();
  }
}
