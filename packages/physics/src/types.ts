/**
 * Physics Types
 * 物理引擎类型定义
 */

import type Matter from 'matter-js';

/**
 * 物理引擎配置
 */
export interface PhysicsConfig {
  /** 重力向量 (x, y) */
  gravity?: { x: number; y: number };
  /** 是否启用睡眠优化 */
  enableSleeping?: boolean;
  /** 时间缩放 (1.0 = 正常速度) */
  timeScale?: number;
  /** 位置迭代次数（影响精确度） */
  positionIterations?: number;
  /** 速度迭代次数（影响精确度） */
  velocityIterations?: number;
  /** 约束迭代次数 */
  constraintIterations?: number;
  /** 像素比例（1米 = ? 像素） */
  pixelRatio?: number;
  /** 是否启用调试绘制 */
  debug?: boolean;
}

/**
 * 刚体类型
 */
export enum BodyType {
  /** 静态刚体（不受力影响，如地面、墙壁） */
  STATIC = 'static',
  /** 动态刚体（受力影响，如玩家、球） */
  DYNAMIC = 'dynamic',
  /** 运动学刚体（不受力但可移动） */
  KINEMATIC = 'kinematic',
}

/**
 * 物理材质属性
 */
export interface PhysicsMaterial {
  /** 密度 */
  density?: number;
  /** 摩擦力 (0-1) */
  friction?: number;
  /** 弹性 (0-1, 0=无弹性, 1=完全弹性) */
  restitution?: number;
  /** 空气阻力 */
  frictionAir?: number;
}

/**
 * 刚体配置
 */
export interface RigidBodyConfig extends PhysicsMaterial {
  /** 刚体类型 */
  type?: BodyType;
  /** 是否为传感器（只检测碰撞不产生响应） */
  isSensor?: boolean;
  /** 是否固定旋转 */
  fixedRotation?: boolean;
  /** 碰撞过滤分组 */
  collisionFilter?: {
    /** 碰撞分类 */
    category?: number;
    /** 可碰撞的分类 */
    mask?: number;
    /** 碰撞组 */
    group?: number;
  };
  /** 初始速度 */
  velocity?: { x: number; y: number };
  /** 初始角速度 */
  angularVelocity?: number;
  /** 用户数据 */
  userData?: any;
}

/**
 * 碰撞事件数据
 */
export interface CollisionEvent {
  /** 碰撞对A */
  bodyA: Matter.Body;
  /** 碰撞对B */
  bodyB: Matter.Body;
  /** 碰撞点 */
  contacts: Array<{
    vertex: { x: number; y: number };
    normal: { x: number; y: number };
  }>;
  /** 碰撞分离速度 */
  separation: number;
}

/**
 * 力类型
 */
export interface Force {
  x: number;
  y: number;
}

/**
 * 射线检测结果
 */
export interface RaycastHit {
  /** 命中的刚体 */
  body: Matter.Body;
  /** 命中点 */
  point: { x: number; y: number };
  /** 距离 */
  distance: number;
  /** 法线 */
  normal: { x: number; y: number };
}

/**
 * 物理调试渲染选项
 */
export interface DebugRenderOptions {
  /** 是否显示刚体 */
  showBodies?: boolean;
  /** 是否显示速度 */
  showVelocity?: boolean;
  /** 是否显示碰撞点 */
  showCollisions?: boolean;
  /** 是否显示约束 */
  showConstraints?: boolean;
  /** 是否显示轴 */
  showAxes?: boolean;
  /** 是否显示边界 */
  showBounds?: boolean;
  /** 是否填充刚体 */
  fillBodies?: boolean;
  /** 线条宽度 */
  lineWidth?: number;
}
