/**
 * 渲染器基类
 */

import { EventEmitter } from 'eventemitter3';
import type { IRenderer, RendererConfig } from './types';

/**
 * 渲染器抽象基类
 */
export abstract class Renderer extends EventEmitter implements IRenderer {
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected config: Required<RendererConfig>;

  constructor(config: RendererConfig = {}) {
    super();

    // 设置默认配置
    this.config = {
      canvas: config.canvas || undefined!,
      width: config.width || 800,
      height: config.height || 600,
      antialias: config.antialias !== false,
      transparent: config.transparent || false,
      backgroundColor: config.backgroundColor || '#000000',
      autoResize: config.autoResize || false,
      pixelRatio: config.pixelRatio || window.devicePixelRatio || 1
    };

    // 初始化Canvas
    this.canvas = this.initCanvas();
    const ctx = this.canvas.getContext('2d', {
      alpha: this.config.transparent,
      desynchronized: true // 提升性能
    });

    if (!ctx) {
      throw new Error('无法获取Canvas 2D上下文');
    }

    this.context = ctx;

    // 设置初始尺寸
    this.resize(this.config.width, this.config.height);

    // 自动调整大小
    if (this.config.autoResize) {
      this.setupAutoResize();
    }

    this.emit('initialized', { renderer: this });
  }

  /**
   * 初始化Canvas元素
   */
  protected initCanvas(): HTMLCanvasElement {
    if (this.config.canvas) {
      if (typeof this.config.canvas === 'string') {
        const canvas = document.getElementById(this.config.canvas) as HTMLCanvasElement;
        if (!canvas) {
          throw new Error(`找不到ID为 ${this.config.canvas} 的Canvas元素`);
        }
        return canvas;
      }
      return this.config.canvas;
    }

    // 创建新Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'jskid-canvas';
    document.body.appendChild(canvas);
    return canvas;
  }

  /**
   * 设置自动调整大小
   */
  protected setupAutoResize(): void {
    const resizeHandler = () => {
      this.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resizeHandler);

    // 初始调整
    resizeHandler();
  }

  /**
   * 获取Canvas元素
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * 获取渲染上下文
   */
  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  /**
   * 调整画布大小
   */
  resize(width: number, height: number): void {
    const pixelRatio = this.config.pixelRatio;

    // 设置实际像素尺寸
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;

    // 设置CSS显示尺寸
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // 缩放上下文以匹配DPI
    this.context.scale(pixelRatio, pixelRatio);

    // 重新应用抗锯齿设置
    if (!this.config.antialias) {
      this.context.imageSmoothingEnabled = false;
    }

    this.emit('resize', { width, height, renderer: this });
  }

  /**
   * 获取画布尺寸
   */
  getSize(): { width: number; height: number } {
    return {
      width: this.canvas.width / this.config.pixelRatio,
      height: this.canvas.height / this.config.pixelRatio
    };
  }

  /**
   * 清空画布
   */
  clear(): void {
    const { width, height } = this.getSize();

    if (this.config.transparent) {
      this.context.clearRect(0, 0, width, height);
    } else {
      this.context.fillStyle = this.config.backgroundColor;
      this.context.fillRect(0, 0, width, height);
    }
  }

  /**
   * 开始新的帧
   */
  begin(): void {
    this.clear();
    this.emit('frameBegin', { renderer: this });
  }

  /**
   * 结束当前帧
   */
  end(): void {
    this.emit('frameEnd', { renderer: this });
  }

  /**
   * 销毁渲染器
   */
  destroy(): void {
    this.removeAllListeners();
    this.emit('destroyed', { renderer: this });
  }
}
