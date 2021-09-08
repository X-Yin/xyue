
export default function normalizeComponent({style, template, options}) {
    if (style) {
        Object.assign(options, {style});
    }
    if (template) {
        Object.assign(options, {template});
    }
    return options;
}