
function registerGlobalComponentAPI(vm) {
    vm.components = {};
    vm.component = function(componentName, options) {
        vm.components[componentName] = options;
        return options;
    }
}

export default registerGlobalComponentAPI;