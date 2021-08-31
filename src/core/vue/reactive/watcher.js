import { queueWatcher } from "./scheduler";
import {popDepTargetQueue, pushDepTargetQueue} from "./dep";

let id = 0;

class Watcher {
    callback = null;
    id = ++id;
    vm = null;
    constructor(cb, vm) {
        this.callback = cb;
        this.vm = vm;
        this.get();
    }

    update() {
        queueWatcher(this);
    }

    get() {
        // 只用在组件挂载的时候收集一次依赖即可
        pushDepTargetQueue(this);
        this.callback();
        popDepTargetQueue();
    }
}

export default Watcher;