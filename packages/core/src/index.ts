/**
 * jsKid核心模块入口文件
 * 导出所有核心类型和类
 */

// 导出引擎类
export { JskidEngine } from './engine';
import { JskidEngine } from './engine';
import type { JskidConfig } from './types';

// 导出场景类
export { BaseScene, BaseGameObject } from './scene';

// 导出所有类型定义
export type {
  // 基础类型
  JskidConfig,
  Vector2D,
  Size2D,
  Rectangle,

  // 游戏对象
  GameObject,
  GameState,
  GameEvent,

  // 插件和场景
  Plugin,
  Scene,

  // 资源系统
  Asset,
  AssetType,

  // 输入系统
  InputEvent,
  InputEventType,

  // 物理系统
  PhysicsConfig,

  // 引擎接口
  IJskidEngine
} from './types';

/**
 * jsKid引擎版本信息
 */
export const VERSION = '2.0.0';

/**
 * 创建jsKid引擎实例的便捷函数
 */
export function createJskid(config?: JskidConfig): JskidEngine {
  return new JskidEngine(config);
}

/**
 * jsKid默认导出
 */
export default JskidEngine;