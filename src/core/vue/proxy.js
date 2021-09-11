function includeKey(data = {}, key) {
    let isInclude = false;
    const obj = data || {};
    Object.entries(obj).forEach(([k, val]) => {
        if (key === k) {
            isInclude = true;
        }
    });
    return isInclude;
}

export function proxyMixin(vm) {
    vm.$self = new Proxy(vm, {
        get(target, key, receiver) {
            const keys = ['methods', 'computed', 'data', '$props'];
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                if (typeof target[k][key] !== 'undefined') {
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
        },
        set(target, key, value, receiver) {
           // 对于 props 的属性的赋值需要做一层拦截
            const isProp = includeKey(target.$props, key);
            if (isProp) {
                throw new Error('can not set props value in child component ' + key);
            }

            const isData = includeKey(target.data, key);
            if (isData) {
                target.data[key] = value;
            }
            return true;
        }
    });
}