import {handleJsExpression} from "../../../utils";

function created() {

}

// 将 vnode.attrs 中的动态的 :class 转换为可以被直接赋值给 className 的字符串，时机要放在 $vnode 创建之后也就是 _render 之后
function handleVNodeClass(vm, vnode) {
    if (!vnode) {
        return;
    }
    const attrs = vnode.attrs; //[{name: '', value: ''}];
    if (!Array.isArray(attrs)) {
        return;
    }
    const staticClass = vnode.staticClass && vnode.staticClass.trim();
    let customClass = `${staticClass} `;
    attrs.forEach(attr => {
        const { name, value } = attr;
        if (name !== ':class') {
            return;
        }
        // 动态 class 有三种格式
        // 1. 字符串 :class="container"
        // 2. 数组 :class="['container', this.flag ? 'active' : '']"
        // 3. 对象 :class="{container: true, active: this.flag}"
        try {
            const result = handleJsExpression(vm, value);
            if (typeof result === 'string') {
                customClass += result;
                return;
            }

            if (Array.isArray(result)) {
                result.forEach(item => {
                    customClass += `${item} `;
                });
                return;
            }

            if (typeof result === 'object' && result !== null) {
                Object.entries(result).forEach(([key, value]) => {
                    if (value) {
                        customClass += `${key} `;
                    }
                });
            }
        } catch (e) {
            console.error('handleVNodeClass error', e);
        }
    })
    vnode.class = customClass.trim();
    // 将 vnode.attrs 里面的 :class 给去掉，避免重复赋值，vnode.attrs 的格式 [{name: ':class', value: '["container", flag ? "a" : "b"]'}]
    const index = vnode.attrs.findIndex(item => item.name === ':class');
    if (index > -1) {
        vnode.attrs.splice(index, 1);
    }

    // 递归遍历 children，实现 class 的 normalize 过程
    if (Array.isArray(vnode.children)) {
        vnode.children.forEach(child => {
            handleVNodeClass(vm, child);
        })
    }
}

function beforeMount() {
    handleVNodeClass(this.$self, this.$vnode);
}

function mounted(vm) {}

function updated(vm) {}

function beforeUpdate(vm) {
    handleVNodeClass(this.$self, this.$vnode);
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
    mounted,
    beforeMount
}