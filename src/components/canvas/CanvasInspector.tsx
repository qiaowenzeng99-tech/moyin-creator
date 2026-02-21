import { useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';

export function CanvasInspector() {
  const { selectedNodeId, nodes } = useCanvasStore();
  const node = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId]);

  if (!node) {
    return <div className="h-full p-4 text-sm text-muted-foreground">选择一个节点查看详情。</div>;
  }

  return (
    <div className="h-full p-4 space-y-3 text-sm">
      <h3 className="font-semibold">节点详情</h3>
      <div><span className="text-muted-foreground">标题：</span>{node.data.title}</div>
      <div><span className="text-muted-foreground">类型：</span>{node.type}</div>
      <div><span className="text-muted-foreground">状态：</span>{node.data.status || 'idle'}</div>
      {node.data.refId && <div><span className="text-muted-foreground">引用 ID：</span>{node.data.refId}</div>}
      {node.data.metrics?.model && <div><span className="text-muted-foreground">模型：</span>{node.data.metrics.model}</div>}
      {typeof node.data.metrics?.durationMs === 'number' && (
        <div><span className="text-muted-foreground">耗时：</span>{node.data.metrics.durationMs}ms</div>
      )}
    </div>
  );
}
