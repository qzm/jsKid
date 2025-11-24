# @jskid/physics

Matter.js 物理引擎集成包，为 jsKid 2D 游戏引擎提供完整的物理模拟功能。

## 特性

- 🎯 **完整的物理模拟** - 基于 Matter.js 的 2D 物理引擎
- 🔄 **自动同步** - 与 jsKid 引擎循环自动同步
- 🎨 **简化的 API** - 封装复杂的物理引擎操作
- 🏗️ **工厂模式** - 快速创建常见形状的刚体
- 🔍 **碰撞检测** - 完整的碰撞事件系统
- 🐛 **调试模式** - 内置调试渲染功能

## 安装

```bash
pnpm add @jskid/physics
```

## 快速开始

### 方式 1：作为插件使用

```typescript
import { createJskid } from '@jskid/core';
import { createPhysicsPlugin, RigidBodyFactory } from '@jskid/physics';

// 创建游戏引擎
const engine = createJskid({
  canvasWidth: 800,
  canvasHeight: 600,
});

// 安装物理插件
const physicsPlugin = createPhysicsPlugin({
  gravity: { x: 0, y: 1 }, // 向下的重力
  pixelRatio: 50, // 1米 = 50像素
});
engine.installPlugin(physicsPlugin);

// 创建物体
const ground = RigidBodyFactory.createRectangle(400, 580, 800, 40, {
  type: 'static',
  friction: 0.5,
});

const ball = RigidBodyFactory.createCircle(400, 100, 20, {
  type: 'dynamic',
  restitution: 0.8, // 弹性
  density: 0.001,
});

// 添加到物理世界
engine.physics!.addBody([ground, ball]);

// 启动引擎
engine.start();
```

### 方式 2：独立使用

```typescript
import { PhysicsEngine, RigidBodyFactory } from '@jskid/physics';

// 创建物理引擎
const physics = new PhysicsEngine({
  gravity: { x: 0, y: 9.8 },
});

// 创建物体
const box = RigidBodyFactory.createRectangle(100, 100, 50, 50, {
  type: 'dynamic',
});

physics.addBody(box);

// 手动更新（在游戏循环中）
function gameLoop(deltaTime: number) {
  physics.update(deltaTime);
  // ... 渲染逻辑
}
```

## API 文档

### PhysicsEngine

物理引擎核心类。

#### 构造函数

```typescript
new PhysicsEngine(config?: PhysicsConfig)
```

**配置选项：**
- `gravity` - 重力向量 `{ x, y }`
- `enableSleeping` - 是否启用睡眠优化
- `timeScale` - 时间缩放（1.0 = 正常速度）
- `pixelRatio` - 像素比例（默认 50，即 1米 = 50像素）

#### 方法

**刚体管理：**
- `addBody(body)` - 添加刚体
- `removeBody(body)` - 移除刚体
- `getBodies()` - 获取所有刚体
- `getBodyAt(x, y)` - 获取指定点的刚体

**引擎控制：**
- `start()` - 启动物理引擎
- `stop()` - 停止物理引擎
- `update(deltaTime)` - 手动更新

**查询：**
- `raycast(startX, startY, endX, endY)` - 射线检测
- `getBodiesInRegion(bounds)` - 区域查询

**设置：**
- `setGravity(x, y)` - 设置重力
- `setTimeScale(scale)` - 设置时间缩放

**调试：**
- `enableDebugRender(canvas, options)` - 启用调试渲染
- `disableDebugRender()` - 禁用调试渲染

### RigidBodyFactory

刚体工厂类，提供创建常见形状的便捷方法。

#### 静态方法

```typescript
// 矩形
RigidBodyFactory.createRectangle(x, y, width, height, config?)

// 圆形
RigidBodyFactory.createCircle(x, y, radius, config?)

// 多边形
RigidBodyFactory.createPolygon(x, y, sides, radius, config?)

// 自定义顶点
RigidBodyFactory.createFromVertices(x, y, vertices, config?)

// 梯形
RigidBodyFactory.createTrapezoid(x, y, width, height, slope, config?)
```

**通用配置：**
```typescript
interface RigidBodyConfig {
  type?: 'static' | 'dynamic' | 'kinematic';
  density?: number;        // 密度
  friction?: number;       // 摩擦力 (0-1)
  restitution?: number;    // 弹性 (0-1)
  frictionAir?: number;    // 空气阻力
  isSensor?: boolean;      // 是否为传感器
  fixedRotation?: boolean; // 是否固定旋转
  velocity?: { x, y };     // 初始速度
  userData?: any;          // 用户数据
}
```

### RigidBodyHelper

刚体辅助类，提供常用操作。

```typescript
// 力和速度
RigidBodyHelper.applyForce(body, force, position?)
RigidBodyHelper.applyImpulse(body, impulse, position?)
RigidBodyHelper.setVelocity(body, x, y)
RigidBodyHelper.setAngularVelocity(body, velocity)

// 位置和旋转
RigidBodyHelper.setPosition(body, x, y)
RigidBodyHelper.setAngle(body, angle)
RigidBodyHelper.rotate(body, angle, point?)

// 属性
RigidBodyHelper.setStatic(body, isStatic)
RigidBodyHelper.setDensity(body, density)
RigidBodyHelper.setMass(body, mass)

// 查询
RigidBodyHelper.getSpeed(body)
RigidBodyHelper.getVelocity(body)
RigidBodyHelper.getPosition(body)
RigidBodyHelper.containsPoint(body, x, y)
```

## 碰撞事件

```typescript
physics.on('collision:start', (event: CollisionEvent) => {
  console.log('碰撞开始', event.bodyA, event.bodyB);
});

physics.on('collision:active', (event: CollisionEvent) => {
  console.log('碰撞持续', event.bodyA, event.bodyB);
});

physics.on('collision:end', (event: CollisionEvent) => {
  console.log('碰撞结束', event.bodyA, event.bodyB);
});
```

## 完整示例

查看 `demos/pong/` 目录获取完整的 Pong 游戏示例，展示物理引擎的实际应用。

## License

MIT
