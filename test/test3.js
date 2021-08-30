
function deepProxy(data) {
    if (!data) {
        return;
    }
    if (typeof data !== 'object') {
        return;
    }

    Object.keys(data).forEach(key => {
        const val = data[key];
        if (typeof val === 'object' && val !== null) {
            const proxy = deepProxy(val);
            data[key] = deepProxy(val);
        }
    });
    return new Proxy(data, {
        get(target, p, receiver) {
            return target[p];
        },
        set(target, p, value, receiver) {
            if (typeof value === 'object' && value !== null) {
                target[p] = deepProxy(value);
            } else {
                target[p] = value;
            }
            return true;
        }
    });
}

const data = {
    array: [1, 2, 3],
    name: 'jack'
};
const proxy = deepProxy(data);
console.log(proxy1);

