# 2026-02-21 13: GHCR `latest` 标签发布修复

## 问题
线上反馈 `ghcr.io/qiaowenzeng99-tech/moyin-creator:latest` 拉取报错 `manifest unknown`。

## 根因
工作流中 `latest` 标签仅在默认分支时才发布：
- `type=raw,value=latest,enable={{is_default_branch}}`

若实际发布在 `work/main` 而默认分支不是其中之一，就不会产生 `latest`。

## 修复
1. `.github/workflows/ci-docker.yml`
   - 将 `latest` 发布条件改为：
     - `github.ref == refs/heads/main || github.ref == refs/heads/work`
   - 确保在 `main/work` 推送时都会产出 `latest`。
2. GHCR 可见性步骤增加 `continue-on-error: true`
   - 避免“设为 public”附加步骤异常导致整个 Docker 发布流程被标红。

## 结果
- `work/main` 推送后都会生成并推送 `:latest`。
- 外部机器使用 `docker compose pull` 拉取 `latest` 的稳定性提升。
