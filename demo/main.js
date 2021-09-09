// import Vue from '../dist/vue.js';
import '../dist/vue.js';
import App from './src/App.vue';

const vm = new window.Vue({
	el: '#app',
    components: {
	    App
    },
    template: `<App></App>`,
    data() {
	    return {
	        name: 'jack'
        }
    }
});
console.log(vm);
vm.mount();
