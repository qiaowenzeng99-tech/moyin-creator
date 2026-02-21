# 2026-02-21 09: docker-compose 镜像标签修正

## 背景
当前 Actions 推送的可用镜像标签与部署侧预期不一致，`docker-compose.yml` 中固定 `:work` 在部分场景下无法直接拉取。

## 修正
- 将 `docker-compose.yml` 默认镜像标签改为：`ghcr.io/memecalculate/moyin-creator:latest`
- 在 compose 注释中补充可选固定版本方式：`sha-<commit>` / `work`
- 在 `DEPLOYMENT.md` 增加说明：compose 默认 `latest`，生产建议使用 `sha-<commit>` 固定版本。

## 结果
- 另一台设备可直接执行 `docker compose pull && docker compose up -d` 拉取默认可用标签启动。
