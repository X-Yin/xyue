import { LifeCycleHooks } from "../../constants";
import attrHooks from './attrs';
import eventHooks from './events';
import styleHooks from './style';

/**
 * hooks 是跟随 vm 组件实例的生命周期函数所增加的各种行为
 * vm 组件实例中，真正的 created, updated, beforeMount, mounted, beforeUpdate, beforeDestroy, destroyed 都是数组的形式
 * */

const installDefaultHooks = [attrHooks, styleHooks, eventHooks,];

export function installHook(vm) {
    const customHooks = {};
    LifeCycleHooks.forEach(hook => {
        if (vm.options[hook]) {
            customHooks[hook] = vm.options[hook];
        }
    });
    const prepareInstallHooks = [...installDefaultHooks, customHooks];
    console.log(prepareInstallHooks);
    LifeCycleHooks.forEach(lifecycleHook => {
        if (!Array.isArray(vm[lifecycleHook])) {
            vm[lifecycleHook] = [];
        }
    });
    prepareInstallHooks.forEach(hooks => {
        Object.entries(hooks).forEach(([hookName, callback]) => {
            vm[hookName].push(callback.bind(vm.$self));
        });
    })
}


