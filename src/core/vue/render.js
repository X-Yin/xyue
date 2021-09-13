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

export function createIfVNode(tag, dataKey, attrs, children) {
    const flag = this.$self[dataKey];
    if (flag) {
        return new VNode(tag, this, attrs, children, 1, null);
    }
    return null;
}

/**
 * expression 两种形式
 * item in array
 * (item, index) in array
 * */
export function handleVForExpression(expression) {
    const expReg1 = /^[\s\n\t]*([0-9a-zA-Z-]+)\s+in\s+([0-9a-zA-Z-]+)[\s\t\n]*$/;
    const expReg2 = /^[\s\n\t]*\(\s*([0-9a-zA-Z-]+)\s*,\s*([0-9a-zA-Z-]+)\s*\)\s+in\s+([0-9a-zA-Z-]+)[\s\t\n]*$/;

    let result;
    if (result = expression.match(expReg1)) {
        const itemKey = result[1] || '';
        const dataKey = result[2] || '';
        return {
            itemKey,
            dataKey,
            indexKey: 'index'
        }
    }

    if (result = expression.match(expReg2)) {
        const itemKey = result[1] || '';
        const indexKey = result[2] || '';
        const dataKey = result[3] || '';
        return {
            itemKey,
            dataKey,
            indexKey
        }
    }
    return null;
}

export function createRuntimeContext(context, runtimeContext) {
    return new Proxy(context, {
        get(target, p, receiver) {
            if (typeof runtimeContext[p] === 'undefined') {
                return target[p];
            }
            return runtimeContext[p];
        },
        set(target, p, value, receiver) {
            context[p] = value;
            return true;
        }
    })
}

export function createListVNode(tag, vForExpression, attrs, children) {
    const vForObj = handleVForExpression(vForExpression);
    if (!vForObj) {
        return [];
    }
    const { itemKey, indexKey, dataKey } = vForObj;
    const arr = this.$self[dataKey];
    if (!arr) {
        throw new Error(vForExpression + ' does not exist on ' + this);
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
    return arr.map((item, index) => {
        const obj = {
            [itemKey]: item,
            [indexKey]: index
        };
        this.$self = createRuntimeContext(this.$self, obj);

        // 需要重新注入一遍新的上下文来生成一遍 child
        const newChildren = children.map(child => {
            return new VNode('text', this, {}, [], 3, child.text);
        });

        return new VNode(tag, this, attrs, newChildren, 1, null, obj);
    });
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

// 清除掉 v-if 创建出来为 null 的 child
export function clearNullChild(vnode) {
    if (!vnode) {
        return {};
    }
    const children = vnode.children || [];
    while(children.includes(null)) {
        const index = children.indexOf(null);
        children.splice(index, 1);
    }
    vnode.children = children;
    return vnode;
}

export function renderMixin(Vue) {
    Vue.prototype._c = createElement;
    Vue.prototype._l = createListVNode;
    Vue.prototype._t = createTextVNode;
    Vue.prototype._f = createIfVNode;
    Vue.prototype._render = function() {
        const vm = this;
        callHook(vm, 'beforeVNodeCreate');
        // $render 是一个 render 函数字符串
        const ast = parse(this.template || '');
        this.$render = genRenderFn(ast);
        const fn = new Function(this.$render);
        // 如果之前已经有 $vnode，证明不是第一次渲染，所以要梳理一下先后关系
        // if (this.$vnode) {
        //     debugger;
        //     this.$oldVNode = this.$vnode;
        // }
        const vnode = fn.call(this);
        this.$vnode = handleVNodeRelationship(clearNullChild(vnode) || {});
        callHook(vm, 'vNodeCreated');
        return this.$vnode;
    }
}