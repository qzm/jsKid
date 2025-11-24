/**
 * RigidBody
 * 刚体包装类和工厂方法
 */

import Matter from 'matter-js';
import type { BodyType, RigidBodyConfig, Force } from './types';

/**
 * 刚体工厂类
 * 提供创建常见形状刚体的便捷方法
 */
export class RigidBodyFactory {
  /**
   * 创建矩形刚体
   */
  static createRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    config: RigidBodyConfig = {}
  ): Matter.Body {
    const body = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: config.type === 'static',
      isSensor: config.isSensor ?? false,
      density: config.density ?? 0.001,
      friction: config.friction ?? 0.1,
      frictionAir: config.frictionAir ?? 0.01,
      restitution: config.restitution ?? 0,
      inertia: config.fixedRotation ? Infinity : undefined,
      collisionFilter: config.collisionFilter,
    });

    if (config.velocity) {
      Matter.Body.setVelocity(body, config.velocity);
    }

    if (config.angularVelocity !== undefined) {
      Matter.Body.setAngularVelocity(body, config.angularVelocity);
    }

    if (config.userData) {
      (body as any).userData = config.userData;
    }

    return body;
  }

  /**
   * 创建圆形刚体
   */
  static createCircle(
    x: number,
    y: number,
    radius: number,
    config: RigidBodyConfig = {}
  ): Matter.Body {
    const body = Matter.Bodies.circle(x, y, radius, {
      isStatic: config.type === 'static',
      isSensor: config.isSensor ?? false,
      density: config.density ?? 0.001,
      friction: config.friction ?? 0.1,
      frictionAir: config.frictionAir ?? 0.01,
      restitution: config.restitution ?? 0,
      inertia: config.fixedRotation ? Infinity : undefined,
      collisionFilter: config.collisionFilter,
    });

    if (config.velocity) {
      Matter.Body.setVelocity(body, config.velocity);
    }

    if (config.angularVelocity !== undefined) {
      Matter.Body.setAngularVelocity(body, config.angularVelocity);
    }

    if (config.userData) {
      (body as any).userData = config.userData;
    }

    return body;
  }

  /**
   * 创建多边形刚体
   */
  static createPolygon(
    x: number,
    y: number,
    sides: number,
    radius: number,
    config: RigidBodyConfig = {}
  ): Matter.Body {
    const body = Matter.Bodies.polygon(x, y, sides, radius, {
      isStatic: config.type === 'static',
      isSensor: config.isSensor ?? false,
      density: config.density ?? 0.001,
      friction: config.friction ?? 0.1,
      frictionAir: config.frictionAir ?? 0.01,
      restitution: config.restitution ?? 0,
      inertia: config.fixedRotation ? Infinity : undefined,
      collisionFilter: config.collisionFilter,
    });

    if (config.velocity) {
      Matter.Body.setVelocity(body, config.velocity);
    }

    if (config.angularVelocity !== undefined) {
      Matter.Body.setAngularVelocity(body, config.angularVelocity);
    }

    if (config.userData) {
      (body as any).userData = config.userData;
    }

    return body;
  }

  /**
   * 从顶点创建刚体
   */
  static createFromVertices(
    x: number,
    y: number,
    vertices: Array<{ x: number; y: number }>,
    config: RigidBodyConfig = {}
  ): Matter.Body {
    const body = Matter.Bodies.fromVertices(x, y, [vertices], {
      isStatic: config.type === 'static',
      isSensor: config.isSensor ?? false,
      density: config.density ?? 0.001,
      friction: config.friction ?? 0.1,
      frictionAir: config.frictionAir ?? 0.01,
      restitution: config.restitution ?? 0,
      inertia: config.fixedRotation ? Infinity : undefined,
      collisionFilter: config.collisionFilter,
    });

    if (config.velocity) {
      Matter.Body.setVelocity(body, config.velocity);
    }

    if (config.angularVelocity !== undefined) {
      Matter.Body.setAngularVelocity(body, config.angularVelocity);
    }

    if (config.userData) {
      (body as any).userData = config.userData;
    }

    return body;
  }

  /**
   * 创建梯形刚体
   */
  static createTrapezoid(
    x: number,
    y: number,
    width: number,
    height: number,
    slope: number,
    config: RigidBodyConfig = {}
  ): Matter.Body {
    const body = Matter.Bodies.trapezoid(x, y, width, height, slope, {
      isStatic: config.type === 'static',
      isSensor: config.isSensor ?? false,
      density: config.density ?? 0.001,
      friction: config.friction ?? 0.1,
      frictionAir: config.frictionAir ?? 0.01,
      restitution: config.restitution ?? 0,
      inertia: config.fixedRotation ? Infinity : undefined,
      collisionFilter: config.collisionFilter,
    });

    if (config.velocity) {
      Matter.Body.setVelocity(body, config.velocity);
    }

    if (config.angularVelocity !== undefined) {
      Matter.Body.setAngularVelocity(body, config.angularVelocity);
    }

    if (config.userData) {
      (body as any).userData = config.userData;
    }

    return body;
  }
}

