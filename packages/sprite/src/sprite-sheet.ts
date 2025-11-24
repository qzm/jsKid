/**
 * 精灵表（Sprite Sheet）管理
 */

import { Frame, type FrameData } from './frame';

export interface SpriteSheetData {
  /** 精灵表图片 */
  image: HTMLImageElement;
  /** 帧数据 */
  frames: FrameData[];
  /** 精灵表元数据 */
  metadata?: {
    name?: string;
    author?: string;
    [key: string]: any;
  };
}

/**
 * 精灵表类
 */
export class SpriteSheet {
  public image: HTMLImageElement;
  public frames: Frame[];
  public metadata: Record<string, any>;

  constructor(data: SpriteSheetData) {
    this.image = data.image;
    this.frames = data.frames.map((frameData) => new Frame(frameData));
    this.metadata = data.metadata || {};
  }

  /**
   * 获取指定索引的帧
   */
  getFrame(index: number): Frame | null {
    return this.frames[index] || null;
  }

  /**
   * 获取帧数量
   */
  getFrameCount(): number {
    return this.frames.length;
  }

  /**
   * 从网格创建精灵表（适用于等宽等高的精灵表）
   */
  static fromGrid(
    image: HTMLImageElement,
    frameWidth: number,
    frameHeight: number,
    options: {
      spacing?: number;
      margin?: number;
      columns?: number;
      rows?: number;
      frameDuration?: number;
    } = {}
  ): SpriteSheet {
    const {
      spacing = 0,
      margin = 0,
      columns,
      rows,
      frameDuration = 100
    } = options;

    const frames: FrameData[] = [];
    const cols = columns || Math.floor((image.width - margin * 2 + spacing) / (frameWidth + spacing));
    const rowCount = rows || Math.floor((image.height - margin * 2 + spacing) / (frameHeight + spacing));

    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < cols; col++) {
        frames.push({
          x: margin + col * (frameWidth + spacing),
          y: margin + row * (frameHeight + spacing),
          width: frameWidth,
          height: frameHeight,
          duration: frameDuration
        });
      }
    }

    return new SpriteSheet({
      image,
      frames,
      metadata: {
        type: 'grid',
        frameWidth,
        frameHeight,
        columns: cols,
        rows: rowCount
      }
    });
  }

  /**
   * 从JSON数据创建精灵表（支持TexturePacker等工具导出的格式）
   */
  static fromJSON(
    image: HTMLImageElement,
    jsonData: any
  ): SpriteSheet {
    const frames: FrameData[] = [];

    // 支持多种JSON格式
    if (jsonData.frames) {
      if (Array.isArray(jsonData.frames)) {
        // 数组格式
        frames.push(...jsonData.frames);
      } else {
        // 对象格式（TexturePacker）
        for (const key in jsonData.frames) {
          const frameData = jsonData.frames[key];
          frames.push({
            x: frameData.frame.x,
            y: frameData.frame.y,
            width: frameData.frame.w,
            height: frameData.frame.h,
            duration: frameData.duration || 100
          });
        }
      }
    }

    return new SpriteSheet({
      image,
      frames,
      metadata: jsonData.meta || {}
    });
  }
}
