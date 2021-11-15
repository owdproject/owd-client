export class EventEmitter {
  _events: any

  constructor() {
    this._events = {};
  }

  on(name: string, listener: any) {
    if (!this._events[name]) {
      this._events[name] = [];
    }

    this._events[name].push(listener);
  }

  removeListener(name: string, listenerToRemove: any) {
    if (!this._events[name]) {
      throw new Error(`[owd] Can't remove a listener. Event "${name}" doesn't exits.`);
    }

    const filterListeners = (listener: any) => listener !== listenerToRemove;

    this._events[name] = this._events[name].filter(filterListeners);
  }

  emit(name: string, data: any) {
    if (!this._events[name]) {
      throw new Error(`[owd] Can't emit an event. Event "${name}" doesn't exits.`);
    }

    const fireCallbacks = (callback: any) => {
      callback(data);
    };

    this._events[name].forEach(fireCallbacks);
  }
}