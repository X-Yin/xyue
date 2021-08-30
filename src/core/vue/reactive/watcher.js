import { queueWatcher } from "./scheduler";
import {popDepTargetQueue, pushDepTargetQueue} from "./dep";

let id = 0;

class Watcher {
    callback = null;
    id = ++id;
    constructor(cb) {
        this.callback = cb;
        this.get();
    }

    update() {
        queueWatcher(this.callback);
    }

    get() {
        // 只用在组件挂载的时候收集一次依赖即可
        pushDepTargetQueue(this);
        this.callback();
        popDepTargetQueue();
    }
}

export default Watcher;