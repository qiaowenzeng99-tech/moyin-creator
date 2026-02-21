# 部署文档（Canvas 改造版）

## 1. 前置条件
- Node.js 20+
- Docker 24+
- GitHub 仓库开启 Actions 权限
- Docker Hub 账号（仓库：`qiaowenzeng/moyin-creator`）

## 2. 本地测试
```bash
npm ci
npm run lint
npx electron-vite build
```

## 3. 本地构建 Docker 镜像
```bash
docker build -t moyin-creator:canvas-latest .
```

运行：
```bash
docker run --rm -p 8080:80 moyin-creator:canvas-latest
```

访问：`http://localhost:8080`

> 镜像内容基于 `out/renderer` 静态资源，由 Nginx 提供服务。

## 4. GitHub Actions 自动构建与推送（Docker Hub）
已提供工作流：`.github/workflows/ci-docker.yml`

流程：
1. `npm ci`
2. `npm run lint`（non-blocking）
3. `npx electron-vite build`
4. `docker buildx` 构建镜像
5. 在 push 事件下自动推送到 Docker Hub：
   - `qiaowenzeng/moyin-creator:<branch>`
   - `qiaowenzeng/moyin-creator:sha-<commit>`
   - `qiaowenzeng/moyin-creator:latest`（仅默认分支）

请在 GitHub 仓库 Secrets 中配置：
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## 5. 服务器部署（Docker）
```bash
docker pull qiaowenzeng/moyin-creator:<tag>
docker stop moyin-creator || true
docker rm moyin-creator || true
docker run -d --name moyin-creator -p 80:80 qiaowenzeng/moyin-creator:<tag>
```

## 6. 版本回滚
```bash
docker run -d --name moyin-creator -p 80:80 qiaowenzeng/moyin-creator:sha-<old-commit>
```

## 7. 常见问题
- 若 Docker Hub 推送失败：检查 `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` 是否有效。
- 若构建失败：先本地执行 `npx electron-vite build` 确认代码无 TS/Lint 问题。
- 若容器白屏：检查 `out/renderer` 是否生成、Nginx 是否正常启动。


## 8. 使用 docker-compose 一键部署
```bash
docker compose pull
docker compose up -d
```

默认端口：`http://localhost:8080`。
