import {handleJsExpression} from "../../../utils";

// 将 vnode.attrs 中的 :style 转换为可以被直接赋值给 dom.style.cssText 的字符串, 时机要放在 $vnode 创建之后也就是 _render 之后
function handleVNodeStyle(vm, vnode) {
    if (!vnode) {
        return;
    }
    const attrs = vnode.attrs; //[{name: '', value: ''}];
    if (!Array.isArray(attrs)) {
        return;
    }
    const staticStyle = vnode.staticStyle && vnode.staticStyle.trim();
    let customStyle = '';
    if (staticStyle) {
        customStyle = `${staticStyle}${staticStyle.endsWith(';') ? '' : ';'}`;
    }
    attrs.forEach(attr => {
        const { name, value } = attr;
        if (name !== ':style') {
            return;
        }
        // 动态 style 有 2 种格式
        // 1. 字符串 :style="color: red"
        // 2. 对象 :style="{color: 'red', background: this.flag ? 'blue' : 'orange'}"
        try {
            const result = handleJsExpression(vm, value);
            if (typeof result === 'string') {
                customStyle += result;
                return;
            }

            if (typeof result === 'object' && result !== null) {
                Object.entries(result).forEach(([key, value]) => {
                    customStyle += `${key}:${value};`;
                });
            }
        } catch (e) {
            console.error('handleVNodeStyle error', e);
        }
    })
    vnode.style = customStyle.trim();

    // 还需要将 vnode.attrs 里面 :style 这个属性去掉，避免重复赋值, vnode.attrs = [{name: ':style', value: '{color: red}'}]
    const index = vnode.attrs.findIndex(item => item.name === ':style');
    if (index > -1) {
        vnode.attrs.splice(index, 1);
    }

    // 递归遍历 children 实现 style 的 normalize 过程
    if (Array.isArray(vnode.children)) {
        vnode.children.forEach(child => {
            handleVNodeStyle(vm, child);
        })
    }
}

function created(vm) {

}

function beforeMount(vm) {
    handleVNodeStyle(this.$self, this.$vnode);
}

function mounted(vm) {}

function updated(vm) {}

function beforeUpdate(vm) {
    handleVNodeStyle(this.$self, this.$vnode);
}

function destroyed(vm) {
}

function  beforeDestroy(vm) {}

export default {
    created,
    updated,
    beforeUpdate,
    destroyed,
    beforeDestroy,
    beforeMount,
    mounted
}