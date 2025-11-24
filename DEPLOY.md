# GitHub Pages 部署指南

本文档说明如何将 jsKid 2.0 项目部署到 GitHub Pages。

## 自动部署配置

项目已配置 GitHub Actions 自动部署工作流。每次推送到 `master` 分支时会自动触发部署。

### 配置步骤

1. **启用 GitHub Pages**
   - 访问仓库设置：https://github.com/qzm/jsKid/settings/pages
   - 在 "Source" 下选择 **GitHub Actions**
   - 保存设置

2. **配置权限**
   - 访问：https://github.com/qzm/jsKid/settings/actions
   - 在 "Workflow permissions" 下选择 **Read and write permissions**
   - 勾选 **Allow GitHub Actions to create and approve pull requests**
   - 保存设置

3. **推送代码触发部署**
   ```bash
   git add .
   git commit -m "chore: 配置 GitHub Pages 自动部署"
   git push
   ```

4. **查看部署状态**
   - 访问 Actions 标签页：https://github.com/qzm/jsKid/actions
   - 查看 "Deploy to GitHub Pages" 工作流运行状态

## 访问地址

部署成功后，可通过以下地址访问：

- **主页**: https://qzm.github.io/jsKid/
- **演示页**: https://qzm.github.io/jsKid/demos/

## 本地测试

在推送前可以本地测试构建：

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build:prod

# 预览构建结果
pnpm preview
```

## 文件结构

```
.github/
  workflows/
    deploy.yml          # GitHub Actions 工作流配置
vite.config.ts          # Vite 构建配置（包含 base path）
public/
  .nojekyll             # 告诉 GitHub Pages 不使用 Jekyll
dist/                   # 构建输出目录（部署到 GitHub Pages）
```

## 关键配置

### vite.config.ts

```typescript
base: process.env.NODE_ENV === 'production' ? '/jsKid/' : '/'
```

这确保在 GitHub Pages 上资源路径正确。

### .github/workflows/deploy.yml

配置了自动构建和部署流程：
1. 检出代码
2. 安装 pnpm 和 Node.js
3. 安装依赖
4. 构建项目
5. 部署到 GitHub Pages

## 故障排除

### 部署失败

1. 检查 GitHub Actions 日志
2. 确认 Workflow 权限已正确配置
3. 验证 `vite.config.ts` 中的 `base` 配置

### 资源路径错误

如果页面加载但资源404：
- 检查 `base` 配置是否为 `/jsKid/`
- 确认所有资源引用使用相对路径

### 页面不更新

- 清除浏览器缓存
- 等待几分钟让 GitHub Pages CDN 更新
- 检查是否有新的提交触发部署

## 手动部署（不推荐）

如果需要手动部署：

```bash
# 构建
pnpm build:prod

# 进入构建目录
cd dist

# 初始化 git 仓库
git init
git add -A
git commit -m "Deploy"

# 推送到 gh-pages 分支
git push -f git@github.com:qzm/jsKid.git master:gh-pages

cd ..
```

注意：使用 GitHub Actions 自动部署更可靠和方便。
