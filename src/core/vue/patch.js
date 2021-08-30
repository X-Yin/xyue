import {
	appendChild,
	clearChildrenList,
	createDocumentFragment,
	createDocumentNode,
	createTextNode,
	handleJsExpression,
	normalizeTagName
} from "../utils";
import { NativeDomEventKeyList } from "../config";

export function patch(oldVNode, newVNode) {
	if (!newVNode) {
		const childDom = vNode2Dom(oldVNode);
		clearChildrenList(oldVNode.parentEl);
		appendChild(oldVNode.parentEl, childDom);
	}
}

// 将一个 vnode 树转换为 dom
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
	const el = createDocumentFragment();
	options.el = el;
	options.parentVnode = vnode; // 把当前的组件占位 vnode 赋值给组件的 $parentVnode 属性，为后面 props 的解析和父子组件通信用
	const Ctor = vnode.vm.Ctor;
	const componentInstance = new Ctor(options);
	componentInstance.$parent = vnode.vm;
	componentInstance._mount();
	return el;
}

export function normalVNode2Dom(vnode) {
	const tag = vnode.tag;

	if (vnode.type === 3) {
		const dom = createTextNode(vnode.data);
		vnode.el = dom;
		return dom;
	}

	const dom = createDocumentNode(tag);
	vnode.el = dom;
	// 处理 css
	if (vnode.style) {
		dom.style.cssText = vnode.style;
	}

	// 处理 className
	if (vnode.class) {
		dom.className = vnode.class;
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
