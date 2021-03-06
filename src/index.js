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
// const renderFn = genRenderFn(ast.children[0]);
// console.log(renderFn);
// const fn = new Function(renderFn);
// const node = fn.call(runtimeCtx);
// console.log(node);
// document.body.appendChild(node);

import Vue from './core/vue/entry';

Vue.component('my-button', {
    template: `<div class="my-button"><h1 @click="changeMessage">my-button  {{name}}-{{message}}</h1></div>`,
    data() {
        return {
            name: 'lucy'
        }
    },
    props: ['message'],
    methods: {
        clickHandler() {
            // console.log('my-button click', this.name);
            this.name = 'hello'
        },
        changeMessage() {
            console.log('this.message is', this.message);
            this.emit('customEvent', this.message + ' base');
        },
    }
});

const vm = new Vue({
    el: '#app',
    data() {
        return {
            name: 'jack',
            array: [1, 2, 3],
            flag: true,
            message1: 'hello1',
            message2: 'hello2'
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
        updateMessage1(msg) {
            this.message1 = msg;
        },
        clickHandler(...args) {
            // console.log('clickHandler', ...args, this.name, this.flag, this.kissa);
            this.changeMessage1();
            this.changeMessage2();
            this.changeName();
        },
        changeArr() {
            this.array.push(4);
        },
        changeMessage1() {
            this.message1 = 'world!';
        },
        changeMessage2() {
            this.message2 = 'world2!';
        },
        changeName() {
            this.name = this.name + ' hello';
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
window.vm = vm;
// ????????? props ????????? key ??????
// vm.$self.kissa = 'asd';
