/**
 * 动画帧定义
 */

export interface FrameData {
  /** 帧在精灵表中的X坐标 */
  x: number;
  /** 帧在精灵表中的Y坐标 */
  y: number;
  /** 帧宽度 */
  width: number;
  /** 帧高度 */
  height: number;
  /** 帧持续时间（毫秒） */
  duration?: number;
  /** 帧的偏移量 */
  offsetX?: number;
  offsetY?: number;
}

/**
 * 动画帧类
 */
export class Frame {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public duration: number;
  public offsetX: number;
  public offsetY: number;

  constructor(data: FrameData) {
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
    this.duration = data.duration || 100;
    this.offsetX = data.offsetX || 0;
    this.offsetY = data.offsetY || 0;
  }

  /**
   * 克隆帧
   */
  clone(): Frame {
    return new Frame({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      duration: this.duration,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    });
  }
}
