/**
 * jsKid游戏引擎核心类
 * 提供游戏引擎的基础功能和生命周期管理
 */

import { EventEmitter } from 'eventemitter3';
import type {
  JskidConfig,
  Plugin,
  Scene,
  InputEvent,
  Asset
} from './types';
import { GameState, AssetType } from './types';

/**
 * jsKid游戏引擎核心类
 */
export class JskidEngine extends EventEmitter {
  /** 引擎配置 */
  private config: Required<JskidConfig>;
  /** 当前游戏状态 */
  private state: GameState = GameState.INITIALIZING;
  /** Canvas元素 */
  private canvas: HTMLCanvasElement | null = null;
  /** Canvas 2D上下文 */
  private context: CanvasRenderingContext2D | null = null;
  /** 动画帧ID */
  private animationFrameId: number | null = null;
  /** 上一帧时间戳 */
  private lastTime: number = 0;
  /** 插件列表 */
  private plugins: Map<string, Plugin> = new Map();
  /** 当前场景 */
  private currentScene: Scene | null = null;
  /** 场景列表 */
  private scenes: Map<string, Scene> = new Map();
  /** 资源管理器 */
  private assets: Map<string, Asset> = new Map();
  /** 输入管理器 */
  private inputManager: InputManager;
  /** 游戏循环是否暂停 */
  private isPaused: boolean = false;

  constructor(config: JskidConfig = {}) {
    super();

    // 设置默认配置
    this.config = {
      debug: false,
      canvasWidth: 800,
      canvasHeight: 600,
      fps: 60,
      autoStart: true,
      enablePlugins: true,
      ...config
    };

    // 初始化输入管理器
    this.inputManager = new InputManager();

    this.log('jsKid引擎初始化开始');
    this.init();
  }

  /**
   * 初始化引擎
   */
  private init(): void {
    try {
      // 查找Canvas元素
      this.canvas = document.querySelector('canvas') || this.createCanvas();
      this.context = this.canvas.getContext('2d');

      if (!this.context) {
        throw new Error('无法获取Canvas 2D上下文');
      }

      // 设置Canvas尺寸
      this.setupCanvas();

      // 初始化输入系统
      this.initInput();

      // 设置requestAnimationFrame兼容性
      this.setupAnimationFrame();

      this.state = GameState.RUNNING;
      this.log('jsKid引擎初始化完成');

      // 发送初始化完成事件
      this.emit('engine:initialized', { engine: this });

      // 如果配置为自动启动，则开始游戏循环
      if (this.config.autoStart) {
        this.start();
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * 创建Canvas元素
   */
  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.id = 'jskid-canvas';
    document.body.appendChild(canvas);
    return canvas;
  }

  /**
   * 设置Canvas属性
   */
  private setupCanvas(): void {
    if (!this.canvas) return;

    this.canvas.width = this.config.canvasWidth;
    this.canvas.height = this.config.canvasHeight;
    this.canvas.style.width = `${this.config.canvasWidth}px`;
    this.canvas.style.height = `${this.config.canvasHeight}px`;
    this.canvas.style.imageRendering = 'pixelated';
  }

  /**
   * 初始化输入系统
   */
  private initInput(): void {
    this.inputManager.on('input', (event: InputEvent) => {
      this.emit('input', event);

      // 将输入事件传递给当前场景
      if (this.currentScene) {
        this.emit('scene:input', { scene: this.currentScene, event });
      }
    });
  }

  /**
   * 设置requestAnimationFrame兼容性
   */
  private setupAnimationFrame(): void {
    // 现代浏览器支持requestAnimationFrame，这里可以添加兼容性处理
    const vendorPrefixes = ['webkit', 'moz', 'o', 'ms'];

    if (!window.requestAnimationFrame) {
      for (const prefix of vendorPrefixes) {
        const prefixedRAF = (window as any)[`${prefix}RequestAnimationFrame`];
        if (prefixedRAF) {
          window.requestAnimationFrame = prefixedRAF;
          break;
        }
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback: FrameRequestCallback) =>
          setTimeout(callback, 1000 / this.config.fps);
      }
    }

    if (!window.cancelAnimationFrame) {
      for (const prefix of vendorPrefixes) {
        const prefixedCAF = (window as any)[`${prefix}CancelAnimationFrame`];
        if (prefixedCAF) {
          window.cancelAnimationFrame = prefixedCAF;
          break;
        }
      }

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = clearTimeout;
      }
    }
  }

