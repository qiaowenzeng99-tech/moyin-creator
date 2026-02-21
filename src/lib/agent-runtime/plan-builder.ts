import type { AgentIntent } from './intent-parser';

export interface PlanStep {
  id: string;
  label: string;
  targetType: 'scene' | 'shot' | 'asset';
}

export interface ExecutionPlan {
  id: string;
  intent: AgentIntent;
  steps: PlanStep[];
}

export function buildPlan(intent: AgentIntent): ExecutionPlan {
  const id = `plan-${Date.now()}`;
  switch (intent.type) {
    case 'split_shots':
      return { id, intent, steps: [{ id: 'step-1', label: '重建分镜结构', targetType: 'scene' }, { id: 'step-2', label: '更新镜头节点', targetType: 'shot' }] };
    case 'generate_images':
      return { id, intent, steps: [{ id: 'step-1', label: '构建图像提示词', targetType: 'shot' }, { id: 'step-2', label: '批量生成首帧', targetType: 'asset' }] };
    case 'generate_videos':
      return { id, intent, steps: [{ id: 'step-1', label: '整理视频任务参数', targetType: 'shot' }, { id: 'step-2', label: '批量提交视频生成', targetType: 'asset' }] };
    default:
      return { id, intent, steps: [{ id: 'step-1', label: '未识别指令，等待确认', targetType: 'scene' }] };
  }
}
