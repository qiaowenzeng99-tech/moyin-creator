# 2026-02-21 10: 仓库 owner 对齐修正

## 背景
当前实际代码仓库为 `https://github.com/qiaowenzeng99-tech/moyin-creator`，但部署配置里仍有旧 owner `memecalculate` 的硬编码地址。

## 修正
1. `docker-compose.yml`
   - 默认镜像改为：`ghcr.io/qiaowenzeng99-tech/moyin-creator:latest`
   - 注释中的 `sha`/`work` 示例同步更新 owner。
2. `DEPLOYMENT.md`
   - 服务器部署与回滚命令中的镜像地址统一改为 `ghcr.io/qiaowenzeng99-tech/moyin-creator`。

## 结果
- 与当前仓库 owner 一致，目标机器可按文档直接拉取对应 GHCR 镜像。
