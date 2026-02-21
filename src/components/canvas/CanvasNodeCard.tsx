import type { CanvasNode } from '@/types/canvas';
import { cn } from '@/lib/utils';

const statusTone: Record<string, string> = {
  idle: 'border-border',
  queued: 'border-amber-500/60',
  running: 'border-blue-500/60',
  success: 'border-emerald-500/60',
  failed: 'border-red-500/60',
};

export function CanvasNodeCard({ node, selected, onClick }: { node: CanvasNode; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-md border bg-card p-3 text-left transition hover:bg-accent',
        statusTone[node.data.status || 'idle'],
        selected && 'ring-2 ring-primary'
      )}
    >
      <div className="text-xs text-muted-foreground uppercase">{node.type}</div>
      <div className="font-medium text-sm truncate">{node.data.title}</div>
      {node.data.subtitle && <div className="text-xs text-muted-foreground truncate">{node.data.subtitle}</div>}
    </button>
  );
}
