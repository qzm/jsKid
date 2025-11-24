/**
 * AudioManager
 * 音频管理器核心类
 */

import EventEmitter from 'eventemitter3';
import type {
  AudioConfig,
  AudioType,
  AudioAsset,
  AudioInstance,
  AudioPlayOptions,
  AudioState,
  FadeOptions,
} from './types';

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Required<AudioConfig> = {
  masterVolume: 1.0,
  musicVolume: 0.8,
  sfxVolume: 1.0,
  muted: false,
  contextOptions: {},
};

/**
 * 音频管理器
 * 基于 Web Audio API 的音频系统
 */
export class AudioManager extends EventEmitter {
  private context: AudioContext | null = null;
  private config: Required<AudioConfig>;
  private assets: Map<string, AudioAsset> = new Map();
  private instances: Map<string, AudioInstance> = new Map();
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private instanceCounter: number = 0;

  constructor(config: AudioConfig = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 初始化音频上下文
   */
  async init(): Promise<void> {
    if (this.context) return;

    try {
      // 创建音频上下文
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)(
        this.config.contextOptions
      );

      // 创建增益节点
      this.masterGain = this.context.createGain();
      this.musicGain = this.context.createGain();
      this.sfxGain = this.context.createGain();

      // 连接增益节点
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);

      // 设置初始音量
      this.masterGain.gain.value = this.config.muted ? 0 : this.config.masterVolume;
      this.musicGain.gain.value = this.config.musicVolume;
      this.sfxGain.gain.value = this.config.sfxVolume;

      // 恢复音频上下文（某些浏览器需要用户交互）
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }

