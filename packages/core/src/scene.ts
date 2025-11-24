/**
 * 场景管理模块
 * 提供场景的基础实现和管理功能
 */

import type { Scene, GameObject, Vector2D, Size2D } from './types';
import { EventEmitter } from 'eventemitter3';

/**
 * 基础场景实现
 */
export abstract class BaseScene extends EventEmitter implements Scene {
  public readonly id: string;
  public name: string;
  public objects: GameObject[] = [];
  protected _enabled: boolean = true;
  protected _visible: boolean = true;

  constructor(id: string, name: string = id) {
    super();
    this.id = id;
    this.name = name;
  }

  /**
   * 场景是否启用
   */
  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    if (this._enabled !== value) {
      this._enabled = value;
      this.emit('enabled-changed', value);
    }
  }

  /**
   * 场景是否可见
   */
  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    if (this._visible !== value) {
      this._visible = value;
      this.emit('visible-changed', value);
    }
  }

  /**
   * 添加游戏对象
   */
  public addObject(object: GameObject): void {
    if (!this.objects.find(obj => obj.id === object.id)) {
      object.parent = this as any;
      this.objects.push(object);

      // 如果对象有初始化方法，调用它
      if (object.init) {
        object.init();
      }

      this.emit('object-added', object);
    }
  }

  /**
   * 移除游戏对象
   */
  public removeObject(id: string): boolean {
    const index = this.objects.findIndex(obj => obj.id === id);
    if (index !== -1) {
      const object = this.objects[index];

      // 调用对象的销毁方法
      if (object.destroy) {
        object.destroy();
      }

      object.parent = undefined;
      this.objects.splice(index, 1);
      this.emit('object-removed', object);
      return true;
    }
    return false;
  }

  /**
   * 根据ID查找游戏对象
   */
  public findObject(id: string): GameObject | undefined {
    return this.objects.find(obj => obj.id === id);
  }

  /**
   * 根据名称查找游戏对象（返回第一个匹配的对象）
   */
  public findObjectByName(name: string): GameObject | undefined {
    return this.objects.find(obj => obj.name === name);
  }

  /**
   * 根据名称查找所有匹配的游戏对象
   */
  public findObjectsByName(name: string): GameObject[] {
    return this.objects.filter(obj => obj.name === name);
  }

  /**
   * 清空所有游戏对象
   */
  public clearObjects(): void {
    for (const object of this.objects) {
      if (object.destroy) {
        object.destroy();
      }
      object.parent = undefined;
    }
    this.objects = [];
    this.emit('objects-cleared');
  }

  /**
   * 更新场景中的所有游戏对象
   */
  public update(deltaTime: number): void {
    if (!this._enabled) return;

    for (const object of this.objects) {
      if (object.enabled && object.update) {
        object.update(deltaTime);
      }
    }

    this.emit('update', deltaTime);
  }

  /**
   * 渲染场景中的所有游戏对象
   */
  public render(context: CanvasRenderingContext2D): void {
    if (!this._visible) return;

    for (const object of this.objects) {
      if (object.visible && object.render) {
        // 保存当前上下文状态
        context.save();

        // 应用对象变换
        context.translate(object.position.x, object.position.y);
        context.rotate(object.rotation);
        context.scale(object.scale.x, object.scale.y);

        // 渲染对象
        object.render(context);

        // 恢复上下文状态
        context.restore();
      }
    }

    this.emit('render', context);
  }

  /**
   * 场景初始化（子类可重写）
   */
  public async load(): Promise<void> {
    this.emit('load');
  }

  /**
   * 场景卸载（子类可重写）
   */
  public async unload(): Promise<void> {
    this.clearObjects();
    this.emit('unload');
  }

  /**
   * 暂停场景
   */
  public pause(): void {
    this.enabled = false;
    this.emit('pause');
  }

  /**
   * 恢复场景
   */
  public resume(): void {
    this.enabled = true;
    this.emit('resume');
  }

  /**
   * 销毁场景
   */
  public destroy(): void {
    this.clearObjects();
    this.removeAllListeners();
  }
}

