# 疯狂 9 点 (Crazy Nines) - Vercel 部署指南

这是一个基于 Vite + React 的纸牌游戏。你可以轻松地将其部署到 Vercel。

## 部署步骤

1. **推送代码到 GitHub/GitLab/Bitbucket**。
2. **在 Vercel 中导入项目**。
3. **配置环境变量**：
   - 在 Vercel 项目设置中，添加 `GEMINI_API_KEY` 环境变量（如果你的应用需要调用 Gemini API）。
4. **部署**：
   - Vercel 会自动识别 Vite 项目并运行 `npm run build`。
   - 构建输出目录默认为 `dist`。

## 项目配置说明

- `vercel.json`：配置了单页应用 (SPA) 的路由重写，确保刷新页面时不会出现 404。
- `vite.config.ts`：处理了环境变量的注入。

## 本地开发

```bash
npm install
npm run dev
```
