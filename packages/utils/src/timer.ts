/**
 * 计时器工具类
 */

export type TimerCallback = () => void;

/**
 * 简单计时器
 */
export class Timer {
  private startTime: number = 0;
  private pauseTime: number = 0;
  private running: boolean = false;
  private paused: boolean = false;

  /**
   * 启动计时器
   */
  start(): void {
    if (!this.running) {
      this.startTime = performance.now();
      this.running = true;
      this.paused = false;
    }
  }

  /**
   * 停止计时器
   */
  stop(): void {
    this.running = false;
    this.paused = false;
  }

  /**
   * 暂停计时器
   */
  pause(): void {
    if (this.running && !this.paused) {
      this.pauseTime = performance.now();
      this.paused = true;
    }
  }

  /**
   * 恢复计时器
   */
  resume(): void {
    if (this.running && this.paused) {
      const pauseDuration = performance.now() - this.pauseTime;
      this.startTime += pauseDuration;
      this.paused = false;
    }
  }

  /**
   * 重置计时器
   */
  reset(): void {
    this.startTime = performance.now();
    this.pauseTime = 0;
  }

  /**
   * 获取经过的时间（毫秒）
   */
  getElapsed(): number {
    if (!this.running) return 0;
    if (this.paused) return this.pauseTime - this.startTime;
    return performance.now() - this.startTime;
  }

  /**
   * 获取经过的时间（秒）
   */
  getElapsedSeconds(): number {
    return this.getElapsed() / 1000;
  }

  /**
   * 计时器是否正在运行
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * 计时器是否已暂停
   */
  isPaused(): boolean {
    return this.paused;
  }
}

/**
 * 延迟计时器（类似setTimeout）
 */
export class DelayTimer {
  private timerId: number | null = null;
  private callback: TimerCallback;
  private delay: number;
  private startTime: number = 0;
  private remainingTime: number = 0;
  private paused: boolean = false;

  constructor(callback: TimerCallback, delay: number) {
    this.callback = callback;
    this.delay = delay;
  }

  /**
   * 启动延迟计时器
   */
  start(): void {
    if (this.timerId !== null) return;

    this.startTime = performance.now();
    this.remainingTime = this.delay;
    this.timerId = window.setTimeout(() => {
      this.callback();
      this.timerId = null;
    }, this.delay);
  }

  /**
   * 暂停延迟计时器
   */
  pause(): void {
    if (this.timerId === null || this.paused) return;

    window.clearTimeout(this.timerId);
    this.remainingTime -= performance.now() - this.startTime;
    this.paused = true;
    this.timerId = null;
  }

  /**
   * 恢复延迟计时器
   */
  resume(): void {
    if (!this.paused) return;

    this.startTime = performance.now();
    this.timerId = window.setTimeout(() => {
      this.callback();
      this.timerId = null;
      this.paused = false;
    }, this.remainingTime);
    this.paused = false;
  }

  /**
   * 取消延迟计时器
   */
  cancel(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.paused = false;
  }

  /**
   * 延迟计时器是否激活
   */
  isActive(): boolean {
    return this.timerId !== null;
  }

  /**
   * 延迟计时器是否暂停
   */
  isPaused(): boolean {
    return this.paused;
  }
}

/**
 * 循环计时器（类似setInterval）
 */
export class IntervalTimer {
  private timerId: number | null = null;
  private callback: TimerCallback;
  private interval: number;
  private paused: boolean = false;
  private lastTick: number = 0;

  constructor(callback: TimerCallback, interval: number) {
    this.callback = callback;
    this.interval = interval;
  }

  /**
   * 启动循环计时器
   */
  start(): void {
    if (this.timerId !== null) return;

    this.lastTick = performance.now();
    this.timerId = window.setInterval(() => {
      if (!this.paused) {
        this.lastTick = performance.now();
        this.callback();
      }
    }, this.interval);
  }

  /**
   * 暂停循环计时器
   */
  pause(): void {
    this.paused = true;
  }

  /**
   * 恢复循环计时器
   */
  resume(): void {
    this.paused = false;
    this.lastTick = performance.now();
  }

  /**
   * 停止循环计时器
   */
  stop(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.paused = false;
  }

  /**
   * 循环计时器是否激活
   */
  isActive(): boolean {
    return this.timerId !== null;
  }

  /**
   * 循环计时器是否暂停
   */
  isPaused(): boolean {
    return this.paused;
  }

  /**
   * 获取距离上次触发的时间
   */
  getTimeSinceLastTick(): number {
    return performance.now() - this.lastTick;
  }
}

/**
 * FPS计数器
 */
export class FPSCounter {
  private frames: number[] = [];
  private lastTime: number = 0;
  private maxSamples: number;

  constructor(maxSamples: number = 60) {
    this.maxSamples = maxSamples;
  }

  /**
   * 更新FPS计数器
   */
  update(): void {
    const now = performance.now();
    if (this.lastTime > 0) {
      const delta = now - this.lastTime;
      this.frames.push(delta);
      if (this.frames.length > this.maxSamples) {
        this.frames.shift();
      }
    }
    this.lastTime = now;
  }

  /**
   * 获取当前FPS
   */
  getFPS(): number {
    if (this.frames.length === 0) return 0;

    const avgDelta = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    return Math.round(1000 / avgDelta);
  }

  /**
   * 获取平均帧时间（毫秒）
   */
  getAverageFrameTime(): number {
    if (this.frames.length === 0) return 0;
    return this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
  }

  /**
   * 重置FPS计数器
   */
  reset(): void {
    this.frames = [];
    this.lastTime = 0;
  }
}
