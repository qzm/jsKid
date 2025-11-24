/**
 * Physics Plugin for jsKid Engine
 * 将 Matter.js 物理引擎集成到 jsKid 游戏引擎
 */

import type { JskidEngine } from '../../core/src/engine';
import { PhysicsEngine } from './physics-engine';
import type { PhysicsConfig } from './types';

/**
 * 物理引擎插件
 */
export class PhysicsPlugin {
  name = 'physics';
  version = '2.0.0';

  private physics: PhysicsEngine;
  private engine: JskidEngine | null = null;

  constructor(config: PhysicsConfig = {}) {
    this.physics = new PhysicsEngine(config);
  }

  /**
   * 插件安装
   */
  install(engine: JskidEngine): void {
    this.engine = engine;

    // 将物理引擎实例挂载到游戏引擎
    (engine as any).physics = this.physics;

    // 监听游戏引擎的更新事件，同步物理引擎
    engine.on('engine:update', (deltaTime: number) => {
      this.physics.update(deltaTime);
    });

    // 监听引擎启动/停止事件
    engine.on('engine:started', () => {
      // 如果需要，可以启动物理引擎的独立循环
      // this.physics.start();
    });

    engine.on('engine:stopped', () => {
      // this.physics.stop();
    });

    console.log('✅ Physics plugin installed');
  }

  /**
   * 插件卸载
   */
  uninstall(engine: JskidEngine): void {
    if (!this.engine) return;

    // 移除挂载的物理引擎
    delete (engine as any).physics;

    // 清理事件监听
    engine.removeAllListeners('engine:update');
    engine.removeAllListeners('engine:started');
    engine.removeAllListeners('engine:stopped');

    // 销毁物理引擎
    this.physics.destroy();

    this.engine = null;
    console.log('🗑️  Physics plugin uninstalled');
  }

  /**
   * 获取物理引擎实例
   */
  getPhysics(): PhysicsEngine {
    return this.physics;
  }
}

/**
 * 类型扩展：为 JskidEngine 添加 physics 属性
 */
declare module '../../core/src/engine' {
  interface JskidEngine {
    physics?: PhysicsEngine;
  }
}

/**
 * 创建物理插件的便捷函数
 */
export function createPhysicsPlugin(config?: PhysicsConfig): PhysicsPlugin {
  return new PhysicsPlugin(config);
}