/**
 * 刚体辅助类
 * 提供常用的刚体操作方法
 */
export class RigidBodyHelper {
  /**
   * 应用力到刚体
   */
  static applyForce(body: Matter.Body, force: Force, position?: { x: number; y: number }): void {
    const point = position || body.position;
    Matter.Body.applyForce(body, point, force);
  }

  /**
   * 应用冲量到刚体
   */
  static applyImpulse(body: Matter.Body, impulse: Force, position?: { x: number; y: number }): void {
    const point = position || body.position;
    const force = {
      x: impulse.x / body.mass,
      y: impulse.y / body.mass,
    };
    Matter.Body.applyForce(body, point, force);
  }

  /**
   * 设置刚体位置
   */
  static setPosition(body: Matter.Body, x: number, y: number): void {
    Matter.Body.setPosition(body, { x, y });
  }

  /**
   * 设置刚体速度
   */
  static setVelocity(body: Matter.Body, x: number, y: number): void {
    Matter.Body.setVelocity(body, { x, y });
  }

  /**
   * 设置刚体角度
   */
  static setAngle(body: Matter.Body, angle: number): void {
    Matter.Body.setAngle(body, angle);
  }

  /**
   * 设置刚体角速度
   */
  static setAngularVelocity(body: Matter.Body, velocity: number): void {
    Matter.Body.setAngularVelocity(body, velocity);
  }

  /**
   * 设置刚体为静态/动态
   */
  static setStatic(body: Matter.Body, isStatic: boolean): void {
    Matter.Body.setStatic(body, isStatic);
  }

  /**
   * 设置刚体密度
   */
  static setDensity(body: Matter.Body, density: number): void {
    Matter.Body.setDensity(body, density);
  }

  /**
   * 设置刚体质量
   */
  static setMass(body: Matter.Body, mass: number): void {
    Matter.Body.setMass(body, mass);
  }

  /**
   * 旋转刚体
   */
  static rotate(body: Matter.Body, angle: number, point?: { x: number; y: number }): void {
    Matter.Body.rotate(body, angle, point);
  }

  /**
   * 缩放刚体
   */
  static scale(body: Matter.Body, scaleX: number, scaleY: number, point?: { x: number; y: number }): void {
    Matter.Body.scale(body, scaleX, scaleY, point);
  }

  /**
   * 平移刚体
   */
  static translate(body: Matter.Body, x: number, y: number): void {
    Matter.Body.translate(body, { x, y });
  }

  /**
   * 获取刚体速度大小
   */
  static getSpeed(body: Matter.Body): number {
    return Matter.Body.getSpeed(body);
  }

  /**
   * 获取刚体速度向量
   */
  static getVelocity(body: Matter.Body): { x: number; y: number } {
    return body.velocity;
  }

  /**
   * 获取刚体角速度
   */
  static getAngularSpeed(body: Matter.Body): number {
    return Matter.Body.getAngularSpeed(body);
  }

  /**
   * 获取刚体角速度向量
   */
  static getAngularVelocity(body: Matter.Body): number {
    return body.angularVelocity;
  }

  /**
   * 获取刚体位置
   */
  static getPosition(body: Matter.Body): { x: number; y: number } {
    return body.position;
  }

  /**
   * 获取刚体角度
   */
  static getAngle(body: Matter.Body): number {
    return body.angle;
  }

  /**
   * 获取刚体边界
   */
  static getBounds(body: Matter.Body): Matter.Bounds {
    return body.bounds;
  }

  /**
   * 检查点是否在刚体内
   */
  static containsPoint(body: Matter.Body, x: number, y: number): boolean {
    return Matter.Bounds.contains(body.bounds, { x, y }) &&
      Matter.Vertices.contains(body.vertices, { x, y });
  }

  /**
   * 获取刚体的用户数据
   */
  static getUserData(body: Matter.Body): any {
    return (body as any).userData;
  }

  /**
   * 设置刚体的用户数据
   */
  static setUserData(body: Matter.Body, data: any): void {
    (body as any).userData = data;
  }
}
