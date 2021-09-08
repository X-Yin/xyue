const qs = require('querystring');
const select = require('./select');
const path = require('path');

function loader(source) {
    const loaderContext = this;
    const {
        target,
        request,
        minimize,
        sourceMap,
        rootContext,
        resourcePath, // 文件的绝对路径
        resourceQuery = '' // ?type=script
    } = loaderContext;

    const rawQuery = resourceQuery.slice(1);
    const incomingQuery = qs.parse(rawQuery);
    if (incomingQuery.type) {
        return select(incomingQuery, loaderContext, source, sourceMap);
    }

    const componentPath = ``

    const scriptReq = `${resourcePath}?type=script`;
    const styleReq = `${resourcePath}?type=style`;
    const templateReq = `${resourcePath}?type=template`;

    let code = `import template from '${templateReq}';
                import style from '${styleReq}';
                import options from '${scriptReq}';
                
    `
}

function normalizeComponent({style, template, options}) {
    if (style) {
        Object.assign(options, {style});
    }
    if (template) {
        Object.assign(options, {template});
    }
    return options;
}

module.exports = loader;