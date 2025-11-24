/**
 * ParticleEmitter
 * 粒子发射器
 */

import EventEmitter from 'eventemitter3';
import { Particle, ParticleConfig } from './particle';
import { Vector2 } from '../../../utils/src/vector';

/**
 * 发射器配置
 */
export interface EmitterConfig {
  /** 位置 */
  position: { x: number; y: number };
  /** 最大粒子数 */
  maxParticles?: number;
  /** 发射速率（粒子/秒） */
  emissionRate?: number;
  /** 发射角度（弧度） */
  angle?: number;
  /** 角度范围（弧度） */
  angleSpread?: number;
  /** 速度 */
  speed?: number;
  /** 速度范围 */
  speedSpread?: number;
  /** 粒子生命周期 */
  lifetime?: number;
  /** 生命周期范围 */
  lifetimeSpread?: number;
  /** 粒子配置（模板） */
  particleConfig?: Partial<ParticleConfig>;
  /** 是否自动发射 */
  autoEmit?: boolean;
  /** 发射持续时间（秒，0=无限） */
  duration?: number;
}

/**
 * 粒子发射器
 */
export class ParticleEmitter extends EventEmitter {
  position: Vector2;
  private particles: Particle[] = [];
  private particlePool: Particle[] = [];
  private config: Required<Omit<EmitterConfig, 'particleConfig'>> & {
    particleConfig: Partial<ParticleConfig>;
  };

  private emissionTimer: number = 0;
  private durationTimer: number = 0;
  private isEmitting: boolean = false;

  constructor(config: EmitterConfig) {
    super();

    this.position = new Vector2(config.position.x, config.position.y);

    this.config = {
      position: config.position,
      maxParticles: config.maxParticles ?? 100,
      emissionRate: config.emissionRate ?? 10,
      angle: config.angle ?? 0,
      angleSpread: config.angleSpread ?? Math.PI / 4,
      speed: config.speed ?? 100,
      speedSpread: config.speedSpread ?? 50,
      lifetime: config.lifetime ?? 1.0,
      lifetimeSpread: config.lifetimeSpread ?? 0.5,
      particleConfig: config.particleConfig ?? {},
      autoEmit: config.autoEmit ?? true,
      duration: config.duration ?? 0,
    };

    if (this.config.autoEmit) {
      this.start();
    }
  }

  /**
   * 开始发射
   */
  start(): void {
    this.isEmitting = true;
    this.durationTimer = 0;
    this.emit('start');
  }

  /**
   * 停止发射
   */
  stop(): void {
    this.isEmitting = false;
    this.emit('stop');
  }

  /**
   * 爆发式发射
   */
  burst(count: number): void {
    for (let i = 0; i < count; i++) {
      this.emitParticle();
    }
  }

  /**
   * 更新发射器
   */
  update(deltaTime: number): void {
    // 更新持续时间
    if (this.isEmitting && this.config.duration > 0) {
      this.durationTimer += deltaTime;
      if (this.durationTimer >= this.config.duration) {
        this.stop();
      }
    }

    // 发射新粒子
    if (this.isEmitting) {
      this.emissionTimer += deltaTime;
      const emissionInterval = 1.0 / this.config.emissionRate;

      while (this.emissionTimer >= emissionInterval) {
        this.emitParticle();
        this.emissionTimer -= emissionInterval;
      }
    }

    // 更新现有粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(deltaTime);

      // 回收死亡粒子
      if (!particle.alive) {
        this.particles.splice(i, 1);
        this.recycleParticle(particle);
      }
    }
  }

  /**
   * 渲染所有粒子
   */
  render(ctx: CanvasRenderingContext2D): void {
    for (const particle of this.particles) {
      particle.render(ctx);
    }
  }

  /**
   * 发射单个粒子
   */
  private emitParticle(): void {
    if (this.particles.length >= this.config.maxParticles) {
      return;
    }

    // 计算随机角度和速度
    const angle =
      this.config.angle +
      (Math.random() - 0.5) * 2 * this.config.angleSpread;
    const speed =
      this.config.speed + (Math.random() - 0.5) * 2 * this.config.speedSpread;

    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    // 计算随机生命周期
    const lifetime =
      this.config.lifetime +
      (Math.random() - 0.5) * 2 * this.config.lifetimeSpread;

    // 创建粒子配置
    const particleConfig: ParticleConfig = {
      position: { x: this.position.x, y: this.position.y },
      velocity,
      lifetime: Math.max(0.1, lifetime),
      ...this.config.particleConfig,
    };

    // 从对象池获取或创建新粒子
    let particle: Particle;
    if (this.particlePool.length > 0) {
      particle = this.particlePool.pop()!;
      particle.reset(particleConfig);
    } else {
      particle = new Particle(particleConfig);
    }

    this.particles.push(particle);
  }

  /**
   * 回收粒子到对象池
   */
  private recycleParticle(particle: Particle): void {
    if (this.particlePool.length < this.config.maxParticles) {
      this.particlePool.push(particle);
    }
  }

  /**
   * 设置位置
   */
  setPosition(x: number, y: number): void {
    this.position.set(x, y);
  }

  /**
   * 获取活跃粒子数量
   */
  getParticleCount(): number {
    return this.particles.length;
  }

  /**
   * 清除所有粒子
   */
  clear(): void {
    for (const particle of this.particles) {
      this.recycleParticle(particle);
    }
    this.particles.length = 0;
  }

  /**
   * 销毁发射器
   */
  destroy(): void {
    this.stop();
    this.clear();
    this.particlePool.length = 0;
    this.removeAllListeners();
  }
}
