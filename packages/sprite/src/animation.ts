/**
 * 动画控制器
 */

import { Frame } from './frame';
import { EventEmitter } from 'eventemitter3';

export interface AnimationOptions {
  /** 动画名称 */
  name: string;
  /** 动画帧序列 */
  frames: Frame[];
  /** 是否循环播放 */
  loop?: boolean;
  /** 播放速度倍数 */
  speed?: number;
  /** 是否自动播放 */
  autoPlay?: boolean;
}

/**
 * 动画类
 */
export class Animation extends EventEmitter {
  public name: string;
  public frames: Frame[];
  public loop: boolean;
  public speed: number;

  private currentFrameIndex: number = 0;
  private currentFrameTime: number = 0;
  private playing: boolean = false;
  private finished: boolean = false;

  constructor(options: AnimationOptions) {
    super();

    this.name = options.name;
    this.frames = options.frames;
    this.loop = options.loop !== false; // 默认循环
    this.speed = options.speed || 1;

    if (options.autoPlay) {
      this.play();
    }
  }

  /**
   * 播放动画
   */
  play(): void {
    if (this.playing) return;

    this.playing = true;
    this.finished = false;
    this.emit('play', { animation: this });
  }

  /**
   * 暂停动画
   */
  pause(): void {
    if (!this.playing) return;

    this.playing = false;
    this.emit('pause', { animation: this });
  }

  /**
   * 停止动画
   */
  stop(): void {
    this.playing = false;
    this.currentFrameIndex = 0;
    this.currentFrameTime = 0;
    this.finished = false;
    this.emit('stop', { animation: this });
  }

  /**
   * 重置动画
   */
  reset(): void {
    this.currentFrameIndex = 0;
    this.currentFrameTime = 0;
    this.finished = false;
  }

  /**
   * 跳转到指定帧
   */
  gotoFrame(index: number): void {
    this.currentFrameIndex = Math.max(0, Math.min(index, this.frames.length - 1));
    this.currentFrameTime = 0;
  }

  /**
   * 更新动画
   */
  update(deltaTime: number): void {
    if (!this.playing || this.finished || this.frames.length === 0) {
      return;
    }

    const currentFrame = this.frames[this.currentFrameIndex];
    this.currentFrameTime += deltaTime * 1000 * this.speed; // 转换为毫秒

    if (this.currentFrameTime >= currentFrame.duration) {
      this.currentFrameTime = 0;
      this.currentFrameIndex++;

      // 检查是否到达最后一帧
      if (this.currentFrameIndex >= this.frames.length) {
        if (this.loop) {
          this.currentFrameIndex = 0;
          this.emit('loop', { animation: this });
        } else {
          this.currentFrameIndex = this.frames.length - 1;
          this.finished = true;
          this.playing = false;
          this.emit('complete', { animation: this });
        }
      } else {
        this.emit('frameChange', {
          animation: this,
          frameIndex: this.currentFrameIndex
        });
      }
    }
  }

  /**
   * 获取当前帧
   */
  getCurrentFrame(): Frame | null {
    return this.frames[this.currentFrameIndex] || null;
  }

  /**
   * 获取当前帧索引
   */
  getCurrentFrameIndex(): number {
    return this.currentFrameIndex;
  }

  /**
   * 是否正在播放
   */
  isPlaying(): boolean {
    return this.playing;
  }

  /**
   * 是否已完成
   */
  isFinished(): boolean {
    return this.finished;
  }

  /**
   * 获取动画总帧数
   */
  getFrameCount(): number {
    return this.frames.length;
  }

  /**
   * 获取动画总时长（毫秒）
   */
  getTotalDuration(): number {
    return this.frames.reduce((total, frame) => total + frame.duration, 0);
  }

  /**
   * 克隆动画
   */
  clone(): Animation {
    return new Animation({
      name: this.name,
      frames: this.frames.map(frame => frame.clone()),
      loop: this.loop,
      speed: this.speed,
      autoPlay: false
    });
  }
}

/**
 * 动画管理器
 */
export class AnimationManager extends EventEmitter {
  private animations: Map<string, Animation> = new Map();
  private currentAnimation: Animation | null = null;

  /**
   * 添加动画
   */
  addAnimation(animation: Animation): void {
    this.animations.set(animation.name, animation);
    this.emit('animationAdded', { animation });
  }

  /**
   * 移除动画
   */
  removeAnimation(name: string): boolean {
    const animation = this.animations.get(name);
    if (animation) {
      if (this.currentAnimation === animation) {
        this.currentAnimation = null;
      }
      this.animations.delete(name);
      this.emit('animationRemoved', { animation });
      return true;
    }
    return false;
  }

  /**
   * 获取动画
   */
  getAnimation(name: string): Animation | null {
    return this.animations.get(name) || null;
  }

  /**
   * 播放指定动画
   */
  play(name: string): boolean {
    const animation = this.animations.get(name);
    if (!animation) return false;

    // 停止当前动画
    if (this.currentAnimation && this.currentAnimation !== animation) {
      this.currentAnimation.stop();
    }

    this.currentAnimation = animation;
    animation.play();

    this.emit('animationChanged', { animation });
    return true;
  }

  /**
   * 停止当前动画
   */
  stop(): void {
    if (this.currentAnimation) {
      this.currentAnimation.stop();
      this.currentAnimation = null;
    }
  }

  /**
   * 暂停当前动画
   */
  pause(): void {
    if (this.currentAnimation) {
      this.currentAnimation.pause();
    }
  }

  /**
   * 恢复当前动画
   */
  resume(): void {
    if (this.currentAnimation) {
      this.currentAnimation.play();
    }
  }

  /**
   * 更新动画
   */
  update(deltaTime: number): void {
    if (this.currentAnimation) {
      this.currentAnimation.update(deltaTime);
    }
  }

  /**
   * 获取当前动画
   */
  getCurrentAnimation(): Animation | null {
    return this.currentAnimation;
  }

  /**
   * 获取当前帧
   */
  getCurrentFrame(): Frame | null {
    return this.currentAnimation?.getCurrentFrame() || null;
  }

  /**
   * 清除所有动画
   */
  clear(): void {
    this.animations.clear();
    this.currentAnimation = null;
  }
}
