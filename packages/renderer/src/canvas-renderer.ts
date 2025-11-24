/**
 * Canvas 2D渲染器实现
 */

import { Renderer } from './renderer';
import type {
  Vector2D,
  Rectangle,
  Circle,
  Line,
  DrawStyle,
  Transform,
  RendererConfig
} from './types';

/**
 * Canvas 2D渲染器
 */
export class CanvasRenderer extends Renderer {
  private styleStack: DrawStyle[] = [];
  private transformStack: number = 0;

  constructor(config: RendererConfig = {}) {
    super(config);
  }

  /**
   * 保存当前绘图状态
   */
  save(): void {
    this.context.save();
    this.transformStack++;
  }

  /**
   * 恢复之前的绘图状态
   */
  restore(): void {
    if (this.transformStack > 0) {
      this.context.restore();
      this.transformStack--;
    }
  }

  /**
   * 应用绘图样式
   */
  applyStyle(style: DrawStyle): void {
    const ctx = this.context;

    if (style.fillColor !== undefined) {
      ctx.fillStyle = style.fillColor;
    }

    if (style.strokeColor !== undefined) {
      ctx.strokeStyle = style.strokeColor;
    }

    if (style.lineWidth !== undefined) {
      ctx.lineWidth = style.lineWidth;
    }

    if (style.alpha !== undefined) {
      ctx.globalAlpha = style.alpha;
    }

    if (style.font !== undefined) {
      ctx.font = style.font;
    }

    if (style.textAlign !== undefined) {
      ctx.textAlign = style.textAlign;
    }

    if (style.textBaseline !== undefined) {
      ctx.textBaseline = style.textBaseline;
    }

    if (style.lineCap !== undefined) {
      ctx.lineCap = style.lineCap;
    }

    if (style.lineJoin !== undefined) {
      ctx.lineJoin = style.lineJoin;
    }

    if (style.lineDash !== undefined) {
      ctx.setLineDash(style.lineDash);
    }
  }

  /**
   * 推入绘图样式
   */
  pushStyle(style: DrawStyle): void {
    this.styleStack.push({ ...style });
    this.save();
    this.applyStyle(style);
  }

  /**
   * 弹出绘图样式
   */
  popStyle(): void {
    this.styleStack.pop();
    this.restore();
  }

  /**
   * 应用变换
   */
  applyTransform(transform: Transform): void {
    const ctx = this.context;
    ctx.translate(transform.position.x, transform.position.y);

    if (transform.rotation !== 0) {
      ctx.rotate(transform.rotation);
    }

    if (transform.scale.x !== 1 || transform.scale.y !== 1) {
      ctx.scale(transform.scale.x, transform.scale.y);
    }
  }

  /**
   * 绘制矩形（填充）
   */
  fillRect(rect: Rectangle, style?: DrawStyle): void {
    if (style) this.pushStyle(style);

    this.context.fillRect(rect.x, rect.y, rect.width, rect.height);

    if (style) this.popStyle();
  }

  /**
   * 绘制矩形（描边）
   */
  strokeRect(rect: Rectangle, style?: DrawStyle): void {
    if (style) this.pushStyle(style);

    this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);

    if (style) this.popStyle();
  }

  /**
   * 绘制圆形（填充）
   */
  fillCircle(circle: Circle, style?: DrawStyle): void {
    if (style) this.pushStyle(style);

    const ctx = this.context;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fill();

    if (style) this.popStyle();
  }

  /**
   * 绘制圆形（描边）
   */
  strokeCircle(circle: Circle, style?: DrawStyle): void {
    if (style) this.pushStyle(style);

    const ctx = this.context;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();

    if (style) this.popStyle();
  }

  /**
   * 绘制线条
   */
  drawLine(line: Line, style?: DrawStyle): void {
    if (style) this.pushStyle(style);

    const ctx = this.context;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();

    if (style) this.popStyle();
  }

  /**
   * 绘制路径
   */
  drawPath(points: Vector2D[], closed: boolean = false, style?: DrawStyle): void {
    if (points.length < 2) return;

    if (style) this.pushStyle(style);

    const ctx = this.context;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    if (closed) {
      ctx.closePath();
    }

    ctx.stroke();

    if (style) this.popStyle();
  }

  /**
   * 填充路径
   */
  fillPath(points: Vector2D[], style?: DrawStyle): void {
    if (points.length < 3) return;

    if (style) this.pushStyle(style);

    const ctx = this.context;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fill();

    if (style) this.popStyle();
  }

  /**
   * 绘制文本（填充）
   */
  fillText(text: string, x: number, y: number, style?: DrawStyle): void {
    if (style) this.pushStyle(style);

    this.context.fillText(text, x, y);

    if (style) this.popStyle();
  }

  /**
   * 绘制文本（描边）
   */
  strokeText(text: string, x: number, y: number, style?: DrawStyle): void {
    if (style) this.pushStyle(style);

    this.context.strokeText(text, x, y);

    if (style) this.popStyle();
  }

  /**
   * 测量文本宽度
   */
  measureText(text: string, font?: string): TextMetrics {
    if (font) {
      this.context.font = font;
    }
    return this.context.measureText(text);
  }

  /**
   * 绘制图片
   */
  drawImage(
    image: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): void {
    if (width !== undefined && height !== undefined) {
      this.context.drawImage(image, x, y, width, height);
    } else {
      this.context.drawImage(image, x, y);
    }
  }

  /**
   * 绘制图片的一部分
   */
  drawImagePart(
    image: HTMLImageElement | HTMLCanvasElement,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number
  ): void {
    this.context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }

  /**
   * 设置混合模式
   */
  setBlendMode(mode: GlobalCompositeOperation): void {
    this.context.globalCompositeOperation = mode;
  }

  /**
   * 设置透明度
   */
  setAlpha(alpha: number): void {
    this.context.globalAlpha = Math.max(0, Math.min(1, alpha));
  }

  /**
   * 平移
   */
  translate(x: number, y: number): void {
    this.context.translate(x, y);
  }

  /**
   * 旋转
   */
  rotate(angle: number): void {
    this.context.rotate(angle);
  }

  /**
   * 缩放
   */
  scale(x: number, y: number): void {
    this.context.scale(x, y);
  }

  /**
   * 裁剪矩形区域
   */
  clipRect(rect: Rectangle): void {
    const ctx = this.context;
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.clip();
  }

  /**
   * 重置变换
   */
  resetTransform(): void {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * 清除所有状态栈
   */
  reset(): void {
    while (this.transformStack > 0) {
      this.restore();
    }
    this.styleStack = [];
    this.resetTransform();
  }
}
