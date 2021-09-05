import parse from "../compile";
import VNode, {cloneVNode} from './vnode';
import { genRenderFn } from "../render";
import {callHook} from "./lifecycle";
// 封装 createElement 函数

export function createTextVNode(text) {
    return new VNode('text', this, {}, [], 3, text);
}

export function createElement(tag, attrs, children) {
    return new VNode(tag, this, attrs, children, 1, null);
}

export function createListVNode(tag, dataKey, attrs, children) {
    const arr = this.$self[dataKey];
    if (!arr) {
        throw new Error(dataKey + ' does not exist on ' + this);
    }
    // 这个地方有大坑
    // 因为 render 函数中 _l 是这么写的
    // ..._l(
    //         'li',
    //         'array',
    //         {staticClass: '', staticStyle: '', events: {}, attrs: []},
    //         [_t('{{name}}')]
    // )
    // 这里 _t 创建的 children 其实是同一个 vnode，所以这里循环创建的 children 其实是同一个 vnode 实例，后面在进行 patch 的时候，会出现 bug
    // 对于 children 的处理要 clone 创建，而不能直接赋值
    return arr.map(item => {
        return new VNode(tag, this, attrs, cloneVNode(children), 1, null);
    });
}

export function createIfVNode(tag, dataKey, attrs, children) {
    const flag = this.$self[dataKey];
    if (flag) {
        return new VNode(tag, this, attrs, children, 1, null);
    }
    return null;
}

// 梳理 vnode 父子关系
export function handleVNodeRelationship(vnode) {
    const children = vnode.children || [];
    children.forEach(item => {
        item.$parent = vnode;
        handleVNodeRelationship(item);
    });
    return vnode;
}

export function renderMixin(Vue) {
    Vue.prototype._c = createElement;
    Vue.prototype._l = createListVNode;
    Vue.prototype._t = createTextVNode;
    Vue.prototype._f = createIfVNode;
    Vue.prototype._render = function() {
        const vm = this;
        callHook(vm, 'beforeCreateVNode');
        // $render 是一个 render 函数字符串
        this.$render = genRenderFn(parse(this.template || ''));
        // debugger;
        const fn = new Function(this.$render);
        // 如果之前已经有 $vnode，证明不是第一次渲染，所以要梳理一下先后关系
        // if (this.$vnode) {
        //     debugger;
        //     this.$oldVNode = this.$vnode;
        // }
        const vnode = fn.call(this);
        this.$vnode = handleVNodeRelationship(vnode || {});
        return this.$vnode;
    }
}