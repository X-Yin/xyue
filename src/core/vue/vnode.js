import {handleDynamicExpression, isEqual, normalizeTagName} from "../utils";
/**
 * vnode 类的定义
 * tag: div | mybutton
 * id 自动生成
 * staticClass：静态的 class 类名，都是纯字符串 'container wrapper'
 * staticStyle：静态的 style，都是纯字符串，比如 'font-size: 20px;color:red;'
 * attrs: 所有的属性，包括 :class 和 :style 等
 * children: [vnode, vnode]
 * el: 当前的 dom 元素
 * parent: vnode
 * parentEl: 父级 dom 元素
 * classes: [{name: ':msg', value: 'msg'}, {name: 'autoplay', value: 'true'}]
 * events: {'click': 'clickHandler'}
 * $vm: vm.$self
 * type: 1 | 3
 * data: 在 type 为 3 的时候是静态文本的内容
 * componentsOptions: {isComponent: false | true, options?: {}}
 * */
let id = 0;

class VNode {
    constructor(tag, vm, attrs, children, type, data) {

        const { staticClass = '', staticStyle = '', attrs: attributes = {}, events = {} } = attrs || {};

        this.tag = normalizeTagName(tag);
        this.id = ++id;
        this.children = children;
        this.el = null;
        this.parent = null; // vm._render 创建时会梳理父子关系并赋值
        this.parentEl = null; // 在 patch 渲染时会赋值
        this.staticClass = staticClass;
        this.staticStyle = staticStyle;
        this.attrs = attributes;
        this.events = events;
        this.vm = vm;
        this.type = type;
        if (this.type === 3) {
            this.data = this.handleDynamicText(data);
        }
        this.options = vm.options;
        // 用来标记是不是组件 vnode，如果是组件 vnode 的话，在后面的 patch 过程中，会递归的去执行该组件的 mount 方法，然后进行 compile 和 render 的过程
        // 这个 componentOptions 里面有两个字段一个是 isComponent 用来标记是不是组件，如果为 true 的话，会把这个组件的 options 选项给赋值
        this.componentOptions = this.getComponentOptions();
    }

    getComponentOptions() {
        const components = {};
        Object.assign(components, this.vm.Ctor.components || {}, this.vm.components);
        const componentKeys = Object.keys(components);
        for (let i = 0; i < componentKeys.length; i++) {
            const componentKey = componentKeys[i];
            if (normalizeTagName(componentKey) === normalizeTagName(this.tag)) {
                return {
                    isComponent: true,
                    options: components[componentKey]
                };
            }
        }
        return {
            isComponent: false
        };
    }

    handleDynamicText(data) {
        return handleDynamicExpression(this.vm.$self, data);
    }
}

// 只负责提供比较当前两个 vnode 属性的工具函数，child 的递归对比逻辑不在这里
export function compareVNode(oldVNode, newVNode) {
    if (!newVNode) {
        return false;
    }
    if (!oldVNode) {
        throw new Error('Unexpected params ' + oldVNode);
    }
    // 对比 tag class style classes events type data 等
    if (!isEqual(newVNode.tag, oldVNode.tag)) {
        return false;
    }

    if (!isEqual(newVNode.type, oldVNode.type)) {
        return false;
    }

    if (!isEqual(oldVNode.data, newVNode.data)) {
        return false;
    }

    if (!isEqual(newVNode.class, oldVNode.class)) {
        return false;
    }

    if (!isEqual(newVNode.style, oldVNode.style)) {
        return false;
    }

    if (!isEqual(newVNode.attrs, oldVNode.attrs)) {
        return false;
    }

    if (!isEqual(newVNode.events, oldVNode.events)) {
        return false;
    }

    return true;
}

// 将 newVNode 的属性赋值给 oldVNode，但是不替换 oldVNode 的堆地址
export function replaceVNode(oldVNode, newVNode) {
    const keys = ['tag', 'children', 'id', 'staticClass',
        'staticStyle', 'attrs', 'events', 'vm', 'type', 'data', 'options', 'componentOptions'];
    keys.forEach(key => {
        oldVNode[key] = newVNode[key];
    });
    return oldVNode;
}

export function cloneVNode(oldVNode) {
    if (Array.isArray(oldVNode)) {
        return oldVNode.map(vnode => {
            return cloneVNode(vnode);
        });
    }
    const children = (oldVNode.children || []).map(child => {
        return cloneVNode(child);
    });

    return new VNode(oldVNode.tag, oldVNode.vm, oldVNode.attrs, children, oldVNode.type, oldVNode.data);
}

export default VNode;