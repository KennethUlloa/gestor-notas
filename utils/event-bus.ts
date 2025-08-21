type Listener<T = any> = (payload: T) => void;

class EventBus {
  private listeners: Record<string, Listener[]> = {};

  subscribe(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit<T = any>(event: string, payload: T) {
    (this.listeners[event] || []).forEach(callback => callback(payload));
  }
}

export const eventBus = new EventBus();
