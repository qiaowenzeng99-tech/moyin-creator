import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCanvasStore } from '@/stores/canvas-store';
import { parseIntent } from '@/lib/agent-runtime/intent-parser';
import { buildPlan } from '@/lib/agent-runtime/plan-builder';
import { executePlan } from '@/lib/agent-runtime/executor';

export function CommandBar() {
  const [command, setCommand] = useState('');
  const [running, setRunning] = useState(false);
  const { nodes, pushCommand, updateNodeStatus, addSnapshot } = useCanvasStore();

  const runCommand = async () => {
    if (!command.trim() || running) return;

    const intent = parseIntent(command);
    const plan = buildPlan(intent);
    pushCommand(command);
    setRunning(true);

    try {
      await executePlan(plan, nodes, {
        onNodeStatus: (nodeId, status) => updateNodeStatus(nodeId, status),
      });
      addSnapshot({ id: `snapshot-${Date.now()}`, command, createdAt: Date.now(), nodeIds: nodes.map((n) => n.id) });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-3 border-b border-border bg-background flex items-center gap-2">
      <Input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="输入自然语言命令，例如：把第3集拆成12镜头并生成首帧草图"
        onKeyDown={(e) => {
          if (e.key === 'Enter') runCommand();
        }}
      />
      <Button onClick={runCommand} disabled={running}>
        {running ? '执行中...' : '执行'}
      </Button>
    </div>
  );
}
