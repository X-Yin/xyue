
/**
 * vnode 类的定义
 * tag: div | my-button
 * id 自动生成
 * class: 'container' | "['container', flag ? 'active' : '']" | "{container: true, active: flag}" html 中解析出来的原生的结果
 * style: 'color: red' 只支持静态字符串的写法
 * children: [vnode, vnode]
 * parent: vnode
 * attrs: [{name: ':msg', value: 'msg'}, {name: 'autoplay', value: 'true'}]
 * $vm: vm.$self
 * type: 1 | 3
 * data: 在 type 为 3 的时候是静态文本的内容
 * */
let id = 0;

class VNode {
    constructor(tag, vm) {

    }
}