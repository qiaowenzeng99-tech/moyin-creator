# 2026-02-21 15: 默认提交分支调整为 main

## 背景
- 现有 CI 中曾包含 `work` 分支构建与 `latest` 标签发布逻辑。
- 新要求：所有后续变更默认提交到 `main` 分支。

## 调整内容
1. `.github/workflows/ci-docker.yml`
   - push/pull_request 触发分支统一为 `main`。
   - `latest` 标签仅在 `refs/heads/main` 发布。
2. `docker-compose.yml`
   - 删除 `work` 分支镜像注释，避免误导使用非默认分支标签。
3. `DEPLOYMENT.md`
   - 文档中的自动构建说明统一为 `main` 分支。

## 结果
- 分支策略与镜像发布策略统一，默认开发交付路径明确为 `main`。
