
export function appendChild(parentNode, childNode) {
    return parentNode.appendChild(childNode);
}

export function clearChildrenList(node) {
    node.innerHTML = '';
}

export function createDocumentFragment() {
    return document.createDocumentFragment();
}

export function createDocumentNode(tag) {
    return document.createElement(tag);
}

export function createTextNode(data) {
    return document.createTextNode(data);
}