
function isPropsKey(target, key) {
    let isProp = false;
    const props = target.$props || {};
    Object.entries(props).forEach(([k, val]) => {
        if (key === k) {
            isProp = true;
        }
    });
    return isProp;
}

export function proxyMixin(vm) {
    vm.$self = new Proxy(vm, {
        get(target, key, receiver) {
            const keys = ['methods', 'computed', 'data', '$props'];
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
        },
        set(target, key, value, receiver) {
           // 对于 props 的属性的赋值需要做一层拦截
            const isProp = isPropsKey(target, key);
            if (isProp) {
                throw new Error('can not set props value in child component ' + key);
            }
            return true;
        }
    });
}