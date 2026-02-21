# 2026-02-21 04: Canvas 计划预览与事件总线增强

## 完成内容
- 新增 Agent Runtime 组件：
  - `src/lib/agent-runtime/tool-registry.ts`（按步骤类型选择工具）
  - `src/lib/agent-runtime/event-bus.ts`（计划/步骤执行事件广播）
- 升级执行器：`src/lib/agent-runtime/executor.ts`
  - 接入工具注册表执行
  - 计划/步骤执行事件上报
- 升级画布状态：`src/stores/canvas-store.ts`
  - 增加 `draftPlan` 计划草案
  - 增加 `eventLogs` 执行日志
- 升级命令交互：`src/components/canvas/CommandBar.tsx`
  - 支持“预览计划”
  - split_shots 命令执行前二次确认
  - 执行后写入快照并清空计划
- 升级画布检查器：`src/components/canvas/CanvasInspector.tsx`
  - 展示执行日志

## 结果
Canvas 模式从“直接执行”升级为“先预览后执行 + 可追踪日志”，增强了可解释性与安全性。