/**
 * 游戏对象基类
 */
export abstract class BaseGameObject implements GameObject {
  public readonly id: string;
  public name: string;
  public enabled: boolean = true;
  public visible: boolean = true;
  public position: Vector2D = { x: 0, y: 0 };
  public size: Size2D = { width: 0, height: 0 };
  public rotation: number = 0;
  public scale: Vector2D = { x: 1, y: 1 };
  public parent?: GameObject;
  public children: GameObject[] = [];

  private static idCounter: number = 0;

  constructor(name: string = 'GameObject') {
    this.id = `gameobj_${++BaseGameObject.idCounter}`;
    this.name = name;
  }

  /**
   * 初始化方法（子类可重写）
   */
  public init(): void {
    // 子类实现
  }

  /**
   * 更新方法（子类可重写）
   */
  public update(deltaTime: number): void {
    // 子类实现
  }

  /**
   * 渲染方法（子类可重写）
   */
  public render(context: CanvasRenderingContext2D): void {
    // 子类实现
  }

  /**
   * 销毁方法（子类可重写）
   */
  public destroy(): void {
    this.parent = undefined;
    this.children = [];
  }

  /**
   * 添加子对象
   */
  public addChild(child: GameObject): void {
    if (!this.children.find(c => c.id === child.id)) {
      child.parent = this;
      this.children.push(child);
      if (child.init) {
        child.init();
      }
    }
  }

  /**
   * 移除子对象
   */
  public removeChild(id: string): boolean {
    const index = this.children.findIndex(c => c.id === id);
    if (index !== -1) {
      const child = this.children[index];
      child.parent = undefined;
      if (child.destroy) {
        child.destroy();
      }
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 获取世界坐标（考虑父对象的变换）
   */
  public getWorldPosition(): Vector2D {
    if (this.parent) {
      const parentPos = this.parent.getWorldPosition ?
        this.parent.getWorldPosition() : this.parent.position;
      return {
        x: parentPos.x + this.position.x,
        y: parentPos.y + this.position.y
      };
    }
    return { ...this.position };
  }

  /**
   * 获取边界框
   */
  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.position.x - (this.size.width * this.scale.x) / 2,
      y: this.position.y - (this.size.height * this.scale.y) / 2,
      width: this.size.width * this.scale.x,
      height: this.size.height * this.scale.y
    };
  }

  /**
   * 检查是否与另一个对象碰撞
   */
  public intersects(other: GameObject): boolean {
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds ? other.getBounds() : {
      x: other.position.x - (other.size.width * other.scale.x) / 2,
      y: other.position.y - (other.size.height * other.scale.y) / 2,
      width: other.size.width * other.scale.x,
      height: other.size.height * other.scale.y
    };

    return !(
      bounds1.x + bounds1.width < bounds2.x ||
      bounds2.x + bounds2.width < bounds1.x ||
      bounds1.y + bounds1.height < bounds2.y ||
      bounds2.y + bounds2.height < bounds1.y
    );
  }

  /**
   * 移动到指定位置
   */
  public moveTo(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  /**
   * 相对移动
   */
  public moveBy(dx: number, dy: number): void {
    this.position.x += dx;
    this.position.y += dy;
  }

  /**
   * 设置旋转角度（弧度）
   */
  public setRotation(angle: number): void {
    this.rotation = angle;
  }

  /**
   * 相对旋转
   */
  public rotateBy(angle: number): void {
    this.rotation += angle;
  }

  /**
   * 设置缩放
   */
  public setScale(x: number, y: number = x): void {
    this.scale.x = x;
    this.scale.y = y;
  }

  /**
   * 相对缩放
   */
  public scaleBy(x: number, y: number = x): void {
    this.scale.x *= x;
    this.scale.y *= y;
  }
}