import lodash from 'lodash';


export function isEqual(obj1, obj2) {
    return lodash.isEqual(obj1, obj2);
}

export function handleJsExpression(context, expression) {
    // 这块做一层代理，是为了减少重复检查 with 对象里面的属性，造成的性能损失
    // 但是这样会导致在 code 代码执行的过程中，所有的对象，包括 window.console 也会被直接认为是 context上的对象
    // 那么就会调用报错
    const fn = new Function('sandbox', `with(sandbox){return ${expression}}`);
    // 这个 proxy 必须要做代理，否则执行表达式的时候报错
    const proxy = new Proxy(context, {
        has(target, p) {
            return true;
        }
    });
    return fn(proxy);
}

export function normalizeTagName(tagName) {
    // 统一转成小写无连字符
    // 驼峰命名 userAgent
    // 帕斯卡命名 UserAgent
    // 下划线命名 user_agent
    // 中划线命名 user-agent
    tagName = tagName.toLowerCase();
    tagName = tagName.replace('-', '');
    tagName = tagName.replace('_', '');
    return tagName;
}

export function handleDynamicExpression(context, expression = '') {
    // .*? 非贪婪匹配，匹配尽可能少的字符串
    // expression 为 {{a}}-{{b}} 时，如果是贪婪匹配，那么匹配到的结果是 a}}-{{b
    // 如果是非贪婪匹配，那么匹配到结果是 a
    const reg = /{{(.*?)}}/;
    let matchResult;
    while(matchResult = (expression || '').match(reg)) {
        try {
            const value = handleJsExpression(context, matchResult[1]);
            expression = expression.replace(matchResult[0], value);
        } catch(e) {
            console.error('handleDynamicExpression error', e);
            break;
        }
    }
    return expression;
}


export function isEqual(oldVal, newVal) {
    return lodash.isEqual(oldVal, newVal);
}