/**
 * BaseGame - 所有 Demo 游戏的基类
 *
 * 提供统一的游戏初始化、循环、场景管理接口
 * 简化 Demo 开发，展示 jsKid 引擎的正确使用方式
 */

import { JskidEngine, BaseScene, JskidConfig } from '../../packages/core/src/index';
import { CanvasRenderer } from '../../packages/renderer/src/index';

export interface GameConfig extends Partial<JskidConfig> {
  canvasId: string;
  backgroundColor?: string;
  showFPS?: boolean;
}

/**
 * 游戏基类
 * 所有 Demo 继承此类以使用 jsKid 引擎
 */
export abstract class BaseGame {
  protected engine: JskidEngine;
  protected renderer: CanvasRenderer;
  protected canvas: HTMLCanvasElement;
  protected scene: BaseScene | null = null;

  protected config: Required<GameConfig>;
  protected lastFrameTime: number = 0;
  protected fps: number = 0;
  protected frameCount: number = 0;
  protected fpsUpdateTime: number = 0;

  constructor(config: GameConfig) {
    // 默认配置
    this.config = {
      debug: false,
      canvasWidth: 800,
      canvasHeight: 600,
      fps: 60,
      autoStart: false,
      enablePlugins: true,
      backgroundColor: '#000000',
      showFPS: true,
      ...config,
    };

    // 获取 Canvas
    const canvas = document.getElementById(config.canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${config.canvasId}" not found`);
    }
    this.canvas = canvas;

    // 设置 Canvas 尺寸
    canvas.width = this.config.canvasWidth;
    canvas.height = this.config.canvasHeight;

    // 创建渲染器
    this.renderer = new CanvasRenderer(canvas);

    // 创建引擎
    this.engine = new JskidEngine({
      debug: this.config.debug,
      canvasWidth: this.config.canvasWidth,
      canvasHeight: this.config.canvasHeight,
      fps: this.config.fps,
      autoStart: false, // 手动控制启动
      enablePlugins: this.config.enablePlugins,
    });

    // 设置引擎渲染器
    this.engine['renderer'] = this.renderer;

    // 绑定引擎事件
    this.bindEngineEvents();
  }

  /**
   * 绑定引擎事件
   */
  private bindEngineEvents(): void {
    this.engine.on('engine:update', (deltaTime: number) => {
      this.update(deltaTime);
    });

    this.engine.on('engine:render', () => {
      this.render();
    });

    this.engine.on('engine:started', () => {
      console.log('🎮 Game started');
      this.onStart();
    });

    this.engine.on('engine:paused', () => {
      console.log('⏸️  Game paused');
      this.onPause();
    });

    this.engine.on('engine:resumed', () => {
      console.log('▶️  Game resumed');
      this.onResume();
    });
  }

  /**
   * 初始化游戏
   * 子类必须实现此方法来设置场景和游戏对象
   */
  abstract init(): void;

  /**
   * 更新游戏逻辑
   * @param deltaTime 距离上一帧的时间（秒）
   */
  protected update(deltaTime: number): void {
    // 更新当前场景
    if (this.scene) {
      this.scene.update(deltaTime);
    }

    // 更新 FPS 计数
    this.updateFPS(deltaTime);

    // 子类可以覆盖此方法添加额外逻辑
    this.onUpdate(deltaTime);
  }

  /**
   * 渲染游戏
   */
  protected render(): void {
    const ctx = this.renderer.getContext();

    // 清空画布
    this.renderer.clear(this.config.backgroundColor);

    // 渲染当前场景
    if (this.scene) {
      this.scene.render(ctx);
    }

    // 渲染 FPS
    if (this.config.showFPS) {
      this.renderFPS();
    }

    // 子类可以覆盖此方法添加额外渲染
    this.onRender();
  }

  /**
   * 更新 FPS 计数
   */
  private updateFPS(deltaTime: number): void {
    this.frameCount++;
    this.fpsUpdateTime += deltaTime;

    if (this.fpsUpdateTime >= 1.0) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = 0;
    }
  }

  /**
   * 渲染 FPS 显示
   */
  private renderFPS(): void {
    const ctx = this.renderer.getContext();
    ctx.save();
    ctx.font = '16px monospace';
    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`FPS: ${this.fps}`, 10, 10);
    ctx.restore();
  }

  /**
   * 启动游戏
   */
  start(): void {
    this.init();
    this.engine.start();
  }

  /**
   * 暂停游戏
   */
  pause(): void {
    this.engine.pause();
  }

  /**
   * 恢复游戏
   */
  resume(): void {
    this.engine.resume();
  }

  /**
   * 停止游戏
   */
  stop(): void {
    this.engine.stop();
  }

  /**
   * 设置当前场景
   */
  protected setScene(scene: BaseScene): void {
    this.scene = scene;
    this.engine.addScene(scene);
    this.engine.switchScene(scene.id);
  }

  /**
   * 获取引擎实例
   */
  getEngine(): JskidEngine {
    return this.engine;
  }

  /**
   * 获取渲染器实例
   */
  getRenderer(): CanvasRenderer {
    return this.renderer;
  }

  /**
   * 获取 Canvas 元素
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * 获取画布尺寸
   */
  getSize(): { width: number; height: number } {
    return {
      width: this.config.canvasWidth,
      height: this.config.canvasHeight,
    };
  }

  // 生命周期钩子（子类可选择性覆盖）

  /**
   * 游戏启动时调用
   */
  protected onStart(): void {}

  /**
   * 游戏暂停时调用
   */
  protected onPause(): void {}

  /**
   * 游戏恢复时调用
   */
  protected onResume(): void {}

  /**
   * 每帧更新时调用（在场景更新后）
   */
  protected onUpdate(deltaTime: number): void {}

  /**
   * 每帧渲染时调用（在场景渲染后）
   */
  protected onRender(): void {}

  /**
   * 销毁游戏实例
   */
  destroy(): void {
    this.engine.destroy();
    this.scene = null;
  }
}

/**
 * 辅助函数：快速创建并启动游戏
 */
export function createGame<T extends BaseGame>(
  GameClass: new (config: GameConfig) => T,
  config: GameConfig
): T {
  const game = new GameClass(config);
  game.start();
  return game;
}
