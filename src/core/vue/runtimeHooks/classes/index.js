
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
    const staticClass = vnode.staticClass;
    const customClass = '';
    attrs.forEach(attr => {
        const { name, value } = attr;
        if (name === ':class') {
            // 动态的 class 有三种写法
            // 1. 普通的字符串 :class="container"
            // 2. 数组 :class="['container', flag ? 'active' : '']"
            // 3. 对象 :class="{container: true, active: flag}"
            try {
                const val = JSON.parse(value);
                if (Array.isArray()) {}
            } catch (e) {

            }
        }
    })

}

function beforeMount() {
    const vnode = this.$vnode;

}

function mounted(vm) {}

function updated(vm) {}

function beforeUpdate(vm) {}

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