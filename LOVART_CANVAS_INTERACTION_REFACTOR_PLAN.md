# 基于 Lovart「AI 驱动画布」范式的 Moyin Creator 全局交互改造方案

## 1. 背景与目标

当前项目交互是典型的 **流程分栏式工作台**（剧本/角色/场景/导演/S级），优点是结构清晰、易于上手；但在复杂创作场景下，用户需要在多个面板间频繁切换，创作上下文被割裂，难以形成“所见即所得 + AI 即时协作”的体验。

Lovart 风格的核心是：
- **画布即主界面**（Canvas-first）
- **自然语言即操作**（Prompt-as-Command）
- **AI 代理即执行引擎**（Agentic Orchestration）
- **结果可追溯可回滚**（Versioned Non-destructive Editing）

本方案目标：在保留现有生产能力（解析、分镜、生成、导出）的前提下，将项目交互重构为 **“AI 导演画布”**，实现“讲需求 → 出草案 → 可编辑 → 批量落地”的闭环。

---

## 2. 现状诊断（基于源码）

### 2.1 交互结构现状
- 侧栏以 tab 为主，按阶段切换（script / characters / scenes / director / sclass / media / export）。
- 跨板块通过 `pending*Data` 传值，属于“面板间跳转式协作”。

### 2.2 AI 执行现状
- 已有 feature router、多模型轮询、任务队列、并发与重试，AI 执行层基础较好。
- 生成入口分散在多个 panel hook 中，缺统一的“用户意图 -> agent 计划 -> 多工具执行 -> 回填画布”的编排层。

### 2.3 数据层现状
- IndexedDB + OPFS 的本地存储非常适合做画布项目。
- 但当前资产主要以“列表 + 表单”组织，尚未升维到“节点 + 连线 + 时序片段 + 版本快照”的画布模型。

**结论**：当前代码适合改造为 AI 画布体系，重点在于“交互与编排层重构”，而非底层推倒重来。

---

## 3. Lovart 范式映射：目标交互蓝图

## 3.1 核心体验
1. 用户进入项目后默认进入 **Director Canvas**（非 tab 表单页）。
2. 在画布输入：
   - “把第3集拆成12镜头并生成首帧草图”
   - “把女主统一换成红色风衣并重生成相关镜头”
3. Agent 自动产生执行计划（Plan）：脚本解析 -> 分镜更新 -> 角色一致性检查 -> 批量生图。
4. 结果以节点形式落在画布：Scene Node、Shot Node、Asset Node、Timeline Node。
5. 用户可框选节点做批操作（重写 prompt、锁定角色、切换模型、重渲染）。

## 3.2 交互原则
- **命令可解释**：每次 AI 执行动作都给出“将做什么/为什么”。
- **可中断可回滚**：任何批处理支持 pause/resume/cancel，结果版本化。
- **局部重算**：改动某角色服装，仅触发相关 shot 的增量生成。
- **状态可观测**：每个节点显示耗时、模型、成本、失败原因。

---

## 4. 技术架构改造方案

## 4.1 前端：从 Tab UI 升级到 Canvas UI

新增模块建议：
- `src/components/canvas/`
  - `DirectorCanvas.tsx`：主画布容器（缩放、平移、框选、多选）
  - `CanvasNode.tsx`：统一节点协议（scene/shot/asset/task）
  - `CanvasInspector.tsx`：右侧属性面板
  - `CommandBar.tsx`：自然语言命令输入
  - `TimelineStrip.tsx`：镜头时序条
- `src/stores/canvas-store.ts`
  - 节点图状态、选择集、视图状态（zoom/viewport）、命令历史

建议选型：
- 2D 节点交互：`reactflow` 或 `@xyflow/react`
- 大规模状态：继续 `zustand`（与现有一致）
- 协同预留：Y.js 抽象接口（先单机，后续多人）

## 4.2 编排层：引入 AI Agent Runtime

新增：`src/lib/agent-runtime/`
- `intent-parser.ts`：把用户命令转为结构化意图
- `plan-builder.ts`：生成执行 DAG（步骤、依赖、回滚点）
- `tool-registry.ts`：注册项目内可调用工具
- `executor.ts`：串并行执行、失败恢复
- `event-bus.ts`：把执行进度实时推送给 Canvas Node

工具层映射（复用现有能力）：
- `parse_script` -> 复用 `episode-parser/full-script-service`
- `generate_shots` -> 复用现有分镜生成逻辑
- `generate_image` -> 复用 `use-image-generation` 对应 API
- `generate_video` -> 复用 `use-video-generation`
- `analyze_viewpoint` -> 复用 `viewpoint-analyzer`

## 4.3 数据模型：引入 Canvas Domain Model

