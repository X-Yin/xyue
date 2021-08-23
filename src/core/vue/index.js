import { initMixin } from "./init";
import { proxyMixin } from "./proxy";
import { eventMixin } from "./event";
import { renderMixin } from "./render";

function Vue(options) {
    if (!options) {
        throw new Error('Unexpected params!');
    }
    this._init(options);
}

initMixin(Vue);
proxyMixin(Vue);
eventMixin(Vue);
renderMixin(Vue);

export default Vue;