

const _c = function(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach((attr) => {
        const [key, value] = attr;
        node.setAttribute(key, value);
    });
    children.forEach(child => {
        node.appendChild(child);
    })
    return node;
}

const _l = function(tag, vfor, attrs, children) {
    return _c(tag, attrs, children);
}

const _t = function(text) {
    return document.createTextNode(text);
}

export default {
    _c,
    _l,
    _t
}