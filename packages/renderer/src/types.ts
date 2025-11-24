/**
 * 渲染器类型定义
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * 渲染器配置
 */
export interface RendererConfig {
  /** Canvas元素或ID */
  canvas?: HTMLCanvasElement | string;
  /** Canvas宽度 */
  width?: number;
  /** Canvas高度 */
  height?: number;
  /** 是否启用抗锯齿 */
  antialias?: boolean;
  /** 是否透明背景 */
  transparent?: boolean;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 是否自动调整大小 */
  autoResize?: boolean;
  /** DPI缩放 */
  pixelRatio?: number;
}

/**
 * 绘图样式
 */
export interface DrawStyle {
  /** 填充颜色 */
  fillColor?: string;
  /** 描边颜色 */
  strokeColor?: string;
  /** 线宽 */
  lineWidth?: number;
  /** 透明度 */
  alpha?: number;
  /** 字体 */
  font?: string;
  /** 文本对齐 */
  textAlign?: CanvasTextAlign;
  /** 文本基线 */
  textBaseline?: CanvasTextBaseline;
  /** 线条端点样式 */
  lineCap?: CanvasLineCap;
  /** 线条连接样式 */
  lineJoin?: CanvasLineJoin;
  /** 虚线样式 */
  lineDash?: number[];
}

/**
 * 变换信息
 */
export interface Transform {
  /** 位置 */
  position: Vector2D;
  /** 旋转角度（弧度） */
  rotation: number;
  /** 缩放 */
  scale: Vector2D;
}

/**
 * 渲染器接口
 */
export interface IRenderer {
  /** 获取Canvas元素 */
  getCanvas(): HTMLCanvasElement;

  /** 获取渲染上下文 */
  getContext(): CanvasRenderingContext2D;

  /** 清空画布 */
  clear(): void;

  /** 开始新的帧 */
  begin(): void;

  /** 结束当前帧 */
  end(): void;

  /** 调整大小 */
  resize(width: number, height: number): void;

  /** 获取画布尺寸 */
  getSize(): { width: number; height: number };
}
