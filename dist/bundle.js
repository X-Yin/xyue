/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/core/compile/index.js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * html to ast
 * ast 定义标准
 * {
 *     attrs: [{name 'id', value: 'app'}],
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
  var handleMatchRes = function handleMatchRes(res) {
    var key = res[1];
    var value = res[2];

    if (typeof value !== 'string') {
      value = true;
    }

    return {
      key: key,
      value: value,
      raw: attr
    };
  }; // attr 总共有四种类型
  // class = 'a'
  // class = "a"
  // class = true
  // autoplay


  var regs = [/([^=<>\"\'\s]+)\s*="([^"]*)"/, /([^=<>\"\'\s]+)\s*='([^']*)'/, /([^=<>\"\'\s]+)\s*=([^'"]*)/, /([^=<>\"\'\s]+)\s*/];

  for (var i = 0; i < regs.length; i++) {
    var reg = regs[i];
    var res = attr.match(reg);

    if (res) {
      return handleMatchRes(res);
    }
  }
}
/**
 * 将 attrs 数组细分到 events style class 等
 * */


function handleAttr(node, attrs) {
  var res = [];
  attrs.forEach(function (_ref, index) {
    var name = _ref.name,
        value = _ref.value;

    if (name === 'style') {
      node.staticStyle = value;
      return;
    }

    if (name === 'class') {
      node.staticClass = value;
      return;
    }

    if (name.startsWith('v-on:') || name.startsWith('@')) {
      node.events.push(_defineProperty({}, name.replace(/v-on:|@/, ''), value));
      return;
    }

    if (name.startsWith('v-for')) {
      node.vFor = value;
      return;
    }

    if (name.startsWith('v-if')) {
      node.vIf = value;
      return;
    }

    res.push({
      name: name,
      value: value
    });
  });
  return res;
}
/**
 * template html 字符串
 * options 可选参数
 * */


var attributeReg = /^\s*[^=<>\"\'\s]+\s*="[^"]*"|^\s*[^=<>\"\'\s]+\s*='[^']*'|^\s*[^=<>\"\'\s]+\s*=[^'"]*|^\s*[^=<>\"\'\s]+/;
var startTagReg = /^<([a-zA-Z0-9\-]+)[^>]*>/;
var endTagReg = /^<\/([a-zA-Z0-9\-]+)[^>]*>/;
var commentReg = /<!--(.*)-->/;

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

  var ast = createNode();

  function advance(num) {
    template = template.slice(num);
  } // 下面的这些 tag 不应该包含 child 元素


  var emptyTags = {
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
  };

  function _parse(node) {
    while (template) {
      if (template.startsWith('<')) {
        var startTagRes = template.match(startTagReg);

        if (startTagRes) {
          var child = createNode();
          node.children.push(child);
          child.parent = node;
          child.tag = startTagRes[1];
          child.type = 1;
          advance(startTagRes[1].length + 1); // attr 的解析和 startTag

          var attrRes = void 0;

          while (attrRes = template.match(attributeReg)) {
            var attr = attrRes[0];

            var _parseAttr = parseAttr(attr),
                key = _parseAttr.key,
                value = _parseAttr.value;

            child.attrs.push({
              name: key,
              value: value
            });
            advance(attr.length + attrRes['index']);
          }

          child.attrs = handleAttr(child, child.attrs);
          advance(1); // 区分自闭合标签和普通标签

          if (Object.keys(emptyTags).includes(child.tag)) {
            continue;
          }

          _parse(child);

          continue;
        }

        var endTagRes = template.match(endTagReg);

        if (endTagRes) {
          advance(endTagRes[0].length);
          return;
        }

        var commentRes = template.match(commentReg);

        if (commentRes) {
          advance(endTagRes[0].length);
        }
      } else {
        var index = template.indexOf('<');

        var _child = createNode();

        _child.type = 3;
        _child.tag = 'text';
        var data = template.slice(0, index);

        if (data.includes('\n')) {
          // 踩坑： 这个地方，如果是 \n 的话，在生成 render 函数的时候 _t('\n xxx') 会报错，只有 _t('\\n xxx') 才能正确被 new Function() 生成函数
          data = data.replace('\n', '\\n');
        }

        _child.data = data;
        _child.parent = node;
        node.children.push(_child);

        if (index < 0) {
          return node;
        }

        advance(index);
      }
    }

    return node;
  }

  _parse(ast);

  return ast;
}

/* harmony default export */ const compile = (parse);
;// CONCATENATED MODULE: ./src/core/render/index.js
/**
 * render 函数的标准
 * _t createText 创建普通的文本 vnode: createText('helloText')
 * _c createElement 创建普通的标签 vnode 和组件 vnode: createElement('div', attrs: { class, style, events, type, attrs, parent }, children: [])
 * _l createList 创建 v-for 循环渲染的 vnode: createList('li', 'array', attrs, children: [])
 * _f createIf 创建 v-if 条件渲染的 vnode: createIf('div', 'flag', attrs, children: [])
 * */

/**
 * ast 是一个语法结构对象
 * */
function genRenderFn(ast) {
  return "with(this){return ".concat(_genRenderFn(ast), "}");
}
function _genRenderFn(ast) {
  var type = ast.type,
      vFor = ast.vFor,
      vIf = ast.vIf;

  if (type === 3) {
    // 普通文本
    return genText(ast);
  }

  if (type === 1) {
    if (vFor) {
      return genFor(ast);
    }

    if (vIf) {
      return genIf(ast);
    }

    return genEle(ast);
  }
}

function genChildren(children) {
  var fns = '';
  var len = children.length;
  children.forEach(function (item, index) {
    fns += _genRenderFn(item);

    if (index !== len - 1) {
      fns += ',';
    }
  });
  return fns;
}

function genText(ast) {
  return "_t('".concat(ast.data, "')");
}

function genFor(ast) {
  var parent = ast.parent,
      children = ast.children,
      tag = ast.tag,
      staticClass = ast.staticClass,
      staticStyle = ast.staticStyle,
      events = ast.events,
      type = ast.type,
      data = ast.data,
      attrs = ast.attrs,
      vFor = ast.vFor,
      vIf = ast.vIf;
  var attributes = {};
  attrs.forEach(function (_ref) {
    var name = _ref.name,
        value = _ref.value;
    attributes[name] = value;
  });
  return "_l(\n        '".concat(tag, "',\n        '").concat(vFor, "', \n        {class: '").concat(staticClass, "', style: '").concat(staticStyle, "', events: ").concat(JSON.stringify(events || []), ", ...").concat(JSON.stringify(attributes), "},\n        [").concat(genChildren(children), "])");
}

function genIf(ast) {
  var children = ast.children,
      tag = ast.tag,
      staticClass = ast.staticClass,
      staticStyle = ast.staticStyle,
      events = ast.events,
      attrs = ast.attrs,
      vIf = ast.vIf;
  var attributes = {};
  attrs.forEach(function (_ref2) {
    var name = _ref2.name,
        value = _ref2.value;
    attributes[name] = value;
  });
  return "_f(\n        '".concat(tag, "',\n        '").concat(vIf, "', \n        {class: '").concat(staticClass, "', style: '").concat(staticStyle, "', events: ").concat(JSON.stringify(events || []), ", ...").concat(JSON.stringify(attributes), "},\n        [").concat(genChildren(children), "])");
}

function genEle(ast) {
  var parent = ast.parent,
      children = ast.children,
      tag = ast.tag,
      staticClass = ast.staticClass,
      staticStyle = ast.staticStyle,
      events = ast.events,
      type = ast.type,
      data = ast.data,
      attrs = ast.attrs,
      vFor = ast.vFor,
      vIf = ast.vIf;
  var attributes = {};
  attrs.forEach(function (_ref3) {
    var name = _ref3.name,
        value = _ref3.value;
    attributes[name] = value;
  });
  return "_c(\n        '".concat(tag, "',\n        {class: '").concat(staticClass, "', style: '").concat(staticStyle, "', events: ").concat(JSON.stringify(events || []), ", ...").concat(JSON.stringify(attributes), "},\n        [").concat(genChildren(children), "])");
}
;// CONCATENATED MODULE: ./src/core/render/testRender.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _c = function _c(tag, attrs, children) {
  var node = document.createElement(tag);
  Object.entries(attrs).forEach(function (attr) {
    var _attr = _slicedToArray(attr, 2),
        key = _attr[0],
        value = _attr[1];

    node.setAttribute(key, value);
  });
  children.forEach(function (child) {
    node.appendChild(child);
  });
  return node;
};

var _l = function _l(tag, vfor, attrs, children) {
  return _c(tag, attrs, children);
};

var _t = function _t(text) {
  return document.createTextNode(text);
};

/* harmony default export */ const testRender = ({
  _c: _c,
  _l: _l,
  _t: _t
});
;// CONCATENATED MODULE: ./src/index.js



var content = "<div id=\"app\">\n    <div @click=\"handler\" :msg=\"msg\" value=\"hello\" style=\"color: red\" class=\"container\" v-for=\"arr\" v-if=\"flag\">\n        <input type=\"text\">\n        <p>hello</p>\n        <my-button :msg=\"msg\"></my-button>\n    </div>\n</div>";
var ast = compile(content);
console.log('>>> ast', ast);
var renderFn = genRenderFn(ast.children[0]);
console.log(renderFn);
var fn = new Function(renderFn);
var node = fn.call(testRender);
console.log(node);
document.body.appendChild(node);
/******/ })()
;