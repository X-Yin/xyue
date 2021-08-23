export function callHook(vm, hookName) {
    vm[hookName]();
}

export function lifecycleMixin(vm) {
    vm.prototype.lifecycleMixin = function() {
        callHook(this, 'created');

    }
}