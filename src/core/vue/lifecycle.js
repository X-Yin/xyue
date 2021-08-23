export function callHook(vm, hookName) {
    vm[hookName]();
}

export function lifecycleMixin(vm) {
    vm.prototype._mount = function() {
        callHook(this, 'created');

    }
}