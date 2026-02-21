export type CanvasNodeType = 'scene' | 'shot' | 'asset' | 'task';

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasNodeData {
  title: string;
  subtitle?: string;
  refId?: string;
  status?: 'idle' | 'queued' | 'running' | 'success' | 'failed';
  metrics?: {
    durationMs?: number;
    model?: string;
    cost?: number;
  };
}

export interface CanvasNode {
  id: string;
  type: CanvasNodeType;
  position: CanvasPosition;
  data: CanvasNodeData;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ExecutionSnapshot {
  id: string;
  command: string;
  createdAt: number;
  nodeIds: string[];
}

export interface PromptVersion {
  id: string;
  refId: string;
  prompt: string;
  createdAt: number;
}
