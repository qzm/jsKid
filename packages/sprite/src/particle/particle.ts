/**
 * Particle
 * 粒子类
 */

import { Vector2 } from '../../../utils/src/vector';

/**
 * 粒子配置
 */
export interface ParticleConfig {
  /** 位置 */
  position: { x: number; y: number };
  /** 速度 */
  velocity?: { x: number; y: number };
  /** 加速度 */
  acceleration?: { x: number; y: number };
  /** 生命周期（秒） */
  lifetime: number;
  /** 颜色 */
  color?: string;
  /** 起始颜色 */
  startColor?: string;
  /** 结束颜色 */
  endColor?: string;
  /** 大小 */
  size?: number;
  /** 起始大小 */
  startSize?: number;
  /** 结束大小 */
  endSize?: number;
  /** 透明度 */
  alpha?: number;
  /** 起始透明度 */
  startAlpha?: number;
  /** 结束透明度 */
  endAlpha?: number;
  /** 旋转 */
  rotation?: number;
  /** 角速度 */
  angularVelocity?: number;
}

/**
 * 粒子类
 */
export class Particle {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;

  lifetime: number;
  age: number = 0;
  alive: boolean = true;

  color: string;
  startColor?: string;
  endColor?: string;

  size: number;
  startSize: number;
  endSize: number;

  alpha: number;
  startAlpha: number;
  endAlpha: number;

  rotation: number;
  angularVelocity: number;

  constructor(config: ParticleConfig) {
    this.position = new Vector2(config.position.x, config.position.y);
    this.velocity = config.velocity
      ? new Vector2(config.velocity.x, config.velocity.y)
      : new Vector2(0, 0);
    this.acceleration = config.acceleration
      ? new Vector2(config.acceleration.x, config.acceleration.y)
      : new Vector2(0, 0);

    this.lifetime = config.lifetime;

    this.color = config.color || '#ffffff';
    this.startColor = config.startColor;
    this.endColor = config.endColor;

    this.size = config.size || 4;
    this.startSize = config.startSize ?? this.size;
    this.endSize = config.endSize ?? this.size;

    this.alpha = config.alpha ?? 1.0;
    this.startAlpha = config.startAlpha ?? this.alpha;
    this.endAlpha = config.endAlpha ?? 0.0;

    this.rotation = config.rotation || 0;
    this.angularVelocity = config.angularVelocity || 0;
  }

  /**
   * 更新粒子
   */
  update(deltaTime: number): void {
    if (!this.alive) return;

    // 更新年龄
    this.age += deltaTime;

    // 检查生命周期
    if (this.age >= this.lifetime) {
      this.alive = false;
      return;
    }

    // 更新速度和位置
    this.velocity.add(Vector2.multiply(this.acceleration, deltaTime));
    this.position.add(Vector2.multiply(this.velocity, deltaTime));

    // 更新旋转
    this.rotation += this.angularVelocity * deltaTime;

    // 计算生命周期百分比
    const t = this.age / this.lifetime;

    // 插值大小
    this.size = this.startSize + (this.endSize - this.startSize) * t;

    // 插值透明度
    this.alpha = this.startAlpha + (this.endAlpha - this.startAlpha) * t;

    // 插值颜色（如果设置了起始和结束颜色）
    if (this.startColor && this.endColor) {
      this.color = this.interpolateColor(this.startColor, this.endColor, t);
    }
  }

  /**
   * 渲染粒子
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    ctx.save();

    // 设置透明度
    ctx.globalAlpha = this.alpha;

    // 移动和旋转
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    // 绘制粒子（圆形）
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 插值颜色
   */
  private interpolateColor(start: string, end: string, t: number): string {
    const startRGB = this.hexToRgb(start);
    const endRGB = this.hexToRgb(end);

    if (!startRGB || !endRGB) return start;

    const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * t);
    const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * t);
    const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * t);

    return `rgb(${r},${g},${b})`;
  }

  /**
   * 十六进制转 RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * 重置粒子
   */
  reset(config: ParticleConfig): void {
    this.position.set(config.position.x, config.position.y);
    this.velocity = config.velocity
      ? new Vector2(config.velocity.x, config.velocity.y)
      : new Vector2(0, 0);
    this.acceleration = config.acceleration
      ? new Vector2(config.acceleration.x, config.acceleration.y)
      : new Vector2(0, 0);

    this.lifetime = config.lifetime;
    this.age = 0;
    this.alive = true;

    this.color = config.color || '#ffffff';
    this.startColor = config.startColor;
    this.endColor = config.endColor;

    this.size = config.size || 4;
    this.startSize = config.startSize ?? this.size;
    this.endSize = config.endSize ?? this.size;

    this.alpha = config.alpha ?? 1.0;
    this.startAlpha = config.startAlpha ?? this.alpha;
    this.endAlpha = config.endAlpha ?? 0.0;

    this.rotation = config.rotation || 0;
    this.angularVelocity = config.angularVelocity || 0;
  }
}
