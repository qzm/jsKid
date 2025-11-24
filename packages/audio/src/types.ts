/**
 * Audio Types
 * 音频系统类型定义
 */

/**
 * 音频管理器配置
 */
export interface AudioConfig {
  /** 主音量 (0-1) */
  masterVolume?: number;
  /** 音乐音量 (0-1) */
  musicVolume?: number;
  /** 音效音量 (0-1) */
  sfxVolume?: number;
  /** 是否静音 */
  muted?: boolean;
  /** 音频上下文选项 */
  contextOptions?: AudioContextOptions;
}

/**
 * 音频资源类型
 */
export enum AudioType {
  /** 背景音乐 */
  MUSIC = 'music',
  /** 音效 */
  SFX = 'sfx',
}

/**
 * 音频播放选项
 */
export interface AudioPlayOptions {
  /** 音量 (0-1) */
  volume?: number;
  /** 是否循环 */
  loop?: boolean;
  /** 开始时间（秒） */
  startTime?: number;
  /** 淡入时间（秒） */
  fadeIn?: number;
  /** 播放速率 */
  playbackRate?: number;
  /** 是否立体声定位 */
  spatial?: boolean;
  /** 3D 位置 */
  position?: { x: number; y: number; z?: number };
}

/**
 * 音频状态
 */
export enum AudioState {
  /** 未加载 */
  UNLOADED = 'unloaded',
  /** 加载中 */
  LOADING = 'loading',
  /** 已加载 */
  LOADED = 'loaded',
  /** 播放中 */
  PLAYING = 'playing',
  /** 已暂停 */
  PAUSED = 'paused',
  /** 已停止 */
  STOPPED = 'stopped',
  /** 加载失败 */
  ERROR = 'error',
}

/**
 * 音频资源
 */
export interface AudioAsset {
  /** 唯一标识 */
  id: string;
  /** 音频类型 */
  type: AudioType;
  /** URL 或路径 */
  url: string;
  /** 音频缓冲区 */
  buffer: AudioBuffer | null;
  /** 当前状态 */
  state: AudioState;
  /** 错误信息 */
  error?: Error;
}

/**
 * 音频实例
 */
export interface AudioInstance {
  /** 实例 ID */
  id: string;
  /** 资源 ID */
  assetId: string;
  /** 音源节点 */
  source: AudioBufferSourceNode;
  /** 增益节点 */
  gainNode: GainNode;
  /** 当前状态 */
  state: AudioState;
  /** 开始时间 */
  startTime: number;
  /** 暂停时的时间 */
  pauseTime: number;
  /** 是否循环 */
  loop: boolean;
  /** 播放完成回调 */
  onEnded?: () => void;
}

/**
 * 音频淡入淡出选项
 */
export interface FadeOptions {
  /** 持续时间（秒） */
  duration: number;
  /** 起始音量 */
  from?: number;
  /** 目标音量 */
  to?: number;
  /** 缓动函数类型 */
  easing?: 'linear' | 'exponential';
}
