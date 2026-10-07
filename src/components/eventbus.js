const listeners = {};

const EventBus = {
  $on(event, callback) {
    (listeners[event] = listeners[event] || []).push(callback);
  },
  $off(event, callback) {
    listeners[event] = (listeners[event] || []).filter(cb => cb !== callback);
  },
  $emit(event, ...args) {
    (listeners[event] || []).forEach(cb => cb(...args));
  }
};

export default EventBus;
