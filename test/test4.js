const obj = {
    name: 'jack'
}

const proxy = new Proxy(obj, {
    get(target, p, receiver) {
        return target[p];
    },
    set(target, p, value, receiver) {
        target[p] = value;
        return true;
    }
});

const obj2 = {
    age: 30
}

const context = new Proxy(proxy, {
    get(target, p, receiver) {
        if (typeof target[p] === 'undefined') {
            return obj2[p];
        }
        return target[p];
    },
    set(target, p, value, receiver) {
        return false;
    }
});

console.log(context.name, context.age);
context.msg = 'hello';
console.log(context.msg);