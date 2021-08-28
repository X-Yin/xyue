import lodash from 'lodash';


export function isEqual(obj1, obj2) {
    return lodash.isEqual(obj1, obj2);
}

export function handleJsExpression(context, expression) {
    const str = `with(this){return ${expression}}`;
    const fn = new Function(str);
    return fn.call(context);
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
