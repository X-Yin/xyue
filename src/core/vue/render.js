
// 封装 createElement 函数

export function createTextVNode(text) {

}

export function createElement(tag, attrs, children) {}

export function createListVNode(tag, dataKey, attrs, children) {}

export function createIfVNode(tag, dataKey, attrs, children) {}


export function renderMixin(vm) {
    vm.prototype._render = function() {
    }
}