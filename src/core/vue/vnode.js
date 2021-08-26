import { isEqual } from "../utils";
/**
 * vnode 类的定义
 * tag: div | my-button
 * id 自动生成
 * class: 'container' | "['container', flag ? 'active' : '']" | "{container: true, active: flag}" html 中解析出来的原生的结果
 * style: 'color: red' 只支持静态字符串的写法，或者绑定 data 与 props 中的字段
 * children: [vnode, vnode]
 * parent: vnode
 * classes: [{name: ':msg', value: 'msg'}, {name: 'autoplay', value: 'true'}]
 * $vm: vm.$self
 * type: 1 | 3
 * data: 在 type 为 3 的时候是静态文本的内容
 * */
let id = 0;

class VNode {
    constructor(tag, vm, attrs, children, type, data) {
        this.tag = tag;
        this.id = ++id;
        this.children = children;
        this.parent = null;
        this.staticClass = attrs.staticClass;
        this.staticStyle = attrs.staticStyle;
        this.attrs = attrs.attrs;
        this.events = attrs.events;
        this.$vm = vm.$self;
        this.type = type;
        this.data = data;
        this.options = vm.options;
        // 用来标记是不是组件 vnode，如果是组件 vnode 的话，在后面的 patch 过程中，会递归的去执行该组件的 mount 方法，然后进行 compile 和 render 的过程
        this.isComponent = !!vm.$self.components[tag]; //
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

export default VNode;