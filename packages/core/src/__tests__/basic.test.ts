/**
 * jsKid基础功能测试
 */

import { VERSION, createJskid, GameState } from '../index';

// Mock DOM环境
const mockCanvas = {
  width: 800,
  height: 600,
  getContext: jest.fn(() => ({
    clearRect: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn()
  }))
};

Object.defineProperty(global, 'document', {
  value: {
    querySelector: jest.fn(() => mockCanvas),
    createElement: jest.fn(() => mockCanvas),
    body: {
      appendChild: jest.fn()
    }
  },
  writable: true
});

Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  },
  writable: true
});

describe('jsKid Core Basics', () => {
  test('应该导出正确的版本号', () => {
    expect(VERSION).toBe('2.0.0');
  });

  test('createJskid应该创建引擎实例', () => {
    const engine = createJskid({
      debug: true,
      canvasWidth: 800,
      canvasHeight: 600,
      autoStart: false
    });

    expect(engine).toBeTruthy();
    expect(engine.getState()).toBe(GameState.RUNNING);

    engine.destroy();
  });

  test('引擎应该有正确的配置', () => {
    const engine = createJskid({
      debug: false,
      canvasWidth: 1024,
      canvasHeight: 768
    });

    const config = engine.getConfig();
    expect(config.canvasWidth).toBe(1024);
    expect(config.canvasHeight).toBe(768);
    expect(config.debug).toBe(false);

    engine.destroy();
  });

  test('引擎应该有Canvas和上下文', () => {
    const engine = createJskid({ autoStart: false });

    expect(engine.getCanvas()).toBeTruthy();
    expect(engine.getContext()).toBeTruthy();

    engine.destroy();
  });
});