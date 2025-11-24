# jsKid 2.0 - 现代化2D游戏引擎

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-orange.svg)

jsKid是一个基于JavaScript+HTML5技术的轻量级2D游戏引擎，由QZM开发。jsKid 2.0是对原始jsKid引擎的完全现代化重构，使用TypeScript和现代开发工具重新构建，提供更好的开发体验和性能。

## ✨ 主要特性

### 🚀 现代化技术栈
- **TypeScript 5.x** - 完整的类型安全和现代JavaScript支持
- **ES6+ 模块** - 标准化的模块系统
- **Vite构建** - 快速的现代化构建工具
- **pnpm包管理** - 高效的依赖管理

### 🎮 游戏引擎功能
- **游戏循环管理** - 高性能的requestAnimationFrame游戏循环
- **场景系统** - 灵活的场景管理和切换
- **游戏对象系统** - 基于组件的游戏对象架构
- **输入处理** - 统一的键盘、鼠标、触摸输入支持
- **资源管理** - 图片、音频、JSON等资源的加载和管理
- **事件系统** - 基于EventEmitter3的事件驱动架构
- **插件系统** - 可扩展的插件架构

### 🛠️ 开发工具
- **类型安全** - 完整的TypeScript类型定义
- **自动化测试** - Jest单元测试框架
- **代码质量** - ESLint + Prettier代码检查和格式化
- **热重载** - 开发环境实时预览
- **Monorepo** - 模块化的包管理

## 📦 安装

```bash
# 克隆项目
git clone https://github.com/qzm/jskid.git

# 进入项目目录
cd jskid

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

## 🚀 快速开始

### 基础示例

```typescript
import { createJskid, BaseScene, BaseGameObject } from '@jskid/core';

// 创建游戏引擎
const engine = createJskid({
  debug: true,
  canvasWidth: 800,
  canvasHeight: 600,
  autoStart: true
});

// 创建游戏场景
class GameScene extends BaseScene {
  constructor() {
    super('game-scene', '游戏场景');

    // 添加游戏对象
    this.addObject(new Player());
  }
}

// 创建玩家对象
class Player extends BaseGameObject {
  constructor() {
    super('玩家');
    this.size = { width: 50, height: 50 };
    this.position = { x: 100, y: 100 };
  }

  update(deltaTime: number) {
    // 游戏逻辑更新
    this.position.x += 100 * deltaTime;
  }

  render(context: CanvasRenderingContext2D) {
    // 渲染玩家
    context.fillStyle = 'blue';
    context.fillRect(-25, -25, 50, 50);
  }
}

// 启动游戏
engine.addScene(new GameScene());
engine.switchScene('game-scene');
```

### HTML中使用

```html
<!DOCTYPE html>
<html>
<head>
    <title>jsKid 2.0 游戏</title>
</head>
<body>
    <canvas id="game" width="800" height="600"></canvas>

    <script type="module">
        import { createJskid } from './node_modules/@jskid/core/index.js';

        const engine = createJskid();
        // ... 游戏逻辑
    </script>
</body>
</html>
```

## 📁 项目结构

```
jskid/
├── packages/           # 核心模块
│   ├── core/          # 引擎核心
│   ├── renderer/      # 渲染系统
│   ├── sprite/        # 精灵和动画
│   ├── physics/       # 物理引擎
│   ├── input/         # 输入处理
│   ├── audio/         # 音频系统
│   └── utils/         # 工具库
├── demos/             # 功能演示
│   ├── basic-canvas/  # 基础Canvas演示
│   ├── sprite-animation/ # 精灵动画
│   └── physics-demo/  # 物理演示
├── apps/              # 应用示例
├── docs/              # 文档
└── tools/             # 开发工具
```

## 🎯 核心模块

### @jskid/core
游戏引擎核心，提供：
- 游戏循环管理
- 场景系统
- 游戏对象基类
- 事件系统
- 资源管理
- 输入处理

### @jskid/renderer
渲染系统，支持：
- Canvas 2D渲染
- WebGL渲染器（计划中）
- 批量渲染优化
- 纹理管理

### @jskid/sprite
精灵和动画系统：
- 精灵类
- 帧动画
- 精灵表（SpriteSheet）
- 粒子系统

### @jskid/physics
物理引擎集成：
- 碰撞检测
- 重力系统
- 物理模拟
- Matter.js集成

## 🔧 开发指南

### 开发环境设置

```bash
# 安装依赖
pnpm install

# 开发模式（热重载）
pnpm dev

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage
```

### 创建新模块

```bash
# 创建新的核心模块
pnpm create:module my-module

# 创建新的演示
pnpm add:demo my-demo
```

### 构建项目

```bash
# 构建所有模块
pnpm build

# 预览构建结果
pnpm preview
```

## 📖 API文档

### JskidEngine

游戏引擎的主要类，管理整个游戏的生命周期。

```typescript
import { createJskid, JskidConfig } from '@jskid/core';

const config: JskidConfig = {
  debug: true,
  canvasWidth: 800,
  canvasHeight: 600,
  fps: 60,
  autoStart: true
};

const engine = createJskid(config);
```

### 方法

- `start()` - 启动游戏循环
- `pause()` - 暂停游戏
- `resume()` - 恢复游戏
- `stop()` - 停止游戏循环
- `addScene(scene)` - 添加场景
- `switchScene(id)` - 切换场景
- `loadAsset(id, src, type)` - 加载资源

### 事件

- `engine:initialized` - 引擎初始化完成
- `engine:started` - 游戏循环开始
- `engine:paused` - 游戏暂停
- `engine:resumed` - 游戏恢复
- `engine:update` - 游戏更新
- `engine:render` - 游戏渲染
- `input` - 输入事件

## 🎮 演示

### 基础Canvas演示
```bash
# 运行基础演示
pnpm dev
# 访问 http://localhost:5173/demos/basic-canvas/
```

### 精灵动画演示
```bash
# 访问 http://localhost:5173/demos/sprite-animation/
```

### 物理演示
```bash
# 访问 http://localhost:5173/demos/physics-demo/
```

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 运行特定模块测试
pnpm test packages/core

# 监听模式
pnpm test:watch

# 覆盖率报告
pnpm test:coverage

# 端到端测试
pnpm test:e2e
```

## 📊 性能

jsKid 2.0相比原版有显著的性能提升：

- **TypeScript类型检查** - 减少运行时错误
- **现代JavaScript引擎优化** - 利用V8等现代引擎
- **批量渲染** - 减少Canvas API调用
- **对象池** - 减少垃圾回收压力
- **空间分割** - 优化碰撞检测

## 🔄 从jsKid 1.x迁移

jsKid 2.0保持了与原版API的兼容性，主要变化：

```javascript
// 原版 jsKid 1.x
var game = new jsKid();
game.init(function(){
    // 初始化代码
});
game.run(function(){
    // 游戏循环
});

// 新版 jsKid 2.x
import { createJskid } from '@jskid/core';
const game = createJskid({
    autoStart: true
});
game.on('engine:update', (deltaTime) => {
    // 游戏循环
});
```

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 贡献规范

- 使用TypeScript编写代码
- 遵循ESLint和Prettier规则
- 编写单元测试
- 更新相关文档

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 原始jsKid作者：QZM
- TypeScript团队
- Vite构建工具
- Jest测试框架
- 所有贡献者

## 📞 联系方式

- 项目主页：https://github.com/qzm/jskid
- 问题反馈：https://github.com/qzm/jskid/issues
- 作者邮箱：qzmdev@gmail.com

---

**jsKid 2.0** - 现代化的HTML5 2D游戏引擎 🚀