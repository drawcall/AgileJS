const array = [];

export default class EventDispatcher {
  constructor() {
    this._listeners = null;
  }

  addEventListener(type, listener) {
    if (!this._listeners) this._listeners = {};
    if (this._listeners[type] === undefined) this._listeners[type] = [];
    if (this._listeners[type].indexOf(listener) === -1) this._listeners[type].push(listener);
  }

  removeEventListener(type, listener) {
    if (!this._listeners) return;

    const listeners = this._listeners;
    const listenerArray = listeners[type];

    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener);
      if (index !== -1) listenerArray.splice(index, 1);
    }
  }

  dispatchEvent(event) {
    if (!this._listeners) return;

    array.length = 0;
    const listeners = this._listeners;
    const listenerArray = listeners[event.type];

    if (listenerArray !== undefined) {
      event.target = this;

      for (let i = 0; i < listenerArray.length; i++) array[i] = listenerArray[i];
      for (let i = 0; i < listenerArray.length; i++) array[i].call(this, event);
    }
  }
}
