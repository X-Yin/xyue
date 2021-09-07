
// 用于创建每个组件的 eventBus
import {normalizeTagName} from "../utils";

export function eventMixin(Vue) {
    Vue.prototype._events = {};
    
    Vue.prototype.emit = function(eventName, ...args) {
        // 这个 emit 是向父组件通信的时候使用，所以这里触发的是父组件实例的 $emit
        const vm = this;
        if (vm.$parentVm) {
            vm.$parentVm.$emit(eventName, ...args);
        }
    }

    Vue.prototype.$on = function(eventName, cb) {
        eventName = normalizeTagName(eventName);
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

    Vue.prototype.$emit = function(eventName, ...args) {
        if (!eventName) {
            throw new Error('_on Unexpected eventName params!');
        }
        eventName = normalizeTagName(eventName);
        if (Array.isArray(this._events[eventName])) {
            this._events[eventName].forEach(cb => {
                cb(...args);
            })
        }
    }

    Vue.prototype.$off = function(eventName, cb) {
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