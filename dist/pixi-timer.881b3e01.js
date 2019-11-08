// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"vendors/pixi-timer.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (e) {
  function t(r) {
    if (i[r]) return i[r].exports;
    var n = i[r] = {
      exports: {},
      id: r,
      loaded: !1
    };
    return e[r].call(n.exports, n, n.exports, t), n.loaded = !0, n.exports;
  }

  var i = {};
  return t.m = e, t.c = i, t.p = "", t(0);
}([function (e, t, i) {
  e.exports = i(4);
}, function (e, t, i) {
  "use strict";

  function r(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }

  function n(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
  }

  function a(e, t) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !t || "object" != _typeof(t) && "function" != typeof t ? e : t;
  }

  function s(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
    e.prototype = Object.create(t && t.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
  }

  var o = function () {
    function e(e, t) {
      for (var i = 0; i < t.length; i++) {
        var r = t[i];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }

    return function (t, i, r) {
      return i && e(t.prototype, i), r && e(t, r), t;
    };
  }();

  Object.defineProperty(t, "__esModule", {
    value: !0
  });

  var u = i(2),
      l = r(u),
      h = function (e) {
    function t() {
      var e = arguments.length <= 0 || void 0 === arguments[0] ? 1 : arguments[0],
          i = arguments[1];
      n(this, t);
      var r = a(this, Object.getPrototypeOf(t).call(this));
      return r.time = e, i && r.addTo(i), r.active = !1, r.isEnded = !1, r.isStarted = !1, r.expire = !1, r.delay = 0, r.repeat = 0, r.loop = !1, r._delayTime = 0, r._elapsedTime = 0, r._repeat = 0, r;
    }

    return s(t, e), o(t, [{
      key: "addTo",
      value: function value(e) {
        return this.manager = e, this.manager.addTimer(this), this;
      }
    }, {
      key: "remove",
      value: function value() {
        return this.manager ? (this.manager.removeTimer(this), this) : void 0;
      }
    }, {
      key: "start",
      value: function value() {
        return this.active = !0, this;
      }
    }, {
      key: "stop",
      value: function value() {
        return this.active = !1, this.emit("stop", this._elapsedTime), this;
      }
    }, {
      key: "reset",
      value: function value() {
        return this._elapsedTime = 0, this._repeat = 0, this._delayTime = 0, this.isStarted = !1, this.isEnded = !1, this;
      }
    }, {
      key: "update",
      value: function value(e, t) {
        if (this.active) {
          if (this.delay > this._delayTime) return void (this._delayTime += t);

          if (this.isStarted || (this.isStarted = !0, this.emit("start", this._elapsedTime)), this.time > this._elapsedTime) {
            var i = this._elapsedTime + t,
                r = i >= this.time;

            if (this._elapsedTime = r ? this.time : i, this.emit("update", this._elapsedTime, e), r) {
              if (this.loop || this.repeat > this._repeat) return this._repeat++, this.emit("repeat", this._elapsedTime, this._repeat), void (this._elapsedTime = 0);
              this.isEnded = !0, this.active = !1, this.emit("end", this._elapsedTime);
            }
          }
        }
      }
    }]), t;
  }(PIXI.utils.EventEmitter);

  t["default"] = h;
}, function (e, t) {
  e.exports = PIXI;
}, function (e, t, i) {
  "use strict";

  function r(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }

  function n(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
  }

  var a = function () {
    function e(e, t) {
      for (var i = 0; i < t.length; i++) {
        var r = t[i];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }

    return function (t, i, r) {
      return i && e(t.prototype, i), r && e(t, r), t;
    };
  }();

  Object.defineProperty(t, "__esModule", {
    value: !0
  });

  var s = i(1),
      o = r(s),
      u = function () {
    function e() {
      n(this, e), this.timers = [], this._timersToDelete = [], this._last = 0;
    }

    return a(e, [{
      key: "update",
      value: function value(e) {
        var t = void 0;
        e || 0 === e ? t = 1e3 * e : (t = this._getDeltaMS(), e = t / 1e3);

        for (var i = 0; i < this.timers.length; i++) {
          var r = this.timers[i];
          r.active && (r.update(e, t), r.isEnded && r.expire && r.remove());
        }

        if (this._timersToDelete.length) {
          for (var i = 0; i < this._timersToDelete.length; i++) {
            this._remove(this._timersToDelete[i]);
          }

          this._timersToDelete.length = 0;
        }
      }
    }, {
      key: "removeTimer",
      value: function value(e) {
        this._timersToDelete.push(e);
      }
    }, {
      key: "addTimer",
      value: function value(e) {
        e.manager = this, this.timers.push(e);
      }
    }, {
      key: "createTimer",
      value: function value(e) {
        return new o["default"](e, this);
      }
    }, {
      key: "_remove",
      value: function value(e) {
        var t = this.timers.indexOf(e);
        t > 0 && this.timers.splice(t, 1);
      }
    }, {
      key: "_getDeltaMS",
      value: function value() {
        0 === this._last && (this._last = Date.now());
        var e = Date.now(),
            t = e - this._last;
        return this._last = e, t;
      }
    }]), e;
  }();

  t["default"] = u;
}, function (e, t, i) {
  "use strict";

  function r(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }

  Object.defineProperty(t, "__esModule", {
    value: !0
  });
  var n = i(2),
      a = r(n),
      s = i(3),
      o = r(s),
      u = i(1),
      l = r(u),
      h = {
    TimerManager: o["default"],
    Timer: l["default"]
  };
  a["default"].timerManager || (a["default"].timerManager = new o["default"](), a["default"].timer = h), t["default"] = h;
}]);
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "42687" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","vendors/pixi-timer.js"], null)
//# sourceMappingURL=/pixi-timer.881b3e01.js.map