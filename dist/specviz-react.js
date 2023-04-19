import { jsx as S, Fragment as bt, jsxs as $ } from "react/jsx-runtime";
import { createContext as wt, useContext as Gt, useEffect as B, useMemo as P, useState as q, useRef as z, useCallback as L } from "react";
import { computeUnit as _, computeRect as O, computeRectInverse as St, formatUnit as rt } from "./axis.js";
import { fromPoints as dt, intersectRect as ct, logical as F, intersectPoint as at } from "./rect.js";
import { randomBytes as Ut, formatPercent as ot } from "./format.js";
function I(s, c, a) {
  return Math.min(Math.max(s, c), a);
}
function ut(s, c) {
  return { type: "play", progress: s, timeRef: c };
}
function et(s) {
  return { type: "stop", progress: s };
}
function Rt(s, c, a) {
  return { type: "loop", progress: s, timeRef: c, annotation: a };
}
const ft = wt({
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
    setRectX1: () => {
      console.error("command.setRectX1 called outside of Specviz context");
    },
    setRectX2: () => {
      console.error("command.setRectX2 called outside of Specviz context");
    },
    setRectY: () => {
      console.error("command.setRectY called outside of Specviz context");
    },
    setRectY1: () => {
      console.error("command.setRectY1 called outside of Specviz context");
    },
    setRectY2: () => {
      console.error("command.setRectY2 called outside of Specviz context");
    },
    tool: () => {
      console.error("command.tool called outside of Specviz context");
    },
    zoom: () => {
      console.error("command.zoom called outside of Specviz context");
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
  transportState: et(0),
  setAnnotations: (s) => {
    console.error("setAnnotations called outside of Specviz context");
  },
  setSelection: (s) => {
    console.error("setSelection called outside of Specviz context");
  },
  setTransport: (s) => {
    console.error("setTransport called outside of Specviz context");
  },
  setTransportState: (s) => {
    console.error("setTransportState called outside of Specviz context");
  }
});
function X(s) {
  B(
    () => {
      let c;
      function a(h) {
        s(h), c = window.requestAnimationFrame(a);
      }
      return c = window.requestAnimationFrame(a), () => {
        window.cancelAnimationFrame(c);
      };
    },
    [s]
  );
}
function pt(s) {
  const { input: c, mousedown: a, mouseup: h, mouseRect: l, unitDown: n, unitUp: o, scroll: v, zoom: p } = T();
  return P(
    () => ({
      onContextMenu(d) {
        d.preventDefault(), s.onContextMenu(d);
      },
      onMouseDown(d) {
        d.preventDefault(), c.buttons = d.buttons, s.onMouseDown(d);
      },
      onMouseMove(d) {
        const b = d.currentTarget.getBoundingClientRect(), N = (d.clientX - b.x) / b.width, y = (d.clientY - b.y) / b.height;
        c.buttons & 1 ? (h.rel.x = N, h.rel.y = y, h.abs.x = (N + v.x) / p.x, h.abs.y = (y + v.y) / p.y, s.xaxis != null && (o.x = _(s.xaxis, I(h.abs.x, 0, 1))), s.yaxis != null && (o.y = _(s.yaxis, I(h.abs.y, 0, 1)))) : (a.rel.x = h.rel.x = N, a.rel.y = h.rel.y = y, a.abs.x = h.abs.x = (N + v.x) / p.x, a.abs.y = h.abs.y = (y + v.y) / p.y, s.xaxis != null && (n.x = o.x = _(s.xaxis, I(a.abs.x, 0, 1))), s.yaxis != null && (n.y = o.y = _(s.yaxis, I(a.abs.y, 0, 1))));
        const G = dt(a.abs, h.abs);
        l.x = G.x, l.y = G.y, l.width = G.width, l.height = G.height, s.onMouseMove(d);
      },
      onMouseUp(d) {
        s.onMouseUp(d), c.buttons = 0;
      },
      onMouseEnter(d) {
        c.focus = d.currentTarget, s.xaxis != null && (c.xaxis = s.xaxis), s.yaxis != null && (c.yaxis = s.yaxis), s.onMouseEnter(d);
      },
      onMouseLeave(d) {
        s.onMouseLeave(d), c.buttons = 0, c.focus = null, c.xaxis = null, c.yaxis = null;
      }
    }),
    [
      s.xaxis,
      s.yaxis,
      s.onMouseDown,
      s.onMouseMove,
      s.onMouseUp,
      s.onMouseLeave,
      s.onContextMenu
    ]
  );
}
function st() {
  return P(
    () => {
      let s = 0, c = 0;
      return {
        get x() {
          return s;
        },
        get y() {
          return c;
        },
        set x(a) {
          s = a;
        },
        set y(a) {
          c = a;
        }
      };
    },
    []
  );
}
function ht() {
  return P(
    () => {
      let s = 0, c = 0, a = 0, h = 0;
      return {
        abs: {
          get x() {
            return s;
          },
          set x(l) {
            s = l;
          },
          get y() {
            return c;
          },
          set y(l) {
            c = l;
          }
        },
        rel: {
          get x() {
            return a;
          },
          set x(l) {
            a = l;
          },
          get y() {
            return h;
          },
          set y(l) {
            h = l;
          }
        }
      };
    },
    []
  );
}
function kt() {
  return P(
    () => {
      let s = 0, c = 0, a = 0, h = 0;
      return {
        get x() {
          return s;
        },
        get y() {
          return c;
        },
        set x(l) {
          s = l;
        },
        set y(l) {
          c = l;
        },
        get width() {
          return a;
        },
        set width(l) {
          a = l;
        },
        get height() {
          return h;
        },
        set height(l) {
          h = l;
        }
      };
    },
    []
  );
}
function vt(s, c) {
  const { command: a, mousedown: h, zoom: l } = T();
  B(
    () => {
      const n = s.current;
      function o(v) {
        v.preventDefault();
        const p = v.deltaX / n.clientWidth, d = v.deltaY / n.clientHeight;
        v.altKey ? (a.zoom(
          p * c,
          d * c
        ), a.scrollTo({
          x: h.abs.x * l.x - h.rel.x,
          y: h.abs.y * l.y - h.rel.y
        })) : a.scroll(
          -p * c,
          -d * c
        );
      }
      return n.addEventListener("wheel", o, { passive: !1 }), () => {
        n.removeEventListener("wheel", o);
      };
    },
    [c]
  );
}
function T() {
  return Gt(ft);
}
const lt = 5, H = () => {
};
function Vt(s) {
  const { initAnnotations: c, children: a } = s, [h, l] = q(() => c ?? /* @__PURE__ */ new Map()), [n, o] = q(() => /* @__PURE__ */ new Set()), v = P(
    () => {
      let e = 0, i = !1, r = !1, u = null, f = null, g = null;
      return {
        get buttons() {
          return e;
        },
        set buttons(R) {
          e = R;
        },
        get alt() {
          return i;
        },
        set alt(R) {
          i = R;
        },
        get ctrl() {
          return r;
        },
        set ctrl(R) {
          r = R;
        },
        get focus() {
          return u;
        },
        set focus(R) {
          u = R;
        },
        get xaxis() {
          return f;
        },
        set xaxis(R) {
          f = R;
        },
        get yaxis() {
          return g;
        },
        set yaxis(R) {
          g = R;
        }
      };
    },
    []
  ), p = P(
    () => {
      let e = 1, i = 1;
      return {
        get x() {
          return e;
        },
        get y() {
          return i;
        },
        set x(r) {
          e = I(r, 1, lt);
        },
        set y(r) {
          i = I(r, 1, lt);
        }
      };
    },
    []
  ), d = P(
    () => {
      let e = 0, i = 0;
      return {
        get x() {
          return e;
        },
        get y() {
          return i;
        },
        set x(r) {
          e = I(r, 0, p.x - 1);
        },
        set y(r) {
          i = I(r, 0, p.y - 1);
        }
      };
    },
    []
  ), w = P(
    () => ({
      annotate(e, i, r, u) {
        const f = Ut(10), g = { id: f, rect: e, unit: i, xaxis: r, yaxis: u };
        l((R) => new Map(R).set(f, g)), o(/* @__PURE__ */ new Set([g.id]));
      },
      delete() {
        l((e) => {
          const i = new Map(e);
          for (const r of n)
            i.delete(r);
          return i;
        }), o(/* @__PURE__ */ new Set());
      },
      deselect() {
        o(/* @__PURE__ */ new Set());
      },
      moveSelection(e, i) {
        l((r) => {
          let u;
          return new Map(Array.from(
            r,
            ([f, g]) => [
              f,
              n.has(g.id) ? {
                ...g,
                rect: u = {
                  x: I(g.rect.x + (v.xaxis == g.xaxis ? e : 0), 0, 1 - g.rect.width),
                  y: I(g.rect.y + (v.yaxis == g.yaxis ? i : 0), 0, 1 - g.rect.height),
                  width: g.rect.width,
                  height: g.rect.height
                },
                unit: O(g.xaxis, g.yaxis, u)
              } : g
            ]
          ));
        });
      },
      resetView() {
        p.x = 1, p.y = 1, d.x = 0, d.y = 0;
      },
      scroll(e, i) {
        d.x += e, d.y += i;
      },
      scrollTo(e) {
        d.x = e.x, d.y = e.y;
      },
      selectArea(e) {
        o((i) => {
          if (v.ctrl) {
            const r = new Set(i);
            for (const u of h.values())
              ct(F(u.rect, v.xaxis == u.xaxis, v.yaxis == u.yaxis), e) && (r.has(u.id) ? r.delete(u.id) : r.add(u.id));
            return r;
          } else {
            const r = /* @__PURE__ */ new Set();
            for (const u of h.values())
              ct(F(u.rect, v.xaxis == u.xaxis, v.yaxis == u.yaxis), e) && r.add(u.id);
            return r;
          }
        });
      },
      selectPoint(e) {
        o((i) => {
          if (v.ctrl) {
            const r = new Set(i);
            for (const u of h.values())
              at(F(u.rect, v.xaxis == u.xaxis, v.yaxis == u.yaxis), e) && (r.has(u.id) ? r.delete(u.id) : r.add(u.id));
            return r;
          } else {
            const r = /* @__PURE__ */ new Set();
            for (const u of h.values())
              at(F(u.rect, v.xaxis == u.xaxis, v.yaxis == u.yaxis), e) && r.add(u.id);
            return r;
          }
        });
      },
      setRectX(e, i) {
        l((r) => {
          const u = new Map(r), f = {
            x: I(e.rect.x + i, 0, 1 - e.rect.width),
            y: e.rect.y,
            width: e.rect.width,
            height: e.rect.height
          };
          return u.set(
            e.id,
            { ...e, rect: f, unit: O(e.xaxis, e.yaxis, f) }
          );
        });
      },
      setRectX1(e, i) {
      },
      setRectX2(e, i) {
        l((r) => {
          const u = new Map(r), f = {
            x: e.rect.x,
            y: e.rect.y,
            width: I(e.rect.width + i, 0.01, 1 - e.rect.x),
            height: e.rect.height
          };
          return u.set(
            e.id,
            { ...e, rect: f, unit: O(e.xaxis, e.yaxis, f) }
          );
        });
      },
      setRectY(e, i) {
        l((r) => {
          const u = new Map(r), f = {
            x: e.rect.x,
            y: I(e.rect.y + i, 0, 1 - e.rect.height),
            width: e.rect.width,
            height: e.rect.height
          };
          return u.set(
            e.id,
            { ...e, rect: f, unit: O(e.xaxis, e.yaxis, f) }
          );
        });
      },
      setRectY1(e, i) {
        l((r) => {
          const u = new Map(r), f = {
            x: e.rect.x,
            y: I(e.rect.y + i, 0, e.rect.y + e.rect.height - 0.01),
            width: e.rect.width,
            height: I(e.rect.height - Math.max(i, -e.rect.y), 0.01, 1 - e.rect.y)
          };
          return u.set(
            e.id,
            { ...e, rect: f, unit: O(e.xaxis, e.yaxis, f) }
          );
        });
      },
      setRectY2(e, i) {
        l((r) => {
          const u = new Map(r), f = {
            x: e.rect.x,
            y: e.rect.y,
            width: e.rect.width,
            height: I(e.rect.height + i, 0.01, 1 - e.rect.y)
          };
          return u.set(
            e.id,
            { ...e, rect: f, unit: O(e.xaxis, e.yaxis, f) }
          );
        });
      },
      tool(e) {
        N(e);
      },
      zoom(e, i) {
        p.x += e, p.y += i;
      },
      zoomArea(e) {
        p.x = 1 / e.width, p.y = 1 / e.height, d.x = -0.5 + (e.x + e.width / 2) * p.x, d.y = -0.5 + (e.y + e.height / 2) * p.y;
      },
      zoomPoint(e) {
        const i = e.x * p.x - d.x, r = e.y * p.y - d.y;
        p.x += 0.5, p.y += 0.5, d.x = e.x * p.x - i, d.y = e.y * p.y - r;
      }
    }),
    [h, n]
  ), [b, N] = q("annotate"), [y, G] = q({
    play: H,
    loop: H,
    stop: H,
    seek: H
  }), [x, t] = q(et(0));
  return B(
    () => {
      function e(r) {
        r.key == "Alt" ? v.alt = !0 : r.key == "Control" && (v.ctrl = !0);
      }
      function i(r) {
        r.key == "Alt" ? v.alt = !1 : r.key == "Control" && (v.ctrl = !1);
      }
      return window.addEventListener("keydown", e), window.addEventListener("keyup", i), () => {
        window.removeEventListener("keydown", e), window.removeEventListener("keyup", i);
      };
    },
    []
  ), /* @__PURE__ */ S(ft.Provider, { value: {
    annotations: h,
    input: v,
    mousedown: ht(),
    mouseup: ht(),
    mouseRect: kt(),
    unitDown: st(),
    unitUp: st(),
    scroll: d,
    zoom: p,
    playhead: st(),
    selection: n,
    command: w,
    toolState: b,
    transport: y,
    transportState: x,
    setAnnotations: l,
    setSelection: o,
    setTransport: G,
    setTransportState: t
  }, children: a });
}
var It = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, j = {}, Mt = {
  get exports() {
    return j;
  },
  set exports(s) {
    j = s;
  }
};
(function(s) {
  (function(c) {
    function a(t, e) {
      this.options = {}, t = t || this.options;
      var i = { frequency: 350, peak: 1 };
      this.inputNode = this.filterNode = o.context.createBiquadFilter(), this.filterNode.type = e, this.outputNode = n.context.createGain(), this.filterNode.connect(this.outputNode);
      for (var r in i)
        this[r] = t[r], this[r] = this[r] === void 0 || this[r] === null ? i[r] : this[r];
    }
    function h() {
      var t, e, i = o.context.sampleRate * this.time, r = n.context.createBuffer(2, i, o.context.sampleRate), u = r.getChannelData(0), f = r.getChannelData(1);
      for (e = 0; i > e; e++)
        t = this.reverse ? i - e : e, u[e] = (2 * Math.random() - 1) * Math.pow(1 - t / i, this.decay), f[e] = (2 * Math.random() - 1) * Math.pow(1 - t / i, this.decay);
      this.reverbNode.buffer && (this.inputNode.disconnect(this.reverbNode), this.reverbNode.disconnect(this.wetGainNode), this.reverbNode = n.context.createConvolver(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode)), this.reverbNode.buffer = r;
    }
    function l(t) {
      for (var e = o.context.sampleRate, i = new Float32Array(e), r = Math.PI / 180, u = 0; e > u; u++) {
        var f = 2 * u / e - 1;
        i[u] = (3 + t) * f * 20 * r / (Math.PI + t * Math.abs(f));
      }
      return i;
    }
    var n = {}, o = n, v = s.exports;
    v ? s.exports = n : c.Pizzicato = c.Pz = n;
    var p = c.AudioContext || c.webkitAudioContext;
    if (!p)
      return void console.error("No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.");
    n.context = new p();
    var d = n.context.createGain();
    d.connect(n.context.destination), n.Util = { isString: function(t) {
      return toString.call(t) === "[object String]";
    }, isObject: function(t) {
      return toString.call(t) === "[object Object]";
    }, isFunction: function(t) {
      return toString.call(t) === "[object Function]";
    }, isNumber: function(t) {
      return toString.call(t) === "[object Number]" && t === +t;
    }, isArray: function(t) {
      return toString.call(t) === "[object Array]";
    }, isInRange: function(t, e, i) {
      return o.Util.isNumber(t) && o.Util.isNumber(e) && o.Util.isNumber(i) ? t >= e && i >= t : !1;
    }, isBool: function(t) {
      return typeof t == "boolean";
    }, isOscillator: function(t) {
      return t && t.toString() === "[object OscillatorNode]";
    }, isAudioBufferSourceNode: function(t) {
      return t && t.toString() === "[object AudioBufferSourceNode]";
    }, isSound: function(t) {
      return t instanceof o.Sound;
    }, isEffect: function(t) {
      for (var e in n.Effects)
        if (t instanceof n.Effects[e])
          return !0;
      return !1;
    }, normalize: function(t, e, i) {
      return o.Util.isNumber(t) && o.Util.isNumber(e) && o.Util.isNumber(i) ? (i - e) * t / 1 + e : void 0;
    }, getDryLevel: function(t) {
      return !o.Util.isNumber(t) || t > 1 || 0 > t ? 0 : 0.5 >= t ? 1 : 1 - 2 * (t - 0.5);
    }, getWetLevel: function(t) {
      return !o.Util.isNumber(t) || t > 1 || 0 > t ? 0 : t >= 0.5 ? 1 : 1 - 2 * (0.5 - t);
    } };
    var w = n.context.createGain(), b = Object.getPrototypeOf(Object.getPrototypeOf(w)), N = b.connect;
    b.connect = function(t) {
      var e = o.Util.isEffect(t) ? t.inputNode : t;
      return N.call(this, e), t;
    }, Object.defineProperty(n, "volume", { enumerable: !0, get: function() {
      return d.gain.value;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && d && (d.gain.value = t);
    } }), Object.defineProperty(n, "masterGainNode", { enumerable: !1, get: function() {
      return d;
    }, set: function(t) {
      console.error("Can't set the master gain node");
    } }), n.Events = { on: function(t, e, i) {
      if (t && e) {
        this._events = this._events || {};
        var r = this._events[t] || (this._events[t] = []);
        r.push({ callback: e, context: i || this, handler: this });
      }
    }, trigger: function(t) {
      if (t) {
        var e, i, r, u;
        if (this._events = this._events || {}, e = this._events[t] || (this._events[t] = [])) {
          for (i = Math.max(0, arguments.length - 1), r = [], u = 0; i > u; u++)
            r[u] = arguments[u + 1];
          for (u = 0; u < e.length; u++)
            e[u].callback.apply(e[u].context, r);
        }
      }
    }, off: function(t) {
      t ? this._events[t] = void 0 : this._events = {};
    } }, n.Sound = function(t, e) {
      function i(m) {
        var k = ["wave", "file", "input", "script", "sound"];
        if (m && !U.isFunction(m) && !U.isString(m) && !U.isObject(m))
          return "Description type not supported. Initialize a sound using an object, a function or a string.";
        if (U.isObject(m)) {
          if (!U.isString(m.source) || k.indexOf(m.source) === -1)
            return "Specified source not supported. Sources can be wave, file, input or script";
          if (!(m.source !== "file" || m.options && m.options.path))
            return "A path is needed for sounds with a file source";
          if (!(m.source !== "script" || m.options && m.options.audioFunction))
            return "An audio function is needed for sounds with a script source";
        }
      }
      function r(m, k) {
        m = m || {}, this.getRawSourceNode = function() {
          var M = this.sourceNode ? this.sourceNode.frequency.value : m.frequency, A = n.context.createOscillator();
          return A.type = m.type || "sine", A.frequency.value = M || 440, A;
        }, this.sourceNode = this.getRawSourceNode(), this.sourceNode.gainSuccessor = o.context.createGain(), this.sourceNode.connect(this.sourceNode.gainSuccessor), U.isFunction(k) && k();
      }
      function u(m, k) {
        m = U.isArray(m) ? m : [m];
        var M = new XMLHttpRequest();
        M.open("GET", m[0], !0), M.responseType = "arraybuffer", M.onload = function(A) {
          n.context.decodeAudioData(A.target.response, function(E) {
            D.getRawSourceNode = function() {
              var it = n.context.createBufferSource();
              return it.loop = this.loop, it.buffer = E, it;
            }, U.isFunction(k) && k();
          }.bind(D), function(E) {
            return console.error("Error decoding audio file " + m[0]), m.length > 1 ? (m.shift(), void u(m, k)) : (E = E || new Error("Error decoding audio file " + m[0]), void (U.isFunction(k) && k(E)));
          }.bind(D));
        }, M.onreadystatechange = function(A) {
          M.readyState === 4 && M.status !== 200 && console.error("Error while fetching " + m[0] + ". " + M.statusText);
        }, M.send();
      }
      function f(m, k) {
        if (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, !navigator.getUserMedia && !navigator.mediaDevices.getUserMedia)
          return void console.error("Your browser does not support getUserMedia");
        var M = function(E) {
          D.getRawSourceNode = function() {
            return n.context.createMediaStreamSource(E);
          }, U.isFunction(k) && k();
        }.bind(D), A = function(E) {
          U.isFunction(k) && k(E);
        };
        navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({ audio: !0 }).then(M).catch(A) : navigator.getUserMedia({ audio: !0 }, M, A);
      }
      function g(m, k) {
        var M = U.isFunction(m) ? m : m.audioFunction, A = U.isObject(m) && m.bufferSize ? m.bufferSize : null;
        if (!A)
          try {
            n.context.createScriptProcessor();
          } catch {
            A = 2048;
          }
        this.getRawSourceNode = function() {
          var E = n.context.createScriptProcessor(A, 1, 1);
          return E.onaudioprocess = M, E;
        };
      }
      function R(m, k) {
        this.getRawSourceNode = m.sound.getRawSourceNode, m.sound.sourceNode && o.Util.isOscillator(m.sound.sourceNode) && (this.sourceNode = this.getRawSourceNode(), this.frequency = m.sound.frequency);
      }
      var D = this, U = n.Util, nt = i(t), C = U.isObject(t) && U.isObject(t.options), yt = 0.04, Nt = 0.04;
      if (nt)
        throw console.error(nt), new Error("Error initializing Pizzicato Sound: " + nt);
      this.detached = C && t.options.detached, this.masterVolume = n.context.createGain(), this.fadeNode = n.context.createGain(), this.fadeNode.gain.value = 0, this.detached || this.masterVolume.connect(n.masterGainNode), this.lastTimePlayed = 0, this.effects = [], this.effectConnectors = [], this.playing = this.paused = !1, this.loop = C && t.options.loop, this.attack = C && U.isNumber(t.options.attack) ? t.options.attack : yt, this.volume = C && U.isNumber(t.options.volume) ? t.options.volume : 1, C && U.isNumber(t.options.release) ? this.release = t.options.release : C && U.isNumber(t.options.sustain) ? (console.warn("'sustain' is deprecated. Use 'release' instead."), this.release = t.options.sustain) : this.release = Nt, t ? U.isString(t) ? u.bind(this)(t, e) : U.isFunction(t) ? g.bind(this)(t, e) : t.source === "file" ? u.bind(this)(t.options.path, e) : t.source === "wave" ? r.bind(this)(t.options, e) : t.source === "input" ? f.bind(this)(t, e) : t.source === "script" ? g.bind(this)(t.options, e) : t.source === "sound" && R.bind(this)(t.options, e) : r.bind(this)({}, e);
    }, n.Sound.prototype = Object.create(n.Events, { play: { enumerable: !0, value: function(t, e) {
      this.playing || (o.Util.isNumber(e) || (e = this.offsetTime || 0), o.Util.isNumber(t) || (t = 0), this.playing = !0, this.paused = !1, this.sourceNode = this.getSourceNode(), this.applyAttack(), o.Util.isFunction(this.sourceNode.start) && (this.lastTimePlayed = n.context.currentTime - e, this.sourceNode.start(o.context.currentTime + t, e)), this.trigger("play"));
    } }, stop: { enumerable: !0, value: function() {
      (this.paused || this.playing) && (this.paused = this.playing = !1, this.stopWithRelease(), this.offsetTime = 0, this.trigger("stop"));
    } }, pause: { enumerable: !0, value: function() {
      if (!this.paused && this.playing) {
        this.paused = !0, this.playing = !1, this.stopWithRelease();
        var t = o.context.currentTime - this.lastTimePlayed;
        this.sourceNode.buffer ? this.offsetTime = t % (this.sourceNode.buffer.length / o.context.sampleRate) : this.offsetTime = t, this.trigger("pause");
      }
    } }, clone: { enumerable: !0, value: function() {
      for (var t = new n.Sound({ source: "sound", options: { loop: this.loop, attack: this.attack, release: this.release, volume: this.volume, sound: this } }), e = 0; e < this.effects.length; e++)
        t.addEffect(this.effects[e]);
      return t;
    } }, onEnded: { enumerable: !0, value: function(t) {
      return function() {
        this.sourceNode && this.sourceNode !== t || (this.playing && this.stop(), this.paused || this.trigger("end"));
      };
    } }, addEffect: { enumerable: !0, value: function(t) {
      if (!o.Util.isEffect(t))
        return console.error("The object provided is not a Pizzicato effect."), this;
      this.effects.push(t);
      var e = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.fadeNode;
      e.disconnect(), e.connect(t);
      var i = o.context.createGain();
      return this.effectConnectors.push(i), t.connect(i), i.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(t) {
      var e = this.effects.indexOf(t);
      if (e === -1)
        return console.warn("Cannot remove effect that is not applied to this sound."), this;
      var i = this.playing;
      i && this.pause();
      var r = e === 0 ? this.fadeNode : this.effectConnectors[e - 1];
      r.disconnect();
      var u = this.effectConnectors[e];
      u.disconnect(), t.disconnect(u), this.effectConnectors.splice(e, 1), this.effects.splice(e, 1);
      var f;
      return f = e > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[e], r.connect(f), i && this.play(), this;
    } }, connect: { enumerable: !0, value: function(t) {
      return this.masterVolume.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.masterVolume.disconnect(t), this;
    } }, connectEffects: { enumerable: !0, value: function() {
      for (var t = [], e = 0; e < this.effects.length; e++) {
        var i = e === this.effects.length - 1, r = i ? this.masterVolume : this.effects[e + 1].inputNode;
        t[e] = o.context.createGain(), this.effects[e].outputNode.disconnect(this.effectConnectors[e]), this.effects[e].outputNode.connect(r);
      }
    } }, volume: { enumerable: !0, get: function() {
      return this.masterVolume ? this.masterVolume.gain.value : void 0;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && this.masterVolume && (this.masterVolume.gain.value = t);
    } }, frequency: { enumerable: !0, get: function() {
      return this.sourceNode && o.Util.isOscillator(this.sourceNode) ? this.sourceNode.frequency.value : null;
    }, set: function(t) {
      this.sourceNode && o.Util.isOscillator(this.sourceNode) && (this.sourceNode.frequency.value = t);
    } }, sustain: { enumerable: !0, get: function() {
      return console.warn("'sustain' is deprecated. Use 'release' instead."), this.release;
    }, set: function(t) {
      console.warn("'sustain' is deprecated. Use 'release' instead."), o.Util.isInRange(t, 0, 10) && (this.release = t);
    } }, getSourceNode: { enumerable: !0, value: function() {
      if (this.sourceNode) {
        var t = this.sourceNode;
        t.gainSuccessor.gain.setValueAtTime(t.gainSuccessor.gain.value, o.context.currentTime), t.gainSuccessor.gain.linearRampToValueAtTime(1e-4, o.context.currentTime + 0.2), setTimeout(function() {
          t.disconnect(), t.gainSuccessor.disconnect();
        }, 200);
      }
      var e = this.getRawSourceNode();
      return e.gainSuccessor = o.context.createGain(), e.connect(e.gainSuccessor), e.gainSuccessor.connect(this.fadeNode), this.fadeNode.connect(this.getInputNode()), o.Util.isAudioBufferSourceNode(e) && (e.onended = this.onEnded(e).bind(this)), e;
    } }, getInputNode: { enumerable: !0, value: function() {
      return this.effects.length > 0 ? this.effects[0].inputNode : this.masterVolume;
    } }, applyAttack: { enumerable: !1, value: function() {
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.attack)
        return void this.fadeNode.gain.setTargetAtTime(1, o.context.currentTime, 1e-3);
      var t = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, e = this.attack;
      t || (e = (1 - this.fadeNode.gain.value) * this.attack), this.fadeNode.gain.setTargetAtTime(1, o.context.currentTime, 2 * e);
    } }, stopWithRelease: { enumerable: !1, value: function(t) {
      var e = this.sourceNode, i = function() {
        return o.Util.isFunction(e.stop) ? e.stop(0) : e.disconnect();
      };
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.release)
        return this.fadeNode.gain.setTargetAtTime(0, o.context.currentTime, 1e-3), void i();
      var r = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, u = this.release;
      r || (u = this.fadeNode.gain.value * this.release), this.fadeNode.gain.setTargetAtTime(1e-5, o.context.currentTime, u / 5), window.setTimeout(function() {
        i();
      }, 1e3 * u);
    } } }), n.Group = function(t) {
      t = t || [], this.mergeGainNode = o.context.createGain(), this.masterVolume = o.context.createGain(), this.sounds = [], this.effects = [], this.effectConnectors = [], this.mergeGainNode.connect(this.masterVolume), this.masterVolume.connect(o.masterGainNode);
      for (var e = 0; e < t.length; e++)
        this.addSound(t[e]);
    }, n.Group.prototype = Object.create(o.Events, { connect: { enumerable: !0, value: function(t) {
      return this.masterVolume.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.masterVolume.disconnect(t), this;
    } }, addSound: { enumerable: !0, value: function(t) {
      return o.Util.isSound(t) ? this.sounds.indexOf(t) > -1 ? void console.warn("The Pizzicato.Sound object was already added to this group") : t.detached ? void console.warn("Groups do not support detached sounds. You can manually create an audio graph to group detached sounds together.") : (t.disconnect(o.masterGainNode), t.connect(this.mergeGainNode), void this.sounds.push(t)) : void console.error("You can only add Pizzicato.Sound objects");
    } }, removeSound: { enumerable: !0, value: function(t) {
      var e = this.sounds.indexOf(t);
      return e === -1 ? void console.warn("Cannot remove a sound that is not part of this group.") : (t.disconnect(this.mergeGainNode), t.connect(o.masterGainNode), void this.sounds.splice(e, 1));
    } }, volume: { enumerable: !0, get: function() {
      return this.masterVolume ? this.masterVolume.gain.value : void 0;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.masterVolume.gain.value = t);
    } }, play: { enumerable: !0, value: function() {
      for (var t = 0; t < this.sounds.length; t++)
        this.sounds[t].play();
      this.trigger("play");
    } }, stop: { enumerable: !0, value: function() {
      for (var t = 0; t < this.sounds.length; t++)
        this.sounds[t].stop();
      this.trigger("stop");
    } }, pause: { enumerable: !0, value: function() {
      for (var t = 0; t < this.sounds.length; t++)
        this.sounds[t].pause();
      this.trigger("pause");
    } }, addEffect: { enumerable: !0, value: function(t) {
      if (!o.Util.isEffect(t))
        return console.error("The object provided is not a Pizzicato effect."), this;
      this.effects.push(t);
      var e = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.mergeGainNode;
      e.disconnect(), e.connect(t);
      var i = o.context.createGain();
      return this.effectConnectors.push(i), t.connect(i), i.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(t) {
      var e = this.effects.indexOf(t);
      if (e === -1)
        return console.warn("Cannot remove effect that is not applied to this group."), this;
      var i = e === 0 ? this.mergeGainNode : this.effectConnectors[e - 1];
      i.disconnect();
      var r = this.effectConnectors[e];
      r.disconnect(), t.disconnect(r), this.effectConnectors.splice(e, 1), this.effects.splice(e, 1);
      var u;
      return u = e > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[e], i.connect(u), this;
    } } }), n.Effects = {};
    var y = Object.create(null, { connect: { enumerable: !0, value: function(t) {
      return this.outputNode.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.outputNode.disconnect(t), this;
    } } });
    n.Effects.Delay = function(t) {
      this.options = {}, t = t || this.options;
      var e = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.feedbackGainNode = n.context.createGain(), this.delayNode = n.context.createDelay(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.delayNode), this.inputNode.connect(this.delayNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    }, n.Effects.Delay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 180) && (this.options.time = t, this.delayNode.delayTime.value = t);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.feedback = parseFloat(t, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), n.Effects.Compressor = function(t) {
      this.options = {}, t = t || this.options;
      var e = { threshold: -24, knee: 30, attack: 3e-3, release: 0.25, ratio: 12 };
      this.inputNode = this.compressorNode = n.context.createDynamicsCompressor(), this.outputNode = n.context.createGain(), this.compressorNode.connect(this.outputNode);
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    }, n.Effects.Compressor.prototype = Object.create(y, { threshold: { enumerable: !0, get: function() {
      return this.compressorNode.threshold.value;
    }, set: function(t) {
      n.Util.isInRange(t, -100, 0) && (this.compressorNode.threshold.value = t);
    } }, knee: { enumerable: !0, get: function() {
      return this.compressorNode.knee.value;
    }, set: function(t) {
      n.Util.isInRange(t, 0, 40) && (this.compressorNode.knee.value = t);
    } }, attack: { enumerable: !0, get: function() {
      return this.compressorNode.attack.value;
    }, set: function(t) {
      n.Util.isInRange(t, 0, 1) && (this.compressorNode.attack.value = t);
    } }, release: { enumerable: !0, get: function() {
      return this.compressorNode.release.value;
    }, set: function(t) {
      n.Util.isInRange(t, 0, 1) && (this.compressorNode.release.value = t);
    } }, ratio: { enumerable: !0, get: function() {
      return this.compressorNode.ratio.value;
    }, set: function(t) {
      n.Util.isInRange(t, 1, 20) && (this.compressorNode.ratio.value = t);
    } }, getCurrentGainReduction: function() {
      return this.compressorNode.reduction;
    } }), n.Effects.LowPassFilter = function(t) {
      a.call(this, t, "lowpass");
    }, n.Effects.HighPassFilter = function(t) {
      a.call(this, t, "highpass");
    };
    var G = Object.create(y, { frequency: { enumerable: !0, get: function() {
      return this.filterNode.frequency.value;
    }, set: function(t) {
      n.Util.isInRange(t, 10, 22050) && (this.filterNode.frequency.value = t);
    } }, peak: { enumerable: !0, get: function() {
      return this.filterNode.Q.value;
    }, set: function(t) {
      n.Util.isInRange(t, 1e-4, 1e3) && (this.filterNode.Q.value = t);
    } } });
    n.Effects.LowPassFilter.prototype = G, n.Effects.HighPassFilter.prototype = G, n.Effects.Distortion = function(t) {
      this.options = {}, t = t || this.options;
      var e = { gain: 0.5 };
      this.waveShaperNode = n.context.createWaveShaper(), this.inputNode = this.outputNode = this.waveShaperNode;
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    }, n.Effects.Distortion.prototype = Object.create(y, { gain: { enumerable: !0, get: function() {
      return this.options.gain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.gain = t, this.adjustGain());
    } }, adjustGain: { writable: !1, configurable: !1, enumerable: !1, value: function() {
      for (var t, e = o.Util.isNumber(this.options.gain) ? parseInt(100 * this.options.gain, 10) : 50, i = 44100, r = new Float32Array(i), u = Math.PI / 180, f = 0; i > f; ++f)
        t = 2 * f / i - 1, r[f] = (3 + e) * t * 20 * u / (Math.PI + e * Math.abs(t));
      this.waveShaperNode.curve = r;
    } } }), n.Effects.Flanger = function(t) {
      this.options = {}, t = t || this.options;
      var e = { time: 0.45, speed: 0.2, depth: 0.1, feedback: 0.1, mix: 0.5 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.inputFeedbackNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.delayNode = n.context.createDelay(), this.oscillatorNode = n.context.createOscillator(), this.gainNode = n.context.createGain(), this.feedbackNode = n.context.createGain(), this.oscillatorNode.type = "sine", this.inputNode.connect(this.inputFeedbackNode), this.inputNode.connect(this.dryGainNode), this.inputFeedbackNode.connect(this.delayNode), this.inputFeedbackNode.connect(this.wetGainNode), this.delayNode.connect(this.wetGainNode), this.delayNode.connect(this.feedbackNode), this.feedbackNode.connect(this.inputFeedbackNode), this.oscillatorNode.connect(this.gainNode), this.gainNode.connect(this.delayNode.delayTime), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode), this.oscillatorNode.start(0);
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    }, n.Effects.Flanger.prototype = Object.create(y, { time: { enumberable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.time = t, this.delayNode.delayTime.value = o.Util.normalize(t, 1e-3, 0.02));
    } }, speed: { enumberable: !0, get: function() {
      return this.options.speed;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.speed = t, this.oscillatorNode.frequency.value = o.Util.normalize(t, 0.5, 5));
    } }, depth: { enumberable: !0, get: function() {
      return this.options.depth;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.depth = t, this.gainNode.gain.value = o.Util.normalize(t, 5e-4, 5e-3));
    } }, feedback: { enumberable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.feedback = t, this.feedbackNode.gain.value = o.Util.normalize(t, 0, 0.8));
    } }, mix: { enumberable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } } }), n.Effects.StereoPanner = function(t) {
      this.options = {}, t = t || this.options;
      var e = { pan: 0 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), n.context.createStereoPanner ? (this.pannerNode = n.context.createStereoPanner(), this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : n.context.createPanner ? (console.warn("Your browser does not support the StereoPannerNode. Will use PannerNode instead."), this.pannerNode = n.context.createPanner(), this.pannerNode.type = "equalpower", this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : (console.warn("Your browser does not support the Panner effect."), this.inputNode.connect(this.outputNode));
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    }, n.Effects.StereoPanner.prototype = Object.create(y, { pan: { enumerable: !0, get: function() {
      return this.options.pan;
    }, set: function(t) {
      if (o.Util.isInRange(t, -1, 1) && (this.options.pan = t, this.pannerNode)) {
        var e = this.pannerNode.toString().indexOf("StereoPannerNode") > -1;
        e ? this.pannerNode.pan.value = t : this.pannerNode.setPosition(t, 0, 1 - Math.abs(t));
      }
    } } }), n.Effects.Convolver = function(t, e) {
      this.options = {}, t = t || this.options;
      var i = this, r = new XMLHttpRequest(), u = { mix: 0.5 };
      this.callback = e, this.inputNode = n.context.createGain(), this.convolverNode = n.context.createConvolver(), this.outputNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.inputNode.connect(this.convolverNode), this.convolverNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var f in u)
        this[f] = t[f], this[f] = this[f] === void 0 || this[f] === null ? u[f] : this[f];
      return t.impulse ? (r.open("GET", t.impulse, !0), r.responseType = "arraybuffer", r.onload = function(g) {
        var R = g.target.response;
        n.context.decodeAudioData(R, function(D) {
          i.convolverNode.buffer = D, i.callback && o.Util.isFunction(i.callback) && i.callback();
        }, function(D) {
          D = D || new Error("Error decoding impulse file"), i.callback && o.Util.isFunction(i.callback) && i.callback(D);
        });
      }, r.onreadystatechange = function(g) {
        r.readyState === 4 && r.status !== 200 && console.error("Error while fetching " + t.impulse + ". " + r.statusText);
      }, void r.send()) : void console.error("No impulse file specified.");
    }, n.Effects.Convolver.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } } }), n.Effects.PingPongDelay = function(t) {
      this.options = {}, t = t || this.options;
      var e = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.delayNodeLeft = n.context.createDelay(), this.delayNodeRight = n.context.createDelay(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.feedbackGainNode = n.context.createGain(), this.channelMerger = n.context.createChannelMerger(2), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNodeLeft.connect(this.channelMerger, 0, 0), this.delayNodeRight.connect(this.channelMerger, 0, 1), this.delayNodeLeft.connect(this.delayNodeRight), this.feedbackGainNode.connect(this.delayNodeLeft), this.delayNodeRight.connect(this.feedbackGainNode), this.inputNode.connect(this.feedbackGainNode), this.channelMerger.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    }, n.Effects.PingPongDelay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 180) && (this.options.time = t, this.delayNodeLeft.delayTime.value = t, this.delayNodeRight.delayTime.value = t);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.feedback = parseFloat(t, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), n.Effects.Reverb = function(t) {
      this.options = {}, t = t || this.options;
      var e = { mix: 0.5, time: 0.01, decay: 0.01, reverse: !1 };
      this.inputNode = n.context.createGain(), this.reverbNode = n.context.createConvolver(), this.outputNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
      h.bind(this)();
    }, n.Effects.Reverb.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      o.Util.isInRange(t, 1e-4, 10) && (this.options.time = t, h.bind(this)());
    } }, decay: { enumerable: !0, get: function() {
      return this.options.decay;
    }, set: function(t) {
      o.Util.isInRange(t, 1e-4, 10) && (this.options.decay = t, h.bind(this)());
    } }, reverse: { enumerable: !0, get: function() {
      return this.options.reverse;
    }, set: function(t) {
      o.Util.isBool(t) && (this.options.reverse = t, h.bind(this)());
    } } }), n.Effects.Tremolo = function(t) {
      this.options = {}, t = t || this.options;
      var e = { speed: 4, depth: 1, mix: 0.8 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.tremoloGainNode = n.context.createGain(), this.tremoloGainNode.gain.value = 0, this.lfoNode = n.context.createOscillator(), this.shaperNode = n.context.createWaveShaper(), this.shaperNode.curve = new Float32Array([0, 1]), this.shaperNode.connect(this.tremoloGainNode.gain), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.lfoNode.connect(this.shaperNode), this.lfoNode.type = "sine", this.lfoNode.start(0), this.inputNode.connect(this.tremoloGainNode), this.tremoloGainNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    }, n.Effects.Tremolo.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 20) && (this.options.speed = t, this.lfoNode.frequency.value = t);
    } }, depth: { enumerable: !0, get: function() {
      return this.options.depth;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.depth = t, this.shaperNode.curve = new Float32Array([1 - t, 1]));
    } } }), n.Effects.DubDelay = function(t) {
      this.options = {}, t = t || this.options;
      var e = { feedback: 0.6, time: 0.7, mix: 0.5, cutoff: 700 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.feedbackGainNode = n.context.createGain(), this.delayNode = n.context.createDelay(), this.bqFilterNode = n.context.createBiquadFilter(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.bqFilterNode), this.bqFilterNode.connect(this.delayNode), this.delayNode.connect(this.feedbackGainNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    }, n.Effects.DubDelay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 180) && (this.options.time = t, this.delayNode.delayTime.value = t);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.feedback = parseFloat(t, 10), this.feedbackGainNode.gain.value = this.feedback);
    } }, cutoff: { enumerable: !0, get: function() {
      return this.options.cutoff;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 4e3) && (this.options.cutoff = t, this.bqFilterNode.frequency.value = this.cutoff);
    } } }), n.Effects.RingModulator = function(t) {
      this.options = {}, t = t || this.options;
      var e = { speed: 30, distortion: 1, mix: 0.5 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.vIn = n.context.createOscillator(), this.vIn.start(0), this.vInGain = n.context.createGain(), this.vInGain.gain.value = 0.5, this.vInInverter1 = n.context.createGain(), this.vInInverter1.gain.value = -1, this.vInInverter2 = n.context.createGain(), this.vInInverter2.gain.value = -1, this.vInDiode1 = new x(n.context), this.vInDiode2 = new x(n.context), this.vInInverter3 = n.context.createGain(), this.vInInverter3.gain.value = -1, this.vcInverter1 = n.context.createGain(), this.vcInverter1.gain.value = -1, this.vcDiode3 = new x(n.context), this.vcDiode4 = new x(n.context), this.outGain = n.context.createGain(), this.outGain.gain.value = 3, this.compressor = n.context.createDynamicsCompressor(), this.compressor.threshold.value = -24, this.compressor.ratio.value = 16, this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.vcInverter1), this.inputNode.connect(this.vcDiode4.node), this.vcInverter1.connect(this.vcDiode3.node), this.vIn.connect(this.vInGain), this.vInGain.connect(this.vInInverter1), this.vInGain.connect(this.vcInverter1), this.vInGain.connect(this.vcDiode4.node), this.vInInverter1.connect(this.vInInverter2), this.vInInverter1.connect(this.vInDiode2.node), this.vInInverter2.connect(this.vInDiode1.node), this.vInDiode1.connect(this.vInInverter3), this.vInDiode2.connect(this.vInInverter3), this.vInInverter3.connect(this.compressor), this.vcDiode3.connect(this.compressor), this.vcDiode4.connect(this.compressor), this.compressor.connect(this.outGain), this.outGain.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in e)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? e[i] : this[i];
    };
    var x = function(t) {
      this.context = t, this.node = this.context.createWaveShaper(), this.vb = 0.2, this.vl = 0.4, this.h = 1, this.setCurve();
    };
    return x.prototype.setDistortion = function(t) {
      return this.h = t, this.setCurve();
    }, x.prototype.setCurve = function() {
      var t, e, i, r, u, f, g;
      for (e = 1024, u = new Float32Array(e), t = f = 0, g = u.length; g >= 0 ? g > f : f > g; t = g >= 0 ? ++f : --f)
        i = (t - e / 2) / (e / 2), i = Math.abs(i), r = i <= this.vb ? 0 : this.vb < i && i <= this.vl ? this.h * (Math.pow(i - this.vb, 2) / (2 * this.vl - 2 * this.vb)) : this.h * i - this.h * this.vl + this.h * (Math.pow(this.vl - this.vb, 2) / (2 * this.vl - 2 * this.vb)), u[t] = r;
      return this.node.curve = u;
    }, x.prototype.connect = function(t) {
      return this.node.connect(t);
    }, n.Effects.RingModulator.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 2e3) && (this.options.speed = t, this.vIn.frequency.value = t);
    } }, distortion: { enumerable: !0, get: function() {
      return this.options.distortion;
    }, set: function(t) {
      if (o.Util.isInRange(t, 0.2, 50)) {
        this.options.distortion = parseFloat(t, 10);
        for (var e = [this.vInDiode1, this.vInDiode2, this.vcDiode3, this.vcDiode4], i = 0, r = e.length; r > i; i++)
          e[i].setDistortion(t);
      }
    } } }), n.Effects.Quadrafuzz = function(t) {
      this.options = {}, t = t || this.options;
      var e = { lowGain: 0.6, midLowGain: 0.8, midHighGain: 0.5, highGain: 0.6 };
      this.inputNode = o.context.createGain(), this.outputNode = o.context.createGain(), this.dryGainNode = o.context.createGain(), this.wetGainNode = o.context.createGain(), this.lowpassLeft = o.context.createBiquadFilter(), this.lowpassLeft.type = "lowpass", this.lowpassLeft.frequency.value = 147, this.lowpassLeft.Q.value = 0.7071, this.bandpass1Left = o.context.createBiquadFilter(), this.bandpass1Left.type = "bandpass", this.bandpass1Left.frequency.value = 587, this.bandpass1Left.Q.value = 0.7071, this.bandpass2Left = o.context.createBiquadFilter(), this.bandpass2Left.type = "bandpass", this.bandpass2Left.frequency.value = 2490, this.bandpass2Left.Q.value = 0.7071, this.highpassLeft = o.context.createBiquadFilter(), this.highpassLeft.type = "highpass", this.highpassLeft.frequency.value = 4980, this.highpassLeft.Q.value = 0.7071, this.overdrives = [];
      for (var i = 0; 4 > i; i++)
        this.overdrives[i] = o.context.createWaveShaper(), this.overdrives[i].curve = l();
      this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode);
      var r = [this.lowpassLeft, this.bandpass1Left, this.bandpass2Left, this.highpassLeft];
      for (i = 0; i < r.length; i++)
        this.wetGainNode.connect(r[i]), r[i].connect(this.overdrives[i]), this.overdrives[i].connect(this.outputNode);
      for (var u in e)
        this[u] = t[u], this[u] = this[u] === void 0 || this[u] === null ? e[u] : this[u];
    }, n.Effects.Quadrafuzz.prototype = Object.create(y, { lowGain: { enumerable: !0, get: function() {
      return this.options.lowGain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.lowGain = t, this.overdrives[0].curve = l(o.Util.normalize(this.lowGain, 0, 150)));
    } }, midLowGain: { enumerable: !0, get: function() {
      return this.options.midLowGain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.midLowGain = t, this.overdrives[1].curve = l(o.Util.normalize(this.midLowGain, 0, 150)));
    } }, midHighGain: { enumerable: !0, get: function() {
      return this.options.midHighGain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.midHighGain = t, this.overdrives[2].curve = l(o.Util.normalize(this.midHighGain, 0, 150)));
    } }, highGain: { enumerable: !0, get: function() {
      return this.options.highGain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.highGain = t, this.overdrives[3].curve = l(o.Util.normalize(this.highGain, 0, 150)));
    } } }), n;
  })(typeof window < "u" ? window : It);
})(Mt);
function zt(s, c, a, h) {
  return s.addEventListener(c, a, h), () => s.removeEventListener(c, a, h);
}
const Q = 22e3, K = 0;
function $t(s) {
  const { src: c, duration: a } = s, { annotations: h, playhead: l, transportState: n, setTransport: o, setTransportState: v } = T(), p = z(null), d = z(new j.Effects.LowPassFilter({ frequency: Q, peak: 10 })), w = z(new j.Effects.HighPassFilter({ frequency: K, peak: 10 }));
  X(L(
    () => {
      let x, t, e, i;
      switch (n.type) {
        case "stop":
          w.current.frequency = K, d.current.frequency = Q, l.x = n.progress;
          break;
        case "play":
          w.current.frequency = K, d.current.frequency = Q, x = (Date.now() - n.timeRef) / 1e3, l.x = n.progress + x / a;
          break;
        case "loop":
          if (x = (Date.now() - n.timeRef) / 1e3, l.x = n.progress + x / a, t = h.get(n.annotation.id), t == null)
            return y();
          e = t.rect, i = t.unit, t.yaxis.unit === "hertz" ? (w.current.frequency = i.y, d.current.frequency = i.y + i.height) : (w.current.frequency = K, d.current.frequency = Q), (l.x < e.x || l.x >= e.x + e.width) && N(t);
          break;
      }
    },
    [h, n, a]
  ));
  const b = L(
    () => {
      v((x) => {
        if (p.current == null)
          return x;
        switch (x.type) {
          case "stop":
            return p.current.play(0, x.progress * a), ut(x.progress, Date.now());
          case "play":
          case "loop":
            return x;
        }
      });
    },
    [a]
  ), N = L(
    (x) => {
      const { rect: t, unit: e } = x;
      v((i) => p.current == null ? i : (p.current.stop(), p.current.play(0, e.x), Rt(t.x, Date.now(), x)));
    },
    []
  ), y = L(
    () => {
      v((x) => {
        if (p.current == null)
          return x;
        switch (x.type) {
          case "stop":
            return x;
          case "play":
          case "loop":
            p.current.stop();
            const t = (Date.now() - x.timeRef) / 1e3;
            return et(x.progress + t / a);
        }
      });
    },
    [a]
  ), G = L(
    (x) => {
      v((t) => {
        if (p.current == null)
          return t;
        switch (t.type) {
          case "stop":
            return et(x);
          case "play":
          case "loop":
            return p.current.stop(), p.current.play(0, x * a), ut(x, Date.now());
        }
      });
    },
    [a]
  );
  return B(
    () => {
      const x = zt(window, "blur", y), t = new j.Sound(
        c,
        (e) => {
          if (e)
            return console.error(e);
          p.current != null && p.current.stop(), t.addEffect(d.current), t.addEffect(w.current), p.current = t, o({ play: b, loop: N, stop: y, seek: G });
        }
      );
      return () => {
        y(), x();
      };
    },
    [c, b, N, y, G]
  ), /* @__PURE__ */ S(bt, {});
}
function Wt(s) {
  const { state: c, setState: a, value: h, unit: l } = s, { input: n } = T(), o = z(null), v = 5 * Math.PI / 4, p = -Math.PI / 4, { x: d, y: w } = P(
    () => {
      const b = v - c * (v - p);
      return { x: Math.cos(b) * 4 / 5, y: -Math.sin(b) * 4 / 5 };
    },
    [c]
  );
  return B(
    () => {
      const b = o.current;
      function N(y) {
        y.preventDefault();
        const G = y.deltaY / (n.ctrl ? 1e4 : 1e3);
        a(G);
      }
      return b.addEventListener("wheel", N, { passive: !1 }), () => {
        b.removeEventListener("wheel", N);
      };
    },
    [a]
  ), /* @__PURE__ */ $(
    "svg",
    {
      ref: o,
      width: "60",
      height: "60",
      viewBox: "-1.1 -1.1 2.2 2.2",
      children: [
        /* @__PURE__ */ S("path", { className: "encoder", d: `
      M ${Math.cos(v)} ${-Math.sin(v)}
      A 1 1 0 1 1 ${Math.cos(p)} ${-Math.sin(p)}
    ` }),
        /* @__PURE__ */ S(
          "circle",
          {
            className: "encoder-marker",
            cx: d,
            cy: w,
            r: "0.10"
          }
        ),
        /* @__PURE__ */ S(
          "text",
          {
            className: "encoder-text",
            textAnchor: "middle",
            x: "0",
            y: "0.15",
            children: h.toFixed(2)
          }
        ),
        /* @__PURE__ */ S(
          "text",
          {
            className: "encoder-text",
            textAnchor: "middle",
            x: "0",
            y: "0.45",
            children: l
          }
        )
      ]
    }
  );
}
function xt(s) {
  return Math.sqrt(s.x * s.x + s.y * s.y);
}
function V(s) {
  s.setAttribute("display", "none");
}
function tt(s) {
  s.setAttribute("display", "inline");
}
function At(s, c, a = String) {
  c.x < 0.5 ? (W(s, c.x, void 0, a), s.setAttribute("text-anchor", "start")) : (W(s, c.x, void 0, a), s.setAttribute("text-anchor", "end")), c.y < 0.5 ? (Y(s, c.y + 0.01, void 0, a), s.setAttribute("dominant-baseline", "hanging")) : (Y(s, c.y - 0.01, void 0, a), s.setAttribute("dominant-baseline", "text-top"));
}
function Et(s, c) {
  s.setAttribute("d", c);
}
function Lt(s, c, a = String) {
  s.setAttribute("x", a(c.x)), s.setAttribute("y", a(c.y)), s.setAttribute("width", a(c.width)), s.setAttribute("height", a(c.height));
}
function Tt(s, c) {
  s.textContent = c;
}
function Dt(s, c, a) {
  s.setAttribute(
    "transform",
    `translate(${-c.x}, ${-c.y}) scale(${a.x}, ${a.y})`
  );
}
function W(s, c, a = c, h = String) {
  switch (s.constructor) {
    case SVGTextElement:
      s.setAttribute("x", h(c));
    case SVGLineElement:
      s.setAttribute("x1", h(c)), s.setAttribute("x2", h(a));
      break;
    case SVGRectElement:
      s.setAttribute("x", h(c)), s.setAttribute("width", h(a));
  }
}
function Y(s, c, a = c, h = String) {
  switch (s.constructor) {
    case SVGTextElement:
      s.setAttribute("y", h(c));
    case SVGLineElement:
      s.setAttribute("y1", h(c)), s.setAttribute("y2", h(a));
      break;
    case SVGRectElement:
      s.setAttribute("y", h(c)), s.setAttribute("height", h(a));
  }
}
function mt(s) {
  const { xaxis: c, yaxis: a } = s, { annotations: h, playhead: l, transportState: n } = T(), o = z(null);
  return X(L(
    () => {
      const v = o.current;
      let p, d;
      switch (n.type) {
        case "stop":
        case "play":
          W(v, l.x), Y(v, 0, 1);
          break;
        case "loop":
          if (p = h.get(n.annotation.id), p == null)
            return;
          d = F(p.rect, c === p.xaxis, a === p.yaxis), W(v, l.x), Y(v, d.y, d.y + d.height);
          break;
      }
    },
    [h, n]
  )), /* @__PURE__ */ S(
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
function gt(s) {
  const { annotation: c, xaxis: a, yaxis: h } = s, { selection: l } = T(), n = P(
    () => F(c.rect, a == c.xaxis, h == c.yaxis),
    [c, a, h]
  );
  return /* @__PURE__ */ S(
    "rect",
    {
      className: l.has(c.id) ? "annotation annotation-selected" : "annotation",
      x: String(n.x),
      y: String(n.y),
      width: String(n.width),
      height: String(n.height)
    },
    c.id
  );
}
function Yt(s, c) {
  const a = /* @__PURE__ */ new Map();
  for (const h of s) {
    const l = c.get(h.xunit), n = c.get(h.yunit);
    if (l == null || n == null) {
      console.error("missing axis context for annotation:", h);
      continue;
    }
    const o = St(l, n, h.unit);
    a.set(h.id, { id: h.id, rect: o, unit: h.unit, xaxis: l, yaxis: n });
  }
  return a;
}
function Bt(s) {
  return Array.from(s.values(), (c) => ({
    id: c.id,
    unit: c.unit,
    xunit: c.xaxis.unit,
    yunit: c.yaxis.unit
  }));
}
const Z = () => {
};
function Xt(s) {
  const { src: c, xaxis: a, yaxis: h } = s, { annotations: l, command: n, input: o, mouseup: v, mouseRect: p, scroll: d, zoom: w, toolState: b, transportState: N } = T(), y = z(null), G = z(null);
  X(L(
    () => {
      Et(G.current, `
        M 0 0
        h 1
        v 1
        h -1
        z
        M ${d.x / w.x} ${d.y / w.y}
        v ${1 / w.y}
        h ${1 / w.x}
        v ${-1 / w.y}
        z
      `);
    },
    []
  ));
  const x = pt({
    onContextMenu: Z,
    onMouseDown: Z,
    onMouseEnter: Z,
    onMouseLeave: Z,
    onMouseMove: L(
      (t) => {
        o.buttons & 1 && n.scroll(
          t.movementX / t.currentTarget.clientWidth * w.x,
          t.movementY / t.currentTarget.clientHeight * w.y
        );
      },
      [b]
    ),
    onMouseUp: L(
      (t) => {
        if (o.buttons & 1 && xt({ x: p.width, y: p.height }) < 0.01)
          switch (b) {
            case "annotate":
            case "select":
            case "pan":
              n.scrollTo({
                x: v.rel.x * w.x - 0.5,
                y: v.rel.y * w.y - 0.5
              });
              break;
            case "zoom":
              n.resetView();
              break;
          }
      },
      [b]
    )
  });
  return vt(y, 1), /* @__PURE__ */ S(
    "div",
    {
      className: `navigator ${b} ${N.type}`,
      children: /* @__PURE__ */ $(
        "svg",
        {
          ref: y,
          width: "100%",
          height: "100%",
          viewBox: "0 0 1 1",
          preserveAspectRatio: "none",
          ...x,
          children: [
            /* @__PURE__ */ S(
              "image",
              {
                href: c,
                width: "100%",
                height: "100%",
                preserveAspectRatio: "none"
              }
            ),
            Array.from(l.values()).map(
              (t) => /* @__PURE__ */ S(
                gt,
                {
                  annotation: t,
                  xaxis: a,
                  yaxis: h
                },
                t.id
              )
            ),
            /* @__PURE__ */ S(
              "path",
              {
                ref: G,
                className: "mask",
                d: ""
              }
            ),
            /* @__PURE__ */ S(mt, { xaxis: a, yaxis: h })
          ]
        }
      )
    }
  );
}
function Pt(s) {
  const { parent: c, xaxis: a, yaxis: h } = s, { input: l, mouseup: n, unitUp: o } = T(), v = z(null), p = z(null), d = z(null), w = z(null);
  return X(L(
    () => {
      const b = v.current;
      if (l.alt) {
        const N = p.current, y = d.current, G = w.current;
        let x, t;
        tt(b), c.current == l.focus || a == l.xaxis ? (x = rt(a, o.x), W(N, n.rel.x, void 0, ot), tt(N)) : (x = "", V(N)), c.current == l.focus || h == l.yaxis ? (t = rt(h, o.y), Y(y, n.rel.y, void 0, ot), tt(y)) : (t = "", V(y)), Tt(G, x && t ? `(${x}, ${t})` : x || t), At(G, n.rel, ot);
      } else
        V(b);
    },
    [a, h]
  )), /* @__PURE__ */ $("g", { ref: v, children: [
    /* @__PURE__ */ S(
      "line",
      {
        ref: p,
        className: "cursor-x",
        x1: "0",
        y1: "0",
        x2: "0",
        y2: "100%"
      }
    ),
    /* @__PURE__ */ S(
      "line",
      {
        ref: d,
        className: "cursor-y",
        x1: "0",
        y1: "0",
        x2: "100%",
        y2: "0"
      }
    ),
    /* @__PURE__ */ S(
      "text",
      {
        ref: w,
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
function _t(s) {
  const { src: c, xaxis: a, yaxis: h } = s, { command: l, input: n, mouseup: o, mouseRect: v, unitDown: p, unitUp: d, scroll: w, zoom: b } = T(), { toolState: N, transportState: y, transport: G } = T(), { annotations: x } = T(), { selection: t } = T(), e = z(null), i = z(null), r = z(null);
  X(L(
    () => {
      const f = i.current, g = r.current;
      switch (Dt(f, w, b), N) {
        case "annotate":
        case "select":
        case "zoom":
          n.buttons & 1 ? (tt(g), Lt(g, F(v, a === n.xaxis, h === n.yaxis))) : V(g);
          break;
        case "pan":
          V(g);
          break;
      }
    },
    [N, a, h]
  ));
  const u = pt({
    xaxis: a,
    yaxis: h,
    onContextMenu: J,
    onMouseDown: J,
    onMouseEnter: J,
    onMouseLeave: J,
    onMouseMove: L(
      (f) => {
        if (n.buttons & 1) {
          const g = f.movementX / f.currentTarget.clientWidth, R = f.movementY / f.currentTarget.clientHeight;
          switch (N) {
            case "annotate":
            case "select":
            case "zoom":
              break;
            case "pan":
              t.size == 0 ? l.scroll(-g, -R) : l.moveSelection(g, R);
              break;
          }
        }
      },
      [N, t, a, h]
    ),
    onMouseUp: L(
      (f) => {
        if (n.buttons & 1)
          if (xt({ x: v.width, y: v.height }) < 0.01)
            switch (N) {
              case "annotate":
                l.deselect();
                break;
              case "select":
                l.selectPoint(o.abs);
                break;
              case "zoom":
                l.zoomPoint(o.abs);
                break;
            }
          else
            switch (N) {
              case "annotate":
                l.annotate({ ...v }, dt(p, d), a, h);
                break;
              case "select":
                l.selectArea(v);
                break;
              case "zoom":
                l.zoomArea(v);
                break;
            }
        n.buttons & 2 && G.seek(o.abs.x);
      },
      [x, N, G, a, h]
    )
  });
  return vt(e, -1), /* @__PURE__ */ S(
    "div",
    {
      className: `visualization ${N} ${y.type}`,
      children: /* @__PURE__ */ $(
        "svg",
        {
          ref: e,
          width: "100%",
          height: "100%",
          ...u,
          children: [
            /* @__PURE__ */ S(
              "svg",
              {
                width: "100%",
                height: "100%",
                viewBox: "0 0 1 1",
                preserveAspectRatio: "none",
                children: /* @__PURE__ */ $(
                  "g",
                  {
                    ref: i,
                    width: "1",
                    height: "1",
                    children: [
                      /* @__PURE__ */ S(
                        "image",
                        {
                          preserveAspectRatio: "none",
                          href: c,
                          width: "100%",
                          height: "100%"
                        }
                      ),
                      Array.from(x.values()).map(
                        (f) => /* @__PURE__ */ S(
                          gt,
                          {
                            annotation: f,
                            xaxis: a,
                            yaxis: h
                          },
                          f.id
                        )
                      ),
                      /* @__PURE__ */ S(
                        "rect",
                        {
                          ref: r,
                          className: "selection",
                          x: "0",
                          y: "0",
                          width: "0",
                          height: "0"
                        }
                      ),
                      /* @__PURE__ */ S(mt, { xaxis: a, yaxis: h })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ S(Pt, { parent: e, xaxis: a, yaxis: h })
          ]
        }
      )
    }
  );
}
export {
  $t as Audio,
  Wt as Encoder,
  Xt as Navigator,
  Vt as Specviz,
  _t as Visualization,
  Yt as deserializeAnnotations,
  Bt as serializeAnnotations,
  T as useSpecviz
};
