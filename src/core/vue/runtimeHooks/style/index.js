import {handleJsExpression} from "../../../utils";

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