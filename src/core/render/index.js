
/**
 * render 函数的标准
 * _t createText 创建普通的文本 vnode: createText('helloText')
 * _c createElement 创建普通的标签 vnode 和组件 vnode: createElement('div', classes: { class, style, events, classes: [{name, value}], parent }, children: [])
 * _l createList 创建 v-for 循环渲染的 vnode: createList('li', 'array', classes, children: [])
 * _f createIf 创建 v-if 条件渲染的 vnode: createIf('div', 'flag', classes, children: [])
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
    return `..._l(
        '${tag}',
        '${vFor}', 
        {staticClass: ${JSON.stringify(staticClass)}, staticStyle: ${JSON.stringify(staticStyle)}, events: ${JSON.stringify(events || [])}, attrs: ${JSON.stringify(attrs || {})}},
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
        {staticClass: ${JSON.stringify(staticClass)}, staticStyle: ${JSON.stringify(staticStyle)}, events: ${JSON.stringify(events || [])}, attrs: ${JSON.stringify(attrs || {})}},
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
        {staticClass: ${JSON.stringify(staticClass)}, staticStyle: ${JSON.stringify(staticStyle)}, events: ${JSON.stringify(events || [])}, attrs: ${JSON.stringify(attrs || {})}},
        [${genChildren(children)}])`;
}