/**
 * Quadtree
 * 四叉树空间分割算法 - 用于优化碰撞检测
 */

/**
 * 矩形边界
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 可碰撞对象接口
 */
export interface Collidable {
  getBounds(): Bounds;
  id?: string | number;
}

/**
 * 四叉树节点
 */
export class Quadtree<T extends Collidable> {
  private bounds: Bounds;
  private capacity: number;
  private objects: T[] = [];
  private divided: boolean = false;

  private northeast?: Quadtree<T>;
  private northwest?: Quadtree<T>;
  private southeast?: Quadtree<T>;
  private southwest?: Quadtree<T>;

  constructor(bounds: Bounds, capacity: number = 4) {
    this.bounds = bounds;
    this.capacity = capacity;
  }

  /**
   * 插入对象
   */
  insert(object: T): boolean {
    // 不在边界内
    if (!this.intersects(this.bounds, object.getBounds())) {
      return false;
    }

    // 容量未满，直接插入
    if (this.objects.length < this.capacity) {
      this.objects.push(object);
      return true;
    }

    // 需要细分
    if (!this.divided) {
      this.subdivide();
    }

    // 尝试插入到子节点
    if (this.northeast!.insert(object)) return true;
    if (this.northwest!.insert(object)) return true;
    if (this.southeast!.insert(object)) return true;
    if (this.southwest!.insert(object)) return true;

    // 无法插入到子节点，保留在当前节点
    this.objects.push(object);
    return true;
  }

  /**
   * 细分为四个子节点
   */
  private subdivide(): void {
    const x = this.bounds.x;
    const y = this.bounds.y;
    const w = this.bounds.width / 2;
    const h = this.bounds.height / 2;

    this.northeast = new Quadtree<T>(
      { x: x + w, y: y, width: w, height: h },
      this.capacity
    );
    this.northwest = new Quadtree<T>(
      { x: x, y: y, width: w, height: h },
      this.capacity
    );
    this.southeast = new Quadtree<T>(
      { x: x + w, y: y + h, width: w, height: h },
      this.capacity
    );
    this.southwest = new Quadtree<T>(
      { x: x, y: y + h, width: w, height: h },
      this.capacity
    );

    this.divided = true;
  }

  /**
   * 查询区域内的对象
   */
  query(range: Bounds, found: T[] = []): T[] {
    // 不相交
    if (!this.intersects(this.bounds, range)) {
      return found;
    }

    // 检查当前节点的对象
    for (const obj of this.objects) {
      if (this.intersects(obj.getBounds(), range)) {
        found.push(obj);
      }
    }

    // 如果已细分，递归查询子节点
    if (this.divided) {
      this.northeast!.query(range, found);
      this.northwest!.query(range, found);
      this.southeast!.query(range, found);
      this.southwest!.query(range, found);
    }

    return found;
  }

  /**
   * 查询点
   */
  queryPoint(x: number, y: number): T[] {
    return this.query({ x, y, width: 0, height: 0 });
  }

  /**
   * 获取所有对象
   */
  getAllObjects(objects: T[] = []): T[] {
    objects.push(...this.objects);

    if (this.divided) {
      this.northeast!.getAllObjects(objects);
      this.northwest!.getAllObjects(objects);
      this.southeast!.getAllObjects(objects);
      this.southwest!.getAllObjects(objects);
    }

    return objects;
  }

  /**
   * 清空四叉树
   */
  clear(): void {
    this.objects = [];
    this.divided = false;
    this.northeast = undefined;
    this.northwest = undefined;
    this.southeast = undefined;
    this.southwest = undefined;
  }

  /**
   * 检查两个矩形是否相交
   */
  private intersects(a: Bounds, b: Bounds): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }

  /**
   * 获取边界
   */
  getBounds(): Bounds {
    return this.bounds;
  }

  /**
   * 获取对象数量（包括子节点）
   */
  size(): number {
    let count = this.objects.length;

    if (this.divided) {
      count += this.northeast!.size();
      count += this.northwest!.size();
      count += this.southeast!.size();
      count += this.southwest!.size();
    }

    return count;
  }

  /**
   * 绘制四叉树（调试用）
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height
    );

    if (this.divided) {
      this.northeast!.draw(ctx);
      this.northwest!.draw(ctx);
      this.southeast!.draw(ctx);
      this.southwest!.draw(ctx);
    }
  }
}
