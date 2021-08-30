const reg1 = /{{2}/;
const reg2 = /}{2}/;
const reg3 = /\{\{((.|\r?\n)+?)\}\}/;
const reg4 = /\{\{(.*?)\}\}/;


let content = `abcheloll-{{msg1}}-{{msg2}}`;

let res;
while(res = content.match(reg4)) {
    content = content.replace(res[0], res[1]);
}

console.log(content);