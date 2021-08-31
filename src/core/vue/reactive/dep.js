import { singlePush } from "./scheduler";

let id = 0;

class Dep {
    subs = [];
    id = ++id;

    constructor() {
    }

    depend() {
        if (Dep.target) {
            singlePush(this.subs, Dep.target);
        }
    }

    notify() {
        this.subs.forEach((sub) => {
            sub.update && sub.update();
        })
    }
}

Dep.target = null;

const DepTargetQueue = [];

export function pushDepTargetQueue(target) {
    DepTargetQueue.push(target);
    Dep.target = target;
}

export function popDepTargetQueue() {
    DepTargetQueue.pop();
    Dep.target = DepTargetQueue[DepTargetQueue.length - 1];
}

export default Dep;



