# 2026-02-21 12: Workflow `if` 中 secrets 上下文修复

## 问题
GitHub Actions 校验报错：
- `Unrecognized named-value: 'secrets'`
- 触发点：step 的 `if` 表达式中使用 `secrets.GHCR_PAT != ''`。

## 修复
1. 在 `docker` job 级别增加环境变量：
   - `GHCR_PAT: ${{ secrets.GHCR_PAT }}`
2. step 条件改为：
   - `if: github.event_name != 'pull_request' && env.GHCR_PAT != ''`
3. `github-token` 改为：
   - `${{ env.GHCR_PAT }}`

## 结果
- 规避 `if` 表达式中的 secrets 上下文识别问题。
- 在配置了 `GHCR_PAT` 时，仍可自动把 GHCR 包可见性设为 public。
