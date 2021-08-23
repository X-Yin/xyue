import { lifecycleMixin } from "./lifecycle";

let id = 0;

function normalizeData(data) {
    if (typeof data === 'function') {
        return data();
    }
    return data;
}

export function initMixin(vm) {
    vm.prototype._init = function(options) {
        // 1. 初始化参数
        this.$template = options.template || '';
        this.$el = options.el || '';
        this.$id = ++id;
        this.$watch = options.watch || {};
        this.$vnode = {};
        this.$self = null;
        this.$render = '';
        this.$watcher = null;
        this.data = normalizeData(options.data || {});
        this.methods = options.methods || {};
        this.props = options.props || [];

        // 这两个只能在递归循环的时候赋值，在构造函数里面无法给 parent 和 child 赋值
        this.$parent = null;
        this.$child = null;

        // 2. 生命周期
    }
}