import type { CanvasNode } from '@/types/canvas';
import type { ExecutionPlan } from './plan-builder';

export interface ExecutorHooks {
  onNodeStatus: (nodeId: string, status: CanvasNode['data']['status']) => void;
  onLog?: (message: string) => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function executePlan(plan: ExecutionPlan, nodes: CanvasNode[], hooks: ExecutorHooks): Promise<void> {
  const targets = nodes.filter((n) => plan.steps.some((s) => s.targetType === n.type));
  hooks.onLog?.(`执行计划 ${plan.id}，共 ${plan.steps.length} 个步骤，目标节点 ${targets.length} 个`);

  for (const step of plan.steps) {
    hooks.onLog?.(`开始：${step.label}`);
    const stepTargets = targets.filter((n) => n.type === step.targetType);

    for (const node of stepTargets) {
      hooks.onNodeStatus(node.id, 'running');
      await sleep(120);
      hooks.onNodeStatus(node.id, 'success');
    }
  }
}
