
/**
 * render 函数的标准
 * _t createText 创建普通的文本 vnode: createText('helloText')
 * _c createElement 创建普通的标签 vnode 和组件 vnode: createElement('div', attrs: { class, style, events, type, attrs, parent }, children: [])
 * _l createList 创建 v-for 循环渲染的 vnode: createList('li', 'array', attrs, children: [])
 * _f createIf 创建 v-if 条件渲染的 vnode: createIf('div', 'flag', attrs, children: [])
 * */

/**
 * ast 是一个语法结构对象
 * */
export function genRenderFn(ast) {
    return `with(this){return ${_genRenderFn(ast)}}`;
}

export function _genRenderFn(ast) {
    const { type, vFor, vIf } = ast;
    if (type === 3) { // 普通文本
        return genText(ast);
    }
    if (type === 1) {
       if (vFor) {
           return genFor(ast);
       }
       if (vIf) {
           return genIf(ast);
       }
       return genEle(ast);
    }
}

function genChildren(children) {
    let fns = '';
    const len = children.length;
    children.forEach((item, index) => {
        fns += _genRenderFn(item);
        if (index !== len - 1) {
            fns += ',';
        }
    });
    return fns;
}

function genText(ast) {
    return `_t('${ast.data}')`;
}

function genFor(ast) {
    const { parent, children, tag, staticClass, staticStyle, events, type, data, attrs, vFor, vIf } = ast;
    const attributes = {};
    attrs.forEach(({name, value}) => {
        attributes[name] = value;
    });
    return `_l(
        '${tag}',
        '${vFor}', 
        {class: '${staticClass}', style: '${staticStyle}', events: ${JSON.stringify(events || [])}, ...${JSON.stringify(attributes)}},
        [${genChildren(children)}])`;
}

function genIf(ast) {
    const { children, tag, staticClass, staticStyle, events, attrs, vIf } = ast;
    const attributes = {};
    attrs.forEach(({name, value}) => {
        attributes[name] = value;
    });
    return `_f(
        '${tag}',
        '${vIf}', 
        {class: '${staticClass}', style: '${staticStyle}', events: ${JSON.stringify(events || [])}, ...${JSON.stringify(attributes)}},
        [${genChildren(children)}])`;
}

function genEle(ast) {
    const { parent, children, tag, staticClass, staticStyle, events, type, data, attrs, vFor, vIf } = ast;
    const attributes = {};
    attrs.forEach(({name, value}) => {
        attributes[name] = value;
    });
    return `_c(
        '${tag}',
        {class: '${staticClass}', style: '${staticStyle}', events: ${JSON.stringify(events || [])}, ...${JSON.stringify(attributes)}},
        [${genChildren(children)}])`;
}