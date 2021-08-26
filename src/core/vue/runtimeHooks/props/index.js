
function created() {
    const vm = this;
    // 将 parent 的值和 props 中的值一一对应起来
    // 然后把 props 中的这些 key 值赋值到 vm 实例中去
    // 但是在 set 函数中，如果修改的是 props 中的 key，需要发出警告
    if (!vm.$parent) {
        return;
    }
    if (Array.isArray(vm.props)) {
        vm.props.forEach(key => {
            const val = vm.$parent.$self[key];
            Object.assign(vm.$props, {[key]: val});
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

export default {
    created
}