  /**
   * 启动游戏循环
   */
  public start(): void {
    if (this.state !== GameState.RUNNING) {
      this.state = GameState.RUNNING;
      this.isPaused = false;
      this.lastTime = performance.now();
      this.gameLoop();
      this.log('游戏循环已启动');
      this.emit('engine:started', { engine: this });
    }
  }

  /**
   * 暂停游戏
   */
  public pause(): void {
    this.isPaused = true;
    this.log('游戏已暂停');
    this.emit('engine:paused', { engine: this });
  }

  /**
   * 恢复游戏
   */
  public resume(): void {
    this.isPaused = false;
    this.lastTime = performance.now();
    this.log('游戏已恢复');
    this.emit('engine:resumed', { engine: this });
  }

  /**
   * 切换暂停/恢复状态
   */
  public togglePause(): void {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * 停止游戏循环
   */
  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state = GameState.STOPPED;
    this.log('游戏循环已停止');
    this.emit('engine:stopped', { engine: this });
  }

  /**
   * 游戏主循环
   */
  private gameLoop(): void {
    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // 限制最大帧时间
    this.lastTime = currentTime;

    if (!this.isPaused && this.state === GameState.RUNNING) {
      try {
        // 更新阶段
        this.update(deltaTime);

        // 渲染阶段
        this.render();

        // 更新插件
        this.updatePlugins(deltaTime);
      } catch (error) {
        this.handleError(error as Error);
      }
    }

    // 继续下一帧
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * 更新游戏逻辑
   */
  private update(deltaTime: number): void {
    // 更新当前场景
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime);
    }

    // 发送更新事件
    this.emit('engine:update', { deltaTime, engine: this });
  }

  /**
   * 渲染游戏画面
   */
  private render(): void {
    if (!this.context || !this.canvas) return;

    // 清空画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 渲染当前场景
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render(this.context);
    }

    // 发送渲染事件
    this.emit('engine:render', { context: this.context, engine: this });
  }

  /**
   * 更新插件
   */
  private updatePlugins(deltaTime: number): void {
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.update) {
        try {
          plugin.update(deltaTime);
        } catch (error) {
          this.log(`插件 ${plugin.name} 更新出错:`, error);
        }
      }
    }
  }

  /**
   * 加载资源
   */
  public async loadAsset(id: string, src: string, type: AssetType): Promise<Asset> {
    const asset: Asset = {
      id,
      type,
      src,
      loaded: false
    };

    this.assets.set(id, asset);

    try {
      switch (type) {
        case AssetType.IMAGE:
          asset.data = await this.loadImage(src);
          break;
        case AssetType.AUDIO:
          asset.data = await this.loadAudio(src);
          break;
        case AssetType.JSON:
          asset.data = await this.loadJSON(src);
          break;
        case AssetType.TEXT:
          asset.data = await this.loadText(src);
          break;
        default:
          throw new Error(`不支持的资源类型: ${type}`);
      }

      asset.loaded = true;
      this.emit('asset:loaded', { asset });
      return asset;
    } catch (error) {
      asset.error = error as Error;
      this.emit('asset:error', { asset, error });
      throw error;
    }
  }

  /**
   * 加载图片
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`加载图片失败: ${src}`));
      img.src = src;
    });
  }

  /**
   * 加载音频
   */
  private loadAudio(src: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadstart = () => resolve(audio);
      audio.onerror = () => reject(new Error(`加载音频失败: ${src}`));
      audio.src = src;
    });
  }

  /**
   * 加载JSON
   */
  private async loadJSON(src: string): Promise<any> {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`加载JSON失败: ${src}`);
    }
    return response.json();
  }

  /**
   * 加载文本
   */
  private async loadText(src: string): Promise<string> {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`加载文本失败: ${src}`);
    }
    return response.text();
  }

  /**
   * 安装插件
   */
  public installPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      this.log(`插件 ${plugin.name} 已存在，将被替换`);
    }

    try {
      plugin.install(this);
      this.plugins.set(plugin.name, plugin);
      this.log(`插件 ${plugin.name} 安装成功`);
      this.emit('plugin:installed', { plugin });
    } catch (error) {
      this.log(`插件 ${plugin.name} 安装失败:`, error);
      this.emit('plugin:error', { plugin, error });
    }
  }

  /**
   * 卸载插件
   */
  public uninstallPlugin(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      return false;
    }

    try {
      if (plugin.uninstall) {
        plugin.uninstall(this);
      }
      this.plugins.delete(name);
      this.log(`插件 ${name} 卸载成功`);
      this.emit('plugin:uninstalled', { plugin });
      return true;
    } catch (error) {
      this.log(`插件 ${name} 卸载失败:`, error);
      this.emit('plugin:error', { plugin, error });
      return false;
    }
  }

  /**
   * 添加场景
   */
  public addScene(scene: Scene): void {
    this.scenes.set(scene.id, scene);
    this.log(`场景 ${scene.name} (${scene.id}) 已添加`);
    this.emit('scene:added', { scene });
  }

  /**
   * 移除场景
   */
  public removeScene(id: string): boolean {
    const scene = this.scenes.get(id);
    if (!scene) {
      return false;
    }

    if (scene.unload) {
      scene.unload();
    }

    this.scenes.delete(id);
    this.log(`场景 ${scene.name} (${id}) 已移除`);
    this.emit('scene:removed', { scene });
    return true;
  }

  /**
   * 切换到指定场景
   */
  public async switchScene(id: string): Promise<boolean> {
    const scene = this.scenes.get(id);
    if (!scene) {
      this.log(`场景不存在: ${id}`);
      return false;
    }

    // 卸载当前场景
    if (this.currentScene && this.currentScene.unload) {
      await this.currentScene.unload();
    }

    // 加载新场景
    if (scene.load) {
      await scene.load();
    }

    this.currentScene = scene;
    this.log(`切换到场景: ${scene.name} (${id})`);
    this.emit('scene:switched', { scene });
    return true;
  }

  /**
   * 获取当前场景
   */
  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * 获取Canvas元素
   */
  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * 获取Canvas上下文
   */
  public getContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  /**
   * 获取游戏状态
   */
  public getState(): GameState {
    return this.state;
  }

  /**
   * 获取配置
   */
  public getConfig(): Required<JskidConfig> {
    return this.config;
  }

  /**
   * 获取输入管理器
   */
  public getInputManager(): InputManager {
    return this.inputManager;
  }

  /**
   * 获取资源
   */
  public getAsset(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  /**
   * 错误处理
   */
  private handleError(error: Error): void {
    this.state = GameState.ERROR;
    this.log('引擎发生错误:', error);
    this.emit('engine:error', { error, engine: this });
  }

  /**
   * 日志输出
   */
  private log(...args: any[]): void {
    if (this.config.debug && console.log) {
      console.log('[jsKid]', ...args);
    }
  }

  /**
   * 销毁引擎
   */
  public destroy(): void {
    this.stop();

    // 卸载所有插件
    for (const [name] of this.plugins) {
      this.uninstallPlugin(name);
    }

    // 移除所有场景
    for (const [id] of this.scenes) {
      this.removeScene(id);
    }

    this.removeAllListeners();
    this.assets.clear();

    this.log('jsKid引擎已销毁');
  }
}

