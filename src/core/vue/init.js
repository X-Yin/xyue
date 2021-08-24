import { proxyMixin } from "./proxy";

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
        this.$el = document.querySelector(options.el || '');
        this.$id = ++id;
        this.$watch = options.watch || {};
        this.$vnode = {};
        this.$self = null;
        this.$render = '';
        this.$watcher = null;
        this.data = normalizeData(options.data || {});
        this.methods = options.methods || {};
        this.props = options.props || [];
        this.computed = options.computed || {};
        this.template = options.template || (this.$el ? this.$el.outerHTML : '');

        // 在构造函数里面无法给 parent 和 child 赋值，只能在运行时创建 vnode 的时候赋值
        // 因为 props 里面的数据，只有在创建 vnode 的时候才会用到，刚开始初始化构造的时候并用不到这两个值
        this.$parent = null;
        this.$child = null;

        // 2. 对内部属性做一层代理，给 $self 赋值，把 data props computed methods 中的取值进行一层代理
        proxyMixin(this);
    }
}