/**
 * html to ast
 * ast 定义标准
 * {
 *     classes: [{name 'id', value: 'app'}],
 *     children: [{...}],
 *     parent: [{...}] || null,
 *     tag: 'div',
 *     staticClass: "\"container\""
 *     staticStyle: "{\"color\":\"red\"}"
 *     events: [{click: 'clickHandler', 'doubleClick': 'handler'}]
 *     v-for: '',
 *     v-if: '',
 *     type: 1 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
 * }
 * */


/**
 * 对于 attr 的解析
 * */
function parseAttr(attr) {
    const handleMatchRes = (res) => {
        const key = res[1];
        let value = res[2];
        if (typeof value !== 'string') {
            value = true
        }

        return {key, value, raw: attr}
    }
    // attr 总共有四种类型
    // class = 'a'
    // class = "a"
    // class = true
    // autoplay
    const regs = [
        /([^=<>\"\'\s]+)\s*="([^"]*)"/,
        /([^=<>\"\'\s]+)\s*='([^']*)'/,
        /([^=<>\"\'\s]+)\s*=([^'"]*)/,
        /([^=<>\"\'\s]+)\s*/
    ];
    for (let i = 0; i < regs.length; i++) {
        const reg = regs[i];
        const res = attr.match(reg);
        if (res) {
            return handleMatchRes(res);
        }
    }
}

/**
 * 将 classes 数组细分到 events style class 等
 * */
function handleAttr(node, attrs) {
    const res = [];
    attrs.forEach(({name, value}, index) => {
        if (name === 'style') {
            node.staticStyle = value;
            return;
        }

        if (name === 'class') {
            node.staticClass = value;
            return;
        }

        if (name.startsWith('v-on:') || name.startsWith('@')) {
            node.events.push({
                [name.replace(/v-on:|@/, '')]: value
            });
            return;
        }

        if (name.startsWith(('v-for'))) {
            node.vFor = value;
            return;
        }

        if (name.startsWith('v-if')) {
            node.vIf = value;
            return;
        }

        res.push({name, value});
    });
    return res;
}

/**
 * template html 字符串
 * options 可选参数
 * */
const attributeReg = /^\s*[^=<>\"\'\s]+\s*="[^"]*"|^\s*[^=<>\"\'\s]+\s*='[^']*'|^\s*[^=<>\"\'\s]+\s*=[^'"]*|^\s*[^=<>\"\'\s]+/;
const startTagReg = /^<([a-zA-Z0-9\-]+)[^>]*>/;
const endTagReg = /^<\/([a-zA-Z0-9\-]+)[^>]*>/;
const commentReg = /<!--(.*)-->/;
function parse(template, options) {

    function createNode() {
        return {
            attrs: [],
            children: [],
            parent: [],
            tag: '',
            staticClass: '',
            staticStyle: '',
            events: [],
            type: 0,
            vFor: '',
            vIf: '',
            data: ''
        };
    }

    const ast = createNode();

    function advance(num) {
        template = template.slice(num);
    }
    // 下面的这些 tag 不应该包含 child 元素
    const emptyTags = {
        area: 1,
        base: 1,
        basefont: 1,
        br: 1,
        col: 1,
        frame: 1,
        hr: 1,
        img: 1,
        input: 1,
        isindex: 1,
        link: 1,
        meta: 1,
        param: 1,
        embed: 1
    }

    function _parse(node) {
        while(template) {
            if (template.startsWith('<')) {
                const startTagRes = template.match(startTagReg);
                if (startTagRes) {
                    const child = createNode();
                    node.children.push(child);
                    child.parent = node;
                    child.tag = startTagRes[1];
                    advance(startTagRes[1].length + 1);

                    // attr 的解析和 startTag
                    let attrRes;
                    while(attrRes = template.match(attributeReg)) {
                        const attr = attrRes[0];
                        const { key, value } = parseAttr(attr);
                        child.attrs.push({
                            name: key,
                            value
                        });
                        advance(attr.length + attrRes['index']);
                    }
                    child.attrs = handleAttr(child, child.attrs);
                    advance(1);
                    // 区分自闭合标签和普通标签
                    if (Object.keys(emptyTags).includes(child.tag)) {
                        continue;
                    }
                    _parse(child);
                    continue;
                }

                const endTagRes = template.match(endTagReg);
                if (endTagRes) {
                    advance(endTagRes[0].length);
                    return;
                }

                const commentRes = template.match(commentReg);
                if (commentRes) {
                    advance(endTagRes[0].length);
                }

            } else {
                const index = template.indexOf('<');
                if (index < 0) {
                    return node;
                }
                const child = createNode();
                child.type = 3;
                child.tag = 'text';
                child.data = template.slice(0, index);
                child.parent = node;
                node.children.push(child);
                advance(index);
            }
        }
        return node;
    }

    _parse(ast);

    return ast;
}

export default parse;