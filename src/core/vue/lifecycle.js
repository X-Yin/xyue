import { installHook } from "./runtimeHooks";
import {patch} from "./patch";
import Dep, {pushDepTargetQueue} from "./reactive/dep";
import Watcher from "./reactive/watcher";
import Observer from "./reactive/observer";

export function callHook(vm, hookName) {
    if (typeof vm[hookName] === 'function') {
        vm[hookName]();
        return;
    }

    if (Array.isArray(vm[hookName])) {
        vm[hookName].forEach(hook => {
            hook.call(vm);
        });
    }
}

export function lifecycleMixin(Vue) {
    Vue.prototype.mount = function() {
        return this._mount();
    }

    Vue.prototype._mount = function() {
        const vm = this;
        installHook(vm);

        // 开始给内部的 props 变量赋值
        callHook(vm, 'created');

        const updateComponent = () => {
            vm._update(vm._render());
        }

        const dep = new Dep();
        // 应该是通过 watcher 来触发的，这里暂时先手动触发下
        // updateComponent();

        const observer = new Observer(this.data, dep);
        this.data = observer.data;

        this.$watcher = new Watcher(updateComponent, vm);
    }

    Vue.prototype._update = function(vnode) {
        const vm = this;
        const prevEl = vm.$el;
        // 关于 $oldVNode 和 $vnode 的赋值逻辑放在了 _render 函数里面

        if (vm.isMount) {
            callHook(vm, 'beforeUpdate');
        } else {
            callHook(vm, 'beforeMount');
        }

        vnode.parentEl = vm.$el;

        patch(vm, vm.$oldVNode, vnode);
    }



}