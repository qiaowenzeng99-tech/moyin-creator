import { useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';
import { useScriptStore } from '@/stores/script-store';
import { CanvasNodeCard } from './CanvasNodeCard';

export function DirectorCanvas() {
  const { activeProjectId, projects } = useScriptStore();
  const { nodes, setGraph, selectedNodeId, selectNode } = useCanvasStore();

  const project = activeProjectId ? projects[activeProjectId] : null;

  const projected = useMemo(() => {
    if (!project?.scriptData) return { nodes: [], edges: [] };

    const sceneNodes = project.scriptData.scenes.map((scene, i) => ({
      id: `scene-${scene.id}`,
      type: 'scene' as const,
      position: { x: 0, y: i * 96 },
      data: { title: scene.location || scene.name || `场景 ${i + 1}`, subtitle: scene.time, refId: scene.id, status: 'idle' as const },
    }));

    const shotNodes = project.shots.map((shot, i) => ({
      id: `shot-${shot.id}`,
      type: 'shot' as const,
      position: { x: 1, y: i * 96 },
      data: { title: shot.actionSummary || `分镜 ${shot.index}`, subtitle: shot.dialogue || shot.visualDescription, refId: shot.id, status: 'idle' as const },
    }));

    const edges = project.shots
      .map((shot) => ({
        id: `edge-${shot.sceneRefId}-${shot.id}`,
        source: `scene-${shot.sceneRefId}`,
        target: `shot-${shot.id}`,
      }))
      .filter((edge) => sceneNodes.some((n) => n.id === edge.source));

    return { nodes: [...sceneNodes, ...shotNodes], edges };
  }, [project]);

  useEffect(() => {
    setGraph(projected.nodes, projected.edges);
  }, [projected, setGraph]);

  if (!project) {
    return <div className="h-full p-4 text-sm text-muted-foreground">请先选择项目。</div>;
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="mb-3 text-xs text-muted-foreground">Canvas MVP · Scene/Shot 投影视图（只读）</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs font-medium">场景与分镜节点</div>
          {nodes.map((node) => (
            <CanvasNodeCard key={node.id} node={node} selected={selectedNodeId === node.id} onClick={() => selectNode(node.id)} />
          ))}
          {nodes.length === 0 && <div className="text-sm text-muted-foreground">暂无可投影数据。</div>}
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs font-medium mb-2">连线关系</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            {projected.edges.map((edge) => (
              <div key={edge.id}>{edge.source} → {edge.target}</div>
            ))}
            {projected.edges.length === 0 && <div>暂无连线。</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
