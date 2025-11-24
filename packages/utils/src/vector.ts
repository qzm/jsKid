/**
 * 2D向量类和工具函数
 */

export interface IVector2D {
  x: number;
  y: number;
}

/**
 * 2D向量类
 */
export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  /**
   * 复制向量
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * 从另一个向量复制值
   */
  copy(v: IVector2D): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  /**
   * 设置向量值
   */
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * 向量加法
   */
  add(v: IVector2D): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * 向量减法
   */
  sub(v: IVector2D): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * 向量标量乘法
   */
  multiply(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * 向量标量除法
   */
  divide(scalar: number): this {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  /**
   * 计算向量长度
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 计算向量长度平方
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * 归一化向量
   */
  normalize(): this {
    const len = this.length();
    if (len > 0) {
      this.divide(len);
    }
    return this;
  }

  /**
   * 限制向量长度
   */
  limit(max: number): this {
    const lenSq = this.lengthSquared();
    if (lenSq > max * max) {
      this.normalize().multiply(max);
    }
    return this;
  }

  /**
   * 计算两个向量的点积
   */
  dot(v: IVector2D): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 计算两个向量的叉积（返回标量）
   */
  cross(v: IVector2D): number {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * 计算到另一个向量的距离
   */
  distanceTo(v: IVector2D): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 计算到另一个向量的距离平方
   */
  distanceToSquared(v: IVector2D): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  /**
   * 计算向量角度（弧度）
   */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * 旋转向量
   */
  rotate(angle: number): this {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * 线性插值
   */
  lerp(v: IVector2D, t: number): this {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    return this;
  }

  /**
   * 向量相等比较
   */
  equals(v: IVector2D, epsilon = 0.0001): boolean {
    return (
      Math.abs(this.x - v.x) < epsilon &&
      Math.abs(this.y - v.y) < epsilon
    );
  }

  /**
   * 转换为数组
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * 转换为对象
   */
  toObject(): IVector2D {
    return { x: this.x, y: this.y };
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }

  // 静态工厂方法

  /**
   * 创建零向量
   */
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /**
   * 创建单位向量（指向右）
   */
  static one(): Vector2 {
    return new Vector2(1, 1);
  }

  /**
   * 创建向上的单位向量
   */
  static up(): Vector2 {
    return new Vector2(0, -1);
  }

  /**
   * 创建向下的单位向量
   */
  static down(): Vector2 {
    return new Vector2(0, 1);
  }

  /**
   * 创建向左的单位向量
   */
  static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  /**
   * 创建向右的单位向量
   */
  static right(): Vector2 {
    return new Vector2(1, 0);
  }

  /**
   * 从角度创建向量
   */
  static fromAngle(angle: number, length = 1): Vector2 {
    return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  /**
   * 从数组创建向量
   */
  static fromArray(arr: [number, number]): Vector2 {
    return new Vector2(arr[0], arr[1]);
  }

  /**
   * 从对象创建向量
   */
  static fromObject(obj: IVector2D): Vector2 {
    return new Vector2(obj.x, obj.y);
  }

  /**
   * 计算两个向量之间的距离
   */
  static distance(a: IVector2D, b: IVector2D): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 向量插值
   */
  static lerp(a: IVector2D, b: IVector2D, t: number): Vector2 {
    return new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  }

  /**
   * 计算两个向量的点积
   */
  static dot(a: IVector2D, b: IVector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  /**
   * 计算两个向量的叉积
   */
  static cross(a: IVector2D, b: IVector2D): number {
    return a.x * b.y - a.y * b.x;
  }
}
