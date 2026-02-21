import { DirectorCanvas } from '@/components/canvas/DirectorCanvas';
import { CanvasInspector } from '@/components/canvas/CanvasInspector';
import { CommandBar } from '@/components/canvas/CommandBar';

export function CanvasView() {
  return (
    <div className="h-full flex flex-col">
      <CommandBar />
      <div className="flex-1 grid grid-cols-[1fr_300px] min-h-0">
        <DirectorCanvas />
        <div className="border-l border-border bg-panel">
          <CanvasInspector />
        </div>
      </div>
    </div>
  );
}
