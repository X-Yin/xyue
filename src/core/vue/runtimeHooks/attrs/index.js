import { handleJsExpression } from "../../../utils";
// 在 vnode 创建完成以后，需要对所有的动态 attrs 进行一次处理，也就是 v-bind 或者 : 开头的属性
// 比如 :value="componentValue"，在 attrs 中的数据结构是 [{name: ':value', value: 'componentValue'}]
// 需要将 componentValue 转换成真正的 data 中的 componentValue 值，比如说转换成下面这个样子
// [{name: 'value', value: 'hello world'}]，在真正进行 patch 的时候，不需要处理动态的 attrs，所有的动态 attrs 都在 vnode 创建完成以后自动处理
// 因为此时已经可以拿到所有的上下文数据了，props 的 parent 注入是在 beforeVNodeCreate 已经注入过了

function vNodeCreated() {
    const vm = this;
    handleDynamicAttrs(vm, vm.$vnode);
}

function handleDynamicAttrs(vm, vnode) {
    if (!vnode) {
        return;
    }
    if (vnode.componentOptions.isComponent) {
        return;
    }

    const attrs = vnode.attrs;
    if (!Array.isArray(attrs)) {
        return;
    }

    attrs.forEach((attr) => {
        const { name, value } = attr;
        if (name.startsWith(':style')) {
            return;
        }
        if (name.startsWith(':class')) {
            return;
        }
        if (!name.startsWith(':')) {
            return;
        }
        attr.name = name.slice(1);
        attr.value = handleJsExpression(vm.$self, value);
    });

    // 递归处理 children
    const children = vnode.children || [];
    if (!Array.isArray(children)) {
        return;
    }
    children.forEach(child => {
        handleDynamicAttrs(vm, child);
    });
}


export default {
    vNodeCreated
}