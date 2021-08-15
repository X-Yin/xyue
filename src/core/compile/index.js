/**
 * html to ast
 * ast 定义标准
 * {
 *     attrs: [{name 'id', value: 'app'}],
 *     children: [{...}],
 *     parent: [{...}] || null,
 *     tag: 'div',
 *     staticClass: "\"container\""
 *     staticStyle: "{\"color\":\"red\"}"
 *     events: [{click: 'clickHandler', 'doubleClick': 'handler'}]
 *     type: 1 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
 * }
 * */


/**
 * template html 字符串
 * options 可选参数
 * */
export default function parse(template, options) {
    const ast = {};
    // ...
    return ast;
}