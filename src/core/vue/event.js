
// 用于创建每个组件的 eventBus
export function eventMixin(vm) {
    vm.prototype._events = {};

    vm.prototype._on = function() {}

    vm.prototype._off = function() {}

}