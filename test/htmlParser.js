const startTagReg = /^<([0-9a-zA-Z\-]+)(?:[^>]*\/*)>/;
const endTagReg = /^<\/([0-9a-zA-Z\-]+)(?:[^>]*)>/;
const doctypeReg = /^<!doctype[^>]+>/;
const attributeReg = /[^=<>\"\'\s]+\s*=\s*"[^"]*"|[^=<>\"\'\s]+\s*=\s*'[^']*'|[^=<>\"\'\s]+\s*=\s*[^"'\s]+|[^=<>\"\'\/\s]+/;

const commentReg = /<!--[^\-!]*-->/;

/**
 * 输入的是一个 html 字符串
 * 输出的是一个 ast 语法树
 * */
function parse(content) {

    function advance(index) {
        content = content.slice(index);
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

    function isEmptyTag(node) {
        const { type, data } = node;
        return type === 'tag' &&
            Object.keys(emptyTags).indexOf(data) > -1;
    }


    /**
     * {type: 'tag', data: 'div', children: [], attributes: {}}
     * {type: 'text', data: 'hello world!', children: [], attributes: {}}
     * */
    let ast = {
        type: '',
        data: '',
        attributes: {},
        children: []
    }

    function createTextNode(data) {
        return {
            type: 'text',
            data,
            attributes: {},
            children: [],
        }
    }

    function createTagNode(data) {
        return {
            type: 'tag',
            data,
            attributes: {},
            children: []
        }
    }

    function handleAttrStr(str) {
        let key;
        let value;
        // class="a" class="'b' + c" class=c autoplay
        const tag1 = /([^=<>\"\'\s]+)\s*=\s*"([^"]*)"/;
        const tag2 = /([^=<>\"\'\s]+)\s*=\s*'([^']*)'/;
        const tag3 = /([^=<>\"\'\s]+)\s*=\s*([^"'\s]+)/;
        const tag4 = /([^=<>\"\'\s]+)/;
        const tag5 = /([^=<>\"\'\s]+)\s*=\s*\"([^"]*)\"/;
        const tag6 = /([^=<>\"\'\s]+)\s*=\s*\'([^']*)\'/;
        if (str.match(tag1)) {
            const match = str.match(tag1);
            key = match[1];
            value = match[2] || '';
        }
        if (str.match(tag2)) {
            const match = str.match(tag2);
            key = match[1];
            value = match[2] || '';
        }
        if (str.match(tag3)) {
            const match = str.match(tag3);
            key = match[1];
            value = match[2] || '';
        }
        if (str.match(tag4)) {
            const match = str.match(tag4);
            key = match[1];
            value = match[2] || '';
        }
        if (str.match(tag5)) {
            const match = str.match(tag5);
            key = match[1];
            value = match[2] || '';
        }
        if (str.match(tag6)) {
            const match = str.match(tag6);
            key = match[1];
            value = match[2] || '';
        }
        return {key, value}
    }

    function parseHtml(curNode) {
        while(content) {
            if (content.startsWith('<')) {
                let matches = [];
                matches = content.match(endTagReg);
                if (matches) {
                    advance(matches[0].length);
                    return curNode;
                }

                matches = content.match(doctypeReg);
                if (matches) {
                    advance(matches[0].length);
                    continue;
                }

                matches = content.match(commentReg);
                if (matches) {
                    advance(matches[0].length);
                    continue;
                }

                matches = content.match(startTagReg);
                if (matches) {
                    const node = createTagNode(matches[1]);
                    curNode.children.push(node);
                    advance(matches[1].length + 1);
                    let attrMatch;

                    const endSeq = content.indexOf('>');
                    let innerContent = content.slice(0, endSeq);

                    while(attrMatch = innerContent.match(attributeReg)) {
                        const index = attrMatch.index;
                        const endIndex = index + attrMatch[0].length;
                        const { key, value } = handleAttrStr(attrMatch[0]);
                        node.attributes[key] = value;
                        innerContent = innerContent.slice(endIndex);
                        advance(endIndex);
                    }
                    // 找到 > 所在的 index
                    const sliceIndex = content.indexOf('>');
                    if (sliceIndex > -1) {
                        advance(sliceIndex + 1);
                        // 如果是自闭合标签直接 return
                        if (isEmptyTag(node)) {
                            parseHtml(curNode);
                        } else {
                            parseHtml(node);
                        }
                    } else {
                        throw new Error('start tag 标签不合法');
                    }

                }
            } else {
                const index = content.indexOf('<');
                const text = content.slice(0, index < 0 ? content.length : index);
                const node = createTextNode(text);
                curNode.children.push(node);
                advance(index);
            }
        }
    }

    parseHtml(ast);
    return ast.children[0];
}