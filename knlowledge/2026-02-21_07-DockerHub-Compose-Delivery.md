# 2026-02-21 07: Docker Compose 与 Docker Hub 流水线交付

## 完成内容
- 新增 `docker-compose.yml`，支持一键部署查看效果。
- 更新 `.github/workflows/ci-docker.yml`，将镜像推送目标从 GHCR 调整为 Docker Hub：
  - 目标仓库：`qiaowenzeng/moyin-creator`
  - 推送标签：branch、sha、latest（默认分支）
  - 登录凭据：`DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN`
- 更新 `DEPLOYMENT.md`：
  - 改为 Docker Hub 部署说明
  - 增加 docker-compose 一键部署章节

## 结果
- 代码推送后可通过 GitHub Actions 自动构建并推送镜像到 Docker Hub。
- 服务器可直接通过 `docker compose up -d` 拉起服务。
