/**
 * UUID生成工具
 */

/**
 * 生成UUID v4
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 生成简短的唯一ID
 */
export function shortId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * 生成带前缀的ID
 */
export function prefixedId(prefix: string): string {
  return `${prefix}_${shortId()}`;
}

/**
 * 递增ID生成器
 */
export class IdGenerator {
  private counter: number = 0;
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  /**
   * 生成下一个ID
   */
  next(): string {
    return this.prefix ? `${this.prefix}_${this.counter++}` : `${this.counter++}`;
  }

  /**
   * 重置计数器
   */
  reset(start: number = 0): void {
    this.counter = start;
  }

  /**
   * 获取当前计数器值
   */
  current(): number {
    return this.counter;
  }
}
