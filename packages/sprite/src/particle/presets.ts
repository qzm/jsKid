/**
 * Particle Presets
 * 预设粒子效果
 */

import { EmitterConfig } from './emitter';

/**
 * 爆炸效果
 */
export function explosionPreset(x: number, y: number): EmitterConfig {
  return {
    position: { x, y },
    maxParticles: 50,
    emissionRate: 100,
    angle: 0,
    angleSpread: Math.PI * 2, // 360度
    speed: 200,
    speedSpread: 100,
    lifetime: 0.8,
    lifetimeSpread: 0.3,
    autoEmit: true,
    duration: 0.1, // 短暂爆发
    particleConfig: {
      startSize: 8,
      endSize: 0,
      startColor: '#ff6600',
      endColor: '#ff0000',
      startAlpha: 1.0,
      endAlpha: 0.0,
    },
  };
}

/**
 * 火焰效果
 */
export function firePreset(x: number, y: number): EmitterConfig {
  return {
    position: { x, y },
    maxParticles: 100,
    emissionRate: 30,
    angle: -Math.PI / 2, // 向上
    angleSpread: Math.PI / 6,
    speed: 80,
    speedSpread: 40,
    lifetime: 1.0,
    lifetimeSpread: 0.5,
    autoEmit: true,
    duration: 0, // 持续
    particleConfig: {
      startSize: 10,
      endSize: 2,
      startColor: '#ffaa00',
      endColor: '#ff0000',
      startAlpha: 0.9,
      endAlpha: 0.0,
      acceleration: { x: 0, y: -20 }, // 向上漂浮
    },
  };
}

/**
 * 烟雾效果
 */
export function smokePreset(x: number, y: number): EmitterConfig {
  return {
    position: { x, y },
    maxParticles: 80,
    emissionRate: 20,
    angle: -Math.PI / 2,
    angleSpread: Math.PI / 8,
    speed: 50,
    speedSpread: 20,
    lifetime: 2.0,
    lifetimeSpread: 0.8,
    autoEmit: true,
    duration: 0,
    particleConfig: {
      startSize: 8,
      endSize: 20,
      startColor: '#888888',
      endColor: '#333333',
      startAlpha: 0.7,
      endAlpha: 0.0,
      acceleration: { x: 0, y: -10 },
    },
  };
}

/**
 * 星星闪烁效果
 */
export function sparklePreset(x: number, y: number): EmitterConfig {
  return {
    position: { x, y },
    maxParticles: 40,
    emissionRate: 15,
    angle: 0,
    angleSpread: Math.PI * 2,
    speed: 50,
    speedSpread: 30,
    lifetime: 0.8,
    lifetimeSpread: 0.3,
    autoEmit: true,
    duration: 0,
    particleConfig: {
      startSize: 4,
      endSize: 0,
      color: '#ffff00',
      startAlpha: 1.0,
      endAlpha: 0.0,
      angularVelocity: Math.PI * 4,
    },
  };
}

/**
 * 雨滴效果
 */
export function rainPreset(x: number, y: number, width: number): EmitterConfig {
  return {
    position: { x, y },
    maxParticles: 200,
    emissionRate: 50,
    angle: Math.PI / 2, // 向下
    angleSpread: 0.1,
    speed: 300,
    speedSpread: 50,
    lifetime: 2.0,
    lifetimeSpread: 0.5,
    autoEmit: true,
    duration: 0,
    particleConfig: {
      startSize: 2,
      endSize: 1,
      color: '#6699ff',
      startAlpha: 0.7,
      endAlpha: 0.3,
      acceleration: { x: 0, y: 50 }, // 重力
    },
  };
}

/**
 * 尾迹效果
 */
export function trailPreset(x: number, y: number): EmitterConfig {
  return {
    position: { x, y },
    maxParticles: 50,
    emissionRate: 30,
    angle: Math.PI, // 向后
    angleSpread: 0.2,
    speed: 20,
    speedSpread: 10,
    lifetime: 0.5,
    lifetimeSpread: 0.2,
    autoEmit: true,
    duration: 0,
    particleConfig: {
      startSize: 6,
      endSize: 0,
      startColor: '#00ffff',
      endColor: '#0066ff',
      startAlpha: 0.8,
      endAlpha: 0.0,
    },
  };
}

/**
 * 治愈效果
 */
export function healPreset(x: number, y: number): EmitterConfig {
  return {
    position: { x, y },
    maxParticles: 30,
    emissionRate: 20,
    angle: -Math.PI / 2,
    angleSpread: Math.PI / 4,
    speed: 60,
    speedSpread: 30,
    lifetime: 1.5,
    lifetimeSpread: 0.5,
    autoEmit: true,
    duration: 0,
    particleConfig: {
      startSize: 6,
      endSize: 2,
      startColor: '#00ff00',
      endColor: '#00ff00',
      startAlpha: 0.9,
      endAlpha: 0.0,
      acceleration: { x: 0, y: -20 },
    },
  };
}

/**
 * 冲击波效果
 */
export function shockwavePreset(x: number, y: number): EmitterConfig {
  return {
    position: { x, y },
    maxParticles: 60,
    emissionRate: 200,
    angle: 0,
    angleSpread: Math.PI * 2,
    speed: 300,
    speedSpread: 50,
    lifetime: 0.5,
    lifetimeSpread: 0.1,
    autoEmit: true,
    duration: 0.05,
    particleConfig: {
      startSize: 4,
      endSize: 0,
      startColor: '#ffffff',
      endColor: '#888888',
      startAlpha: 1.0,
      endAlpha: 0.0,
    },
  };
}
