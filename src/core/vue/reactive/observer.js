
class Observer {
    data = null;
    dep = null;
    constructor(data, dep) {
        this.dep = dep;
        this.data = this.deepProxy(data);
    }

    deepProxy(data) {
        const dep = this.dep;
        if (!data) {
            return;
        }
        if (typeof data !== 'object') {
            return;
        }

        Object.keys(data).forEach(key => {
            const val = data[key];
            if (typeof val === 'object' && val !== null) {
                data[key] = this.deepProxy(val);
            }
        });
        return new Proxy(data, {
            get(target, p, receiver) {
                if (typeof dep !== 'undefined') {
                    console.log('observer proxy get', target, p, dep);
                    dep.depend();
                }
                return target[p];
            },
            set(target, p, value, receiver) {
                if (typeof value === 'object' && value !== null) {
                    target[p] = this.deepProxy(value);
                } else {
                    target[p] = value;
                }
                dep.notify();
                return true;
            }
        });
    }
}

export default Observer;