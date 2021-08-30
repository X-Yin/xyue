
function handleProps(vm) {
    // 将 parent 的值和 props 中的值一一对应起来
    // 然后把 props 中的这些 key 值赋值到 vm 实例中去
    // 但是在 set 函数中，如果修改的是 props 中的 key，需要发出警告
    if (!vm.$parent) {
        return;
    }
    if (Array.isArray(vm.props)) {
        vm.props.forEach(key => {
            const parentAttrs = vm.$parentVnode.attrs || []; //[{name: ':msg', value: 'message'}]
            parentAttrs.forEach(item => {
                const {name, value} = item;
                if (name.startsWith(':')) {
                    const k = name.slice(1); // name 是 :msg
                    if (k === key) {
                        const val = vm.$parent.$self[value];
                        Object.assign(vm.$props, {[key]: val});
                    }
                }
            });
        });
        return;
    }

    if (typeof vm.props === 'object') {
        Object.entries(vm.props).forEach(([key, val]) => {
            const value = vm.$parent.$self[key];
           Object.assign(vm.$props, {[val]: value});
        });
    }
}

export function created() {
    handleProps(this);
}

export function beforeMount() {
    // handleProps(this)
}

export function beforeUpdate() {
    // handleProps(this);
}

export default {
    created,
    beforeMount,
    beforeUpdate
}
