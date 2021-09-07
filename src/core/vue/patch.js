import {
	appendChild,
	clearChildrenList,
	createDocumentFragment,
	createElement,
	createTextNode,
	handleJsExpression,
	normalizeTagName, removeChild,
	replaceNode
} from "../utils";
import { NativeDomEventKeyList } from "../config";
import {compareVNode, replaceVNode} from "./vnode";
import component from "./global/component";
import {callHook} from "./lifecycle";

function _patch(vm, oldVNode, newVNode) {
	if (!oldVNode) {
		// const childDom = vNode2Dom(oldVNode);
		// console.log('>>> childDom is', childDom);
		// return childDom;
		return vNode2Dom(newVNode);
	}
	return diff(vm, oldVNode, newVNode);
}

export function patch(vm, oldVNode, newVNode) {
	if (!oldVNode) { // 说明是第一次挂载，是 mount 的逻辑，而不是 update 的逻辑
		const dom = _patch(vm, oldVNode, newVNode);
		const prevEl = vm.$el;
		vm.$oldVNode = newVNode;
		if (prevEl) { // App 组件，el 是 div#app 真实存在于页面上
			prevEl.parentNode.replaceChild(dom, prevEl);
		} else { // MyButton 组件，并不是真实存在于页面上
			vm.$parentEl.appendChild(dom);
		}
		vm.$el = dom;
		vm.isMount = true;
		callHook(vm, 'mounted');
	} else { // 说明不是第一次挂载，是 update 的逻辑，不走 appendChild 或者是 replaceChild 的逻辑，而是走 diff 然后替换的逻辑
		const dom = _patch(vm, oldVNode, newVNode);
		callHook(vm, 'updated');
	}

}

/**
 * diff
 * oldVNode !== newVNode
 * vnode2dom(newVNode) 然后直接替换旧的 dom
 * oldVNode = newVNode
 * 1. 如果是组件 vnode，执行 oldVNode 的 updateComponent 逻辑
 * 2. 如果不是组件 vnode，执行 children 的递归遍历
 * */

export function diff(vm, oldVNode, newVNode) {
	// 普通 text 元素不一样 vnode2dom 然后替换
	// 普通其他元素不一样，vnode2dom 然后替换
	// my-button 元素不一样
	// 先判断占位组件 vnode 是不是一样，比如 <my-button :message='hello'> 和 <my-button-1 :message='base'>，这种不一致，就直接 vnode2dom 创建一个新的组件，然后替换
	// 如果占位组件 vnode 的 tag 一致，attrs 也一致，需要触发 oldVNode.vm.$watcher.update 这个函数，让子组件内部实现 diff 逻辑才行
	const isEqual = compareVNode(oldVNode, newVNode);

	if (!isEqual) {
		const newDom = vNode2Dom(newVNode);
		replaceNode(newDom, oldVNode.el);
		replaceVNode(oldVNode, newVNode);
		oldVNode.el = newDom;
		return newDom;
	}

	if (oldVNode.componentOptions.isComponent) {
		// 如果父组件发生更新的话，子组件默认全部执行一次 updateComponent() 来 diff 一次
		// TODO 后面优化，如果子组件的 props 属性中没有发生更新的情况，就跳过子组件的 diff 更新
		const { componentInstance } = oldVNode.componentOptions;
		if (componentInstance) {
			return componentInstance.$watcher.update();
		}
		return vNode2Dom(oldVNode);
	} else {
		const newChildren = newVNode.children || [];
		const oldChildren = oldVNode.children || [];
		const maxLength = Math.max(newChildren.length, oldChildren.length);
		for (let i = 0; i < maxLength; i++) {
			const newChild = newChildren[i];
			const oldChild = oldChildren[i];
			if (!oldChild && newChild) { // 增加新的子元素
				const newDom = vNode2Dom(newChild);
				oldVNode.children.push(newChild);
				oldVNode.el.appendChild(newDom);
				continue;
			}

			if (!newChild && oldChild) { //  删除之前的子元素
				removeChild(oldVNode.el, oldChild.el);
				oldChildren.splice(i, 1);
				continue;
			}

			if (newChild && oldChild) {
				diff(vm, oldChild, newChild);
			}
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
	options.parentVm = vnode.vm;
	const Ctor = vnode.vm.Ctor;
	const componentInstance = new Ctor(options);
	componentInstance.$parent = vnode.vm;
	componentInstance._mount();
	vnode.el = componentInstance.$el;

	// 处理组件上面的事件
	addEvent(vnode);

	// 这个地方要将 componentInstance 赋值给组件 vnode 的 componentOptions 中，为了以后的 diff 更新不重复创建组件 vm 实例
	vnode.componentOptions.componentInstance = componentInstance;
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
		} else { // 不是浏览器的原生事件，自定义事件，可能是用于父子组件通信
			// name: customEvent value: clickHandler
			const cb = handleJsExpression(vnode.vm.$self, value);
			vnode.vm.$on(name, cb.bind(vnode.vm.$self));
		}
	});
}
