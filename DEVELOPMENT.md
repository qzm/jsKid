# jsKid 开发指南

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发命令

```bash
# 启动开发服务器 (http://localhost:6000)
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm typecheck
```

## 📦 包结构

### @jskid/core - 引擎核心
- 游戏循环和时间管理
- 场景系统
- 插件系统
- 资源管理

### @jskid/utils - 工具库
- 数学工具函数
- 2D向量运算
- 颜色处理
- 计时器
- UUID生成

### @jskid/renderer - 渲染系统
- Canvas 2D渲染器
- 基础图形绘制
- 变换管理
- 状态栈

### @jskid/sprite - 精灵系统
- 精灵管理
- 动画系统
- 精灵表处理
- 帧动画

## 🛠️ 开发工作流

### 1. 创建新功能

```bash
# 在相应的包中添加代码
cd packages/<package-name>

# 编写源代码
# src/new-feature.ts

# 构建包
pnpm build

# 编写测试
# src/__tests__/new-feature.test.ts
pnpm test
```

### 2. 包间依赖

```json
{
  "dependencies": {
    "@jskid/core": "workspace:*",
    "@jskid/utils": "workspace:*"
  }
}
```

### 3. TypeScript配置

每个包都有自己的tsconfig.json，继承根配置：

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": false,
    "allowImportingTsExtensions": false
  }
}
```

## 🧪 测试

### 单元测试

使用Jest进行单元测试：

```typescript
describe('Vector2', () => {
  test('should add vectors correctly', () => {
    const v1 = new Vector2(1, 2);
    const v2 = new Vector2(3, 4);
    v1.add(v2);
    expect(v1.x).toBe(4);
    expect(v1.y).toBe(6);
  });
});
```

### 运行测试

```bash
# 所有测试
pnpm test

# 监听模式
pnpm test:watch

# 覆盖率
pnpm test:coverage
```

## 📝 代码规范

### 命名约定

- 文件名：kebab-case (例如：`game-object.ts`)
- 类名：PascalCase (例如：`GameObject`)
- 函数/变量：camelCase (例如：`updatePosition`)
- 常量：UPPER_SNAKE_CASE (例如：`MAX_SPEED`)

### 注释规范

使用JSDoc注释：

```typescript
/**
 * 计算两点之间的距离
 * @param x1 - 第一个点的X坐标
 * @param y1 - 第一个点的Y坐标
 * @param x2 - 第二个点的X坐标
 * @param y2 - 第二个点的Y坐标
 * @returns 两点之间的距离
 */
function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
```

### 代码风格

- 使用ES6+语法
- 优先使用const，需要时使用let
- 避免使用any类型
- 使用箭头函数
- 2空格缩进

## 🏗️ 架构设计

### 模块依赖图

```
core
 ├── utils
 ├── renderer ──> utils
 └── sprite ──> utils, renderer
```

### 事件驱动

使用eventemitter3进行事件通信：

```typescript
import { EventEmitter } from 'eventemitter3';

class GameObject extends EventEmitter {
  update(deltaTime: number): void {
    this.emit('update', { deltaTime });
  }
}

// 使用
const obj = new GameObject();
obj.on('update', ({ deltaTime }) => {
  console.log('Updated:', deltaTime);
});
```

### 插件系统

```typescript
interface Plugin {
  name: string;
  version: string;
  install(engine: JskidEngine): void;
  uninstall?(engine: JskidEngine): void;
  update?(deltaTime: number): void;
}
```

## 🎨 示例代码

### 基础示例

```typescript
import { JskidEngine } from '@jskid/core';
import { CanvasRenderer } from '@jskid/renderer';
import { Sprite } from '@jskid/sprite';

// 创建渲染器
const renderer = new CanvasRenderer({
  canvas: 'game-canvas',
  width: 800,
  height: 600
});

// 创建引擎
const engine = new JskidEngine({
  fps: 60,
  autoStart: true
});

// 创建精灵
const sprite = new Sprite({
  position: { x: 100, y: 100 },
  scale: { x: 1, y: 1 }
});

// 游戏循环
engine.on('engine:update', ({ deltaTime }) => {
  sprite.update(deltaTime);
});

engine.on('engine:render', ({ context }) => {
  renderer.clear();
  sprite.render(context);
});
```

## 📚 扩展阅读

- [TypeScript文档](https://www.typescriptlang.org/)
- [Vite文档](https://vitejs.dev/)
- [pnpm文档](https://pnpm.io/)
- [Jest文档](https://jestjs.io/)
- [Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

## 🐛 调试技巧

### 开发者工具

- 使用Chrome DevTools调试
- 启用source maps
- 使用console.log/debugger

### 性能分析

```typescript
import { FPSCounter } from '@jskid/utils';

const fpsCounter = new FPSCounter();

function gameLoop(): void {
  fpsCounter.update();
  console.log('FPS:', fpsCounter.getFPS());
}
```

## 🤝 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
