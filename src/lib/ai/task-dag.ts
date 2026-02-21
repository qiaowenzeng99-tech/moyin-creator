export interface DagNode {
  id: string;
  deps: string[];
}

export function topoSort(nodes: DagNode[]): string[] {
  const inDegree = new Map<string, number>();
  const graph = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, node.deps.length);
    graph.set(node.id, []);
  }

  for (const node of nodes) {
    for (const dep of node.deps) {
      const arr = graph.get(dep) || [];
      arr.push(node.id);
      graph.set(dep, arr);
    }
  }

  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const sorted: string[] = [];
  while (queue.length) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const next of graph.get(current) || []) {
      const deg = (inDegree.get(next) || 0) - 1;
      inDegree.set(next, deg);
      if (deg === 0) queue.push(next);
    }
  }

  if (sorted.length !== nodes.length) {
    throw new Error('DAG contains cycle');
  }

  return sorted;
}
