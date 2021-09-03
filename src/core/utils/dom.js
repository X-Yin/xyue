
export function appendChild(parentNode, childNode) {
    return parentNode.appendChild(childNode);
}

export function clearChildrenList(node) {
    node.innerHTML = '';
}

export function createDocumentFragment() {
    return document.createDocumentFragment();
}

export function createElement(tag) {
    return document.createElement(tag);
}

export function createTextNode(data) {
    return document.createTextNode(data);
}

export function replaceNode(newNode, oldNode) {
    if (!oldNode || !oldNode.parentNode) {
        return
    }
    oldNode.parentNode.replaceChild(newNode, oldNode);
}

export function removeChild(parentNode, childNode) {
    parentNode.removeChild(childNode);
}