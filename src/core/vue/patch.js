import {
	appendChild,
	clearChildrenList,
	createDocumentFragment,
	createElement,
	createTextNode,
	handleJsExpression,
	normalizeTagName,
	replaceNode
} from "../utils";
import { NativeDomEventKeyList } from "../config";
import { compareVNode } from "./vnode";

function _patch(vm, oldVNode, newVNode) {
	if (!newVNode) {
		// const childDom = vNode2Dom(oldVNode);
		// console.log('>>> childDom is', childDom);
		// return childDom;
		return vNode2Dom(oldVNode);
	}
	return diff(oldVNode, newVNode);
}

export function patch(vm, oldVNode, newVNode) {
	if (!newVNode) { // 说明是第一次挂载，是 mount 的逻辑，而不是 update 的逻辑
		const dom = _patch(vm, oldVNode, newVNode);
		const prevEl = vm.$el;
		vm.$oldVNode = oldVNode;
		if (prevEl) { // App 组件，el 是 div#app 真实存在于页面上
			prevEl.parentNode.replaceChild(dom, prevEl);
		} else { // MyButton 组件，并不是真实存在于页面上
			vm.$parentEl.appendChild(dom);
		}
		vm.$el = dom;
		vm.isMount = true;
	} else { // 说明不是第一次挂在，是 update 的逻辑，不走 appendChild 或者是 replaceChild 的逻辑，而是走 diff 然后替换的逻辑
		_patch(vm, oldVNode, newVNode);
	}

}

export function diff(vm, oldVNode, newVNode) {
	// 普通 text 元素不一样 vnode2dom 然后替换
	// 普通其他元素不一样，vnode2dom 然后替换
	// my-button 元素不一样
	// 先判断占位组件 vnode 是不是一样，比如 <my-button :message='hello'> 和 <my-button-1 :message='base'>，这种不一致，就直接 vnode2dom 创建一个新的组件，然后替换
	// 如果占位组件 vnode 的 tag 一致，attrs 也一致，需要触发 oldVNode.vm.$watcher.update 这个函数，让子组件内部实现 diff 逻辑才行
	const isEqual = compareVNode(oldVNode, newVNode);
	if (!isEqual) {
		if (newVNode.tag === 'text') {
			const newDom = createTextNode(newVNode.data);
			replaceNode(newDom, oldVNode.el);
		}
	}
}

// 将一个 vnode 树转换为 dom，这种情况下，只有在完全替换某个 dom 元素的时候，才需要用到
export function vNode2Dom(vnode) {
	const tag = vnode.tag;
	if (!vnode.tag) {
		throw new Error('VNode2Dom Unexpected params tag ' + vnode.tag);
	}
	if (vnode.componentOptions.isComponent) {
		return componentVNode2Dom(vnode);
	}
	return normalVNode2Dom(vnode);
}

export function componentVNode2Dom(vnode) {
	const options = vnode.componentOptions.options;
	options.parentEl = vnode.$parent.el;
	options.parentVnode = vnode;
	const Ctor = vnode.vm.Ctor;
	const componentInstance = new Ctor(options);
	componentInstance.$parent = vnode.vm;
	componentInstance._mount();
	vnode.el = componentInstance.$el;
	return componentInstance.$el;
}

export function normalVNode2Dom(vnode) {
	const tag = vnode.tag;

	if (vnode.type === 3) {
		const dom = createTextNode(vnode.data);
		vnode.el = dom;
		return dom;
	}

	const dom = createElement(tag);
	vnode.el = dom;
	// 处理 css
	if (vnode.style) {
		dom.style.cssText = vnode.style;
	}

	// 处理 className
	if (vnode.class) {
		dom.className = vnode.class;
	}

	// 处理 attrs
	if (Array.isArray(vnode.attrs)) {
		vnode.attrs.forEach(({name, value}) => {
			if (name.startsWith(':')) {
				value = handleJsExpression(vnode.vm.$self, value);
				name = name.slice(1);
			}
			vnode.el.setAttribute(name, value);
		})
	}

	// 处理 event
	addEvent(vnode);

	// 递归处理 children
	vnode.children.forEach(child => {
		const node = vNode2Dom(child);
		node.parentEl = dom;
		appendChild(dom, node);
	});
	return dom;
}

export function addEvent(vnode) {
	const dom = vnode.el;
	const events = vnode.events || {}; //{click: 'clickHandler'}
	Object.entries(events).forEach(([name, value]) => {
		if (NativeDomEventKeyList.includes(name)) {
			const cb = handleJsExpression(vnode.vm.$self, value);
			// TODO addEventListeners 的 options
			dom.addEventListener(name, cb.bind(vnode.vm.$self));
		}
	});
}
