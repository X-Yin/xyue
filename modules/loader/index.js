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

    const scriptReq = `${resourcePath}?type=script`;
    const styleReq = `${resourcePath}?type=style`;
    const templateReq = `${resourcePath}?type=template`;

    // TODO 这个地方导出的不应该是一个 options，应该导出一个 component 实例，但是在真正做 render 渲染的时候，这个 options 只会用里面的 Ctor 属性，来构建一个新的组件
    let code = `import template from '${templateReq}';
                import style from '${styleReq}';
                import options from '${scriptReq}';
                function normalizeComponent({style, template, options}) {
                    if (style) {
                        Object.assign(options, {style: style.content});
                    }
                    if (template) {
                        Object.assign(options, {template: template.content});
                    }
                    return options;
                }
                export default normalizeComponent({template, style, options});
    `;
    return code;
}

module.exports = loader;