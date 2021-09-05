let queue = [];

function runQueue() {
    queue.forEach((watcher, index) => {
        if (watcher) {
            watcher.callback();
        }
        queue[index] = null;
    });
    // 这个地方有坑！
    // 不能直接 queue = []，因为 watcher.callback 中间会执行该组件的 updateComponent，里面可能会执行子组件的 updateComponent
    // 那么就会走到 queueWatcher(childWatcher)这个地方，相当于是遍历一个数组的时候，还往这个数组里面添加新的元素，关键 runQueue 的下一次执行遍历还是异步执行
    // 此时如果将 queue 置为空 那么新添加的子元素的 watcher 就无法执行到了
    // queue = [];
    clearQueue();
}

function clearQueue() {
    let data = [];
    queue.forEach(item => {
        if (item) {
            data.push(item);
        }
    });
    queue = data;
}

export function singlePush(array, item) {
    const index = array.findIndex(i => i === item);
    if (index < 0) {
        array.push(item);
    }
    // 先更新子组件再更新父组件，子组件的 id 大，放在前面，父组件的 id 小，放在后面
    // array = array.sort((a, b) => {
    //     return b.id - a.id;
    // });
}

function nextTick(fn) {
    Promise.resolve().then(() => {
        fn();
    });
}

export function queueWatcher(watcher) {
    singlePush(queue, watcher);
    nextTick(runQueue);
}