import { jsx as S, Fragment as be, jsxs as $ } from "react/jsx-runtime";
import { createContext as we, useContext as Ge, useEffect as B, useMemo as P, useState as q, useRef as z, useCallback as L } from "react";
import { computeUnit as _, computeRect as O, computeRectInverse as Se, formatUnit as re } from "./axis.js";
import { fromPoints as de, intersectRect as ce, logical as F, intersectPoint as ae } from "./rect.js";
import { randomBytes as Ue, formatPercent as oe } from "./format.js";
function M(s, c, u) {
  return Math.min(Math.max(s, c), u);
}
function ue(s, c) {
  return { type: "play", progress: s, timeRef: c };
}
function te(s) {
  return { type: "stop", progress: s };
}
function Re(s, c, u) {
  return { type: "loop", progress: s, timeRef: c, annotation: u };
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
    setFields: () => {
      console.error("command.setFields called outside of Specviz context");
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
  transportState: te(0),
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
      function u(l) {
        s(l), c = window.requestAnimationFrame(u);
      }
      return c = window.requestAnimationFrame(u), () => {
        window.cancelAnimationFrame(c);
      };
    },
    [s]
  );
}
function pe(s) {
  const { input: c, mousedown: u, mouseup: l, mouseRect: h, unitDown: i, unitUp: o, scroll: v, zoom: p } = T();
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
        c.buttons & 1 ? (l.rel.x = N, l.rel.y = y, l.abs.x = (N + v.x) / p.x, l.abs.y = (y + v.y) / p.y, s.xaxis != null && (o.x = _(s.xaxis, M(l.abs.x, 0, 1))), s.yaxis != null && (o.y = _(s.yaxis, M(l.abs.y, 0, 1)))) : (u.rel.x = l.rel.x = N, u.rel.y = l.rel.y = y, u.abs.x = l.abs.x = (N + v.x) / p.x, u.abs.y = l.abs.y = (y + v.y) / p.y, s.xaxis != null && (i.x = o.x = _(s.xaxis, M(u.abs.x, 0, 1))), s.yaxis != null && (i.y = o.y = _(s.yaxis, M(u.abs.y, 0, 1))));
        const G = de(u.abs, l.abs);
        h.x = G.x, h.y = G.y, h.width = G.width, h.height = G.height, s.onMouseMove(d);
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
function se() {
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
        set x(u) {
          s = u;
        },
        set y(u) {
          c = u;
        }
      };
    },
    []
  );
}
function le() {
  return P(
    () => {
      let s = 0, c = 0, u = 0, l = 0;
      return {
        abs: {
          get x() {
            return s;
          },
          set x(h) {
            s = h;
          },
          get y() {
            return c;
          },
          set y(h) {
            c = h;
          }
        },
        rel: {
          get x() {
            return u;
          },
          set x(h) {
            u = h;
          },
          get y() {
            return l;
          },
          set y(h) {
            l = h;
          }
        }
      };
    },
    []
  );
}
function ke() {
  return P(
    () => {
      let s = 0, c = 0, u = 0, l = 0;
      return {
        get x() {
          return s;
        },
        get y() {
          return c;
        },
        set x(h) {
          s = h;
        },
        set y(h) {
          c = h;
        },
        get width() {
          return u;
        },
        set width(h) {
          u = h;
        },
        get height() {
          return l;
        },
        set height(h) {
          l = h;
        }
      };
    },
    []
  );
}
function ve(s, c) {
  const { command: u, mousedown: l, zoom: h } = T();
  B(
    () => {
      const i = s.current;
      function o(v) {
        v.preventDefault();
        const p = v.deltaX / i.clientWidth, d = v.deltaY / i.clientHeight;
        v.altKey ? (u.zoom(
          p * c,
          d * c
        ), u.scrollTo({
          x: l.abs.x * h.x - l.rel.x,
          y: l.abs.y * h.y - l.rel.y
        })) : u.scroll(
          -p * c,
          -d * c
        );
      }
      return i.addEventListener("wheel", o, { passive: !1 }), () => {
        i.removeEventListener("wheel", o);
      };
    },
    [c]
  );
}
function T() {
  return Ge(fe);
}
const he = 5, H = () => {
};
function Ve(s) {
  const { initAnnotations: c, children: u } = s, [l, h] = q(() => c ?? /* @__PURE__ */ new Map()), [i, o] = q(() => /* @__PURE__ */ new Set()), v = P(
    () => {
      let t = 0, n = !1, r = !1, a = null, f = null, g = null;
      return {
        get buttons() {
          return t;
        },
        set buttons(R) {
          t = R;
        },
        get alt() {
          return n;
        },
        set alt(R) {
          n = R;
        },
        get ctrl() {
          return r;
        },
        set ctrl(R) {
          r = R;
        },
        get focus() {
          return a;
        },
        set focus(R) {
          a = R;
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
      let t = 1, n = 1;
      return {
        get x() {
          return t;
        },
        get y() {
          return n;
        },
        set x(r) {
          t = M(r, 1, he);
        },
        set y(r) {
          n = M(r, 1, he);
        }
      };
    },
    []
  ), d = P(
    () => {
      let t = 0, n = 0;
      return {
        get x() {
          return t;
        },
        get y() {
          return n;
        },
        set x(r) {
          t = M(r, 0, p.x - 1);
        },
        set y(r) {
          n = M(r, 0, p.y - 1);
        }
      };
    },
    []
  ), w = P(
    () => ({
      annotate(t, n, r, a) {
        const f = Ue(10), g = { id: f, fields: {}, rect: t, unit: n, xaxis: r, yaxis: a };
        h((R) => new Map(R).set(f, g)), o(/* @__PURE__ */ new Set([g.id]));
      },
      delete() {
        h((t) => {
          const n = new Map(t);
          for (const r of i)
            n.delete(r);
          return n;
        }), o(/* @__PURE__ */ new Set());
      },
      deselect() {
        o(/* @__PURE__ */ new Set());
      },
      moveSelection(t, n) {
        h((r) => {
          let a;
          return new Map(Array.from(
            r,
            ([f, g]) => [
              f,
              i.has(g.id) ? {
                ...g,
                rect: a = {
                  x: M(g.rect.x + (v.xaxis == g.xaxis ? t : 0), 0, 1 - g.rect.width),
                  y: M(g.rect.y + (v.yaxis == g.yaxis ? n : 0), 0, 1 - g.rect.height),
                  width: g.rect.width,
                  height: g.rect.height
                },
                unit: O(g.xaxis, g.yaxis, a)
              } : g
            ]
          ));
        });
      },
      resetView() {
        p.x = 1, p.y = 1, d.x = 0, d.y = 0;
      },
      scroll(t, n) {
        d.x += t, d.y += n;
      },
      scrollTo(t) {
        d.x = t.x, d.y = t.y;
      },
      selectArea(t) {
        o((n) => {
          if (v.ctrl) {
            const r = new Set(n);
            for (const a of l.values())
              ce(F(a.rect, v.xaxis == a.xaxis, v.yaxis == a.yaxis), t) && (r.has(a.id) ? r.delete(a.id) : r.add(a.id));
            return r;
          } else {
            const r = /* @__PURE__ */ new Set();
            for (const a of l.values())
              ce(F(a.rect, v.xaxis == a.xaxis, v.yaxis == a.yaxis), t) && r.add(a.id);
            return r;
          }
        });
      },
      selectPoint(t) {
        o((n) => {
          if (v.ctrl) {
            const r = new Set(n);
            for (const a of l.values())
              ae(F(a.rect, v.xaxis == a.xaxis, v.yaxis == a.yaxis), t) && (r.has(a.id) ? r.delete(a.id) : r.add(a.id));
            return r;
          } else {
            const r = /* @__PURE__ */ new Set();
            for (const a of l.values())
              ae(F(a.rect, v.xaxis == a.xaxis, v.yaxis == a.yaxis), t) && r.add(a.id);
            return r;
          }
        });
      },
      setFields(t, n) {
        h((r) => {
          const a = new Map(r);
          return a.set(t.id, { ...t, fields: n }), a;
        });
      },
      setRectX(t, n) {
        h((r) => {
          const a = new Map(r), f = {
            x: M(t.rect.x + n, 0, 1 - t.rect.width),
            y: t.rect.y,
            width: t.rect.width,
            height: t.rect.height
          };
          return a.set(
            t.id,
            { ...t, rect: f, unit: O(t.xaxis, t.yaxis, f) }
          );
        });
      },
      setRectX1(t, n) {
      },
      setRectX2(t, n) {
        h((r) => {
          const a = new Map(r), f = {
            x: t.rect.x,
            y: t.rect.y,
            width: M(t.rect.width + n, 0.01, 1 - t.rect.x),
            height: t.rect.height
          };
          return a.set(
            t.id,
            { ...t, rect: f, unit: O(t.xaxis, t.yaxis, f) }
          );
        });
      },
      setRectY(t, n) {
        h((r) => {
          const a = new Map(r), f = {
            x: t.rect.x,
            y: M(t.rect.y + n, 0, 1 - t.rect.height),
            width: t.rect.width,
            height: t.rect.height
          };
          return a.set(
            t.id,
            { ...t, rect: f, unit: O(t.xaxis, t.yaxis, f) }
          );
        });
      },
      setRectY1(t, n) {
        h((r) => {
          const a = new Map(r), f = {
            x: t.rect.x,
            y: M(t.rect.y + n, 0, t.rect.y + t.rect.height - 0.01),
            width: t.rect.width,
            height: M(t.rect.height - Math.max(n, -t.rect.y), 0.01, 1 - t.rect.y)
          };
          return a.set(
            t.id,
            { ...t, rect: f, unit: O(t.xaxis, t.yaxis, f) }
          );
        });
      },
      setRectY2(t, n) {
        h((r) => {
          const a = new Map(r), f = {
            x: t.rect.x,
            y: t.rect.y,
            width: t.rect.width,
            height: M(t.rect.height + n, 0.01, 1 - t.rect.y)
          };
          return a.set(
            t.id,
            { ...t, rect: f, unit: O(t.xaxis, t.yaxis, f) }
          );
        });
      },
      tool(t) {
        N(t);
      },
      zoom(t, n) {
        p.x += t, p.y += n;
      },
      zoomArea(t) {
        p.x = 1 / t.width, p.y = 1 / t.height, d.x = -0.5 + (t.x + t.width / 2) * p.x, d.y = -0.5 + (t.y + t.height / 2) * p.y;
      },
      zoomPoint(t) {
        const n = t.x * p.x - d.x, r = t.y * p.y - d.y;
        p.x += 0.5, p.y += 0.5, d.x = t.x * p.x - n, d.y = t.y * p.y - r;
      }
    }),
    [l, i]
  ), [b, N] = q("annotate"), [y, G] = q({
    play: H,
    loop: H,
    stop: H,
    seek: H
  }), [x, e] = q(te(0));
  return B(
    () => {
      function t(r) {
        r.key == "Alt" ? v.alt = !0 : r.key == "Control" && (v.ctrl = !0);
      }
      function n(r) {
        r.key == "Alt" ? v.alt = !1 : r.key == "Control" && (v.ctrl = !1);
      }
      return window.addEventListener("keydown", t), window.addEventListener("keyup", n), () => {
        window.removeEventListener("keydown", t), window.removeEventListener("keyup", n);
      };
    },
    []
  ), /* @__PURE__ */ S(fe.Provider, { value: {
    annotations: l,
    input: v,
    mousedown: le(),
    mouseup: le(),
    mouseRect: ke(),
    unitDown: se(),
    unitUp: se(),
    scroll: d,
    zoom: p,
    playhead: se(),
    selection: i,
    command: w,
    toolState: b,
    transport: y,
    transportState: x,
    setAnnotations: h,
    setSelection: o,
    setTransport: G,
    setTransportState: e
  }, children: u });
}
var Me = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, j = {}, Ie = {
  get exports() {
    return j;
  },
  set exports(s) {
    j = s;
  }
};
(function(s) {
  (function(c) {
    function u(e, t) {
      this.options = {}, e = e || this.options;
      var n = { frequency: 350, peak: 1 };
      this.inputNode = this.filterNode = o.context.createBiquadFilter(), this.filterNode.type = t, this.outputNode = i.context.createGain(), this.filterNode.connect(this.outputNode);
      for (var r in n)
        this[r] = e[r], this[r] = this[r] === void 0 || this[r] === null ? n[r] : this[r];
    }
    function l() {
      var e, t, n = o.context.sampleRate * this.time, r = i.context.createBuffer(2, n, o.context.sampleRate), a = r.getChannelData(0), f = r.getChannelData(1);
      for (t = 0; n > t; t++)
        e = this.reverse ? n - t : t, a[t] = (2 * Math.random() - 1) * Math.pow(1 - e / n, this.decay), f[t] = (2 * Math.random() - 1) * Math.pow(1 - e / n, this.decay);
      this.reverbNode.buffer && (this.inputNode.disconnect(this.reverbNode), this.reverbNode.disconnect(this.wetGainNode), this.reverbNode = i.context.createConvolver(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode)), this.reverbNode.buffer = r;
    }
    function h(e) {
      for (var t = o.context.sampleRate, n = new Float32Array(t), r = Math.PI / 180, a = 0; t > a; a++) {
        var f = 2 * a / t - 1;
        n[a] = (3 + e) * f * 20 * r / (Math.PI + e * Math.abs(f));
      }
      return n;
    }
    var i = {}, o = i, v = s.exports;
    v ? s.exports = i : c.Pizzicato = c.Pz = i;
    var p = c.AudioContext || c.webkitAudioContext;
    if (!p)
      return void console.error("No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.");
    i.context = new p();
    var d = i.context.createGain();
    d.connect(i.context.destination), i.Util = { isString: function(e) {
      return toString.call(e) === "[object String]";
    }, isObject: function(e) {
      return toString.call(e) === "[object Object]";
    }, isFunction: function(e) {
      return toString.call(e) === "[object Function]";
    }, isNumber: function(e) {
      return toString.call(e) === "[object Number]" && e === +e;
    }, isArray: function(e) {
      return toString.call(e) === "[object Array]";
    }, isInRange: function(e, t, n) {
      return o.Util.isNumber(e) && o.Util.isNumber(t) && o.Util.isNumber(n) ? e >= t && n >= e : !1;
    }, isBool: function(e) {
      return typeof e == "boolean";
    }, isOscillator: function(e) {
      return e && e.toString() === "[object OscillatorNode]";
    }, isAudioBufferSourceNode: function(e) {
      return e && e.toString() === "[object AudioBufferSourceNode]";
    }, isSound: function(e) {
      return e instanceof o.Sound;
    }, isEffect: function(e) {
      for (var t in i.Effects)
        if (e instanceof i.Effects[t])
          return !0;
      return !1;
    }, normalize: function(e, t, n) {
      return o.Util.isNumber(e) && o.Util.isNumber(t) && o.Util.isNumber(n) ? (n - t) * e / 1 + t : void 0;
    }, getDryLevel: function(e) {
      return !o.Util.isNumber(e) || e > 1 || 0 > e ? 0 : 0.5 >= e ? 1 : 1 - 2 * (e - 0.5);
    }, getWetLevel: function(e) {
      return !o.Util.isNumber(e) || e > 1 || 0 > e ? 0 : e >= 0.5 ? 1 : 1 - 2 * (0.5 - e);
    } };
    var w = i.context.createGain(), b = Object.getPrototypeOf(Object.getPrototypeOf(w)), N = b.connect;
    b.connect = function(e) {
      var t = o.Util.isEffect(e) ? e.inputNode : e;
      return N.call(this, t), e;
    }, Object.defineProperty(i, "volume", { enumerable: !0, get: function() {
      return d.gain.value;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && d && (d.gain.value = e);
    } }), Object.defineProperty(i, "masterGainNode", { enumerable: !1, get: function() {
      return d;
    }, set: function(e) {
      console.error("Can't set the master gain node");
    } }), i.Events = { on: function(e, t, n) {
      if (e && t) {
        this._events = this._events || {};
        var r = this._events[e] || (this._events[e] = []);
        r.push({ callback: t, context: n || this, handler: this });
      }
    }, trigger: function(e) {
      if (e) {
        var t, n, r, a;
        if (this._events = this._events || {}, t = this._events[e] || (this._events[e] = [])) {
          for (n = Math.max(0, arguments.length - 1), r = [], a = 0; n > a; a++)
            r[a] = arguments[a + 1];
          for (a = 0; a < t.length; a++)
            t[a].callback.apply(t[a].context, r);
        }
      }
    }, off: function(e) {
      e ? this._events[e] = void 0 : this._events = {};
    } }, i.Sound = function(e, t) {
      function n(m) {
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
          var I = this.sourceNode ? this.sourceNode.frequency.value : m.frequency, A = i.context.createOscillator();
          return A.type = m.type || "sine", A.frequency.value = I || 440, A;
        }, this.sourceNode = this.getRawSourceNode(), this.sourceNode.gainSuccessor = o.context.createGain(), this.sourceNode.connect(this.sourceNode.gainSuccessor), U.isFunction(k) && k();
      }
      function a(m, k) {
        m = U.isArray(m) ? m : [m];
        var I = new XMLHttpRequest();
        I.open("GET", m[0], !0), I.responseType = "arraybuffer", I.onload = function(A) {
          i.context.decodeAudioData(A.target.response, function(E) {
            D.getRawSourceNode = function() {
              var ie = i.context.createBufferSource();
              return ie.loop = this.loop, ie.buffer = E, ie;
            }, U.isFunction(k) && k();
          }.bind(D), function(E) {
            return console.error("Error decoding audio file " + m[0]), m.length > 1 ? (m.shift(), void a(m, k)) : (E = E || new Error("Error decoding audio file " + m[0]), void (U.isFunction(k) && k(E)));
          }.bind(D));
        }, I.onreadystatechange = function(A) {
          I.readyState === 4 && I.status !== 200 && console.error("Error while fetching " + m[0] + ". " + I.statusText);
        }, I.send();
      }
      function f(m, k) {
        if (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, !navigator.getUserMedia && !navigator.mediaDevices.getUserMedia)
          return void console.error("Your browser does not support getUserMedia");
        var I = function(E) {
          D.getRawSourceNode = function() {
            return i.context.createMediaStreamSource(E);
          }, U.isFunction(k) && k();
        }.bind(D), A = function(E) {
          U.isFunction(k) && k(E);
        };
        navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({ audio: !0 }).then(I).catch(A) : navigator.getUserMedia({ audio: !0 }, I, A);
      }
      function g(m, k) {
        var I = U.isFunction(m) ? m : m.audioFunction, A = U.isObject(m) && m.bufferSize ? m.bufferSize : null;
        if (!A)
          try {
            i.context.createScriptProcessor();
          } catch {
            A = 2048;
          }
        this.getRawSourceNode = function() {
          var E = i.context.createScriptProcessor(A, 1, 1);
          return E.onaudioprocess = I, E;
        };
      }
      function R(m, k) {
        this.getRawSourceNode = m.sound.getRawSourceNode, m.sound.sourceNode && o.Util.isOscillator(m.sound.sourceNode) && (this.sourceNode = this.getRawSourceNode(), this.frequency = m.sound.frequency);
      }
      var D = this, U = i.Util, ne = n(e), C = U.isObject(e) && U.isObject(e.options), ye = 0.04, Ne = 0.04;
      if (ne)
        throw console.error(ne), new Error("Error initializing Pizzicato Sound: " + ne);
      this.detached = C && e.options.detached, this.masterVolume = i.context.createGain(), this.fadeNode = i.context.createGain(), this.fadeNode.gain.value = 0, this.detached || this.masterVolume.connect(i.masterGainNode), this.lastTimePlayed = 0, this.effects = [], this.effectConnectors = [], this.playing = this.paused = !1, this.loop = C && e.options.loop, this.attack = C && U.isNumber(e.options.attack) ? e.options.attack : ye, this.volume = C && U.isNumber(e.options.volume) ? e.options.volume : 1, C && U.isNumber(e.options.release) ? this.release = e.options.release : C && U.isNumber(e.options.sustain) ? (console.warn("'sustain' is deprecated. Use 'release' instead."), this.release = e.options.sustain) : this.release = Ne, e ? U.isString(e) ? a.bind(this)(e, t) : U.isFunction(e) ? g.bind(this)(e, t) : e.source === "file" ? a.bind(this)(e.options.path, t) : e.source === "wave" ? r.bind(this)(e.options, t) : e.source === "input" ? f.bind(this)(e, t) : e.source === "script" ? g.bind(this)(e.options, t) : e.source === "sound" && R.bind(this)(e.options, t) : r.bind(this)({}, t);
    }, i.Sound.prototype = Object.create(i.Events, { play: { enumerable: !0, value: function(e, t) {
      this.playing || (o.Util.isNumber(t) || (t = this.offsetTime || 0), o.Util.isNumber(e) || (e = 0), this.playing = !0, this.paused = !1, this.sourceNode = this.getSourceNode(), this.applyAttack(), o.Util.isFunction(this.sourceNode.start) && (this.lastTimePlayed = i.context.currentTime - t, this.sourceNode.start(o.context.currentTime + e, t)), this.trigger("play"));
    } }, stop: { enumerable: !0, value: function() {
      (this.paused || this.playing) && (this.paused = this.playing = !1, this.stopWithRelease(), this.offsetTime = 0, this.trigger("stop"));
    } }, pause: { enumerable: !0, value: function() {
      if (!this.paused && this.playing) {
        this.paused = !0, this.playing = !1, this.stopWithRelease();
        var e = o.context.currentTime - this.lastTimePlayed;
        this.sourceNode.buffer ? this.offsetTime = e % (this.sourceNode.buffer.length / o.context.sampleRate) : this.offsetTime = e, this.trigger("pause");
      }
    } }, clone: { enumerable: !0, value: function() {
      for (var e = new i.Sound({ source: "sound", options: { loop: this.loop, attack: this.attack, release: this.release, volume: this.volume, sound: this } }), t = 0; t < this.effects.length; t++)
        e.addEffect(this.effects[t]);
      return e;
    } }, onEnded: { enumerable: !0, value: function(e) {
      return function() {
        this.sourceNode && this.sourceNode !== e || (this.playing && this.stop(), this.paused || this.trigger("end"));
      };
    } }, addEffect: { enumerable: !0, value: function(e) {
      if (!o.Util.isEffect(e))
        return console.error("The object provided is not a Pizzicato effect."), this;
      this.effects.push(e);
      var t = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.fadeNode;
      t.disconnect(), t.connect(e);
      var n = o.context.createGain();
      return this.effectConnectors.push(n), e.connect(n), n.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(e) {
      var t = this.effects.indexOf(e);
      if (t === -1)
        return console.warn("Cannot remove effect that is not applied to this sound."), this;
      var n = this.playing;
      n && this.pause();
      var r = t === 0 ? this.fadeNode : this.effectConnectors[t - 1];
      r.disconnect();
      var a = this.effectConnectors[t];
      a.disconnect(), e.disconnect(a), this.effectConnectors.splice(t, 1), this.effects.splice(t, 1);
      var f;
      return f = t > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[t], r.connect(f), n && this.play(), this;
    } }, connect: { enumerable: !0, value: function(e) {
      return this.masterVolume.connect(e), this;
    } }, disconnect: { enumerable: !0, value: function(e) {
      return this.masterVolume.disconnect(e), this;
    } }, connectEffects: { enumerable: !0, value: function() {
      for (var e = [], t = 0; t < this.effects.length; t++) {
        var n = t === this.effects.length - 1, r = n ? this.masterVolume : this.effects[t + 1].inputNode;
        e[t] = o.context.createGain(), this.effects[t].outputNode.disconnect(this.effectConnectors[t]), this.effects[t].outputNode.connect(r);
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
      var t = this.getRawSourceNode();
      return t.gainSuccessor = o.context.createGain(), t.connect(t.gainSuccessor), t.gainSuccessor.connect(this.fadeNode), this.fadeNode.connect(this.getInputNode()), o.Util.isAudioBufferSourceNode(t) && (t.onended = this.onEnded(t).bind(this)), t;
    } }, getInputNode: { enumerable: !0, value: function() {
      return this.effects.length > 0 ? this.effects[0].inputNode : this.masterVolume;
    } }, applyAttack: { enumerable: !1, value: function() {
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.attack)
        return void this.fadeNode.gain.setTargetAtTime(1, o.context.currentTime, 1e-3);
      var e = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, t = this.attack;
      e || (t = (1 - this.fadeNode.gain.value) * this.attack), this.fadeNode.gain.setTargetAtTime(1, o.context.currentTime, 2 * t);
    } }, stopWithRelease: { enumerable: !1, value: function(e) {
      var t = this.sourceNode, n = function() {
        return o.Util.isFunction(t.stop) ? t.stop(0) : t.disconnect();
      };
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.release)
        return this.fadeNode.gain.setTargetAtTime(0, o.context.currentTime, 1e-3), void n();
      var r = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, a = this.release;
      r || (a = this.fadeNode.gain.value * this.release), this.fadeNode.gain.setTargetAtTime(1e-5, o.context.currentTime, a / 5), window.setTimeout(function() {
        n();
      }, 1e3 * a);
    } } }), i.Group = function(e) {
      e = e || [], this.mergeGainNode = o.context.createGain(), this.masterVolume = o.context.createGain(), this.sounds = [], this.effects = [], this.effectConnectors = [], this.mergeGainNode.connect(this.masterVolume), this.masterVolume.connect(o.masterGainNode);
      for (var t = 0; t < e.length; t++)
        this.addSound(e[t]);
    }, i.Group.prototype = Object.create(o.Events, { connect: { enumerable: !0, value: function(e) {
      return this.masterVolume.connect(e), this;
    } }, disconnect: { enumerable: !0, value: function(e) {
      return this.masterVolume.disconnect(e), this;
    } }, addSound: { enumerable: !0, value: function(e) {
      return o.Util.isSound(e) ? this.sounds.indexOf(e) > -1 ? void console.warn("The Pizzicato.Sound object was already added to this group") : e.detached ? void console.warn("Groups do not support detached sounds. You can manually create an audio graph to group detached sounds together.") : (e.disconnect(o.masterGainNode), e.connect(this.mergeGainNode), void this.sounds.push(e)) : void console.error("You can only add Pizzicato.Sound objects");
    } }, removeSound: { enumerable: !0, value: function(e) {
      var t = this.sounds.indexOf(e);
      return t === -1 ? void console.warn("Cannot remove a sound that is not part of this group.") : (e.disconnect(this.mergeGainNode), e.connect(o.masterGainNode), void this.sounds.splice(t, 1));
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
      var t = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.mergeGainNode;
      t.disconnect(), t.connect(e);
      var n = o.context.createGain();
      return this.effectConnectors.push(n), e.connect(n), n.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(e) {
      var t = this.effects.indexOf(e);
      if (t === -1)
        return console.warn("Cannot remove effect that is not applied to this group."), this;
      var n = t === 0 ? this.mergeGainNode : this.effectConnectors[t - 1];
      n.disconnect();
      var r = this.effectConnectors[t];
      r.disconnect(), e.disconnect(r), this.effectConnectors.splice(t, 1), this.effects.splice(t, 1);
      var a;
      return a = t > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[t], n.connect(a), this;
    } } }), i.Effects = {};
    var y = Object.create(null, { connect: { enumerable: !0, value: function(e) {
      return this.outputNode.connect(e), this;
    } }, disconnect: { enumerable: !0, value: function(e) {
      return this.outputNode.disconnect(e), this;
    } } });
    i.Effects.Delay = function(e) {
      this.options = {}, e = e || this.options;
      var t = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.feedbackGainNode = i.context.createGain(), this.delayNode = i.context.createDelay(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.delayNode), this.inputNode.connect(this.delayNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    }, i.Effects.Delay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 180) && (this.options.time = e, this.delayNode.delayTime.value = e);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.feedback = parseFloat(e, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), i.Effects.Compressor = function(e) {
      this.options = {}, e = e || this.options;
      var t = { threshold: -24, knee: 30, attack: 3e-3, release: 0.25, ratio: 12 };
      this.inputNode = this.compressorNode = i.context.createDynamicsCompressor(), this.outputNode = i.context.createGain(), this.compressorNode.connect(this.outputNode);
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    }, i.Effects.Compressor.prototype = Object.create(y, { threshold: { enumerable: !0, get: function() {
      return this.compressorNode.threshold.value;
    }, set: function(e) {
      i.Util.isInRange(e, -100, 0) && (this.compressorNode.threshold.value = e);
    } }, knee: { enumerable: !0, get: function() {
      return this.compressorNode.knee.value;
    }, set: function(e) {
      i.Util.isInRange(e, 0, 40) && (this.compressorNode.knee.value = e);
    } }, attack: { enumerable: !0, get: function() {
      return this.compressorNode.attack.value;
    }, set: function(e) {
      i.Util.isInRange(e, 0, 1) && (this.compressorNode.attack.value = e);
    } }, release: { enumerable: !0, get: function() {
      return this.compressorNode.release.value;
    }, set: function(e) {
      i.Util.isInRange(e, 0, 1) && (this.compressorNode.release.value = e);
    } }, ratio: { enumerable: !0, get: function() {
      return this.compressorNode.ratio.value;
    }, set: function(e) {
      i.Util.isInRange(e, 1, 20) && (this.compressorNode.ratio.value = e);
    } }, getCurrentGainReduction: function() {
      return this.compressorNode.reduction;
    } }), i.Effects.LowPassFilter = function(e) {
      u.call(this, e, "lowpass");
    }, i.Effects.HighPassFilter = function(e) {
      u.call(this, e, "highpass");
    };
    var G = Object.create(y, { frequency: { enumerable: !0, get: function() {
      return this.filterNode.frequency.value;
    }, set: function(e) {
      i.Util.isInRange(e, 10, 22050) && (this.filterNode.frequency.value = e);
    } }, peak: { enumerable: !0, get: function() {
      return this.filterNode.Q.value;
    }, set: function(e) {
      i.Util.isInRange(e, 1e-4, 1e3) && (this.filterNode.Q.value = e);
    } } });
    i.Effects.LowPassFilter.prototype = G, i.Effects.HighPassFilter.prototype = G, i.Effects.Distortion = function(e) {
      this.options = {}, e = e || this.options;
      var t = { gain: 0.5 };
      this.waveShaperNode = i.context.createWaveShaper(), this.inputNode = this.outputNode = this.waveShaperNode;
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    }, i.Effects.Distortion.prototype = Object.create(y, { gain: { enumerable: !0, get: function() {
      return this.options.gain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.gain = e, this.adjustGain());
    } }, adjustGain: { writable: !1, configurable: !1, enumerable: !1, value: function() {
      for (var e, t = o.Util.isNumber(this.options.gain) ? parseInt(100 * this.options.gain, 10) : 50, n = 44100, r = new Float32Array(n), a = Math.PI / 180, f = 0; n > f; ++f)
        e = 2 * f / n - 1, r[f] = (3 + t) * e * 20 * a / (Math.PI + t * Math.abs(e));
      this.waveShaperNode.curve = r;
    } } }), i.Effects.Flanger = function(e) {
      this.options = {}, e = e || this.options;
      var t = { time: 0.45, speed: 0.2, depth: 0.1, feedback: 0.1, mix: 0.5 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.inputFeedbackNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.delayNode = i.context.createDelay(), this.oscillatorNode = i.context.createOscillator(), this.gainNode = i.context.createGain(), this.feedbackNode = i.context.createGain(), this.oscillatorNode.type = "sine", this.inputNode.connect(this.inputFeedbackNode), this.inputNode.connect(this.dryGainNode), this.inputFeedbackNode.connect(this.delayNode), this.inputFeedbackNode.connect(this.wetGainNode), this.delayNode.connect(this.wetGainNode), this.delayNode.connect(this.feedbackNode), this.feedbackNode.connect(this.inputFeedbackNode), this.oscillatorNode.connect(this.gainNode), this.gainNode.connect(this.delayNode.delayTime), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode), this.oscillatorNode.start(0);
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    }, i.Effects.Flanger.prototype = Object.create(y, { time: { enumberable: !0, get: function() {
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
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } } }), i.Effects.StereoPanner = function(e) {
      this.options = {}, e = e || this.options;
      var t = { pan: 0 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), i.context.createStereoPanner ? (this.pannerNode = i.context.createStereoPanner(), this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : i.context.createPanner ? (console.warn("Your browser does not support the StereoPannerNode. Will use PannerNode instead."), this.pannerNode = i.context.createPanner(), this.pannerNode.type = "equalpower", this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : (console.warn("Your browser does not support the Panner effect."), this.inputNode.connect(this.outputNode));
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    }, i.Effects.StereoPanner.prototype = Object.create(y, { pan: { enumerable: !0, get: function() {
      return this.options.pan;
    }, set: function(e) {
      if (o.Util.isInRange(e, -1, 1) && (this.options.pan = e, this.pannerNode)) {
        var t = this.pannerNode.toString().indexOf("StereoPannerNode") > -1;
        t ? this.pannerNode.pan.value = e : this.pannerNode.setPosition(e, 0, 1 - Math.abs(e));
      }
    } } }), i.Effects.Convolver = function(e, t) {
      this.options = {}, e = e || this.options;
      var n = this, r = new XMLHttpRequest(), a = { mix: 0.5 };
      this.callback = t, this.inputNode = i.context.createGain(), this.convolverNode = i.context.createConvolver(), this.outputNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.inputNode.connect(this.convolverNode), this.convolverNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var f in a)
        this[f] = e[f], this[f] = this[f] === void 0 || this[f] === null ? a[f] : this[f];
      return e.impulse ? (r.open("GET", e.impulse, !0), r.responseType = "arraybuffer", r.onload = function(g) {
        var R = g.target.response;
        i.context.decodeAudioData(R, function(D) {
          n.convolverNode.buffer = D, n.callback && o.Util.isFunction(n.callback) && n.callback();
        }, function(D) {
          D = D || new Error("Error decoding impulse file"), n.callback && o.Util.isFunction(n.callback) && n.callback(D);
        });
      }, r.onreadystatechange = function(g) {
        r.readyState === 4 && r.status !== 200 && console.error("Error while fetching " + e.impulse + ". " + r.statusText);
      }, void r.send()) : void console.error("No impulse file specified.");
    }, i.Effects.Convolver.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } } }), i.Effects.PingPongDelay = function(e) {
      this.options = {}, e = e || this.options;
      var t = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.delayNodeLeft = i.context.createDelay(), this.delayNodeRight = i.context.createDelay(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.feedbackGainNode = i.context.createGain(), this.channelMerger = i.context.createChannelMerger(2), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNodeLeft.connect(this.channelMerger, 0, 0), this.delayNodeRight.connect(this.channelMerger, 0, 1), this.delayNodeLeft.connect(this.delayNodeRight), this.feedbackGainNode.connect(this.delayNodeLeft), this.delayNodeRight.connect(this.feedbackGainNode), this.inputNode.connect(this.feedbackGainNode), this.channelMerger.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    }, i.Effects.PingPongDelay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 180) && (this.options.time = e, this.delayNodeLeft.delayTime.value = e, this.delayNodeRight.delayTime.value = e);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.feedback = parseFloat(e, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), i.Effects.Reverb = function(e) {
      this.options = {}, e = e || this.options;
      var t = { mix: 0.5, time: 0.01, decay: 0.01, reverse: !1 };
      this.inputNode = i.context.createGain(), this.reverbNode = i.context.createConvolver(), this.outputNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
      l.bind(this)();
    }, i.Effects.Reverb.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 1e-4, 10) && (this.options.time = e, l.bind(this)());
    } }, decay: { enumerable: !0, get: function() {
      return this.options.decay;
    }, set: function(e) {
      o.Util.isInRange(e, 1e-4, 10) && (this.options.decay = e, l.bind(this)());
    } }, reverse: { enumerable: !0, get: function() {
      return this.options.reverse;
    }, set: function(e) {
      o.Util.isBool(e) && (this.options.reverse = e, l.bind(this)());
    } } }), i.Effects.Tremolo = function(e) {
      this.options = {}, e = e || this.options;
      var t = { speed: 4, depth: 1, mix: 0.8 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.tremoloGainNode = i.context.createGain(), this.tremoloGainNode.gain.value = 0, this.lfoNode = i.context.createOscillator(), this.shaperNode = i.context.createWaveShaper(), this.shaperNode.curve = new Float32Array([0, 1]), this.shaperNode.connect(this.tremoloGainNode.gain), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.lfoNode.connect(this.shaperNode), this.lfoNode.type = "sine", this.lfoNode.start(0), this.inputNode.connect(this.tremoloGainNode), this.tremoloGainNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    }, i.Effects.Tremolo.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 20) && (this.options.speed = e, this.lfoNode.frequency.value = e);
    } }, depth: { enumerable: !0, get: function() {
      return this.options.depth;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.depth = e, this.shaperNode.curve = new Float32Array([1 - e, 1]));
    } } }), i.Effects.DubDelay = function(e) {
      this.options = {}, e = e || this.options;
      var t = { feedback: 0.6, time: 0.7, mix: 0.5, cutoff: 700 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.feedbackGainNode = i.context.createGain(), this.delayNode = i.context.createDelay(), this.bqFilterNode = i.context.createBiquadFilter(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.bqFilterNode), this.bqFilterNode.connect(this.delayNode), this.delayNode.connect(this.feedbackGainNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    }, i.Effects.DubDelay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
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
    } } }), i.Effects.RingModulator = function(e) {
      this.options = {}, e = e || this.options;
      var t = { speed: 30, distortion: 1, mix: 0.5 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.vIn = i.context.createOscillator(), this.vIn.start(0), this.vInGain = i.context.createGain(), this.vInGain.gain.value = 0.5, this.vInInverter1 = i.context.createGain(), this.vInInverter1.gain.value = -1, this.vInInverter2 = i.context.createGain(), this.vInInverter2.gain.value = -1, this.vInDiode1 = new x(i.context), this.vInDiode2 = new x(i.context), this.vInInverter3 = i.context.createGain(), this.vInInverter3.gain.value = -1, this.vcInverter1 = i.context.createGain(), this.vcInverter1.gain.value = -1, this.vcDiode3 = new x(i.context), this.vcDiode4 = new x(i.context), this.outGain = i.context.createGain(), this.outGain.gain.value = 3, this.compressor = i.context.createDynamicsCompressor(), this.compressor.threshold.value = -24, this.compressor.ratio.value = 16, this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.vcInverter1), this.inputNode.connect(this.vcDiode4.node), this.vcInverter1.connect(this.vcDiode3.node), this.vIn.connect(this.vInGain), this.vInGain.connect(this.vInInverter1), this.vInGain.connect(this.vcInverter1), this.vInGain.connect(this.vcDiode4.node), this.vInInverter1.connect(this.vInInverter2), this.vInInverter1.connect(this.vInDiode2.node), this.vInInverter2.connect(this.vInDiode1.node), this.vInDiode1.connect(this.vInInverter3), this.vInDiode2.connect(this.vInInverter3), this.vInInverter3.connect(this.compressor), this.vcDiode3.connect(this.compressor), this.vcDiode4.connect(this.compressor), this.compressor.connect(this.outGain), this.outGain.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var n in t)
        this[n] = e[n], this[n] = this[n] === void 0 || this[n] === null ? t[n] : this[n];
    };
    var x = function(e) {
      this.context = e, this.node = this.context.createWaveShaper(), this.vb = 0.2, this.vl = 0.4, this.h = 1, this.setCurve();
    };
    return x.prototype.setDistortion = function(e) {
      return this.h = e, this.setCurve();
    }, x.prototype.setCurve = function() {
      var e, t, n, r, a, f, g;
      for (t = 1024, a = new Float32Array(t), e = f = 0, g = a.length; g >= 0 ? g > f : f > g; e = g >= 0 ? ++f : --f)
        n = (e - t / 2) / (t / 2), n = Math.abs(n), r = n <= this.vb ? 0 : this.vb < n && n <= this.vl ? this.h * (Math.pow(n - this.vb, 2) / (2 * this.vl - 2 * this.vb)) : this.h * n - this.h * this.vl + this.h * (Math.pow(this.vl - this.vb, 2) / (2 * this.vl - 2 * this.vb)), a[e] = r;
      return this.node.curve = a;
    }, x.prototype.connect = function(e) {
      return this.node.connect(e);
    }, i.Effects.RingModulator.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 2e3) && (this.options.speed = e, this.vIn.frequency.value = e);
    } }, distortion: { enumerable: !0, get: function() {
      return this.options.distortion;
    }, set: function(e) {
      if (o.Util.isInRange(e, 0.2, 50)) {
        this.options.distortion = parseFloat(e, 10);
        for (var t = [this.vInDiode1, this.vInDiode2, this.vcDiode3, this.vcDiode4], n = 0, r = t.length; r > n; n++)
          t[n].setDistortion(e);
      }
    } } }), i.Effects.Quadrafuzz = function(e) {
      this.options = {}, e = e || this.options;
      var t = { lowGain: 0.6, midLowGain: 0.8, midHighGain: 0.5, highGain: 0.6 };
      this.inputNode = o.context.createGain(), this.outputNode = o.context.createGain(), this.dryGainNode = o.context.createGain(), this.wetGainNode = o.context.createGain(), this.lowpassLeft = o.context.createBiquadFilter(), this.lowpassLeft.type = "lowpass", this.lowpassLeft.frequency.value = 147, this.lowpassLeft.Q.value = 0.7071, this.bandpass1Left = o.context.createBiquadFilter(), this.bandpass1Left.type = "bandpass", this.bandpass1Left.frequency.value = 587, this.bandpass1Left.Q.value = 0.7071, this.bandpass2Left = o.context.createBiquadFilter(), this.bandpass2Left.type = "bandpass", this.bandpass2Left.frequency.value = 2490, this.bandpass2Left.Q.value = 0.7071, this.highpassLeft = o.context.createBiquadFilter(), this.highpassLeft.type = "highpass", this.highpassLeft.frequency.value = 4980, this.highpassLeft.Q.value = 0.7071, this.overdrives = [];
      for (var n = 0; 4 > n; n++)
        this.overdrives[n] = o.context.createWaveShaper(), this.overdrives[n].curve = h();
      this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode);
      var r = [this.lowpassLeft, this.bandpass1Left, this.bandpass2Left, this.highpassLeft];
      for (n = 0; n < r.length; n++)
        this.wetGainNode.connect(r[n]), r[n].connect(this.overdrives[n]), this.overdrives[n].connect(this.outputNode);
      for (var a in t)
        this[a] = e[a], this[a] = this[a] === void 0 || this[a] === null ? t[a] : this[a];
    }, i.Effects.Quadrafuzz.prototype = Object.create(y, { lowGain: { enumerable: !0, get: function() {
      return this.options.lowGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.lowGain = e, this.overdrives[0].curve = h(o.Util.normalize(this.lowGain, 0, 150)));
    } }, midLowGain: { enumerable: !0, get: function() {
      return this.options.midLowGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.midLowGain = e, this.overdrives[1].curve = h(o.Util.normalize(this.midLowGain, 0, 150)));
    } }, midHighGain: { enumerable: !0, get: function() {
      return this.options.midHighGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.midHighGain = e, this.overdrives[2].curve = h(o.Util.normalize(this.midHighGain, 0, 150)));
    } }, highGain: { enumerable: !0, get: function() {
      return this.options.highGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.highGain = e, this.overdrives[3].curve = h(o.Util.normalize(this.highGain, 0, 150)));
    } } }), i;
  })(typeof window < "u" ? window : Me);
})(Ie);
function ze(s, c, u, l) {
  return s.addEventListener(c, u, l), () => s.removeEventListener(c, u, l);
}
const Q = 22e3, K = 0;
function $e(s) {
  const { src: c, duration: u } = s, { annotations: l, playhead: h, transportState: i, setTransport: o, setTransportState: v } = T(), p = z(null), d = z(new j.Effects.LowPassFilter({ frequency: Q, peak: 10 })), w = z(new j.Effects.HighPassFilter({ frequency: K, peak: 10 }));
  X(L(
    () => {
      let x, e, t, n;
      switch (i.type) {
        case "stop":
          w.current.frequency = K, d.current.frequency = Q, h.x = i.progress;
          break;
        case "play":
          w.current.frequency = K, d.current.frequency = Q, x = (Date.now() - i.timeRef) / 1e3, h.x = i.progress + x / u;
          break;
        case "loop":
          if (x = (Date.now() - i.timeRef) / 1e3, h.x = i.progress + x / u, e = l.get(i.annotation.id), e == null)
            return y();
          t = e.rect, n = e.unit, e.yaxis.unit === "hertz" ? (w.current.frequency = n.y, d.current.frequency = n.y + n.height) : (w.current.frequency = K, d.current.frequency = Q), (h.x < t.x || h.x >= t.x + t.width) && N(e);
          break;
      }
    },
    [l, i, u]
  ));
  const b = L(
    () => {
      v((x) => {
        if (p.current == null)
          return x;
        switch (x.type) {
          case "stop":
            return p.current.play(0, x.progress * u), ue(x.progress, Date.now());
          case "play":
          case "loop":
            return x;
        }
      });
    },
    [u]
  ), N = L(
    (x) => {
      const { rect: e, unit: t } = x;
      v((n) => p.current == null ? n : (p.current.stop(), p.current.play(0, t.x), Re(e.x, Date.now(), x)));
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
            const e = (Date.now() - x.timeRef) / 1e3;
            return te(x.progress + e / u);
        }
      });
    },
    [u]
  ), G = L(
    (x) => {
      v((e) => {
        if (p.current == null)
          return e;
        switch (e.type) {
          case "stop":
            return te(x);
          case "play":
          case "loop":
            return p.current.stop(), p.current.play(0, x * u), ue(x, Date.now());
        }
      });
    },
    [u]
  );
  return B(
    () => {
      const x = ze(window, "blur", y), e = new j.Sound(
        c,
        (t) => {
          if (t)
            return console.error(t);
          p.current != null && p.current.stop(), e.addEffect(d.current), e.addEffect(w.current), p.current = e, o({ play: b, loop: N, stop: y, seek: G });
        }
      );
      return () => {
        y(), x();
      };
    },
    [c, b, N, y, G]
  ), /* @__PURE__ */ S(be, {});
}
function We(s) {
  const { state: c, setState: u, value: l, unit: h } = s, { input: i } = T(), o = z(null), v = 5 * Math.PI / 4, p = -Math.PI / 4, { x: d, y: w } = P(
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
        const G = y.deltaY / (i.ctrl ? 1e4 : 1e3);
        u(G);
      }
      return b.addEventListener("wheel", N, { passive: !1 }), () => {
        b.removeEventListener("wheel", N);
      };
    },
    [u]
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
            children: l.toFixed(2)
          }
        ),
        /* @__PURE__ */ S(
          "text",
          {
            className: "encoder-text",
            textAnchor: "middle",
            x: "0",
            y: "0.45",
            children: h
          }
        )
      ]
    }
  );
}
function xe(s) {
  return Math.sqrt(s.x * s.x + s.y * s.y);
}
function V(s) {
  s.setAttribute("display", "none");
}
function ee(s) {
  s.setAttribute("display", "inline");
}
function Ae(s, c, u = String) {
  c.x < 0.5 ? (W(s, c.x, void 0, u), s.setAttribute("text-anchor", "start")) : (W(s, c.x, void 0, u), s.setAttribute("text-anchor", "end")), c.y < 0.5 ? (Y(s, c.y + 0.01, void 0, u), s.setAttribute("dominant-baseline", "hanging")) : (Y(s, c.y - 0.01, void 0, u), s.setAttribute("dominant-baseline", "text-top"));
}
function Ee(s, c) {
  s.setAttribute("d", c);
}
function Le(s, c, u = String) {
  s.setAttribute("x", u(c.x)), s.setAttribute("y", u(c.y)), s.setAttribute("width", u(c.width)), s.setAttribute("height", u(c.height));
}
function Te(s, c) {
  s.textContent = c;
}
function De(s, c, u) {
  s.setAttribute(
    "transform",
    `translate(${-c.x}, ${-c.y}) scale(${u.x}, ${u.y})`
  );
}
function W(s, c, u = c, l = String) {
  switch (s.constructor) {
    case SVGTextElement:
      s.setAttribute("x", l(c));
    case SVGLineElement:
      s.setAttribute("x1", l(c)), s.setAttribute("x2", l(u));
      break;
    case SVGRectElement:
      s.setAttribute("x", l(c)), s.setAttribute("width", l(u));
  }
}
function Y(s, c, u = c, l = String) {
  switch (s.constructor) {
    case SVGTextElement:
      s.setAttribute("y", l(c));
    case SVGLineElement:
      s.setAttribute("y1", l(c)), s.setAttribute("y2", l(u));
      break;
    case SVGRectElement:
      s.setAttribute("y", l(c)), s.setAttribute("height", l(u));
  }
}
function me(s) {
  const { xaxis: c, yaxis: u } = s, { annotations: l, playhead: h, transportState: i } = T(), o = z(null);
  return X(L(
    () => {
      const v = o.current;
      let p, d;
      switch (i.type) {
        case "stop":
        case "play":
          W(v, h.x), Y(v, 0, 1);
          break;
        case "loop":
          if (p = l.get(i.annotation.id), p == null)
            return;
          d = F(p.rect, c === p.xaxis, u === p.yaxis), W(v, h.x), Y(v, d.y, d.y + d.height);
          break;
      }
    },
    [l, i]
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
function ge(s) {
  const { annotation: c, xaxis: u, yaxis: l } = s, { selection: h } = T(), i = P(
    () => F(c.rect, u == c.xaxis, l == c.yaxis),
    [c, u, l]
  );
  return /* @__PURE__ */ S(
    "rect",
    {
      className: h.has(c.id) ? "annotation annotation-selected" : "annotation",
      x: String(i.x),
      y: String(i.y),
      width: String(i.width),
      height: String(i.height)
    },
    c.id
  );
}
function Ye(s, c) {
  const u = /* @__PURE__ */ new Map();
  for (const l of s) {
    const h = c.get(l.xunit), i = c.get(l.yunit);
    if (h == null || i == null) {
      console.error("missing axis context for annotation:", l);
      continue;
    }
    const o = Se(h, i, l.unit);
    u.set(l.id, { id: l.id, fields: l.fields, rect: o, unit: l.unit, xaxis: h, yaxis: i });
  }
  return u;
}
function Be(s) {
  return Array.from(s.values(), (c) => ({
    id: c.id,
    fields: c.fields,
    unit: c.unit,
    xunit: c.xaxis.unit,
    yunit: c.yaxis.unit
  }));
}
const Z = () => {
};
function Xe(s) {
  const { src: c, xaxis: u, yaxis: l } = s, { annotations: h, command: i, input: o, mouseup: v, mouseRect: p, scroll: d, zoom: w, toolState: b, transportState: N } = T(), y = z(null), G = z(null);
  X(L(
    () => {
      Ee(G.current, `
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
  const x = pe({
    onContextMenu: Z,
    onMouseDown: Z,
    onMouseEnter: Z,
    onMouseLeave: Z,
    onMouseMove: L(
      (e) => {
        o.buttons & 1 && i.scroll(
          e.movementX / e.currentTarget.clientWidth * w.x,
          e.movementY / e.currentTarget.clientHeight * w.y
        );
      },
      [b]
    ),
    onMouseUp: L(
      (e) => {
        if (o.buttons & 1 && xe({ x: p.width, y: p.height }) < 0.01)
          switch (b) {
            case "annotate":
            case "select":
            case "pan":
              i.scrollTo({
                x: v.rel.x * w.x - 0.5,
                y: v.rel.y * w.y - 0.5
              });
              break;
            case "zoom":
              i.resetView();
              break;
          }
      },
      [b]
    )
  });
  return ve(y, 1), /* @__PURE__ */ S(
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
            Array.from(h.values()).map(
              (e) => /* @__PURE__ */ S(
                ge,
                {
                  annotation: e,
                  xaxis: u,
                  yaxis: l
                },
                e.id
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
            /* @__PURE__ */ S(me, { xaxis: u, yaxis: l })
          ]
        }
      )
    }
  );
}
function Pe(s) {
  const { parent: c, xaxis: u, yaxis: l } = s, { input: h, mouseup: i, unitUp: o } = T(), v = z(null), p = z(null), d = z(null), w = z(null);
  return X(L(
    () => {
      const b = v.current;
      if (h.alt) {
        const N = p.current, y = d.current, G = w.current;
        let x, e;
        ee(b), c.current == h.focus || u == h.xaxis ? (x = re(u, o.x), W(N, i.rel.x, void 0, oe), ee(N)) : (x = "", V(N)), c.current == h.focus || l == h.yaxis ? (e = re(l, o.y), Y(y, i.rel.y, void 0, oe), ee(y)) : (e = "", V(y)), Te(G, x && e ? `(${x}, ${e})` : x || e), Ae(G, i.rel, oe);
      } else
        V(b);
    },
    [u, l]
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
function _e(s) {
  const { src: c, xaxis: u, yaxis: l } = s, { command: h, input: i, mouseup: o, mouseRect: v, unitDown: p, unitUp: d, scroll: w, zoom: b } = T(), { toolState: N, transportState: y, transport: G } = T(), { annotations: x } = T(), { selection: e } = T(), t = z(null), n = z(null), r = z(null);
  X(L(
    () => {
      const f = n.current, g = r.current;
      switch (De(f, w, b), N) {
        case "annotate":
        case "select":
        case "zoom":
          i.buttons & 1 ? (ee(g), Le(g, F(v, u === i.xaxis, l === i.yaxis))) : V(g);
          break;
        case "pan":
          V(g);
          break;
      }
    },
    [N, u, l]
  ));
  const a = pe({
    xaxis: u,
    yaxis: l,
    onContextMenu: J,
    onMouseDown: J,
    onMouseEnter: J,
    onMouseLeave: J,
    onMouseMove: L(
      (f) => {
        if (i.buttons & 1) {
          const g = f.movementX / f.currentTarget.clientWidth, R = f.movementY / f.currentTarget.clientHeight;
          switch (N) {
            case "annotate":
            case "select":
            case "zoom":
              break;
            case "pan":
              e.size == 0 ? h.scroll(-g, -R) : h.moveSelection(g, R);
              break;
          }
        }
      },
      [N, e, u, l]
    ),
    onMouseUp: L(
      (f) => {
        if (i.buttons & 1)
          if (xe({ x: v.width, y: v.height }) < 0.01)
            switch (N) {
              case "annotate":
                h.deselect();
                break;
              case "select":
                h.selectPoint(o.abs);
                break;
              case "zoom":
                h.zoomPoint(o.abs);
                break;
            }
          else
            switch (N) {
              case "annotate":
                h.annotate({ ...v }, de(p, d), u, l);
                break;
              case "select":
                h.selectArea(v);
                break;
              case "zoom":
                h.zoomArea(v);
                break;
            }
        i.buttons & 2 && G.seek(o.abs.x);
      },
      [x, N, G, u, l]
    )
  });
  return ve(t, -1), /* @__PURE__ */ S(
    "div",
    {
      className: `visualization ${N} ${y.type}`,
      children: /* @__PURE__ */ $(
        "svg",
        {
          ref: t,
          width: "100%",
          height: "100%",
          ...a,
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
                    ref: n,
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
                          ge,
                          {
                            annotation: f,
                            xaxis: u,
                            yaxis: l
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
                      /* @__PURE__ */ S(me, { xaxis: u, yaxis: l })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ S(Pe, { parent: t, xaxis: u, yaxis: l })
          ]
        }
      )
    }
  );
}
export {
  $e as Audio,
  We as Encoder,
  Xe as Navigator,
  Ve as Specviz,
  _e as Visualization,
  Ye as deserializeAnnotations,
  Be as serializeAnnotations,
  T as useSpecviz
};
