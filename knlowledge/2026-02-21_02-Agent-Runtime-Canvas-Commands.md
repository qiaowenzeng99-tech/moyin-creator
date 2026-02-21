# 2026-02-21 02: Agent Runtime 与命令栏接入

## 完成内容
- 新增 Agent Runtime 基础模块：
  - `src/lib/agent-runtime/intent-parser.ts`
  - `src/lib/agent-runtime/plan-builder.ts`
  - `src/lib/agent-runtime/executor.ts`
- 新增 DAG 工具：`src/lib/ai/task-dag.ts`
- 新增命令输入组件：`src/components/canvas/CommandBar.tsx`
- 升级 `CanvasView`，将命令栏接入画布视图：`src/components/panels/canvas/index.tsx`

## 行为变化
- 用户可在画布模式输入自然语言命令。
- 系统会进行意图识别 -> 计划生成 -> 节点状态更新（running/success）。
- 执行完成后写入 snapshot（执行快照）。

## 说明
当前为 MVP 执行器，重点验证交互链路与状态回灌；后续可逐步替换为真实工具调用（分镜生成/生图/生视频）。
