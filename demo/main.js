import Vue from '../dist/vue.js';
import App from './src/App.vue';

console.log(Vue);
console.log(App);

const vm = new Vue({
	...App,
	el: '#app'
});