
// 用于创建每个组件的 eventBus
export function eventMixin(vm) {
    vm.prototype._events = {};

    vm.prototype.$on = function(eventName, cb) {
        if (!eventName) {
            throw new Error('_on Unexpected eventName params!');
        }
        if (!cb) {
            throw new Error('_on Unexpected callback params');
        }
        if (Array.isArray(this._events[eventName])) {
            this._events[eventName].push(cb);
        } else {
            this._events[eventName] = [cb];
        }
    }

    vm.prototype.$emit = function(eventName, ...args) {
        if (!eventName) {
            throw new Error('_on Unexpected eventName params!');
        }
        if (Array.isArray(this._events[eventName])) {
            this._events[eventName].forEach(cb => {
                cb(...args);
            })
        }
    }

    vm.prototype.$off = function(eventName, cb) {
        if (!eventName) {
            throw new Error('_on Unexpected eventName params!');
        }
        if (!cb) {
            throw new Error('_on Unexpected callback params');
        }
        if (Array.isArray(this._events[eventName])) {
            const index = this._events[eventName].findIndex(item => item === cb);
            this._events[eventName].splice(index, 1);
        }
    }

}