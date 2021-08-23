/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

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
;// CONCATENATED MODULE: ./src/core/vue/init.js

var id = 0;

function normalizeData(data) {
  if (typeof data === 'function') {
    return data();
  }

  return data;
}

function initMixin(vm) {
  vm.prototype._init = function (options) {
    // 1. 初始化参数
    this.$template = options.template || '';
    this.$el = options.el || '';
    this.$id = ++id;
    this.$watch = options.watch || {};
    this.$vnode = {};
    this.$self = null;
    this.$render = '';
    this.$watcher = null;
    this.data = normalizeData(options.data || {});
    this.methods = options.methods || {};
    this.props = options.props || []; // 这两个只能在递归循环的时候赋值，在构造函数里面无法给 parent 和 child 赋值

    this.$parent = null;
    this.$child = null; // 2. 生命周期
  };
}
;// CONCATENATED MODULE: ./src/core/vue/proxy.js
function proxyMixin(vm) {
  vm.prototype.proxyMixin = function () {
    this.$self = new Proxy(this, {
      get: function get(target, key, receiver) {
        var keys = ['methods', 'props', 'data'];

        for (var i = 0; i < keys.length; i++) {
          if (target[i][key]) {
            return target[i][key];
          }
        }

        return target[key];
      }
    });
  };
}
;// CONCATENATED MODULE: ./src/core/vue/event.js
function eventMixin(vm) {
  vm.prototype.eventMixin = function () {};
}
;// CONCATENATED MODULE: ./src/core/vue/render.js
function renderMixin(vm) {
  vm.prototype.eventMixin = function () {};
}
;// CONCATENATED MODULE: ./src/core/vue/index.js





function Vue(options) {
  if (!options) {
    throw new Error('Unexpected params!');
  }

  this._init(options);
}

initMixin(Vue);
proxyMixin(Vue);
eventMixin(Vue);
renderMixin(Vue);
/* harmony default export */ const vue = (Vue);
;// CONCATENATED MODULE: ./src/index.js



var content = "<div id=\"app\">\n    <div @click=\"handler\" :msg=\"msg\" value=\"hello\" style=\"color: red\" class=\"container\" v-for=\"arr\" v-if=\"flag\">\n        <input type=\"text\">\n        <p>hello</p>\n        <my-button :msg=\"msg\"></my-button>\n    </div>\n</div>"; // const ast = parse(content);
// console.log('>>> ast', ast);
// const renderFn = genRenderFn(ast.children[0]);
// console.log(renderFn);
// const fn = new Function(renderFn);
// const node = fn.call(runtimeCtx);
// console.log(node);
// document.body.appendChild(node);


var vm = new vue({
  el: '#app',
  data: function data() {
    return {
      name: 'jack'
    };
  }
});
/******/ })()
;