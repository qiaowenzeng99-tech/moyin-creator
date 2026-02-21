import { useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';

export function CanvasInspector() {
  const { selectedNodeId, nodes, eventLogs } = useCanvasStore();
  const node = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId]);

  return (
    <div className="h-full p-4 space-y-4 text-sm overflow-auto">
      <section className="space-y-2">
        <h3 className="font-semibold">节点详情</h3>
        {!node ? (
          <div className="text-muted-foreground">选择一个节点查看详情。</div>
        ) : (
          <>
            <div><span className="text-muted-foreground">标题：</span>{node.data.title}</div>
            <div><span className="text-muted-foreground">类型：</span>{node.type}</div>
            <div><span className="text-muted-foreground">状态：</span>{node.data.status || 'idle'}</div>
            {node.data.refId && <div><span className="text-muted-foreground">引用 ID：</span>{node.data.refId}</div>}
            {node.data.metrics?.model && <div><span className="text-muted-foreground">模型：</span>{node.data.metrics.model}</div>}
            {typeof node.data.metrics?.durationMs === 'number' && (
              <div><span className="text-muted-foreground">耗时：</span>{node.data.metrics.durationMs}ms</div>
            )}
          </>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">执行日志</h3>
        <div className="rounded border bg-card p-2 max-h-56 overflow-auto space-y-1">
          {eventLogs.length === 0 && <div className="text-muted-foreground">暂无日志。</div>}
          {eventLogs.map((log, index) => (
            <div key={`${index}-${log}`} className="text-xs text-muted-foreground">{log}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
