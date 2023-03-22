import { jsx as G, Fragment as be, jsxs as W } from "react/jsx-runtime";
import { createContext as we, useContext as Ge, useEffect as H, useMemo as D, useState as O, useRef as M, useCallback as E } from "react";
import { computeUnit as Y, computeRect as q, formatUnit as re } from "./axis.js";
import { fromPoints as de, intersectRect as ce, logical as P, intersectPoint as ae } from "./rect.js";
import { randomBytes as Se, formatPercent as oe } from "./format.js";
function I(r, c, a) {
  return Math.min(Math.max(r, c), a);
}
function ue(r, c) {
  return { type: "play", progress: r, timeRef: c };
}
function te(r) {
  return { type: "stop", progress: r };
}
function Ue(r, c, a) {
  return { type: "loop", progress: r, timeRef: c, annotation: a };
}
const fe = we({
  annotations: /* @__PURE__ */ new Map(),
  input: { buttons: 0, alt: !1, ctrl: !1, focus: null, xaxis: null, yaxis: null },
  mousedown: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseup: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseRect: { x: 0, y: 0, width: 0, height: 0 },
  unitDown: { x: 0, y: 0 },
  unitUp: { x: 0, y: 0 },
  scroll: { x: 0, y: 0 },
  zoom: { x: 0, y: 0 },
  playhead: { x: 0, y: 0 },
  selection: /* @__PURE__ */ new Set(),
  command: {
    annotate: () => {
      console.error("command.annotate called outside of Specviz context");
    },
    delete: () => {
      console.error("command.delete called outside of Specviz context");
    },
    deselect: () => {
      console.error("command.deselect called outside of Specviz context");
    },
    moveSelection: () => {
      console.error("command.moveSelection called outside of Specviz context");
    },
    resetView: () => {
      console.error("command.resetView called outside of Specviz context");
    },
    scroll: () => {
      console.error("command.scroll called outside of Specviz context");
    },
    scrollTo: () => {
      console.error("command.scrollTo called outside of Specviz context");
    },
    selectPoint: () => {
      console.error("command.selectPoint called outside of Specviz context");
    },
    selectArea: () => {
      console.error("command.selectArea called outside of Specviz context");
    },
    setRectX: () => {
      console.error("command.setRectX called outside of Specviz context");
    },
    setRectY: () => {
      console.error("command.setRectY called outside of Specviz context");
    },
    setRectWidth: () => {
      console.error("command.setRectWidth called outside of Specviz context");
    },
    setRectHeight: () => {
      console.error("command.setRectHeight called outside of Specviz context");
    },
    tool: () => {
      console.error("command.tool called outside of Specviz context");
    },
    zoomPoint: () => {
      console.error("command.zoomPoint called outside of Specviz context");
    },
    zoomArea: () => {
      console.error("command.zoomArea called outside of Specviz context");
    }
  },
  toolState: "annotate",
  transport: {
    play: () => {
      console.error("transport.play called outside of Specviz context");
    },
    loop: () => {
      console.error("transport.loop called outside of Specviz context");
    },
    stop: () => {
      console.error("transport.stop called outside of Specviz context");
    },
    seek: () => {
      console.error("transport.seek called outside of Specviz context");
    }
  },
  transportState: te(0),
  setAnnotations: (r) => {
    console.error("setAnnotations called outside of Specviz context");
  },
  setSelection: (r) => {
    console.error("setSelection called outside of Specviz context");
  },
  setTransport: (r) => {
    console.error("setTransport called outside of Specviz context");
  },
  setTransportState: (r) => {
    console.error("setTransportState called outside of Specviz context");
  }
});
function _(r) {
  H(
    () => {
      let c;
      function a(h) {
        r(h), c = window.requestAnimationFrame(a);
      }
      return c = window.requestAnimationFrame(a), () => {
        window.cancelAnimationFrame(c);
      };
    },
    [r]
  );
}
function pe(r) {
  const { input: c, mousedown: a, mouseup: h, mouseRect: d, unitDown: t, unitUp: o, scroll: f, zoom: x } = L();
  return D(
    () => ({
      onContextMenu(v) {
        v.preventDefault(), r.onContextMenu(v);
      },
      onMouseDown(v) {
        v.preventDefault(), c.buttons = v.buttons, r.onMouseDown(v);
      },
      onMouseMove(v) {
        const N = v.currentTarget.getBoundingClientRect(), y = (v.clientX - N.x) / N.width, g = (v.clientY - N.y) / N.height;
        c.buttons & 1 ? (h.rel.x = y, h.rel.y = g, h.abs.x = (y + f.x) / x.x, h.abs.y = (g + f.y) / x.y, o.x = Y(r.xaxis, I(h.abs.x, 0, 1)), o.y = Y(r.yaxis, I(h.abs.y, 0, 1))) : (a.rel.x = h.rel.x = y, a.rel.y = h.rel.y = g, a.abs.x = h.abs.x = (y + f.x) / x.x, a.abs.y = h.abs.y = (g + f.y) / x.y, t.x = o.x = Y(r.xaxis, I(a.abs.x, 0, 1)), t.y = o.y = Y(r.yaxis, I(a.abs.y, 0, 1)));
        const w = de(a.abs, h.abs);
        d.x = w.x, d.y = w.y, d.width = w.width, d.height = w.height, r.onMouseMove(v);
      },
      onMouseUp(v) {
        r.onMouseUp(v), c.buttons = 0;
      },
      onMouseEnter(v) {
        c.focus = v.currentTarget, c.xaxis = r.xaxis, c.yaxis = r.yaxis, r.onMouseEnter(v);
      },
      onMouseLeave(v) {
        r.onMouseLeave(v), c.buttons = 0, c.focus = null, c.xaxis = null, c.yaxis = null;
      }
    }),
    [
      r.xaxis,
      r.yaxis,
      r.onMouseDown,
      r.onMouseMove,
      r.onMouseUp,
      r.onMouseLeave,
      r.onContextMenu
    ]
  );
}
function se() {
  return D(
    () => {
      let r = 0, c = 0;
      return {
        get x() {
          return r;
        },
        get y() {
          return c;
        },
        set x(a) {
          r = a;
        },
        set y(a) {
          c = a;
        }
      };
    },
    []
  );
}
function he() {
  return D(
    () => {
      let r = 0, c = 0, a = 0, h = 0;
      return {
        abs: {
          get x() {
            return r;
          },
          set x(d) {
            r = d;
          },
          get y() {
            return c;
          },
          set y(d) {
            c = d;
          }
        },
        rel: {
          get x() {
            return a;
          },
          set x(d) {
            a = d;
          },
          get y() {
            return h;
          },
          set y(d) {
            h = d;
          }
        }
      };
    },
    []
  );
}
function ke() {
  return D(
    () => {
      let r = 0, c = 0, a = 0, h = 0;
      return {
        get x() {
          return r;
        },
        get y() {
          return c;
        },
        set x(d) {
          r = d;
        },
        set y(d) {
          c = d;
        },
        get width() {
          return a;
        },
        set width(d) {
          a = d;
        },
        get height() {
          return h;
        },
        set height(d) {
          h = d;
        }
      };
    },
    []
  );
}
function ve(r, c) {
  const { mousedown: a, scroll: h, zoom: d } = L();
  H(
    () => {
      const t = r.current;
      function o(f) {
        f.preventDefault();
        const x = f.deltaX / t.clientWidth, v = f.deltaY / t.clientHeight;
        f.altKey ? (d.x = d.x + x * c, d.y = d.y + v * c, h.x = a.abs.x * d.x - a.rel.x, h.y = a.abs.y * d.y - a.rel.y) : (h.x -= x * c, h.y -= v * c);
      }
      return t.addEventListener("wheel", o, { passive: !1 }), () => {
        t.removeEventListener("wheel", o);
      };
    },
    [c]
  );
}
function L() {
  return Ge(fe);
}
const le = 5, X = () => {
};
function qe(r) {
  const [c, a] = O(/* @__PURE__ */ new Map()), [h, d] = O(/* @__PURE__ */ new Set()), t = D(
    () => {
      let s = 0, e = !1, n = !1, i = null, u = null, l = null;
      return {
        get buttons() {
          return s;
        },
        set buttons(p) {
          s = p;
        },
        get alt() {
          return e;
        },
        set alt(p) {
          e = p;
        },
        get ctrl() {
          return n;
        },
        set ctrl(p) {
          n = p;
        },
        get focus() {
          return i;
        },
        set focus(p) {
          i = p;
        },
        get xaxis() {
          return u;
        },
        set xaxis(p) {
          u = p;
        },
        get yaxis() {
          return l;
        },
        set yaxis(p) {
          l = p;
        }
      };
    },
    []
  ), o = D(
    () => {
      let s = 1, e = 1;
      return {
        get x() {
          return s;
        },
        get y() {
          return e;
        },
        set x(n) {
          s = I(n, 1, le);
        },
        set y(n) {
          e = I(n, 1, le);
        }
      };
    },
    []
  ), f = D(
    () => {
      let s = 0, e = 0;
      return {
        get x() {
          return s;
        },
        get y() {
          return e;
        },
        set x(n) {
          s = I(n, 0, o.x - 1);
        },
        set y(n) {
          e = I(n, 0, o.y - 1);
        }
      };
    },
    []
  ), x = D(
    () => ({
      annotate(s, e, n, i) {
        const u = Se(10), l = { id: u, rect: s, unit: e, xaxis: n, yaxis: i };
        a((p) => new Map(p).set(u, l)), d(/* @__PURE__ */ new Set([l.id]));
      },
      delete() {
        a((s) => {
          const e = new Map(s);
          for (const n of h)
            e.delete(n);
          return e;
        }), d(/* @__PURE__ */ new Set());
      },
      deselect() {
        d(/* @__PURE__ */ new Set());
      },
      moveSelection(s, e) {
        a((n) => {
          let i;
          return new Map(Array.from(
            n,
            ([u, l]) => [
              u,
              h.has(l.id) ? {
                ...l,
                rect: i = {
                  x: I(l.rect.x + (t.xaxis == l.xaxis ? s : 0), 0, 1 - l.rect.width),
                  y: I(l.rect.y + (t.yaxis == l.yaxis ? e : 0), 0, 1 - l.rect.height),
                  width: l.rect.width,
                  height: l.rect.height
                },
                unit: q(l.xaxis, l.yaxis, i)
              } : l
            ]
          ));
        });
      },
      resetView() {
        o.x = 1, o.y = 1, f.x = 0, f.y = 0;
      },
      scroll(s, e) {
        f.x += s, f.y += e;
      },
      scrollTo(s) {
        f.x = s.x, f.y = s.y;
      },
      selectArea(s) {
        d((e) => {
          if (t.ctrl) {
            const n = new Set(e);
            for (const i of c.values())
              ce(P(i.rect, t.xaxis == i.xaxis, t.yaxis == i.yaxis), s) && (n.has(i.id) ? n.delete(i.id) : n.add(i.id));
            return n;
          } else {
            const n = /* @__PURE__ */ new Set();
            for (const i of c.values())
              ce(P(i.rect, t.xaxis == i.xaxis, t.yaxis == i.yaxis), s) && n.add(i.id);
            return n;
          }
        });
      },
      selectPoint(s) {
        d((e) => {
          if (t.ctrl) {
            const n = new Set(e);
            for (const i of c.values())
              ae(P(i.rect, t.xaxis == i.xaxis, t.yaxis == i.yaxis), s) && (n.has(i.id) ? n.delete(i.id) : n.add(i.id));
            return n;
          } else {
            const n = /* @__PURE__ */ new Set();
            for (const i of c.values())
              ae(P(i.rect, t.xaxis == i.xaxis, t.yaxis == i.yaxis), s) && n.add(i.id);
            return n;
          }
        });
      },
      setRectX(s, e) {
        a((n) => {
          const i = new Map(n), u = {
            x: I(s.rect.x + e, 0, 1 - s.rect.width),
            y: s.rect.y,
            width: s.rect.width,
            height: s.rect.height
          };
          return i.set(
            s.id,
            { ...s, rect: u, unit: q(s.xaxis, s.yaxis, u) }
          );
        });
      },
      setRectY(s, e) {
        a((n) => {
          const i = new Map(n), u = {
            x: s.rect.x,
            y: I(s.rect.y + e, 0, 1 - s.rect.height),
            width: s.rect.width,
            height: s.rect.height
          };
          return i.set(
            s.id,
            { ...s, rect: u, unit: q(s.xaxis, s.yaxis, u) }
          );
        });
      },
      setRectWidth(s, e) {
        a((n) => {
          const i = new Map(n), u = {
            x: s.rect.x,
            y: s.rect.y,
            width: I(s.rect.width + e, 0.01, 1 - s.rect.x),
            height: s.rect.height
          };
          return i.set(
            s.id,
            { ...s, rect: u, unit: q(s.xaxis, s.yaxis, u) }
          );
        });
      },
      setRectHeight(s, e) {
        a((n) => {
          const i = new Map(n), u = {
            x: s.rect.x,
            y: s.rect.y,
            width: s.rect.width,
            height: I(s.rect.height + e, 0.01, 1 - s.rect.y)
          };
          return i.set(
            s.id,
            { ...s, rect: u, unit: q(s.xaxis, s.yaxis, u) }
          );
        });
      },
      tool(s) {
        b(s);
      },
      zoomArea(s) {
        o.x = 1 / s.width, o.y = 1 / s.height, f.x = -0.5 + (s.x + s.width / 2) * o.x, f.y = -0.5 + (s.y + s.height / 2) * o.y;
      },
      zoomPoint(s) {
        const e = s.x * o.x - f.x, n = s.y * o.y - f.y;
        o.x += 0.5, o.y += 0.5, f.x = s.x * o.x - e, f.y = s.y * o.y - n;
      }
    }),
    [c, h]
  ), [v, b] = O("annotate"), [N, y] = O({
    play: X,
    loop: X,
    stop: X,
    seek: X
  }), [g, w] = O(te(0));
  return H(
    () => {
      function s(n) {
        n.key == "Alt" ? t.alt = !0 : n.key == "Control" && (t.ctrl = !0);
      }
      function e(n) {
        n.key == "Alt" ? t.alt = !1 : n.key == "Control" && (t.ctrl = !1);
      }
      return window.addEventListener("keydown", s), window.addEventListener("keyup", e), () => {
        window.removeEventListener("keydown", s), window.removeEventListener("keyup", e);
      };
    },
    []
  ), /* @__PURE__ */ G(fe.Provider, { value: {
    annotations: c,
    input: t,
    mousedown: he(),
    mouseup: he(),
    mouseRect: ke(),
    unitDown: se(),
    unitUp: se(),
    scroll: f,
    zoom: o,
    playhead: se(),
    selection: h,
    command: x,
    toolState: v,
    transport: N,
    transportState: g,
    setAnnotations: a,
    setSelection: d,
    setTransport: y,
    setTransportState: w
  }, children: r.children });
}
var Re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, j = {}, Ie = {
  get exports() {
    return j;
  },
  set exports(r) {
    j = r;
  }
};
(function(r) {
  (function(c) {
    function a(e, n) {
      this.options = {}, e = e || this.options;
      var i = { frequency: 350, peak: 1 };
      this.inputNode = this.filterNode = o.context.createBiquadFilter(), this.filterNode.type = n, this.outputNode = t.context.createGain(), this.filterNode.connect(this.outputNode);
      for (var u in i)
        this[u] = e[u], this[u] = this[u] === void 0 || this[u] === null ? i[u] : this[u];
    }
    function h() {
      var e, n, i = o.context.sampleRate * this.time, u = t.context.createBuffer(2, i, o.context.sampleRate), l = u.getChannelData(0), p = u.getChannelData(1);
      for (n = 0; i > n; n++)
        e = this.reverse ? i - n : n, l[n] = (2 * Math.random() - 1) * Math.pow(1 - e / i, this.decay), p[n] = (2 * Math.random() - 1) * Math.pow(1 - e / i, this.decay);
      this.reverbNode.buffer && (this.inputNode.disconnect(this.reverbNode), this.reverbNode.disconnect(this.wetGainNode), this.reverbNode = t.context.createConvolver(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode)), this.reverbNode.buffer = u;
    }
    function d(e) {
      for (var n = o.context.sampleRate, i = new Float32Array(n), u = Math.PI / 180, l = 0; n > l; l++) {
        var p = 2 * l / n - 1;
        i[l] = (3 + e) * p * 20 * u / (Math.PI + e * Math.abs(p));
      }
      return i;
    }
    var t = {}, o = t, f = r.exports;
    f ? r.exports = t : c.Pizzicato = c.Pz = t;
    var x = c.AudioContext || c.webkitAudioContext;
    if (!x)
      return void console.error("No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.");
    t.context = new x();
    var v = t.context.createGain();
    v.connect(t.context.destination), t.Util = { isString: function(e) {
      return toString.call(e) === "[object String]";
    }, isObject: function(e) {
      return toString.call(e) === "[object Object]";
    }, isFunction: function(e) {
      return toString.call(e) === "[object Function]";
    }, isNumber: function(e) {
      return toString.call(e) === "[object Number]" && e === +e;
    }, isArray: function(e) {
      return toString.call(e) === "[object Array]";
    }, isInRange: function(e, n, i) {
      return o.Util.isNumber(e) && o.Util.isNumber(n) && o.Util.isNumber(i) ? e >= n && i >= e : !1;
    }, isBool: function(e) {
      return typeof e == "boolean";
    }, isOscillator: function(e) {
      return e && e.toString() === "[object OscillatorNode]";
    }, isAudioBufferSourceNode: function(e) {
      return e && e.toString() === "[object AudioBufferSourceNode]";
    }, isSound: function(e) {
      return e instanceof o.Sound;
    }, isEffect: function(e) {
      for (var n in t.Effects)
        if (e instanceof t.Effects[n])
          return !0;
      return !1;
    }, normalize: function(e, n, i) {
      return o.Util.isNumber(e) && o.Util.isNumber(n) && o.Util.isNumber(i) ? (i - n) * e / 1 + n : void 0;
    }, getDryLevel: function(e) {
      return !o.Util.isNumber(e) || e > 1 || 0 > e ? 0 : 0.5 >= e ? 1 : 1 - 2 * (e - 0.5);
    }, getWetLevel: function(e) {
      return !o.Util.isNumber(e) || e > 1 || 0 > e ? 0 : e >= 0.5 ? 1 : 1 - 2 * (0.5 - e);
    } };
    var b = t.context.createGain(), N = Object.getPrototypeOf(Object.getPrototypeOf(b)), y = N.connect;
    N.connect = function(e) {
      var n = o.Util.isEffect(e) ? e.inputNode : e;
      return y.call(this, n), e;
    }, Object.defineProperty(t, "volume", { enumerable: !0, get: function() {
      return v.gain.value;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && v && (v.gain.value = e);
    } }), Object.defineProperty(t, "masterGainNode", { enumerable: !1, get: function() {
      return v;
    }, set: function(e) {
      console.error("Can't set the master gain node");
    } }), t.Events = { on: function(e, n, i) {
      if (e && n) {
        this._events = this._events || {};
        var u = this._events[e] || (this._events[e] = []);
        u.push({ callback: n, context: i || this, handler: this });
      }
    }, trigger: function(e) {
      if (e) {
        var n, i, u, l;
        if (this._events = this._events || {}, n = this._events[e] || (this._events[e] = [])) {
          for (i = Math.max(0, arguments.length - 1), u = [], l = 0; i > l; l++)
            u[l] = arguments[l + 1];
          for (l = 0; l < n.length; l++)
            n[l].callback.apply(n[l].context, u);
        }
      }
    }, off: function(e) {
      e ? this._events[e] = void 0 : this._events = {};
    } }, t.Sound = function(e, n) {
      function i(m) {
        var k = ["wave", "file", "input", "script", "sound"];
        if (m && !S.isFunction(m) && !S.isString(m) && !S.isObject(m))
          return "Description type not supported. Initialize a sound using an object, a function or a string.";
        if (S.isObject(m)) {
          if (!S.isString(m.source) || k.indexOf(m.source) === -1)
            return "Specified source not supported. Sources can be wave, file, input or script";
          if (!(m.source !== "file" || m.options && m.options.path))
            return "A path is needed for sounds with a file source";
          if (!(m.source !== "script" || m.options && m.options.audioFunction))
            return "An audio function is needed for sounds with a script source";
        }
      }
      function u(m, k) {
        m = m || {}, this.getRawSourceNode = function() {
          var R = this.sourceNode ? this.sourceNode.frequency.value : m.frequency, z = t.context.createOscillator();
          return z.type = m.type || "sine", z.frequency.value = R || 440, z;
        }, this.sourceNode = this.getRawSourceNode(), this.sourceNode.gainSuccessor = o.context.createGain(), this.sourceNode.connect(this.sourceNode.gainSuccessor), S.isFunction(k) && k();
      }
      function l(m, k) {
        m = S.isArray(m) ? m : [m];
        var R = new XMLHttpRequest();
        R.open("GET", m[0], !0), R.responseType = "arraybuffer", R.onload = function(z) {
          t.context.decodeAudioData(z.target.response, function(A) {
            T.getRawSourceNode = function() {
              var ie = t.context.createBufferSource();
              return ie.loop = this.loop, ie.buffer = A, ie;
            }, S.isFunction(k) && k();
          }.bind(T), function(A) {
            return console.error("Error decoding audio file " + m[0]), m.length > 1 ? (m.shift(), void l(m, k)) : (A = A || new Error("Error decoding audio file " + m[0]), void (S.isFunction(k) && k(A)));
          }.bind(T));
        }, R.onreadystatechange = function(z) {
          R.readyState === 4 && R.status !== 200 && console.error("Error while fetching " + m[0] + ". " + R.statusText);
        }, R.send();
      }
      function p(m, k) {
        if (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, !navigator.getUserMedia && !navigator.mediaDevices.getUserMedia)
          return void console.error("Your browser does not support getUserMedia");
        var R = function(A) {
          T.getRawSourceNode = function() {
            return t.context.createMediaStreamSource(A);
          }, S.isFunction(k) && k();
        }.bind(T), z = function(A) {
          S.isFunction(k) && k(A);
        };
        navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({ audio: !0 }).then(R).catch(z) : navigator.getUserMedia({ audio: !0 }, R, z);
      }
      function U(m, k) {
        var R = S.isFunction(m) ? m : m.audioFunction, z = S.isObject(m) && m.bufferSize ? m.bufferSize : null;
        if (!z)
          try {
            t.context.createScriptProcessor();
          } catch {
            z = 2048;
          }
        this.getRawSourceNode = function() {
          var A = t.context.createScriptProcessor(z, 1, 1);
          return A.onaudioprocess = R, A;
        };
      }
      function F(m, k) {
        this.getRawSourceNode = m.sound.getRawSourceNode, m.sound.sourceNode && o.Util.isOscillator(m.sound.sourceNode) && (this.sourceNode = this.getRawSourceNode(), this.frequency = m.sound.frequency);
      }
      var T = this, S = t.Util, ne = i(e), C = S.isObject(e) && S.isObject(e.options), ye = 0.04, Ne = 0.04;
      if (ne)
        throw console.error(ne), new Error("Error initializing Pizzicato Sound: " + ne);
      this.detached = C && e.options.detached, this.masterVolume = t.context.createGain(), this.fadeNode = t.context.createGain(), this.fadeNode.gain.value = 0, this.detached || this.masterVolume.connect(t.masterGainNode), this.lastTimePlayed = 0, this.effects = [], this.effectConnectors = [], this.playing = this.paused = !1, this.loop = C && e.options.loop, this.attack = C && S.isNumber(e.options.attack) ? e.options.attack : ye, this.volume = C && S.isNumber(e.options.volume) ? e.options.volume : 1, C && S.isNumber(e.options.release) ? this.release = e.options.release : C && S.isNumber(e.options.sustain) ? (console.warn("'sustain' is deprecated. Use 'release' instead."), this.release = e.options.sustain) : this.release = Ne, e ? S.isString(e) ? l.bind(this)(e, n) : S.isFunction(e) ? U.bind(this)(e, n) : e.source === "file" ? l.bind(this)(e.options.path, n) : e.source === "wave" ? u.bind(this)(e.options, n) : e.source === "input" ? p.bind(this)(e, n) : e.source === "script" ? U.bind(this)(e.options, n) : e.source === "sound" && F.bind(this)(e.options, n) : u.bind(this)({}, n);
    }, t.Sound.prototype = Object.create(t.Events, { play: { enumerable: !0, value: function(e, n) {
      this.playing || (o.Util.isNumber(n) || (n = this.offsetTime || 0), o.Util.isNumber(e) || (e = 0), this.playing = !0, this.paused = !1, this.sourceNode = this.getSourceNode(), this.applyAttack(), o.Util.isFunction(this.sourceNode.start) && (this.lastTimePlayed = t.context.currentTime - n, this.sourceNode.start(o.context.currentTime + e, n)), this.trigger("play"));
    } }, stop: { enumerable: !0, value: function() {
      (this.paused || this.playing) && (this.paused = this.playing = !1, this.stopWithRelease(), this.offsetTime = 0, this.trigger("stop"));
    } }, pause: { enumerable: !0, value: function() {
      if (!this.paused && this.playing) {
        this.paused = !0, this.playing = !1, this.stopWithRelease();
        var e = o.context.currentTime - this.lastTimePlayed;
        this.sourceNode.buffer ? this.offsetTime = e % (this.sourceNode.buffer.length / o.context.sampleRate) : this.offsetTime = e, this.trigger("pause");
      }
    } }, clone: { enumerable: !0, value: function() {
      for (var e = new t.Sound({ source: "sound", options: { loop: this.loop, attack: this.attack, release: this.release, volume: this.volume, sound: this } }), n = 0; n < this.effects.length; n++)
        e.addEffect(this.effects[n]);
      return e;
    } }, onEnded: { enumerable: !0, value: function(e) {
      return function() {
        this.sourceNode && this.sourceNode !== e || (this.playing && this.stop(), this.paused || this.trigger("end"));
      };
    } }, addEffect: { enumerable: !0, value: function(e) {
      if (!o.Util.isEffect(e))
        return console.error("The object provided is not a Pizzicato effect."), this;
      this.effects.push(e);
      var n = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.fadeNode;
      n.disconnect(), n.connect(e);
      var i = o.context.createGain();
      return this.effectConnectors.push(i), e.connect(i), i.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(e) {
      var n = this.effects.indexOf(e);
      if (n === -1)
        return console.warn("Cannot remove effect that is not applied to this sound."), this;
      var i = this.playing;
      i && this.pause();
      var u = n === 0 ? this.fadeNode : this.effectConnectors[n - 1];
      u.disconnect();
      var l = this.effectConnectors[n];
      l.disconnect(), e.disconnect(l), this.effectConnectors.splice(n, 1), this.effects.splice(n, 1);
      var p;
      return p = n > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[n], u.connect(p), i && this.play(), this;
    } }, connect: { enumerable: !0, value: function(e) {
      return this.masterVolume.connect(e), this;
    } }, disconnect: { enumerable: !0, value: function(e) {
      return this.masterVolume.disconnect(e), this;
    } }, connectEffects: { enumerable: !0, value: function() {
      for (var e = [], n = 0; n < this.effects.length; n++) {
        var i = n === this.effects.length - 1, u = i ? this.masterVolume : this.effects[n + 1].inputNode;
        e[n] = o.context.createGain(), this.effects[n].outputNode.disconnect(this.effectConnectors[n]), this.effects[n].outputNode.connect(u);
      }
    } }, volume: { enumerable: !0, get: function() {
      return this.masterVolume ? this.masterVolume.gain.value : void 0;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && this.masterVolume && (this.masterVolume.gain.value = e);
    } }, frequency: { enumerable: !0, get: function() {
      return this.sourceNode && o.Util.isOscillator(this.sourceNode) ? this.sourceNode.frequency.value : null;
    }, set: function(e) {
      this.sourceNode && o.Util.isOscillator(this.sourceNode) && (this.sourceNode.frequency.value = e);
    } }, sustain: { enumerable: !0, get: function() {
      return console.warn("'sustain' is deprecated. Use 'release' instead."), this.release;
    }, set: function(e) {
      console.warn("'sustain' is deprecated. Use 'release' instead."), o.Util.isInRange(e, 0, 10) && (this.release = e);
    } }, getSourceNode: { enumerable: !0, value: function() {
      if (this.sourceNode) {
        var e = this.sourceNode;
        e.gainSuccessor.gain.setValueAtTime(e.gainSuccessor.gain.value, o.context.currentTime), e.gainSuccessor.gain.linearRampToValueAtTime(1e-4, o.context.currentTime + 0.2), setTimeout(function() {
          e.disconnect(), e.gainSuccessor.disconnect();
        }, 200);
      }
      var n = this.getRawSourceNode();
      return n.gainSuccessor = o.context.createGain(), n.connect(n.gainSuccessor), n.gainSuccessor.connect(this.fadeNode), this.fadeNode.connect(this.getInputNode()), o.Util.isAudioBufferSourceNode(n) && (n.onended = this.onEnded(n).bind(this)), n;
    } }, getInputNode: { enumerable: !0, value: function() {
      return this.effects.length > 0 ? this.effects[0].inputNode : this.masterVolume;
    } }, applyAttack: { enumerable: !1, value: function() {
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.attack)
        return void this.fadeNode.gain.setTargetAtTime(1, o.context.currentTime, 1e-3);
      var e = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, n = this.attack;
      e || (n = (1 - this.fadeNode.gain.value) * this.attack), this.fadeNode.gain.setTargetAtTime(1, o.context.currentTime, 2 * n);
    } }, stopWithRelease: { enumerable: !1, value: function(e) {
      var n = this.sourceNode, i = function() {
        return o.Util.isFunction(n.stop) ? n.stop(0) : n.disconnect();
      };
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.release)
        return this.fadeNode.gain.setTargetAtTime(0, o.context.currentTime, 1e-3), void i();
      var u = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, l = this.release;
      u || (l = this.fadeNode.gain.value * this.release), this.fadeNode.gain.setTargetAtTime(1e-5, o.context.currentTime, l / 5), window.setTimeout(function() {
        i();
      }, 1e3 * l);
    } } }), t.Group = function(e) {
      e = e || [], this.mergeGainNode = o.context.createGain(), this.masterVolume = o.context.createGain(), this.sounds = [], this.effects = [], this.effectConnectors = [], this.mergeGainNode.connect(this.masterVolume), this.masterVolume.connect(o.masterGainNode);
      for (var n = 0; n < e.length; n++)
        this.addSound(e[n]);
    }, t.Group.prototype = Object.create(o.Events, { connect: { enumerable: !0, value: function(e) {
      return this.masterVolume.connect(e), this;
    } }, disconnect: { enumerable: !0, value: function(e) {
      return this.masterVolume.disconnect(e), this;
    } }, addSound: { enumerable: !0, value: function(e) {
      return o.Util.isSound(e) ? this.sounds.indexOf(e) > -1 ? void console.warn("The Pizzicato.Sound object was already added to this group") : e.detached ? void console.warn("Groups do not support detached sounds. You can manually create an audio graph to group detached sounds together.") : (e.disconnect(o.masterGainNode), e.connect(this.mergeGainNode), void this.sounds.push(e)) : void console.error("You can only add Pizzicato.Sound objects");
    } }, removeSound: { enumerable: !0, value: function(e) {
      var n = this.sounds.indexOf(e);
      return n === -1 ? void console.warn("Cannot remove a sound that is not part of this group.") : (e.disconnect(this.mergeGainNode), e.connect(o.masterGainNode), void this.sounds.splice(n, 1));
    } }, volume: { enumerable: !0, get: function() {
      return this.masterVolume ? this.masterVolume.gain.value : void 0;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.masterVolume.gain.value = e);
    } }, play: { enumerable: !0, value: function() {
      for (var e = 0; e < this.sounds.length; e++)
        this.sounds[e].play();
      this.trigger("play");
    } }, stop: { enumerable: !0, value: function() {
      for (var e = 0; e < this.sounds.length; e++)
        this.sounds[e].stop();
      this.trigger("stop");
    } }, pause: { enumerable: !0, value: function() {
      for (var e = 0; e < this.sounds.length; e++)
        this.sounds[e].pause();
      this.trigger("pause");
    } }, addEffect: { enumerable: !0, value: function(e) {
      if (!o.Util.isEffect(e))
        return console.error("The object provided is not a Pizzicato effect."), this;
      this.effects.push(e);
      var n = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.mergeGainNode;
      n.disconnect(), n.connect(e);
      var i = o.context.createGain();
      return this.effectConnectors.push(i), e.connect(i), i.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(e) {
      var n = this.effects.indexOf(e);
      if (n === -1)
        return console.warn("Cannot remove effect that is not applied to this group."), this;
      var i = n === 0 ? this.mergeGainNode : this.effectConnectors[n - 1];
      i.disconnect();
      var u = this.effectConnectors[n];
      u.disconnect(), e.disconnect(u), this.effectConnectors.splice(n, 1), this.effects.splice(n, 1);
      var l;
      return l = n > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[n], i.connect(l), this;
    } } }), t.Effects = {};
    var g = Object.create(null, { connect: { enumerable: !0, value: function(e) {
      return this.outputNode.connect(e), this;
    } }, disconnect: { enumerable: !0, value: function(e) {
      return this.outputNode.disconnect(e), this;
    } } });
    t.Effects.Delay = function(e) {
      this.options = {}, e = e || this.options;
      var n = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = t.context.createGain(), this.outputNode = t.context.createGain(), this.dryGainNode = t.context.createGain(), this.wetGainNode = t.context.createGain(), this.feedbackGainNode = t.context.createGain(), this.delayNode = t.context.createDelay(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.delayNode), this.inputNode.connect(this.delayNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, t.Effects.Delay.prototype = Object.create(g, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = t.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = t.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 180) && (this.options.time = e, this.delayNode.delayTime.value = e);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.feedback = parseFloat(e, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), t.Effects.Compressor = function(e) {
      this.options = {}, e = e || this.options;
      var n = { threshold: -24, knee: 30, attack: 3e-3, release: 0.25, ratio: 12 };
      this.inputNode = this.compressorNode = t.context.createDynamicsCompressor(), this.outputNode = t.context.createGain(), this.compressorNode.connect(this.outputNode);
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, t.Effects.Compressor.prototype = Object.create(g, { threshold: { enumerable: !0, get: function() {
      return this.compressorNode.threshold.value;
    }, set: function(e) {
      t.Util.isInRange(e, -100, 0) && (this.compressorNode.threshold.value = e);
    } }, knee: { enumerable: !0, get: function() {
      return this.compressorNode.knee.value;
    }, set: function(e) {
      t.Util.isInRange(e, 0, 40) && (this.compressorNode.knee.value = e);
    } }, attack: { enumerable: !0, get: function() {
      return this.compressorNode.attack.value;
    }, set: function(e) {
      t.Util.isInRange(e, 0, 1) && (this.compressorNode.attack.value = e);
    } }, release: { enumerable: !0, get: function() {
      return this.compressorNode.release.value;
    }, set: function(e) {
      t.Util.isInRange(e, 0, 1) && (this.compressorNode.release.value = e);
    } }, ratio: { enumerable: !0, get: function() {
      return this.compressorNode.ratio.value;
    }, set: function(e) {
      t.Util.isInRange(e, 1, 20) && (this.compressorNode.ratio.value = e);
    } }, getCurrentGainReduction: function() {
      return this.compressorNode.reduction;
    } }), t.Effects.LowPassFilter = function(e) {
      a.call(this, e, "lowpass");
    }, t.Effects.HighPassFilter = function(e) {
      a.call(this, e, "highpass");
    };
    var w = Object.create(g, { frequency: { enumerable: !0, get: function() {
      return this.filterNode.frequency.value;
    }, set: function(e) {
      t.Util.isInRange(e, 10, 22050) && (this.filterNode.frequency.value = e);
    } }, peak: { enumerable: !0, get: function() {
      return this.filterNode.Q.value;
    }, set: function(e) {
      t.Util.isInRange(e, 1e-4, 1e3) && (this.filterNode.Q.value = e);
    } } });
    t.Effects.LowPassFilter.prototype = w, t.Effects.HighPassFilter.prototype = w, t.Effects.Distortion = function(e) {
      this.options = {}, e = e || this.options;
      var n = { gain: 0.5 };
      this.waveShaperNode = t.context.createWaveShaper(), this.inputNode = this.outputNode = this.waveShaperNode;
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, t.Effects.Distortion.prototype = Object.create(g, { gain: { enumerable: !0, get: function() {
      return this.options.gain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.gain = e, this.adjustGain());
    } }, adjustGain: { writable: !1, configurable: !1, enumerable: !1, value: function() {
      for (var e, n = o.Util.isNumber(this.options.gain) ? parseInt(100 * this.options.gain, 10) : 50, i = 44100, u = new Float32Array(i), l = Math.PI / 180, p = 0; i > p; ++p)
        e = 2 * p / i - 1, u[p] = (3 + n) * e * 20 * l / (Math.PI + n * Math.abs(e));
      this.waveShaperNode.curve = u;
    } } }), t.Effects.Flanger = function(e) {
      this.options = {}, e = e || this.options;
      var n = { time: 0.45, speed: 0.2, depth: 0.1, feedback: 0.1, mix: 0.5 };
      this.inputNode = t.context.createGain(), this.outputNode = t.context.createGain(), this.inputFeedbackNode = t.context.createGain(), this.wetGainNode = t.context.createGain(), this.dryGainNode = t.context.createGain(), this.delayNode = t.context.createDelay(), this.oscillatorNode = t.context.createOscillator(), this.gainNode = t.context.createGain(), this.feedbackNode = t.context.createGain(), this.oscillatorNode.type = "sine", this.inputNode.connect(this.inputFeedbackNode), this.inputNode.connect(this.dryGainNode), this.inputFeedbackNode.connect(this.delayNode), this.inputFeedbackNode.connect(this.wetGainNode), this.delayNode.connect(this.wetGainNode), this.delayNode.connect(this.feedbackNode), this.feedbackNode.connect(this.inputFeedbackNode), this.oscillatorNode.connect(this.gainNode), this.gainNode.connect(this.delayNode.delayTime), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode), this.oscillatorNode.start(0);
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, t.Effects.Flanger.prototype = Object.create(g, { time: { enumberable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.time = e, this.delayNode.delayTime.value = o.Util.normalize(e, 1e-3, 0.02));
    } }, speed: { enumberable: !0, get: function() {
      return this.options.speed;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.speed = e, this.oscillatorNode.frequency.value = o.Util.normalize(e, 0.5, 5));
    } }, depth: { enumberable: !0, get: function() {
      return this.options.depth;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.depth = e, this.gainNode.gain.value = o.Util.normalize(e, 5e-4, 5e-3));
    } }, feedback: { enumberable: !0, get: function() {
      return this.options.feedback;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.feedback = e, this.feedbackNode.gain.value = o.Util.normalize(e, 0, 0.8));
    } }, mix: { enumberable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = t.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = t.Util.getWetLevel(this.mix));
    } } }), t.Effects.StereoPanner = function(e) {
      this.options = {}, e = e || this.options;
      var n = { pan: 0 };
      this.inputNode = t.context.createGain(), this.outputNode = t.context.createGain(), t.context.createStereoPanner ? (this.pannerNode = t.context.createStereoPanner(), this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : t.context.createPanner ? (console.warn("Your browser does not support the StereoPannerNode. Will use PannerNode instead."), this.pannerNode = t.context.createPanner(), this.pannerNode.type = "equalpower", this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : (console.warn("Your browser does not support the Panner effect."), this.inputNode.connect(this.outputNode));
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, t.Effects.StereoPanner.prototype = Object.create(g, { pan: { enumerable: !0, get: function() {
      return this.options.pan;
    }, set: function(e) {
      if (o.Util.isInRange(e, -1, 1) && (this.options.pan = e, this.pannerNode)) {
        var n = this.pannerNode.toString().indexOf("StereoPannerNode") > -1;
        n ? this.pannerNode.pan.value = e : this.pannerNode.setPosition(e, 0, 1 - Math.abs(e));
      }
    } } }), t.Effects.Convolver = function(e, n) {
      this.options = {}, e = e || this.options;
      var i = this, u = new XMLHttpRequest(), l = { mix: 0.5 };
      this.callback = n, this.inputNode = t.context.createGain(), this.convolverNode = t.context.createConvolver(), this.outputNode = t.context.createGain(), this.wetGainNode = t.context.createGain(), this.dryGainNode = t.context.createGain(), this.inputNode.connect(this.convolverNode), this.convolverNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var p in l)
        this[p] = e[p], this[p] = this[p] === void 0 || this[p] === null ? l[p] : this[p];
      return e.impulse ? (u.open("GET", e.impulse, !0), u.responseType = "arraybuffer", u.onload = function(U) {
        var F = U.target.response;
        t.context.decodeAudioData(F, function(T) {
          i.convolverNode.buffer = T, i.callback && o.Util.isFunction(i.callback) && i.callback();
        }, function(T) {
          T = T || new Error("Error decoding impulse file"), i.callback && o.Util.isFunction(i.callback) && i.callback(T);
        });
      }, u.onreadystatechange = function(U) {
        u.readyState === 4 && u.status !== 200 && console.error("Error while fetching " + e.impulse + ". " + u.statusText);
      }, void u.send()) : void console.error("No impulse file specified.");
    }, t.Effects.Convolver.prototype = Object.create(g, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = t.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = t.Util.getWetLevel(this.mix));
    } } }), t.Effects.PingPongDelay = function(e) {
      this.options = {}, e = e || this.options;
      var n = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = t.context.createGain(), this.outputNode = t.context.createGain(), this.delayNodeLeft = t.context.createDelay(), this.delayNodeRight = t.context.createDelay(), this.dryGainNode = t.context.createGain(), this.wetGainNode = t.context.createGain(), this.feedbackGainNode = t.context.createGain(), this.channelMerger = t.context.createChannelMerger(2), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNodeLeft.connect(this.channelMerger, 0, 0), this.delayNodeRight.connect(this.channelMerger, 0, 1), this.delayNodeLeft.connect(this.delayNodeRight), this.feedbackGainNode.connect(this.delayNodeLeft), this.delayNodeRight.connect(this.feedbackGainNode), this.inputNode.connect(this.feedbackGainNode), this.channelMerger.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, t.Effects.PingPongDelay.prototype = Object.create(g, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = t.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = t.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 180) && (this.options.time = e, this.delayNodeLeft.delayTime.value = e, this.delayNodeRight.delayTime.value = e);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.feedback = parseFloat(e, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), t.Effects.Reverb = function(e) {
      this.options = {}, e = e || this.options;
      var n = { mix: 0.5, time: 0.01, decay: 0.01, reverse: !1 };
      this.inputNode = t.context.createGain(), this.reverbNode = t.context.createConvolver(), this.outputNode = t.context.createGain(), this.wetGainNode = t.context.createGain(), this.dryGainNode = t.context.createGain(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
      h.bind(this)();
    }, t.Effects.Reverb.prototype = Object.create(g, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = t.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = t.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 1e-4, 10) && (this.options.time = e, h.bind(this)());
    } }, decay: { enumerable: !0, get: function() {
      return this.options.decay;
    }, set: function(e) {
      o.Util.isInRange(e, 1e-4, 10) && (this.options.decay = e, h.bind(this)());
    } }, reverse: { enumerable: !0, get: function() {
      return this.options.reverse;
    }, set: function(e) {
      o.Util.isBool(e) && (this.options.reverse = e, h.bind(this)());
    } } }), t.Effects.Tremolo = function(e) {
      this.options = {}, e = e || this.options;
      var n = { speed: 4, depth: 1, mix: 0.8 };
      this.inputNode = t.context.createGain(), this.outputNode = t.context.createGain(), this.dryGainNode = t.context.createGain(), this.wetGainNode = t.context.createGain(), this.tremoloGainNode = t.context.createGain(), this.tremoloGainNode.gain.value = 0, this.lfoNode = t.context.createOscillator(), this.shaperNode = t.context.createWaveShaper(), this.shaperNode.curve = new Float32Array([0, 1]), this.shaperNode.connect(this.tremoloGainNode.gain), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.lfoNode.connect(this.shaperNode), this.lfoNode.type = "sine", this.lfoNode.start(0), this.inputNode.connect(this.tremoloGainNode), this.tremoloGainNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, t.Effects.Tremolo.prototype = Object.create(g, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = t.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = t.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 20) && (this.options.speed = e, this.lfoNode.frequency.value = e);
    } }, depth: { enumerable: !0, get: function() {
      return this.options.depth;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.depth = e, this.shaperNode.curve = new Float32Array([1 - e, 1]));
    } } }), t.Effects.DubDelay = function(e) {
      this.options = {}, e = e || this.options;
      var n = { feedback: 0.6, time: 0.7, mix: 0.5, cutoff: 700 };
      this.inputNode = t.context.createGain(), this.outputNode = t.context.createGain(), this.dryGainNode = t.context.createGain(), this.wetGainNode = t.context.createGain(), this.feedbackGainNode = t.context.createGain(), this.delayNode = t.context.createDelay(), this.bqFilterNode = t.context.createBiquadFilter(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.bqFilterNode), this.bqFilterNode.connect(this.delayNode), this.delayNode.connect(this.feedbackGainNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, t.Effects.DubDelay.prototype = Object.create(g, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = t.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = t.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 180) && (this.options.time = e, this.delayNode.delayTime.value = e);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.feedback = parseFloat(e, 10), this.feedbackGainNode.gain.value = this.feedback);
    } }, cutoff: { enumerable: !0, get: function() {
      return this.options.cutoff;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 4e3) && (this.options.cutoff = e, this.bqFilterNode.frequency.value = this.cutoff);
    } } }), t.Effects.RingModulator = function(e) {
      this.options = {}, e = e || this.options;
      var n = { speed: 30, distortion: 1, mix: 0.5 };
      this.inputNode = t.context.createGain(), this.outputNode = t.context.createGain(), this.dryGainNode = t.context.createGain(), this.wetGainNode = t.context.createGain(), this.vIn = t.context.createOscillator(), this.vIn.start(0), this.vInGain = t.context.createGain(), this.vInGain.gain.value = 0.5, this.vInInverter1 = t.context.createGain(), this.vInInverter1.gain.value = -1, this.vInInverter2 = t.context.createGain(), this.vInInverter2.gain.value = -1, this.vInDiode1 = new s(t.context), this.vInDiode2 = new s(t.context), this.vInInverter3 = t.context.createGain(), this.vInInverter3.gain.value = -1, this.vcInverter1 = t.context.createGain(), this.vcInverter1.gain.value = -1, this.vcDiode3 = new s(t.context), this.vcDiode4 = new s(t.context), this.outGain = t.context.createGain(), this.outGain.gain.value = 3, this.compressor = t.context.createDynamicsCompressor(), this.compressor.threshold.value = -24, this.compressor.ratio.value = 16, this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.vcInverter1), this.inputNode.connect(this.vcDiode4.node), this.vcInverter1.connect(this.vcDiode3.node), this.vIn.connect(this.vInGain), this.vInGain.connect(this.vInInverter1), this.vInGain.connect(this.vcInverter1), this.vInGain.connect(this.vcDiode4.node), this.vInInverter1.connect(this.vInInverter2), this.vInInverter1.connect(this.vInDiode2.node), this.vInInverter2.connect(this.vInDiode1.node), this.vInDiode1.connect(this.vInInverter3), this.vInDiode2.connect(this.vInInverter3), this.vInInverter3.connect(this.compressor), this.vcDiode3.connect(this.compressor), this.vcDiode4.connect(this.compressor), this.compressor.connect(this.outGain), this.outGain.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    };
    var s = function(e) {
      this.context = e, this.node = this.context.createWaveShaper(), this.vb = 0.2, this.vl = 0.4, this.h = 1, this.setCurve();
    };
    return s.prototype.setDistortion = function(e) {
      return this.h = e, this.setCurve();
    }, s.prototype.setCurve = function() {
      var e, n, i, u, l, p, U;
      for (n = 1024, l = new Float32Array(n), e = p = 0, U = l.length; U >= 0 ? U > p : p > U; e = U >= 0 ? ++p : --p)
        i = (e - n / 2) / (n / 2), i = Math.abs(i), u = i <= this.vb ? 0 : this.vb < i && i <= this.vl ? this.h * (Math.pow(i - this.vb, 2) / (2 * this.vl - 2 * this.vb)) : this.h * i - this.h * this.vl + this.h * (Math.pow(this.vl - this.vb, 2) / (2 * this.vl - 2 * this.vb)), l[e] = u;
      return this.node.curve = l;
    }, s.prototype.connect = function(e) {
      return this.node.connect(e);
    }, t.Effects.RingModulator.prototype = Object.create(g, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = t.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = t.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 2e3) && (this.options.speed = e, this.vIn.frequency.value = e);
    } }, distortion: { enumerable: !0, get: function() {
      return this.options.distortion;
    }, set: function(e) {
      if (o.Util.isInRange(e, 0.2, 50)) {
        this.options.distortion = parseFloat(e, 10);
        for (var n = [this.vInDiode1, this.vInDiode2, this.vcDiode3, this.vcDiode4], i = 0, u = n.length; u > i; i++)
          n[i].setDistortion(e);
      }
    } } }), t.Effects.Quadrafuzz = function(e) {
      this.options = {}, e = e || this.options;
      var n = { lowGain: 0.6, midLowGain: 0.8, midHighGain: 0.5, highGain: 0.6 };
      this.inputNode = o.context.createGain(), this.outputNode = o.context.createGain(), this.dryGainNode = o.context.createGain(), this.wetGainNode = o.context.createGain(), this.lowpassLeft = o.context.createBiquadFilter(), this.lowpassLeft.type = "lowpass", this.lowpassLeft.frequency.value = 147, this.lowpassLeft.Q.value = 0.7071, this.bandpass1Left = o.context.createBiquadFilter(), this.bandpass1Left.type = "bandpass", this.bandpass1Left.frequency.value = 587, this.bandpass1Left.Q.value = 0.7071, this.bandpass2Left = o.context.createBiquadFilter(), this.bandpass2Left.type = "bandpass", this.bandpass2Left.frequency.value = 2490, this.bandpass2Left.Q.value = 0.7071, this.highpassLeft = o.context.createBiquadFilter(), this.highpassLeft.type = "highpass", this.highpassLeft.frequency.value = 4980, this.highpassLeft.Q.value = 0.7071, this.overdrives = [];
      for (var i = 0; 4 > i; i++)
        this.overdrives[i] = o.context.createWaveShaper(), this.overdrives[i].curve = d();
      this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode);
      var u = [this.lowpassLeft, this.bandpass1Left, this.bandpass2Left, this.highpassLeft];
      for (i = 0; i < u.length; i++)
        this.wetGainNode.connect(u[i]), u[i].connect(this.overdrives[i]), this.overdrives[i].connect(this.outputNode);
      for (var l in n)
        this[l] = e[l], this[l] = this[l] === void 0 || this[l] === null ? n[l] : this[l];
    }, t.Effects.Quadrafuzz.prototype = Object.create(g, { lowGain: { enumerable: !0, get: function() {
      return this.options.lowGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.lowGain = e, this.overdrives[0].curve = d(o.Util.normalize(this.lowGain, 0, 150)));
    } }, midLowGain: { enumerable: !0, get: function() {
      return this.options.midLowGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.midLowGain = e, this.overdrives[1].curve = d(o.Util.normalize(this.midLowGain, 0, 150)));
    } }, midHighGain: { enumerable: !0, get: function() {
      return this.options.midHighGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.midHighGain = e, this.overdrives[2].curve = d(o.Util.normalize(this.midHighGain, 0, 150)));
    } }, highGain: { enumerable: !0, get: function() {
      return this.options.highGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.highGain = e, this.overdrives[3].curve = d(o.Util.normalize(this.highGain, 0, 150)));
    } } }), t;
  })(typeof window < "u" ? window : Re);
})(Ie);
const Q = 22e3, K = 0;
function je(r) {
  const { src: c, duration: a } = r, { annotations: h, playhead: d, transportState: t, setTransport: o, setTransportState: f } = L(), x = M(null), v = M(new j.Effects.LowPassFilter({ frequency: Q, peak: 10 })), b = M(new j.Effects.HighPassFilter({ frequency: K, peak: 10 }));
  _(E(
    () => {
      let s, e, n, i;
      switch (t.type) {
        case "stop":
          b.current.frequency = K, v.current.frequency = Q, d.x = t.progress;
          break;
        case "play":
          b.current.frequency = K, v.current.frequency = Q, s = (Date.now() - t.timeRef) / 1e3, d.x = t.progress + s / a;
          break;
        case "loop":
          if (s = (Date.now() - t.timeRef) / 1e3, d.x = t.progress + s / a, e = h.get(t.annotation.id), e == null)
            return g();
          n = e.rect, i = e.unit, e.yaxis.unit === "hertz" ? (b.current.frequency = i.y, v.current.frequency = i.y + i.height) : (b.current.frequency = K, v.current.frequency = Q), (d.x < n.x || d.x >= n.x + n.width) && y(e);
          break;
      }
    },
    [h, t, a]
  ));
  const N = E(
    () => {
      f((s) => {
        if (x.current == null)
          return s;
        switch (s.type) {
          case "stop":
            return x.current.play(0, s.progress * a), ue(s.progress, Date.now());
          case "play":
          case "loop":
            return s;
        }
      });
    },
    [a]
  ), y = E(
    (s) => {
      const { rect: e, unit: n } = s;
      f((i) => x.current == null ? i : (x.current.stop(), x.current.play(0, n.x), Ue(e.x, Date.now(), s)));
    },
    []
  ), g = E(
    () => {
      f((s) => {
        if (x.current == null)
          return s;
        switch (s.type) {
          case "stop":
            return s;
          case "play":
          case "loop":
            x.current.stop();
            const e = (Date.now() - s.timeRef) / 1e3;
            return te(s.progress + e / a);
        }
      });
    },
    [a]
  ), w = E(
    (s) => {
      f((e) => {
        if (x.current == null)
          return e;
        switch (e.type) {
          case "stop":
            return te(s);
          case "play":
          case "loop":
            return x.current.stop(), x.current.play(0, s * a), ue(s, Date.now());
        }
      });
    },
    [a]
  );
  return H(
    () => {
      const s = new j.Sound(
        c,
        (e) => {
          if (e)
            return console.error(e);
          x.current != null && x.current.stop(), s.addEffect(v.current), s.addEffect(b.current), x.current = s, o({ play: N, loop: y, stop: g, seek: w });
        }
      );
      return g;
    },
    [c, N, y, g, w]
  ), /* @__PURE__ */ G(be, {});
}
function Ve(r) {
  const { state: c, setState: a, value: h, unit: d } = r, { input: t } = L(), o = M(null), f = 5 * Math.PI / 4, x = -Math.PI / 4, { x: v, y: b } = D(
    () => {
      const N = f - c * (f - x);
      return { x: Math.cos(N) * 4 / 5, y: -Math.sin(N) * 4 / 5 };
    },
    [c]
  );
  return H(
    () => {
      const N = o.current;
      function y(g) {
        g.preventDefault();
        const w = g.deltaY / (t.ctrl ? 1e4 : 1e3);
        a(w);
      }
      return N.addEventListener("wheel", y, { passive: !1 }), () => {
        N.removeEventListener("wheel", y);
      };
    },
    [a]
  ), /* @__PURE__ */ W(
    "svg",
    {
      ref: o,
      width: "60",
      height: "60",
      viewBox: "-1.1 -1.1 2.2 2.2",
      children: [
        /* @__PURE__ */ G("path", { className: "encoder", d: `
      M ${Math.cos(f)} ${-Math.sin(f)}
      A 1 1 0 1 1 ${Math.cos(x)} ${-Math.sin(x)}
    ` }),
        /* @__PURE__ */ G(
          "circle",
          {
            className: "encoder-marker",
            cx: v,
            cy: b,
            r: "0.10"
          }
        ),
        /* @__PURE__ */ G(
          "text",
          {
            className: "encoder-text",
            textAnchor: "middle",
            x: "0",
            y: "0.15",
            children: h.toFixed(2)
          }
        ),
        /* @__PURE__ */ G(
          "text",
          {
            className: "encoder-text",
            textAnchor: "middle",
            x: "0",
            y: "0.45",
            children: d
          }
        )
      ]
    }
  );
}
function xe(r) {
  return Math.sqrt(r.x * r.x + r.y * r.y);
}
function V(r) {
  r.setAttribute("display", "none");
}
function ee(r) {
  r.setAttribute("display", "inline");
}
function Me(r, c, a = String) {
  c.x < 0.5 ? ($(r, c.x, void 0, a), r.setAttribute("text-anchor", "start")) : ($(r, c.x, void 0, a), r.setAttribute("text-anchor", "end")), c.y < 0.5 ? (B(r, c.y + 0.01, void 0, a), r.setAttribute("dominant-baseline", "hanging")) : (B(r, c.y - 0.01, void 0, a), r.setAttribute("dominant-baseline", "text-top"));
}
function ze(r, c) {
  r.setAttribute("d", c);
}
function Ae(r, c, a = String) {
  r.setAttribute("x", a(c.x)), r.setAttribute("y", a(c.y)), r.setAttribute("width", a(c.width)), r.setAttribute("height", a(c.height));
}
function Ee(r, c) {
  r.textContent = c;
}
function Le(r, c, a) {
  r.setAttribute(
    "transform",
    `translate(${-c.x}, ${-c.y}) scale(${a.x}, ${a.y})`
  );
}
function $(r, c, a = c, h = String) {
  switch (r.constructor) {
    case SVGTextElement:
      r.setAttribute("x", h(c));
    case SVGLineElement:
      r.setAttribute("x1", h(c)), r.setAttribute("x2", h(a));
      break;
    case SVGRectElement:
      r.setAttribute("x", h(c)), r.setAttribute("width", h(a));
  }
}
function B(r, c, a = c, h = String) {
  switch (r.constructor) {
    case SVGTextElement:
      r.setAttribute("y", h(c));
    case SVGLineElement:
      r.setAttribute("y1", h(c)), r.setAttribute("y2", h(a));
      break;
    case SVGRectElement:
      r.setAttribute("y", h(c)), r.setAttribute("height", h(a));
  }
}
function me(r) {
  const { xaxis: c, yaxis: a } = r, { annotations: h, playhead: d, transportState: t } = L(), o = M(null);
  return _(E(
    () => {
      const f = o.current;
      let x, v;
      switch (t.type) {
        case "stop":
        case "play":
          $(f, d.x), B(f, 0, 1);
          break;
        case "loop":
          if (x = h.get(t.annotation.id), x == null)
            return;
          v = P(x.rect, c === x.xaxis, a === x.yaxis), $(f, d.x), B(f, v.y, v.y + v.height);
          break;
      }
    },
    [h, t]
  )), /* @__PURE__ */ G(
    "line",
    {
      ref: o,
      className: "playhead",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "100%"
    }
  );
}
function ge(r) {
  const { annotation: c, xaxis: a, yaxis: h } = r, { selection: d } = L(), t = D(
    () => P(c.rect, a == c.xaxis, h == c.yaxis),
    [c, a, h]
  );
  return /* @__PURE__ */ G(
    "rect",
    {
      className: d.has(c.id) ? "annotation annotation-selected" : "annotation",
      x: String(t.x),
      y: String(t.y),
      width: String(t.width),
      height: String(t.height)
    },
    c.id
  );
}
const Z = () => {
};
function We(r) {
  const { src: c, xaxis: a, yaxis: h } = r, { annotations: d, command: t, input: o, mouseup: f, mouseRect: x, scroll: v, zoom: b, toolState: N, transportState: y } = L(), g = M(null), w = M(null);
  _(E(
    () => {
      ze(w.current, `
        M 0 0
        h 1
        v 1
        h -1
        z
        M ${v.x / b.x} ${v.y / b.y}
        v ${1 / b.y}
        h ${1 / b.x}
        v ${-1 / b.y}
        z
      `);
    },
    []
  ));
  const s = pe({
    xaxis: null,
    yaxis: null,
    onContextMenu: Z,
    onMouseDown: Z,
    onMouseEnter: Z,
    onMouseLeave: Z,
    onMouseMove: E(
      (e) => {
        o.buttons & 1 && t.scroll(
          e.movementX / e.currentTarget.clientWidth * b.x,
          e.movementY / e.currentTarget.clientHeight * b.y
        );
      },
      [N]
    ),
    onMouseUp: E(
      (e) => {
        if (o.buttons & 1 && xe({ x: x.width, y: x.height }) < 0.01)
          switch (N) {
            case "annotate":
            case "select":
            case "pan":
              t.scrollTo({
                x: f.rel.x * b.x - 0.5,
                y: f.rel.y * b.y - 0.5
              });
              break;
            case "zoom":
              t.resetView();
              break;
          }
      },
      [N]
    )
  });
  return ve(g, 1), /* @__PURE__ */ G(
    "div",
    {
      className: `navigator ${N} ${y.type}`,
      children: /* @__PURE__ */ W(
        "svg",
        {
          ref: g,
          width: "100%",
          height: "100%",
          viewBox: "0 0 1 1",
          preserveAspectRatio: "none",
          ...s,
          children: [
            /* @__PURE__ */ G(
              "image",
              {
                href: c,
                width: "100%",
                height: "100%",
                preserveAspectRatio: "none"
              }
            ),
            Array.from(d.values()).map(
              (e) => /* @__PURE__ */ G(
                ge,
                {
                  annotation: e,
                  xaxis: a,
                  yaxis: h
                },
                e.id
              )
            ),
            /* @__PURE__ */ G(
              "path",
              {
                ref: w,
                className: "mask",
                d: ""
              }
            ),
            /* @__PURE__ */ G(me, { xaxis: a, yaxis: h })
          ]
        }
      )
    }
  );
}
function Te(r) {
  const { parent: c, xaxis: a, yaxis: h } = r, { input: d, mouseup: t, unitUp: o } = L(), f = M(null), x = M(null), v = M(null), b = M(null);
  return _(E(
    () => {
      const N = f.current;
      if (d.alt) {
        const y = x.current, g = v.current, w = b.current;
        let s, e;
        ee(N), c.current == d.focus || a == d.xaxis ? (s = re(a, o.x), $(y, t.rel.x, void 0, oe), ee(y)) : (s = "", V(y)), c.current == d.focus || h == d.yaxis ? (e = re(h, o.y), B(g, t.rel.y, void 0, oe), ee(g)) : (e = "", V(g)), Ee(w, s && e ? `(${s}, ${e})` : s || e), Me(w, t.rel, oe);
      } else
        V(N);
    },
    [a, h]
  )), /* @__PURE__ */ W("g", { ref: f, children: [
    /* @__PURE__ */ G(
      "line",
      {
        ref: x,
        className: "cursor-x",
        x1: "0",
        y1: "0",
        x2: "0",
        y2: "100%"
      }
    ),
    /* @__PURE__ */ G(
      "line",
      {
        ref: v,
        className: "cursor-y",
        x1: "0",
        y1: "0",
        x2: "100%",
        y2: "0"
      }
    ),
    /* @__PURE__ */ G(
      "text",
      {
        ref: b,
        className: "cursor-text",
        x: "0",
        y: "0",
        children: "0:00"
      }
    )
  ] });
}
const J = () => {
};
function $e(r) {
  const { src: c, xaxis: a, yaxis: h } = r, { command: d, input: t, mouseup: o, mouseRect: f, unitDown: x, unitUp: v, scroll: b, zoom: N } = L(), { toolState: y, transportState: g, transport: w } = L(), { annotations: s } = L(), { selection: e } = L(), n = M(null), i = M(null), u = M(null);
  _(E(
    () => {
      const p = i.current, U = u.current;
      switch (Le(p, b, N), y) {
        case "annotate":
        case "select":
        case "zoom":
          t.buttons & 1 ? (ee(U), Ae(U, P(f, a === t.xaxis, h === t.yaxis))) : V(U);
          break;
        case "pan":
          V(U);
          break;
      }
    },
    [y, a, h]
  ));
  const l = pe({
    xaxis: a,
    yaxis: h,
    onContextMenu: J,
    onMouseDown: J,
    onMouseEnter: J,
    onMouseLeave: J,
    onMouseMove: E(
      (p) => {
        if (t.buttons & 1) {
          const U = p.movementX / p.currentTarget.clientWidth, F = p.movementY / p.currentTarget.clientHeight;
          switch (y) {
            case "annotate":
            case "select":
            case "zoom":
              break;
            case "pan":
              e.size == 0 ? d.scroll(-U, -F) : d.moveSelection(U, F);
              break;
          }
        }
      },
      [y, e, a, h]
    ),
    onMouseUp: E(
      (p) => {
        if (t.buttons & 1)
          if (xe({ x: f.width, y: f.height }) < 0.01)
            switch (y) {
              case "annotate":
                d.deselect();
                break;
              case "select":
                d.selectPoint(o.abs);
                break;
              case "zoom":
                d.zoomPoint(o.abs);
                break;
            }
          else
            switch (y) {
              case "annotate":
                d.annotate({ ...f }, de(x, v), a, h);
                break;
              case "select":
                d.selectArea(f);
                break;
              case "zoom":
                d.zoomArea(f);
                break;
            }
        t.buttons & 2 && w.seek(o.abs.x);
      },
      [s, y, w, a, h]
    )
  });
  return ve(n, -1), /* @__PURE__ */ G(
    "div",
    {
      className: `visualization ${y} ${g.type}`,
      children: /* @__PURE__ */ W(
        "svg",
        {
          ref: n,
          width: "100%",
          height: "100%",
          ...l,
          children: [
            /* @__PURE__ */ G(
              "svg",
              {
                width: "100%",
                height: "100%",
                viewBox: "0 0 1 1",
                preserveAspectRatio: "none",
                children: /* @__PURE__ */ W(
                  "g",
                  {
                    ref: i,
                    width: "1",
                    height: "1",
                    children: [
                      /* @__PURE__ */ G(
                        "image",
                        {
                          preserveAspectRatio: "none",
                          href: c,
                          width: "100%",
                          height: "100%"
                        }
                      ),
                      Array.from(s.values()).map(
                        (p) => /* @__PURE__ */ G(
                          ge,
                          {
                            annotation: p,
                            xaxis: a,
                            yaxis: h
                          },
                          p.id
                        )
                      ),
                      /* @__PURE__ */ G(
                        "rect",
                        {
                          ref: u,
                          className: "selection",
                          x: "0",
                          y: "0",
                          width: "0",
                          height: "0"
                        }
                      ),
                      /* @__PURE__ */ G(me, { xaxis: a, yaxis: h })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ G(Te, { parent: n, xaxis: a, yaxis: h })
          ]
        }
      )
    }
  );
}
export {
  je as Audio,
  Ve as Encoder,
  We as Navigator,
  qe as Specviz,
  $e as Visualization,
  L as useSpecviz
};