/**
 * 输入管理器
 */
class InputManager extends EventEmitter {
  private keyStates: Map<string, boolean> = new Map();
  private mousePosition = { x: 0, y: 0 };
  private mouseButtons: Set<number> = new Set();

  constructor() {
    super();
    this.initEventListeners();
  }

  private initEventListeners(): void {
    // 键盘事件
    window.addEventListener('keydown', (event) => {
      this.keyStates.set(event.code, true);
      this.emitInputEvent('keydown', event);
    });

    window.addEventListener('keyup', (event) => {
      this.keyStates.set(event.code, false);
      this.emitInputEvent('keyup', event);
    });

    // 鼠标事件
    window.addEventListener('mousedown', (event) => {
      this.mouseButtons.add(event.button);
      this.mousePosition = { x: event.clientX, y: event.clientY };
      this.emitInputEvent('mousedown', event);
    });

    window.addEventListener('mouseup', (event) => {
      this.mouseButtons.delete(event.button);
      this.mousePosition = { x: event.clientX, y: event.clientY };
      this.emitInputEvent('mouseup', event);
    });

    window.addEventListener('mousemove', (event) => {
      this.mousePosition = { x: event.clientX, y: event.clientY };
      this.emitInputEvent('mousemove', event);
    });
  }

  private emitInputEvent(type: string, event: KeyboardEvent | MouseEvent): void {
    const inputEvent: InputEvent = {
      type: type as any,
      key: 'key' in event ? event.code : undefined,
      button: 'button' in event ? event.button : undefined,
      position: this.mousePosition,
      modifiers: {
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey
      },
      timestamp: performance.now()
    };

    this.emit('input', inputEvent);
  }

  public isKeyPressed(keyCode: string): boolean {
    return this.keyStates.get(keyCode) || false;
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.has(button);
  }

  public getMousePosition() {
    return { ...this.mousePosition };
  }
}