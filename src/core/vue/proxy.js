
export function proxyMixin(vm) {
    vm.prototype.proxyMixin = function() {
        this.$self = new Proxy(this, {
            get(target, key, receiver) {
                const keys = ['methods', 'props', 'data'];
                for (let i = 0; i < keys.length; i++) {
                    if (target[i][key]) {
                        return target[i][key];
                    }
                }
                return target[key];
            }
        });
    }
}