新增类型：`src/types/canvas.ts`
- `CanvasProject`
- `CanvasNode`（SceneNode / ShotNode / AssetNode / TaskNode）
- `CanvasEdge`
- `ExecutionSnapshot`
- `PromptVersion`

关键能力：
- 节点引用现有 `shot/scene/character` 实体 ID，避免双份数据。
- 每次 AI 执行落地为 `ExecutionSnapshot`，支持回放与回滚。
- Prompt 变更版本化，可比较 diff。

## 4.4 任务系统：从队列到 DAG 调度

在现有 `TaskQueue` 之上加一层 DAG orchestration：
- 阶段依赖：`script -> scene -> shot -> image -> video`
- 局部依赖：只重算受影响分支
- 失败策略：step-level retry + fallback model + 人工接管

新增：`src/lib/ai/task-dag.ts`
- 拓扑排序
- 节点状态机（queued/running/success/failed/skipped）
- 断点续跑（从失败节点恢复）

## 4.5 可观测性与质量闭环

新增：`src/lib/observability/`
- `metrics.ts`：耗时、成功率、平均重试、成本
- `quality-score.ts`：角色一致性分、镜头连续性分
- `trace-log.ts`：一次命令的完整执行链路

UI：
- 每个节点显示模型、耗时、成本、评分。
- 全局提供 Run 面板（类似 CI pipeline 日志）。

---

## 5. 分阶段落地计划（可执行）

## Phase A（2~3 周）— MVP 画布壳
- 新建 `DirectorCanvas + CanvasStore + 基础节点`。
- 把现有 Script/Director 数据投影到画布节点（只读）。
- 保留原 tab，增加“画布模式开关”。

验收：用户可在画布浏览 scene/shot 关系并定位素材。

## Phase B（3~4 周）— 命令驱动生成
- 接入 `CommandBar + intent-parser + plan-builder`。
- 实现 3 条高频命令：
  1) 拆分分镜
  2) 批量生成首帧
  3) 批量生成视频
- 执行日志实时回灌节点状态。

验收：用户一句命令可触发批处理并看到全过程。

## Phase C（3~4 周）— 可编辑与回滚
- 增加 PromptVersion 与 Snapshot。
- 支持节点级回滚、局部重算、模型切换重跑。
- 接入一致性评分并展示。

验收：失败任务可一键重跑，改动可回滚。

## Phase D（4+ 周）— 生产强化
- DAG 调度与策略路由（质量/成本/速度）。
- 质量阈值触发自动纠偏。
- 输出项目 KPI 报表。

验收：形成稳定生产流水线并可持续优化。

---

## 6. 风险评估与规避

1. **风险：重构跨度大，影响现有用户。**
   - 规避：双模式并存（Classic Tabs / Canvas），渐进迁移。

2. **风险：Agent 误解命令导致错误批处理。**
   - 规避：所有 destructive 操作增加执行前确认（dry-run preview）。

3. **风险：本地性能压力（大项目节点过多）。**
   - 规避：虚拟化渲染、分层加载、节点折叠、按需详情。

4. **风险：多模型多任务成本不可控。**
   - 规避：策略路由 + 成本上限 + 超预算熔断。

---

## 7. 关键实现清单（建议优先改造文件）

- 导航入口：
  - `src/stores/media-panel-store.ts`（新增 canvas tab / mode）
  - `src/components/TabBar.tsx`（入口与模式切换）
- 导演面板整合：
  - `src/components/panels/director/index.tsx`（嵌入/跳转 canvas）
- 新增画布域：
  - `src/components/canvas/*`
  - `src/stores/canvas-store.ts`
  - `src/types/canvas.ts`
- 新增 Agent Runtime：
  - `src/lib/agent-runtime/*`
  - `src/lib/ai/task-dag.ts`
- 可观测性：
  - `src/lib/observability/*`

---

## 8. 与现有能力复用关系（避免重复造轮子）

- **保留**：feature-router、api-config-store、task-queue、storage-service、现有 image/video API 适配。
- **升级**：从“面板按钮触发”升级为“agent 计划触发”。
- **新增最小必要层**：Canvas 状态层 + Agent Runtime + DAG + 质量/观测。

=> 这样能最大程度利用当前代码资产，控制改造成本。

---

## 9. 成功指标（量化）

改造后建议追踪：
- TTFV（从命令到首个可用画面）下降 30%+
- 单集平均人工操作步数下降 40%+
- 批量任务失败后的恢复时间下降 50%+
- 角色一致性评分提升（基线对比）20%+
- 用户留存（7日）提升

---

## 10. 最终建议

从技术可行性看，Moyin Creator 非常适合按 Lovart 范式升级：底层 AI/存储能力已经具备，主要差在“统一交互层与编排层”。建议采取 **“双模式渐进迁移 + 先 MVP 后闭环”** 的实施策略，优先把“命令驱动画布 + 可观测执行”做出来，再逐步走向全自动导演代理。
