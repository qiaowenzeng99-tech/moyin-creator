import type { PlanStep } from './plan-builder';

export interface AgentTool {
  id: string;
  label: string;
  run: (context: { step: PlanStep }) => Promise<void>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const noopTool: AgentTool = {
  id: 'noop',
  label: '默认模拟执行器',
  run: async () => {
    await sleep(120);
  },
};

const tools = new Map<string, AgentTool>([
  ['scene', { ...noopTool, id: 'scene-tool', label: '场景工具' }],
  ['shot', { ...noopTool, id: 'shot-tool', label: '分镜工具' }],
  ['asset', { ...noopTool, id: 'asset-tool', label: '素材工具' }],
]);

export function getToolForStep(step: PlanStep): AgentTool {
  return tools.get(step.targetType) || noopTool;
}
