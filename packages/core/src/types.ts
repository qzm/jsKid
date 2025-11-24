/**
 * jsKid核心类型定义
 * 提供游戏引擎的基础类型接口
 */

/**
 * 游戏引擎配置选项
 */
export interface JskidConfig {
  /** 是否启用调试模式 */
  debug?: boolean;
  /** Canvas宽度 */
  canvasWidth?: number;
  /** Canvas高度 */
  canvasHeight?: number;
  /** 游戏帧率 (FPS) */
  fps?: number;
  /** 是否自动启动游戏循环 */
  autoStart?: boolean;
  /** 是否启用插件系统 */
  enablePlugins?: boolean;
}

/**
 * 2D向量坐标
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * 2D尺寸
 */
export interface Size2D {
  width: number;
  height: number;
}

/**
 * 矩形边界框
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 游戏对象基础接口
 */
export interface GameObject {
  /** 唯一标识符 */
  id: string;
  /** 对象名称 */
  name: string;
  /** 是否启用 */
  enabled: boolean;
  /** 是否可见 */
  visible: boolean;
  /** 位置坐标 */
  position: Vector2D;
  /** 尺寸大小 */
  size: Size2D;
  /** 旋转角度 (弧度) */
  rotation: number;
  /** 缩放比例 */
  scale: Vector2D;
  /** 父对象 */
  parent?: GameObject;
  /** 子对象列表 */
  children: GameObject[];
  /** 初始化方法 */
  init?(): void;
  /** 更新方法 */
  update?(deltaTime: number): void;
  /** 渲染方法 */
  render?(context: CanvasRenderingContext2D): void;
  /** 销毁方法 */
  destroy?(): void;
  /** 获取世界坐标 */
  getWorldPosition?(): Vector2D;
  /** 获取边界框 */
  getBounds?(): Rectangle;
}

/**
 * 游戏状态枚举
 */
export enum GameState {
  /** 初始化中 */
  INITIALIZING = 'initializing',
  /** 运行中 */
  RUNNING = 'running',
  /** 暂停 */
  PAUSED = 'paused',
  /** 停止 */
  STOPPED = 'stopped',
  /** 错误状态 */
  ERROR = 'error'
}

/**
 * 事件类型定义
 */
export interface GameEvent {
  type: string;
  data?: any;
  timestamp: number;
}

/**
 * 前向声明引擎类型
 */
export interface IJskidEngine {
  emit(event: string | symbol, ...args: any[]): boolean;
  on(event: string | symbol, fn: (...args: any[]) => void, context?: any): this;
  removeListener(event: string | symbol, fn?: (...args: any[]) => void, context?: any, once?: boolean): this;
}

/**
 * 插件接口
 */
export interface Plugin {
  /** 插件名称 */
  name: string;
  /** 插件版本 */
  version: string;
  /** 插件描述 */
  description?: string;
  /** 是否启用 */
  enabled: boolean;
  /** 插件初始化 */
  install(engine: IJskidEngine): void;
  /** 插件卸载 */
  uninstall?(engine: IJskidEngine): void;
  /** 更新循环 */
  update?(deltaTime: number): void;
}

/**
 * 资源类型
 */
export enum AssetType {
  IMAGE = 'image',
  AUDIO = 'audio',
  JSON = 'json',
  TEXT = 'text',
  SPRITE_SHEET = 'sprite_sheet',
  TILEMAP = 'tilemap'
}

/**
 * 资源定义
 */
export interface Asset {
  /** 资源ID */
  id: string;
  /** 资源类型 */
  type: AssetType;
  /** 资源URL或路径 */
  src: string;
  /** 资源是否已加载 */
  loaded: boolean;
  /** 资源加载错误 */
  error?: Error;
  /** 资源数据 */
  data?: any;
  /** 额外元数据 */
  metadata?: Record<string, any>;
}

/**
 * 场景接口
 */
export interface Scene {
  /** 场景ID */
  id: string;
  /** 场景名称 */
  name: string;
  /** 场景中的游戏对象 */
  objects: GameObject[];
  /** 场景初始化 */
  load?(): Promise<void> | void;
  /** 场景卸载 */
  unload?(): Promise<void> | void;
  /** 场景更新 */
  update?(deltaTime: number): void;
  /** 场景渲染 */
  render?(context: CanvasRenderingContext2D): void;
  /** 添加游戏对象 */
  addObject(object: GameObject): void;
  /** 移除游戏对象 */
  removeObject(id: string): void;
  /** 根据ID查找游戏对象 */
  findObject(id: string): GameObject | undefined;
  /** 根据名称查找游戏对象 */
  findObjectByName(name: string): GameObject | undefined;
}

/**
 * 输入事件类型
 */
export enum InputEventType {
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup',
  MOUSE_DOWN = 'mousedown',
  MOUSE_UP = 'mouseup',
  MOUSE_MOVE = 'mousemove',
  TOUCH_START = 'touchstart',
  TOUCH_END = 'touchend',
  TOUCH_MOVE = 'touchmove'
}

/**
 * 输入事件数据
 */
export interface InputEvent {
  type: InputEventType;
  key?: string;
  button?: number;
  position?: Vector2D;
  touches?: Array<{
    id: number;
    position: Vector2D;
  }>;
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
  timestamp: number;
}

/**
 * 物理引擎配置
 */
export interface PhysicsConfig {
  /** 是否启用物理引擎 */
  enabled: boolean;
  /** 重力加速度 */
  gravity: Vector2D;
  /** 像素与米的转换比例 */
  pixelsPerMeter: number;
  /** 最大帧时间 */
  maxFrameTime: number;
  /** 速度阻尼 */
  velocityDamping: number;
  /** 角速度阻尼 */
  angularVelocityDamping: number;
}