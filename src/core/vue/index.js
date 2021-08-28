import { initMixin } from "./init";
import { proxyMixin } from "./proxy";
import { eventMixin } from "./event";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import * as GlobalApis from './global';

function Vue(options) {
    if (!options) {
        throw new Error('Unexpected params!');
    }
    this._init(options);
}

initMixin(Vue);
eventMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);

export default Vue;