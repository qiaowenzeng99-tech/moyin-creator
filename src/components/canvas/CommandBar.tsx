import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCanvasStore } from '@/stores/canvas-store';
import { parseIntent } from '@/lib/agent-runtime/intent-parser';
import { buildPlan } from '@/lib/agent-runtime/plan-builder';
import { executePlan } from '@/lib/agent-runtime/executor';
import { agentEventBus } from '@/lib/agent-runtime/event-bus';

const DESTRUCTIVE_INTENTS = new Set(['split_shots']);

export function CommandBar() {
  const [command, setCommand] = useState('');
  const [running, setRunning] = useState(false);
  const {
    nodes,
    draftPlan,
    pushCommand,
    pushEventLog,
    setDraftPlan,
    updateNodeStatus,
    addSnapshot,
  } = useCanvasStore();

  useEffect(() => {
    const dispose = agentEventBus.subscribe((event) => {
      pushEventLog(event.message);
    });

    return () => dispose();
  }, [pushEventLog]);

  const previewCommand = () => {
    if (!command.trim()) return;
    const plan = buildPlan(parseIntent(command));
    setDraftPlan(plan);
  };

  const runCommand = async () => {
    if (!command.trim() || running) return;

    const plan = draftPlan || buildPlan(parseIntent(command));

    if (DESTRUCTIVE_INTENTS.has(plan.intent.type)) {
      const ok = window.confirm('该命令可能会重建分镜结构，是否继续执行？');
      if (!ok) return;
    }

    pushCommand(command);
    setRunning(true);

    try {
      await executePlan(plan, nodes, {
        onNodeStatus: (nodeId, status) => updateNodeStatus(nodeId, status),
      });
      addSnapshot({ id: `snapshot-${Date.now()}`, command, createdAt: Date.now(), nodeIds: nodes.map((n) => n.id) });
      setDraftPlan(null);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-3 border-b border-border bg-background space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="输入自然语言命令，例如：把第3集拆成12镜头并生成首帧草图"
          onKeyDown={(e) => {
            if (e.key === 'Enter') previewCommand();
          }}
        />
        <Button variant="outline" onClick={previewCommand} disabled={running}>预览计划</Button>
        <Button onClick={runCommand} disabled={running || !draftPlan}>
          {running ? '执行中...' : '执行'}
        </Button>
      </div>

      {draftPlan && (
        <div className="rounded border bg-card p-2 text-xs space-y-1">
          <div className="font-medium">执行计划预览：{draftPlan.intent.type}</div>
          {draftPlan.steps.map((step) => (
            <div key={step.id} className="text-muted-foreground">- {step.label} ({step.targetType})</div>
          ))}
        </div>
      )}
    </div>
  );
}
