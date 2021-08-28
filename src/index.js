import parse from './core/compile/index';
import { genRenderFn } from './core/render';
import runtimeCtx from './core/render/testRender';

const content = `<div id="app">
    <div @click="handler" :msg="msg" value="hello" style="color: red" class="container" v-for="arr" v-if="flag">
        <input type="text">
        <p>hello</p>
        <my-button :msg="msg"></my-button>
    </div>
</div>`;


// const ast = parse(content);
// console.log('>>> ast', ast);
// const renderFn = genRenderFn(ast.children[0]);
// console.log(renderFn);
// const fn = new Function(renderFn);
// const node = fn.call(runtimeCtx);
// console.log(node);
// document.body.appendChild(node);

import Vue from './core/vue/entry';

Vue.component('my-button', {
    template: `<div class="my-button"><h1 @click="this.clickHandler">my-button</h1></div>`,
    data() {
        return {
            name: 'lucy'
        }
    },
    methods: {
        clickHandler() {
            console.log('my-button click', this.name);
        }
    }
});

const vm = new Vue({
    el: '#app',
    data() {
        return {
            name: 'jack',
            array: [1, 2, 3],
            flag: true
        }
    },
    created() {
        console.log('created');
    },
    components: {
    },
    props: {
        kiss: 'kissa'
    },
    methods: {
        clickHandler(...args) {
            console.log('clickHandler', ...args, this.name, this.flag, this.kissa);
        }
    },
});

const parent = {
    $self: {
        kiss: 'hello world!'
    }
}

vm.$parent = parent;

vm.mount();
console.log(vm);
// 不能给 props 里面的 key 赋值
// vm.$self.kissa = 'asd';
