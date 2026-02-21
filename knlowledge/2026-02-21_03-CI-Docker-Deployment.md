# 2026-02-21 03: CI / Docker / 部署文档落地

## 完成内容
- 新增 Docker 相关文件：
  - `Dockerfile`（multi-stage：node build -> nginx serve）
  - `.dockerignore`
- 新增 GitHub Actions：
  - `.github/workflows/ci-docker.yml`
  - 包含 lint、build、docker build/push（GHCR）
- 新增部署文档：
  - `DEPLOYMENT.md`

## 说明
- PR 场景仅构建不推送镜像；push 场景自动推送到 GHCR。
- 镜像默认提供 renderer 静态资源服务，便于快速部署验证。
