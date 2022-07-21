let activeEffect;

const watchEffect = (fn) => {
  activeEffect = fn;
  fn();
  activeEffect = null;
};

class Dependency {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    !!activeEffect && this.subscribers.add(activeEffect);
  }

  notify() {
    this.subscribers.forEach((subscriber) => subscriber());
  }
}

const reactive = (stateObj) => {
  Object.entries(stateObj).forEach(([stateObjKey, stateObjValue]) => {
    const dependency = new Dependency();
    let oldValue = stateObjValue;

    Object.defineProperty(stateObj, stateObjKey, {
      get() {
        dependency.depend();
        return oldValue;
      },

      set(newValue) {
        if (newValue !== oldValue) {
          oldValue = newValue;
          dependency.notify();
        }
      }
    });
  });

  return stateObj;
};