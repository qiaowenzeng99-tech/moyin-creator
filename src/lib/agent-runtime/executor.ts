import type { CanvasNode } from '@/types/canvas';
import type { ExecutionPlan } from './plan-builder';
import { getToolForStep } from './tool-registry';
import { agentEventBus } from './event-bus';

export interface ExecutorHooks {
  onNodeStatus: (nodeId: string, status: CanvasNode['data']['status']) => void;
  onLog?: (message: string) => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function executePlan(plan: ExecutionPlan, nodes: CanvasNode[], hooks: ExecutorHooks): Promise<void> {
  const targets = nodes.filter((n) => plan.steps.some((s) => s.targetType === n.type));
  const startMsg = `执行计划 ${plan.id}，共 ${plan.steps.length} 个步骤，目标节点 ${targets.length} 个`;
  hooks.onLog?.(startMsg);
  agentEventBus.emit({ type: 'plan_started', planId: plan.id, message: startMsg });

  for (const step of plan.steps) {
    const stepStart = `开始：${step.label}`;
    hooks.onLog?.(stepStart);
    agentEventBus.emit({ type: 'step_started', planId: plan.id, stepId: step.id, message: stepStart });

    const stepTargets = targets.filter((n) => n.type === step.targetType);
    const tool = getToolForStep(step);

    for (const node of stepTargets) {
      hooks.onNodeStatus(node.id, 'running');
      await tool.run({ step });
      await sleep(60);
      hooks.onNodeStatus(node.id, 'success');
    }

    agentEventBus.emit({ type: 'step_finished', planId: plan.id, stepId: step.id, message: `${step.label} 完成` });
  }

  agentEventBus.emit({ type: 'plan_finished', planId: plan.id, message: `计划 ${plan.id} 执行完成` });
}
