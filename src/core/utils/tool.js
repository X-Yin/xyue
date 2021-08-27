import lodash from 'lodash';


export function isEqual(obj1, obj2) {
    return lodash.isEqual(obj1, obj2);
}

export function handleJsExpression(context, expression) {
    const str = `with(this){return ${expression}}`;
    const fn = new Function(str);
    return fn.call(context);
}
