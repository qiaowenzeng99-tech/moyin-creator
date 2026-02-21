export type AgentIntentType = 'split_shots' | 'generate_images' | 'generate_videos' | 'unknown';

export interface AgentIntent {
  type: AgentIntentType;
  raw: string;
}

export function parseIntent(command: string): AgentIntent {
  const normalized = command.trim().toLowerCase();
  if (!normalized) return { type: 'unknown', raw: command };
  if (normalized.includes('拆') || normalized.includes('分镜')) return { type: 'split_shots', raw: command };
  if (normalized.includes('首帧') || normalized.includes('生图') || normalized.includes('图片')) return { type: 'generate_images', raw: command };
  if (normalized.includes('视频') || normalized.includes('运镜')) return { type: 'generate_videos', raw: command };
  return { type: 'unknown', raw: command };
}
