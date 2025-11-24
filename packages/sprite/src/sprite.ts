/**
 * 精灵类
 */

import { EventEmitter } from 'eventemitter3';
import { Animation, AnimationManager } from './animation';
import { Frame } from './frame';
import { SpriteSheet } from './sprite-sheet';

export interface Vector2D {
  x: number;
  y: number;
}

export interface SpriteOptions {
  /** 精灵位置 */
  position?: Vector2D;
  /** 精灵缩放 */
  scale?: Vector2D;
  /** 精灵旋转角度（弧度） */
  rotation?: number;
  /** 精灵锚点（0-1） */
  anchor?: Vector2D;
  /** 精灵透明度（0-1） */
  alpha?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 精灵表 */
  spriteSheet?: SpriteSheet;
  /** 初始帧索引 */
  frameIndex?: number;
}

/**
 * 精灵类
 */
export class Sprite extends EventEmitter {
  // 变换属性
  public position: Vector2D;
  public scale: Vector2D;
  public rotation: number;
  public anchor: Vector2D;
  public alpha: number;
  public visible: boolean;

  // 渲染属性
  private spriteSheet: SpriteSheet | null = null;
  private currentFrame: Frame | null = null;
  private frameIndex: number = 0;

  // 动画
  private animationManager: AnimationManager;

  // 混合模式
  public blendMode: GlobalCompositeOperation = 'source-over';

  // 色调
  public tint: string = '#ffffff';

  constructor(options: SpriteOptions = {}) {
    super();

    this.position = options.position || { x: 0, y: 0 };
    this.scale = options.scale || { x: 1, y: 1 };
    this.rotation = options.rotation || 0;
    this.anchor = options.anchor || { x: 0.5, y: 0.5 };
    this.alpha = options.alpha !== undefined ? options.alpha : 1;
    this.visible = options.visible !== undefined ? options.visible : true;

    this.animationManager = new AnimationManager();

    if (options.spriteSheet) {
      this.setSpriteSheet(options.spriteSheet);
      if (options.frameIndex !== undefined) {
        this.setFrame(options.frameIndex);
      }
    }
  }

  /**
   * 设置精灵表
   */
  setSpriteSheet(spriteSheet: SpriteSheet): void {
    this.spriteSheet = spriteSheet;
    if (spriteSheet.frames.length > 0) {
      this.setFrame(0);
    }
  }

  /**
   * 获取精灵表
   */
  getSpriteSheet(): SpriteSheet | null {
    return this.spriteSheet;
  }

  /**
   * 设置当前帧
   */
  setFrame(index: number): void {
    if (!this.spriteSheet) return;

    this.frameIndex = index;
    this.currentFrame = this.spriteSheet.getFrame(index);

    if (this.currentFrame) {
      this.emit('frameChange', { sprite: this, frame: this.currentFrame });
    }
  }

  /**
   * 获取当前帧
   */
  getCurrentFrame(): Frame | null {
    return this.currentFrame;
  }

  /**
   * 获取当前帧索引
   */
  getFrameIndex(): number {
    return this.frameIndex;
  }

  /**
   * 添加动画
   */
  addAnimation(animation: Animation): void {
    this.animationManager.addAnimation(animation);
  }

  /**
   * 播放动画
   */
  playAnimation(name: string): boolean {
    const result = this.animationManager.play(name);
    if (result) {
      this.emit('animationStart', { sprite: this, animationName: name });
    }
    return result;
  }

  /**
   * 停止动画
   */
  stopAnimation(): void {
    this.animationManager.stop();
    this.emit('animationStop', { sprite: this });
  }

  /**
   * 暂停动画
   */
  pauseAnimation(): void {
    this.animationManager.pause();
  }

  /**
   * 恢复动画
   */
  resumeAnimation(): void {
    this.animationManager.resume();
  }

  /**
   * 获取动画管理器
   */
  getAnimationManager(): AnimationManager {
    return this.animationManager;
  }

  /**
   * 更新精灵
   */
  update(deltaTime: number): void {
    // 更新动画
    this.animationManager.update(deltaTime);

    // 如果有当前动画，使用动画的当前帧
    const animationFrame = this.animationManager.getCurrentFrame();
    if (animationFrame) {
      this.currentFrame = animationFrame;
    }

    this.emit('update', { sprite: this, deltaTime });
  }

  /**
   * 渲染精灵
   */
  render(context: CanvasRenderingContext2D): void {
    if (!this.visible || !this.currentFrame || !this.spriteSheet) {
      return;
    }

    const frame = this.currentFrame;
    const sheet = this.spriteSheet;

    context.save();

    // 设置透明度
    context.globalAlpha = this.alpha;

    // 设置混合模式
    context.globalCompositeOperation = this.blendMode;

    // 平移到精灵位置
    context.translate(this.position.x, this.position.y);

    // 旋转
    if (this.rotation !== 0) {
      context.rotate(this.rotation);
    }

    // 缩放
    if (this.scale.x !== 1 || this.scale.y !== 1) {
      context.scale(this.scale.x, this.scale.y);
    }

    // 计算绘制位置（考虑锚点）
    const drawX = -frame.width * this.anchor.x + frame.offsetX;
    const drawY = -frame.height * this.anchor.y + frame.offsetY;

    // 如果需要色调（简单实现，仅支持白色）
    if (this.tint !== '#ffffff') {
      // 这里可以添加更复杂的色调处理
      // 简单起见，暂时跳过
    }

    // 绘制精灵
    context.drawImage(
      sheet.image,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      drawX,
      drawY,
      frame.width,
      frame.height
    );

    context.restore();

    this.emit('render', { sprite: this, context });
  }

  /**
   * 获取精灵的边界框
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    if (!this.currentFrame) {
      return { x: this.position.x, y: this.position.y, width: 0, height: 0 };
    }

    const frame = this.currentFrame;
    const width = frame.width * this.scale.x;
    const height = frame.height * this.scale.y;

    return {
      x: this.position.x - width * this.anchor.x,
      y: this.position.y - height * this.anchor.y,
      width,
      height
    };
  }

  /**
   * 检测点是否在精灵内
   */
  containsPoint(x: number, y: number): boolean {
    const bounds = this.getBounds();
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    );
  }

  /**
   * 克隆精灵
   */
  clone(): Sprite {
    const sprite = new Sprite({
      position: { ...this.position },
      scale: { ...this.scale },
      rotation: this.rotation,
      anchor: { ...this.anchor },
      alpha: this.alpha,
      visible: this.visible,
      spriteSheet: this.spriteSheet || undefined,
      frameIndex: this.frameIndex
    });

    sprite.blendMode = this.blendMode;
    sprite.tint = this.tint;

    return sprite;
  }

  /**
   * 销毁精灵
   */
  destroy(): void {
    this.animationManager.clear();
    this.removeAllListeners();
    this.spriteSheet = null;
    this.currentFrame = null;
  }

  /**
   * 创建静态精灵（单个图片）
   */
  static fromImage(image: HTMLImageElement, options: SpriteOptions = {}): Sprite {
    const spriteSheet = new SpriteSheet({
      image,
      frames: [
        {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height
        }
      ]
    });

    return new Sprite({
      ...options,
      spriteSheet,
      frameIndex: 0
    });
  }
}
