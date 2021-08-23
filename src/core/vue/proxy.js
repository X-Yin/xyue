
export function proxyMixin(vm) {
    vm.$self = new Proxy(vm, {
        get(target, key, receiver) {
            const keys = ['methods', 'computed', 'data'];
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                if (target[k][key]) {
                    return target[k][key];
                }
            }
            for (let i = 0; i < target.props.length; i++) {
                const k = target.props[i];
                if (k === key && target.$parent && target.$parent.$self[k]) {
                    return target.$parent.$self[k];
                }
            }
            return target[key];
        }
    });
}