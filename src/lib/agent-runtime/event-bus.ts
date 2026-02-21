export type AgentEvent =
  | { type: 'plan_started'; planId: string; message: string }
  | { type: 'step_started'; planId: string; stepId: string; message: string }
  | { type: 'step_finished'; planId: string; stepId: string; message: string }
  | { type: 'plan_finished'; planId: string; message: string };

type Listener = (event: AgentEvent) => void;

class AgentEventBus {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event: AgentEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

export const agentEventBus = new AgentEventBus();
