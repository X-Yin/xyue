const obj1 = {
    array: [1, 2, 3]
}

function a() {
    const obj = {
        name: 'jack'
    }
    return new Proxy(obj1, {
        get(target, p, receiver) {
            console.log(obj);
            return target[p];
        }
    });
}

const fn = new Function(`with(this){return array}`);
// console.log(fn.call(a()));
console.log(typeof c);