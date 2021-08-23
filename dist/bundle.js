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
;// CONCATENATED MODULE: ./src/core/vue/proxy.js
function proxyMixin(vm) {
  vm.$self = new Proxy(vm, {
    get: function get(target, key, receiver) {
      var keys = ['methods', 'computed', 'data'];

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];

        if (target[k][key]) {
          return target[k][key];
        }
      }

      for (var _i = 0; _i < target.props.length; _i++) {
        var _k = target.props[_i];

        if (_k === key && target.$parent && target.$parent.$self[_k]) {
          return target.$parent.$self[_k];
        }
      }

      return target[key];
    }
  });
}
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
    this.props = options.props || [];
    this.computed = options.computed || {}; // 在构造函数里面无法给 parent 和 child 赋值，只能在运行时创建 vnode 的时候赋值
    // 因为 props 里面的数据，只有在创建 vnode 的时候才会用到，刚开始初始化构造的时候并用不到这两个值

    this.$parent = null;
    this.$child = null; // 2. 对内部属性做一层代理，给 $self 赋值，把 data props computed methods 中的取值进行一层代理

    proxyMixin(this);
  };
}
;// CONCATENATED MODULE: ./src/core/vue/event.js
// 用于创建每个组件的 eventBus
function eventMixin(vm) {
  vm.prototype._events = {};

  vm.prototype.$on = function (eventName, cb) {
    if (!eventName) {
      throw new Error('_on Unexpected eventName params!');
    }

    if (!cb) {
      throw new Error('_on Unexpected callback params');
    }

    if (Array.isArray(this._events[eventName])) {
      this._events[eventName].push(cb);
    } else {
      this._events[eventName] = [cb];
    }
  };

  vm.prototype.$emit = function (eventName) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!eventName) {
      throw new Error('_on Unexpected eventName params!');
    }

    if (Array.isArray(this._events[eventName])) {
      this._events[eventName].forEach(function (cb) {
        cb.apply(void 0, args);
      });
    }
  };

  vm.prototype.$off = function (eventName, cb) {
    if (!eventName) {
      throw new Error('_on Unexpected eventName params!');
    }

    if (!cb) {
      throw new Error('_on Unexpected callback params');
    }

    if (Array.isArray(this._events[eventName])) {
      var index = this._events[eventName].findIndex(function (item) {
        return item === cb;
      });

      this._events[eventName].splice(index, 1);
    }
  };
}
;// CONCATENATED MODULE: ./src/core/vue/render.js
function renderMixin(vm) {
  vm.prototype._render = function () {};
}
;// CONCATENATED MODULE: ./src/core/vue/lifecycle.js
function callHook(vm, hookName) {
  vm[hookName]();
}
function lifecycleMixin(vm) {
  vm.prototype._mount = function () {
    callHook(this, 'created');
  };
}
;// CONCATENATED MODULE: ./src/core/vue/index.js






function Vue(options) {
  if (!options) {
    throw new Error('Unexpected params!');
  }

  this._init(options);
}

initMixin(Vue);
eventMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);
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
  },
  props: ['kiss'],
  methods: {
    value: 'hello'
  }
});
vm.$parent = {
  $self: {
    kiss: 'what'
  }
}; // console.log(vm.$self.name, vm.$self.value, vm.$self.kiss);

vm.$on('test', function (a, b) {
  console.log(a + b);
  return a + b;
});

var cb = function cb(a, b) {
  console.log(a - b);
  return a - b;
};

vm.$on('test', cb);
vm.$off('test', cb);
vm.$emit('test', 1, 2);
/******/ })()
;