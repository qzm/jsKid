/**
 * 颜色工具类
 */

export interface RGBA {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1
}

export interface HSLA {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a: number; // 0-1
}

/**
 * 颜色类
 */
export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.r = Math.max(0, Math.min(255, r));
    this.g = Math.max(0, Math.min(255, g));
    this.b = Math.max(0, Math.min(255, b));
    this.a = Math.max(0, Math.min(1, a));
  }

  /**
   * 克隆颜色
   */
  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * 设置颜色
   */
  set(r: number, g: number, b: number, a: number = 1): this {
    this.r = Math.max(0, Math.min(255, r));
    this.g = Math.max(0, Math.min(255, g));
    this.b = Math.max(0, Math.min(255, b));
    this.a = Math.max(0, Math.min(1, a));
    return this;
  }

  /**
   * 转换为RGB字符串
   */
  toRGB(): string {
    return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
  }

  /**
   * 转换为RGBA字符串
   */
  toRGBA(): string {
    return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${this.a})`;
  }

  /**
   * 转换为HEX字符串
   */
  toHex(): string {
    const r = Math.round(this.r).toString(16).padStart(2, '0');
    const g = Math.round(this.g).toString(16).padStart(2, '0');
    const b = Math.round(this.b).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  /**
   * 转换为HSLA
   */
  toHSLA(): HSLA {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / diff + 2) / 6;
          break;
        case b:
          h = ((r - g) / diff + 4) / 6;
          break;
      }
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100,
      a: this.a
    };
  }

  /**
   * 颜色插值
   */
  lerp(target: Color, t: number): this {
    this.r += (target.r - this.r) * t;
    this.g += (target.g - this.g) * t;
    this.b += (target.b - this.b) * t;
    this.a += (target.a - this.a) * t;
    return this;
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    return this.toRGBA();
  }

  // 静态工厂方法

  /**
   * 从RGB创建颜色
   */
  static fromRGB(r: number, g: number, b: number, a: number = 1): Color {
    return new Color(r, g, b, a);
  }

  /**
   * 从HEX字符串创建颜色
   */
  static fromHex(hex: string): Color {
    // 移除 # 符号
    hex = hex.replace('#', '');

    // 支持 3 位和 6 位 HEX
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return new Color(r, g, b);
  }

  /**
   * 从HSLA创建颜色
   */
  static fromHSLA(h: number, s: number, l: number, a: number = 1): Color {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return new Color(r * 255, g * 255, b * 255, a);
  }

  /**
   * 从CSS颜色字符串创建颜色
   */
  static fromString(str: string): Color {
    // 支持 hex
    if (str.startsWith('#')) {
      return Color.fromHex(str);
    }

    // 支持 rgb/rgba
    const rgbaMatch = str.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
    );
    if (rgbaMatch) {
      return new Color(
        parseInt(rgbaMatch[1]),
        parseInt(rgbaMatch[2]),
        parseInt(rgbaMatch[3]),
        rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
      );
    }

    // 默认返回黑色
    return new Color(0, 0, 0, 1);
  }

  // 预定义颜色

  static readonly BLACK = new Color(0, 0, 0);
  static readonly WHITE = new Color(255, 255, 255);
  static readonly RED = new Color(255, 0, 0);
  static readonly GREEN = new Color(0, 255, 0);
  static readonly BLUE = new Color(0, 0, 255);
  static readonly YELLOW = new Color(255, 255, 0);
  static readonly CYAN = new Color(0, 255, 255);
  static readonly MAGENTA = new Color(255, 0, 255);
  static readonly TRANSPARENT = new Color(0, 0, 0, 0);

  /**
   * 随机颜色
   */
  static random(): Color {
    return new Color(
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    );
  }

  /**
   * 颜色插值
   */
  static lerp(a: Color, b: Color, t: number): Color {
    return new Color(
      a.r + (b.r - a.r) * t,
      a.g + (b.g - a.g) * t,
      a.b + (b.b - a.b) * t,
      a.a + (b.a - a.a) * t
    );
  }
}
