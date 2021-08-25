const lodash = require('lodash');
console.log(lodash);
const obj1 = {
    obj: {
        name: 'jack',
        age: 30
    },
    array: [1, 2, 3]
}

const obj2 = {
    array: [1, 2, 3],
    obj: {
        age: 30,
        name: 'jack'
    }
}

console.log(lodash.isEqual('123', 123));