# 2026-02-21 08: GHCR + Compose 回切交付记录

## 目标
- 将 CI 镜像推送从 Docker Hub 回切到 GitHub Container Registry (GHCR)。
- 保持另一台设备可直接通过 `docker-compose` 拉取并运行。

## 变更
1. `.github/workflows/ci-docker.yml`
   - 镜像地址改为：`ghcr.io/${{ github.repository_owner }}/moyin-creator`
   - 登录改为 GHCR：`docker/login-action` + `GITHUB_TOKEN`
   - `docker` job 增加 `packages: write` 权限以允许推送包。
2. `docker-compose.yml`
   - 运行镜像改为：`ghcr.io/memecalculate/moyin-creator:work`
3. `DEPLOYMENT.md`
   - 部署文档整体改为 GHCR 流程与拉取命令。

## 使用方式
- 推送 `work/main` 分支后，Actions 自动构建并推送到 GHCR。
- 在目标机器执行：
  - `docker compose pull`
  - `docker compose up -d`

