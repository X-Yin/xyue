import parse from "../compile";
import VNode from './vnode';
import { genRenderFn } from "../render";
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
    return arr.map(item => {
        return new VNode(tag, this, attrs, children, 1, null);
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

export function renderMixin(vm) {
    vm.prototype._c = createElement;
    vm.prototype._l = createListVNode;
    vm.prototype._t = createTextVNode;
    vm.prototype._f = createIfVNode;
    vm.prototype._render = function() {
        // $render 是一个 render 函数字符串
        this.$render = genRenderFn(parse(this.template || ''));
        const fn = new Function(this.$render);
        // 如果之前已经有 $vnode，证明不是第一次渲染，所以要梳理一下先后关系
        if (this.$vnode) {
            this.$oldVNode = this.$vnode;
        }
        this.$vnode = handleVNodeRelationship(fn.call(this) || {});
        return this.$vnode;
    }
}