/**
 * jsKid核心引擎使用示例
 */

import { createJskid, BaseScene, BaseGameObject } from './index';

// 创建一个简单的游戏场景
class GameScene extends BaseScene {
  constructor() {
    super('game-scene', '游戏场景');

    // 添加一些游戏对象
    const player = new Player('player');
    const enemy = new Enemy('enemy-1');

    this.addObject(player);
    this.addObject(enemy);
  }
}

// 玩家对象
class Player extends BaseGameObject {
  constructor(name: string = '玩家') {
    super(name);
    this.size = { width: 50, height: 50 };
    this.position = { x: 100, y: 100 };
  }

  override update(deltaTime: number): void {
    // 简单的移动逻辑
    this.position.x += 50 * deltaTime;

    // 边界检查
    if (this.position.x > 800) {
      this.position.x = 0;
    }
  }

  override render(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'blue';
    context.fillRect(-25, -25, 50, 50);
  }
}

// 敌人对象
class Enemy extends BaseGameObject {
  constructor(name: string = '敌人') {
    super(name);
    this.size = { width: 30, height: 30 };
    this.position = { x: 300, y: 200 };
  }

  override update(_deltaTime: number): void {
    // 简单的上下移动
    this.position.y += Math.sin(Date.now() * 0.001) * 2;
  }

  override render(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(0, 0, 15, 0, Math.PI * 2);
    context.fill();
  }
}

// 示例：创建和使用引擎
export function createGameExample() {
  console.log('创建jsKid游戏引擎示例...');

  // 创建引擎
  const engine = createJskid({
    debug: true,
    canvasWidth: 800,
    canvasHeight: 600,
    autoStart: true
  });

  // 创建并添加场景
  const scene = new GameScene();
  engine.addScene(scene);
  engine.switchScene('game-scene');

  // 监听引擎事件
  engine.on('engine:update', () => {
    if (Math.random() < 0.01) { // 偶尔输出
      console.log('游戏更新中...');
    }
  });

  engine.on('input', (event: any) => {
    console.log('输入事件:', event.type);
  });

  console.log('jsKid游戏引擎示例创建完成!');

  return engine;
}

// 如果在浏览器环境中运行，自动创建示例
if (typeof window !== 'undefined') {
  (window as any).createGameExample = createGameExample;
}