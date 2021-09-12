const reg1 = /^[\s\n\t]*([0-9a-zA-Z-]+)\s+in\s+([0-9a-zA-Z-]+)[\s\t\n]*$/;
const reg2 = /^[\s\n\t]*\(\s*([0-9a-zA-Z-]+)\s*,\s*([0-9a-zA-Z-]+)\s*\)\s+in\s+([0-9a-zA-Z-]+)[\s\t\n]*$/;

const content = `(item, index)   in  array`;

let result;
if (result = content.match(reg2)) {
    console.log(result);
}