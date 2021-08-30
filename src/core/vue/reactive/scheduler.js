let queue = [];

function runQueue() {
    queue.forEach(watcher => {
        watcher.update()
    });
    queue = [];
}

export function singlePush(array, item) {
    const index = array.findIndex(i => i === item);
    if (index < 0) {
        array.push(item);
    }
    // 先更新子组件再更新父组件，子组件的 id 大，放在前面，父组件的 id 小，放在后面
    array = array.sort((a, b) => {
        return b.id - a.id;
    });
}

function nextTick(fn) {
    Promise.resolve().then(() => {
        fn();
    });
}

export function queueWatcher(watcher) {
    singlePush(queue, watcher);
    nextTick(runQueue);
};