      this.emit('initialized');
      console.log('🔊 AudioManager initialized');
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
      throw error;
    }
  }

  /**
   * 加载音频资源
   */
  async load(id: string, url: string, type: AudioType = AudioType.SFX): Promise<AudioAsset> {
    if (!this.context) {
      await this.init();
    }

    // 检查是否已加载
    if (this.assets.has(id)) {
      const asset = this.assets.get(id)!;
      if (asset.state === AudioState.LOADED) {
        return asset;
      }
    }

    // 创建资源对象
    const asset: AudioAsset = {
      id,
      type,
      url,
      buffer: null,
      state: AudioState.LOADING,
    };

    this.assets.set(id, asset);
    this.emit('loading', id);

    try {
      // 获取音频数据
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();

      // 解码音频数据
      asset.buffer = await this.context!.decodeAudioData(arrayBuffer);
      asset.state = AudioState.LOADED;

      this.emit('loaded', id);
      return asset;
    } catch (error) {
      asset.state = AudioState.ERROR;
      asset.error = error as Error;
      this.emit('error', id, error);
      throw error;
    }
  }

  /**
   * 批量加载音频
   */
  async loadAll(
    assets: Array<{ id: string; url: string; type?: AudioType }>
  ): Promise<AudioAsset[]> {
    return Promise.all(assets.map((asset) => this.load(asset.id, asset.url, asset.type)));
  }

  /**
   * 播放音频
   */
  play(id: string, options: AudioPlayOptions = {}): string | null {
    if (!this.context || !this.masterGain || !this.musicGain || !this.sfxGain) {
      console.warn('AudioManager not initialized');
      return null;
    }

    const asset = this.assets.get(id);
    if (!asset || !asset.buffer) {
      console.warn(`Audio asset "${id}" not loaded`);
      return null;
    }

    // 创建音源节点
    const source = this.context.createBufferSource();
    source.buffer = asset.buffer;
    source.loop = options.loop ?? false;
    source.playbackRate.value = options.playbackRate ?? 1.0;

    // 创建增益节点
    const gainNode = this.context.createGain();
    gainNode.gain.value = options.volume ?? 1.0;

    // 连接节点
    source.connect(gainNode);
    const targetGain = asset.type === AudioType.MUSIC ? this.musicGain : this.sfxGain;
    gainNode.connect(targetGain);

    // 创建实例
    const instanceId = `${id}_${++this.instanceCounter}`;
    const instance: AudioInstance = {
      id: instanceId,
      assetId: id,
      source,
      gainNode,
      state: AudioState.PLAYING,
      startTime: this.context.currentTime,
      pauseTime: 0,
      loop: source.loop,
    };

    this.instances.set(instanceId, instance);

    // 播放结束回调
    source.onended = () => {
      if (instance.state === AudioState.PLAYING) {
        instance.state = AudioState.STOPPED;
        this.instances.delete(instanceId);
        this.emit('ended', instanceId);
        if (options.loop === false && instance.onEnded) {
          instance.onEnded();
        }
      }
    };

    // 淡入效果
    if (options.fadeIn && options.fadeIn > 0) {
      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(
        options.volume ?? 1.0,
        this.context.currentTime + options.fadeIn
      );
    }

    // 开始播放
    source.start(0, options.startTime ?? 0);

    this.emit('play', instanceId);
    return instanceId;
  }

  /**
   * 停止音频实例
   */
  stop(instanceId: string, fadeOut?: number): void {
    const instance = this.instances.get(instanceId);
    if (!instance || !this.context) return;

    if (fadeOut && fadeOut > 0) {
      // 淡出效果
      instance.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + fadeOut);
      setTimeout(() => {
        instance.source.stop();
        instance.state = AudioState.STOPPED;
        this.instances.delete(instanceId);
      }, fadeOut * 1000);
    } else {
      // 立即停止
      instance.source.stop();
      instance.state = AudioState.STOPPED;
      this.instances.delete(instanceId);
    }

    this.emit('stop', instanceId);
  }

  /**
   * 停止所有音频
   */
  stopAll(type?: AudioType, fadeOut?: number): void {
    const instancesToStop: string[] = [];

    this.instances.forEach((instance) => {
      if (!type || this.assets.get(instance.assetId)?.type === type) {
        instancesToStop.push(instance.id);
      }
    });

    instancesToStop.forEach((id) => this.stop(id, fadeOut));
  }

  /**
   * 暂停音频实例
   */
  pause(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance || !this.context || instance.state !== AudioState.PLAYING) return;

    instance.pauseTime = this.context.currentTime - instance.startTime;
    instance.source.stop();
    instance.state = AudioState.PAUSED;
    this.emit('pause', instanceId);
  }

  /**
   * 恢复音频实例
   */
  resume(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance || !this.context || instance.state !== AudioState.PAUSED) return;

    const asset = this.assets.get(instance.assetId);
    if (!asset || !asset.buffer) return;

    // 重新创建音源
    const newSource = this.context.createBufferSource();
    newSource.buffer = asset.buffer;
    newSource.loop = instance.loop;
    newSource.connect(instance.gainNode);

    instance.source = newSource;
    instance.startTime = this.context.currentTime - instance.pauseTime;
    instance.state = AudioState.PLAYING;

    newSource.start(0, instance.pauseTime);
    this.emit('resume', instanceId);
  }

  /**
   * 设置主音量
   */
  setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && !this.config.muted) {
      this.masterGain.gain.value = this.config.masterVolume;
    }
    this.emit('volume:master', this.config.masterVolume);
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume: number): void {
    this.config.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain) {
      this.musicGain.gain.value = this.config.musicVolume;
    }
    this.emit('volume:music', this.config.musicVolume);
  }

  /**
   * 设置音效音量
   */
  setSfxVolume(volume: number): void {
    this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.config.sfxVolume;
    }
    this.emit('volume:sfx', this.config.sfxVolume);
  }

  /**
   * 静音/取消静音
   */
  setMuted(muted: boolean): void {
    this.config.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : this.config.masterVolume;
    }
    this.emit('muted', muted);
  }

  /**
   * 切换静音状态
   */
  toggleMute(): boolean {
    this.setMuted(!this.config.muted);
    return this.config.muted;
  }

  /**
   * 获取音频上下文
   */
  getContext(): AudioContext | null {
    return this.context;
  }

  /**
   * 获取配置
   */
  getConfig(): Readonly<Required<AudioConfig>> {
    return this.config;
  }

  /**
   * 销毁音频管理器
   */
  async destroy(): Promise<void> {
    // 停止所有音频
    this.stopAll();

    // 关闭音频上下文
    if (this.context) {
      await this.context.close();
      this.context = null;
    }

    // 清理资源
    this.assets.clear();
    this.instances.clear();
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;

    this.removeAllListeners();
    this.emit('destroyed');
  }
}
