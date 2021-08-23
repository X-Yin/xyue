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

import Vue from './core/vue';
const vm = new Vue({
    el: '#app',
    data() {
        return {
            name: 'jack'
        }
    },
    props: ['kiss'],
    methods: {
        value: 'hello'
    }
});

vm.$parent = {
    $self: {
        kiss: 'what'
    }
}

// console.log(vm.$self.name, vm.$self.value, vm.$self.kiss);
vm.$on('test', (a, b) => {
    console.log(a + b);
    return a + b;
});

const cb = (a, b) => {
    console.log(a - b);
    return a - b;
}

vm.$on('test', cb);

vm.$off('test', cb);

vm.$emit('test', 1, 2);