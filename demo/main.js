// import '../dist/vue.js';
import '../src/core/vue/global/index'
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
window.vm = vm;
vm.mount();
