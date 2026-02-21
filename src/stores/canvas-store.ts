import { create } from 'zustand';
import type { CanvasEdge, CanvasNode, ExecutionSnapshot } from '@/types/canvas';

interface CanvasStore {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNodeId: string | null;
  commandHistory: string[];
  snapshots: ExecutionSnapshot[];
  setGraph: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  selectNode: (nodeId: string | null) => void;
  pushCommand: (command: string) => void;
  addSnapshot: (snapshot: ExecutionSnapshot) => void;
  updateNodeStatus: (nodeId: string, status: CanvasNode['data']['status']) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  commandHistory: [],
  snapshots: [],
  setGraph: (nodes, edges) => set({ nodes, edges }),
  selectNode: (selectedNodeId) => set({ selectedNodeId }),
  pushCommand: (command) => set((state) => ({ commandHistory: [command, ...state.commandHistory].slice(0, 30) })),
  addSnapshot: (snapshot) => set((state) => ({ snapshots: [snapshot, ...state.snapshots].slice(0, 50) })),
  updateNodeStatus: (nodeId, status) => set((state) => ({
    nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, status } } : n)),
  })),
}));
