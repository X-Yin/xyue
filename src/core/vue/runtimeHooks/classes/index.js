import {handleJsExpression} from "../../../utils";

function created() {

}

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