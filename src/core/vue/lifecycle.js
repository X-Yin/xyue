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

/**
 * 各个生命周期应该做什么事情
 * created 组件内部实例的各个属性的初始化，比如说 class、style、props 等，将模板变量中的字符串和 vm 中的数据一一对应起来
 * beforeMount vnode 和 dom 元素已经创建完成，但是还没有挂载到页面上
 * mounted dom 元素已经挂载到页面上
 * beforeUpdate 开始更新前的时候，组件内部的数据已经更新，但是页面还没有更新
 * updated 页面上的 dom 元素也发生了更新
 * beforeDestroy 组件开始销毁之前
 * destroyed 组件已经销毁之后
 * */

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

        // const el = patch(vnode);
        // if (!(prevEl instanceof HTMLElement)) {
        //     vm.$el = el;
        // }
        // patch 只返回当前组件 vnode 生成的 dom，至于后面的 dom 要如何挂载到页面上，还是在这个 _update 里面处理
        // 如果之前有 $el 比如 App 组件，那就 replaceChild
        // 如果之前没有 $el 比如 MyButton 组件，那就赋值 vm.$el = patch(vnode)，并且 vm.$parentEl.appendChild(this.$el);

        // const dom = patch(vnode);
        patch(vm, vm.$oldVNode, vnode);
        // if (prevEl) { // App 组件，el 是 div#app 真实存在于页面上
        //     prevEl.parentNode.replaceChild(dom, prevEl);
        // } else { // MyButton 组件，并不是真实存在于页面上
        //     vm.$parentEl.appendChild(dom);
        // }
        // vm.$el = dom;
    }



}