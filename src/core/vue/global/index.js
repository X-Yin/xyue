import Vue from "../index";
import registerGlobalComponentAPI from "./component";

function register(vm) {
    registerGlobalComponentAPI(vm);
    return vm;
}

window.Vue = Vue;

export default register(Vue);

