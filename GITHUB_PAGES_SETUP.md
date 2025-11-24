# 🚀 GitHub Pages 快速设置指南

## ✅ 已完成配置

已成功推送以下配置到仓库：
- ✅ GitHub Actions 自动部署工作流
- ✅ Vite 多页面构建配置
- ✅ .nojekyll 文件（禁用Jekyll）
- ✅ 部署文档和脚本

## 🎯 接下来的步骤

### 第一步：启用 GitHub Pages

1. 访问仓库设置页面：
   ```
   https://github.com/qzm/jsKid/settings/pages
   ```

2. 在 **"Build and deployment"** 部分：
   - **Source**: 选择 `GitHub Actions`
   - 点击保存

### 第二步：配置工作流权限

1. 访问 Actions 设置页面：
   ```
   https://github.com/qzm/jsKid/settings/actions
   ```

2. 在 **"Workflow permissions"** 部分：
   - 选择 `Read and write permissions`
   - 勾选 `Allow GitHub Actions to create and approve pull requests`
   - 点击保存

### 第三步：触发部署

部署会在以下情况自动触发：
- ✅ 推送到 `master` 分支（刚才已推送）
- 🔄 手动触发工作流

查看部署进度：
```
https://github.com/qzm/jsKid/actions
```

## 🌐 访问地址

部署完成后（约2-5分钟），可通过以下地址访问：

- **主页**: https://qzm.github.io/jsKid/
- **演示中心**: https://qzm.github.io/jsKid/demos/
- **贪吃蛇**: https://qzm.github.io/jsKid/demos/snake/
- **打砖块**: https://qzm.github.io/jsKid/demos/breakout/
- **Flappy Bird**: https://qzm.github.io/jsKid/demos/flappy-bird/
- **Pong**: https://qzm.github.io/jsKid/demos/pong/
- **俄罗斯方块**: https://qzm.github.io/jsKid/demos/tetris/
- **太空射击**: https://qzm.github.io/jsKid/demos/space-shooter/
- **水果接球**: https://qzm.github.io/jsKid/demos/fruit-catcher/
- **跑酷**: https://qzm.github.io/jsKid/demos/runner/
- **打地鼠**: https://qzm.github.io/jsKid/demos/whack-a-mole/
- **记忆匹配**: https://qzm.github.io/jsKid/demos/memory-match/

## 📋 检查清单

- [x] 创建 GitHub Actions 工作流
- [x] 修改 Vite 配置
- [x] 添加 .nojekyll 文件
- [x] 推送到远程仓库
- [ ] 在 GitHub 启用 Pages
- [ ] 配置工作流权限
- [ ] 等待首次部署完成
- [ ] 访问网站验证

## 🔧 故障排除

### 如果部署失败

1. **检查 Actions 日志**
   ```
   https://github.com/qzm/jsKid/actions
   ```
   查看具体错误信息

2. **常见问题**：
   - ❌ Workflow 权限不足 → 设置为 "Read and write"
   - ❌ Pages 未启用 → 在设置中选择 "GitHub Actions"
   - ❌ 构建失败 → 查看日志，可能是依赖问题

### 如果页面404

1. 等待3-5分钟让CDN更新
2. 清除浏览器缓存
3. 确认 Pages 已启用且状态为 "Active"

## 📚 更多信息

详细部署文档请参考：
- [DEPLOY.md](./DEPLOY.md) - 完整部署指南
- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

**当前状态**: ✅ 配置已推送，等待在 GitHub 控制台启用 Pages
