import { installHook } from "./runtimeHooks";

export function callHook(vm, hookName) {
    if (vm[hookName]) {
        vm[hookName]();
    }
}

export function lifecycleMixin(vm) {
    vm.prototype._mount = function() {
        installHook(this);
        // 开始给内部的变量赋值
    }
}