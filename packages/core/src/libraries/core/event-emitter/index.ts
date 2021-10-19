export class EventEmitter {
  events: any

  constructor() {
    this.events = {};
  }

  on(name: string, listener: any) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push(listener);
  }

  removeListener(name: string, listenerToRemove: any) {
    if (!this.events[name]) {
      throw new Error(`[owd] Can't remove a listener. Event "${name}" doesn't exits.`);
    }

    const filterListeners = (listener: any) => listener !== listenerToRemove;

    this.events[name] = this.events[name].filter(filterListeners);
  }

  emit(name: string, data: any) {
    if (!this.events[name]) {
      throw new Error(`[owd] Can't emit an event. Event "${name}" doesn't exits.`);
    }

    const fireCallbacks = (callback: any) => {
      callback(data);
    };

    this.events[name].forEach(fireCallbacks);
  }
}