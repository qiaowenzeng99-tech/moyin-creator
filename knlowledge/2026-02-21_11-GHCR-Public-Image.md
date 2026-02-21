# 2026-02-21 11: GHCR 公有镜像发布修正

## 目标
- 将 GHCR 镜像发布后自动调整为 public，确保外部设备可无鉴权拉取。
- 同步更新 compose 使用方式。

## 变更
1. `.github/workflows/ci-docker.yml`
   - 新增步骤：`Set GHCR package visibility to public`
   - 通过 `actions/github-script` 调用 GitHub API：
     - `PATCH /user/packages/container/{package_name}/visibility`
     - `package_name: moyin-creator`
     - `visibility: public`
   - 触发条件：非 PR 且已配置 `GHCR_PAT`。
2. `docker-compose.yml`
   - 镜像保持 `ghcr.io/qiaowenzeng99-tech/moyin-creator:latest`，并显式标注 public。
3. `DEPLOYMENT.md`
   - 补充 `GHCR_PAT` 配置说明。

## 结果
- 推送后可自动尝试将容器包改为 public（在 Secret 正确配置时）。
- 其他机器可直接 `docker compose pull` 拉取 public 镜像。
