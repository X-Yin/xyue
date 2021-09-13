import { LifeCycleHooks } from "../../constants";
import classHooks from './classes';
import eventHooks from './events';
import styleHooks from './style';
import propsHooks from './props';
import attrsHooks from './attrs';

/**
 * hooks 是跟随 vm 组件实例的生命周期函数所增加的各种行为
 * vm 组件实例中，真正的 beforeCreate, created, updated, beforeMount, mounted, beforeUpdate, beforeDestroy, destroyed 都是数组的形式
 * */

const installDefaultHooks = [propsHooks, classHooks, styleHooks, eventHooks, attrsHooks];

export function installHook(vm) {
    const customHooks = {};
    LifeCycleHooks.forEach(hook => {
        if (vm.options[hook]) {
            customHooks[hook] = vm.options[hook];
        }
    });
    const prepareInstallHooks = [...installDefaultHooks, customHooks];
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


