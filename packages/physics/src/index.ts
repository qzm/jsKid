/**
 * @jskid/physics
 * Matter.js 物理引擎集成包
 */

// 核心类
export { PhysicsEngine } from './physics-engine';
export { RigidBodyFactory, RigidBodyHelper } from './rigid-body';
export { PhysicsPlugin, createPhysicsPlugin } from './plugin';

// 类型定义
export type {
  PhysicsConfig,
  BodyType,
  PhysicsMaterial,
  RigidBodyConfig,
  CollisionEvent,
  Force,
  RaycastHit,
  DebugRenderOptions,
} from './types';

export { BodyType } from './types';

// 导出 Matter.js 核心模块供高级用户使用
export { default as Matter } from 'matter-js';
