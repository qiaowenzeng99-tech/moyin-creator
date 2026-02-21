# 2026-02-21 14: Web 显示异常与 Compose 部署修复

## 问题现象
- 服务器 `docker compose up` 后容器正常启动，但浏览器侧出现“页面未显示”。
- 日志中存在 `GET /favicon.ico 404` 与 compose `version is obsolete` 提示。

## 根因定位
1. `src/main.tsx` 在 Web（非 Electron）环境无条件执行 `window.ipcRenderer.on(...)`。
2. 在纯浏览器运行时 `window.ipcRenderer` 不存在，触发运行时错误，可能导致初始化中断或空白体验。
3. `docker-compose.yml` 使用了已废弃的顶层 `version` 字段，引发警告。

## 修复内容
- 在 `src/main.tsx` 对 `window.ipcRenderer?.on` 做运行时保护，仅在 Electron 可用时注册监听。
- 删除 `docker-compose.yml` 顶层 `version` 字段，兼容 compose v2 语法。
- 在 `index.html` 显式声明 favicon（`/vite.svg`），减少无效 `favicon.ico` 404 请求。

## 验证结果
- `npx electron-vite build` 构建通过。
- 本地静态服务 + Playwright 访问 `http://127.0.0.1:4173` 正常渲染首页。
- 浏览器控制台不再出现 `Cannot read properties of undefined (reading 'on')`。
