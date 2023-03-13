import { jsx as G, Fragment as bt, jsxs as $ } from "react/jsx-runtime";
import { createContext as wt, useContext as Gt, useEffect as _, useMemo as D, useState as j, useRef as I, useCallback as E } from "react";
import { randomBytes as St, formatPercent as ot } from "./format.js";
function dt(o, r) {
  return {
    x: Math.min(o.x, r.x),
    y: Math.min(o.y, r.y),
    width: Math.abs(r.x - o.x),
    height: Math.abs(r.y - o.y)
  };
}
function rt(o, r) {
  return r.x >= o.x && r.x <= o.x + o.width && r.y >= o.y && r.y <= o.y + o.height;
}
function at(o, r) {
  const c = Math.max(o.x, r.x), u = Math.max(o.y, r.y), h = Math.min(o.x + o.width, r.x + r.width) - c, e = Math.min(o.y + o.height, r.y + r.height) - u;
  return h <= 0 || e <= 0 ? null : { x: c, y: u, width: h, height: e };
}
function F(o, r, c) {
  return {
    x: r ? o.x : 0,
    y: c ? o.y : 0,
    width: r ? o.width : 1,
    height: c ? o.height : 1
  };
}
function Ut(o) {
  return {
    x: Math.min(o.x, o.x + o.width),
    y: Math.min(o.y, o.y + o.height),
    width: Math.abs(o.width),
    height: Math.abs(o.height)
  };
}
function P(o, r) {
  if (o == null)
    return r;
  const { intervals: c } = o;
  if (c.length < 2)
    return -1 / 0;
  let u, h, e, s, f = 0;
  for (; f < c.length - 1; ) {
    if ([u, h] = c[f], [e, s] = c[f + 1], r <= e)
      return h + (s - h) * (r - u) / (e - u);
    f += 1;
  }
  return -1 / 0;
}
function q(o, r, c) {
  const u = P(o, c.x), h = P(r, c.y);
  return Ut({
    x: u,
    y: h,
    width: P(o, c.x + c.width) - u,
    height: P(r, c.y + c.height) - h
  });
}
function ct(o, r) {
  return o.format(r);
}
function R(o, r, c) {
  return Math.min(Math.max(o, r), c);
}
function ut(o, r) {
  return { type: "play", progress: o, timeRef: r };
}
function et(o) {
  return { type: "stop", progress: o };
}
function Mt(o, r, c) {
  return { type: "loop", progress: o, timeRef: r, annotation: c };
}
const ft = wt({
  annotations: /* @__PURE__ */ new Map(),
  duration: 0,
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
  transportState: et(0),
  setAnnotations: (o) => {
    console.error("setAnnotations called outside of Specviz context");
  },
  setSelection: (o) => {
    console.error("setSelection called outside of Specviz context");
  },
  setTransport: (o) => {
    console.error("setTransport called outside of Specviz context");
  },
  setTransportState: (o) => {
    console.error("setTransportState called outside of Specviz context");
  }
});
function Y(o) {
  _(
    () => {
      let r;
      function c(u) {
        o(u), r = window.requestAnimationFrame(c);
      }
      return r = window.requestAnimationFrame(c), () => {
        window.cancelAnimationFrame(r);
      };
    },
    [o]
  );
}
function pt(o) {
  const { input: r, mousedown: c, mouseup: u, mouseRect: h, unitDown: e, unitUp: s, scroll: f, zoom: g } = L();
  return D(
    () => ({
      onContextMenu(x) {
        x.preventDefault(), o.onContextMenu(x);
      },
      onMouseDown(x) {
        x.preventDefault(), r.buttons = x.buttons, o.onMouseDown(x);
      },
      onMouseMove(x) {
        const b = x.currentTarget.getBoundingClientRect(), N = (x.clientX - b.x) / b.width, y = (x.clientY - b.y) / b.height;
        r.buttons & 1 ? (u.rel.x = N, u.rel.y = y, u.abs.x = (N + f.x) / g.x, u.abs.y = (y + f.y) / g.y, s.x = P(o.xaxis, R(u.abs.x, 0, 1)), s.y = P(o.yaxis, R(u.abs.y, 0, 1))) : (c.rel.x = u.rel.x = N, c.rel.y = u.rel.y = y, c.abs.x = u.abs.x = (N + f.x) / g.x, c.abs.y = u.abs.y = (y + f.y) / g.y, e.x = s.x = P(o.xaxis, R(c.abs.x, 0, 1)), e.y = s.y = P(o.yaxis, R(c.abs.y, 0, 1)));
        const v = dt(c.abs, u.abs);
        h.x = v.x, h.y = v.y, h.width = v.width, h.height = v.height, o.onMouseMove(x);
      },
      onMouseUp(x) {
        o.onMouseUp(x), r.buttons = 0;
      },
      onMouseEnter(x) {
        r.focus = x.currentTarget, r.xaxis = o.xaxis, r.yaxis = o.yaxis, o.onMouseEnter(x);
      },
      onMouseLeave(x) {
        o.onMouseLeave(x), r.buttons = 0, r.focus = null, r.xaxis = null, r.yaxis = null;
      }
    }),
    [
      o.xaxis,
      o.yaxis,
      o.onMouseDown,
      o.onMouseMove,
      o.onMouseUp,
      o.onMouseLeave,
      o.onContextMenu
    ]
  );
}
function st() {
  return D(
    () => {
      let o = 0, r = 0;
      return {
        get x() {
          return o;
        },
        get y() {
          return r;
        },
        set x(c) {
          o = c;
        },
        set y(c) {
          r = c;
        }
      };
    },
    []
  );
}
function ht() {
  return D(
    () => {
      let o = 0, r = 0, c = 0, u = 0;
      return {
        abs: {
          get x() {
            return o;
          },
          set x(h) {
            o = h;
          },
          get y() {
            return r;
          },
          set y(h) {
            r = h;
          }
        },
        rel: {
          get x() {
            return c;
          },
          set x(h) {
            c = h;
          },
          get y() {
            return u;
          },
          set y(h) {
            u = h;
          }
        }
      };
    },
    []
  );
}
function kt() {
  return D(
    () => {
      let o = 0, r = 0, c = 0, u = 0;
      return {
        get x() {
          return o;
        },
        get y() {
          return r;
        },
        set x(h) {
          o = h;
        },
        set y(h) {
          r = h;
        },
        get width() {
          return c;
        },
        set width(h) {
          c = h;
        },
        get height() {
          return u;
        },
        set height(h) {
          u = h;
        }
      };
    },
    []
  );
}
function xt(o, r) {
  const { mousedown: c, scroll: u, zoom: h } = L();
  _(
    () => {
      const e = o.current;
      function s(f) {
        f.preventDefault();
        const g = f.deltaX / e.clientWidth, x = f.deltaY / e.clientHeight;
        f.altKey ? (h.x = h.x + g * r, h.y = h.y + x * r, u.x = c.abs.x * h.x - c.rel.x, u.y = c.abs.y * h.y - c.rel.y) : (u.x -= g * r, u.y -= x * r);
      }
      return e.addEventListener("wheel", s, { passive: !1 }), () => {
        e.removeEventListener("wheel", s);
      };
    },
    [r]
  );
}
function L() {
  return Gt(ft);
}
const lt = 5, X = () => {
};
function Ot(o) {
  const [r, c] = j(/* @__PURE__ */ new Map()), [u, h] = j(/* @__PURE__ */ new Set()), e = D(
    () => {
      let a = 0, t = !1, n = !1, i = null, l = null, d = null;
      return {
        get buttons() {
          return a;
        },
        set buttons(p) {
          a = p;
        },
        get alt() {
          return t;
        },
        set alt(p) {
          t = p;
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
          return l;
        },
        set xaxis(p) {
          l = p;
        },
        get yaxis() {
          return d;
        },
        set yaxis(p) {
          d = p;
        }
      };
    },
    []
  ), s = D(
    () => {
      let a = 1, t = 1;
      return {
        get x() {
          return a;
        },
        get y() {
          return t;
        },
        set x(n) {
          a = R(n, 1, lt);
        },
        set y(n) {
          t = R(n, 1, lt);
        }
      };
    },
    []
  ), f = D(
    () => {
      let a = 0, t = 0;
      return {
        get x() {
          return a;
        },
        get y() {
          return t;
        },
        set x(n) {
          a = R(n, 0, s.x - 1);
        },
        set y(n) {
          t = R(n, 0, s.y - 1);
        }
      };
    },
    []
  ), g = D(
    () => ({
      annotate(a, t, n, i) {
        const l = St(10), d = { id: l, rect: a, unit: t, xaxis: n, yaxis: i };
        c((p) => new Map(p).set(l, d)), h(/* @__PURE__ */ new Set([d.id]));
      },
      delete() {
        c((a) => {
          const t = new Map(a);
          for (const n of u)
            t.delete(n);
          return t;
        }), h(/* @__PURE__ */ new Set());
      },
      deselect() {
        h(/* @__PURE__ */ new Set());
      },
      moveSelection(a, t) {
        c((n) => {
          let i;
          return new Map(Array.from(
            n,
            ([l, d]) => [
              l,
              u.has(d.id) ? {
                ...d,
                rect: i = {
                  x: R(d.rect.x + (e.xaxis == d.xaxis ? a : 0), 0, 1 - d.rect.width),
                  y: R(d.rect.y + (e.yaxis == d.yaxis ? t : 0), 0, 1 - d.rect.height),
                  width: d.rect.width,
                  height: d.rect.height
                },
                unit: q(d.xaxis, d.yaxis, i)
              } : d
            ]
          ));
        });
      },
      resetView() {
        s.x = 1, s.y = 1, f.x = 0, f.y = 0;
      },
      scroll(a, t) {
        f.x += a, f.y += t;
      },
      scrollTo(a) {
        f.x = a.x, f.y = a.y;
      },
      selectArea(a) {
        h((t) => {
          if (e.ctrl) {
            const n = new Set(t);
            for (const i of r.values())
              at(F(i.rect, e.xaxis == i.xaxis, e.yaxis == i.yaxis), a) && (n.has(i.id) ? n.delete(i.id) : n.add(i.id));
            return n;
          } else {
            const n = /* @__PURE__ */ new Set();
            for (const i of r.values())
              at(F(i.rect, e.xaxis == i.xaxis, e.yaxis == i.yaxis), a) && n.add(i.id);
            return n;
          }
        });
      },
      selectPoint(a) {
        h((t) => {
          if (e.ctrl) {
            const n = new Set(t);
            for (const i of r.values())
              rt(F(i.rect, e.xaxis == i.xaxis, e.yaxis == i.yaxis), a) && (n.has(i.id) ? n.delete(i.id) : n.add(i.id));
            return n;
          } else {
            const n = /* @__PURE__ */ new Set();
            for (const i of r.values())
              rt(F(i.rect, e.xaxis == i.xaxis, e.yaxis == i.yaxis), a) && n.add(i.id);
            return n;
          }
        });
      },
      setRectX(a, t) {
        c((n) => {
          const i = new Map(n), l = {
            x: R(a.rect.x + t, 0, 1 - a.rect.width),
            y: a.rect.y,
            width: a.rect.width,
            height: a.rect.height
          };
          return i.set(
            a.id,
            { ...a, rect: l, unit: q(a.xaxis, a.yaxis, l) }
          );
        });
      },
      setRectY(a, t) {
        c((n) => {
          const i = new Map(n), l = {
            x: a.rect.x,
            y: R(a.rect.y + t, 0, 1 - a.rect.height),
            width: a.rect.width,
            height: a.rect.height
          };
          return i.set(
            a.id,
            { ...a, rect: l, unit: q(a.xaxis, a.yaxis, l) }
          );
        });
      },
      setRectWidth(a, t) {
        c((n) => {
          const i = new Map(n), l = {
            x: a.rect.x,
            y: a.rect.y,
            width: R(a.rect.width + t, 0.01, 1 - a.rect.x),
            height: a.rect.height
          };
          return i.set(
            a.id,
            { ...a, rect: l, unit: q(a.xaxis, a.yaxis, l) }
          );
        });
      },
      setRectHeight(a, t) {
        c((n) => {
          const i = new Map(n), l = {
            x: a.rect.x,
            y: a.rect.y,
            width: a.rect.width,
            height: R(a.rect.height + t, 0.01, 1 - a.rect.y)
          };
          return i.set(
            a.id,
            { ...a, rect: l, unit: q(a.xaxis, a.yaxis, l) }
          );
        });
      },
      tool(a) {
        w(a);
      },
      zoomArea(a) {
        s.x = 1 / a.width, s.y = 1 / a.height, f.x = -0.5 + (a.x + a.width / 2) * s.x, f.y = -0.5 + (a.y + a.height / 2) * s.y;
      },
      zoomPoint(a) {
        const t = a.x * s.x - f.x, n = a.y * s.y - f.y;
        s.x += 0.5, s.y += 0.5, f.x = a.x * s.x - t, f.y = a.y * s.y - n;
      }
    }),
    [r, u]
  ), [x, w] = j("annotate"), [b, N] = j({
    play: X,
    loop: X,
    stop: X,
    seek: X
  }), [y, v] = j(et(0));
  return _(
    () => {
      function a(n) {
        n.key == "Alt" ? e.alt = !0 : n.key == "Control" && (e.ctrl = !0);
      }
      function t(n) {
        n.key == "Alt" ? e.alt = !1 : n.key == "Control" && (e.ctrl = !1);
      }
      return window.addEventListener("keydown", a), window.addEventListener("keyup", t), () => {
        window.removeEventListener("keydown", a), window.removeEventListener("keyup", t);
      };
    },
    []
  ), /* @__PURE__ */ G(ft.Provider, { value: {
    annotations: r,
    duration: o.duration,
    input: e,
    mousedown: ht(),
    mouseup: ht(),
    mouseRect: kt(),
    unitDown: st(),
    unitUp: st(),
    scroll: f,
    zoom: s,
    playhead: st(),
    selection: u,
    command: g,
    toolState: x,
    transport: b,
    transportState: y,
    setAnnotations: c,
    setSelection: h,
    setTransport: N,
    setTransportState: v
  }, children: o.children });
}
var Rt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, V = {}, It = {
  get exports() {
    return V;
  },
  set exports(o) {
    V = o;
  }
};
(function(o) {
  (function(r) {
    function c(t, n) {
      this.options = {}, t = t || this.options;
      var i = { frequency: 350, peak: 1 };
      this.inputNode = this.filterNode = s.context.createBiquadFilter(), this.filterNode.type = n, this.outputNode = e.context.createGain(), this.filterNode.connect(this.outputNode);
      for (var l in i)
        this[l] = t[l], this[l] = this[l] === void 0 || this[l] === null ? i[l] : this[l];
    }
    function u() {
      var t, n, i = s.context.sampleRate * this.time, l = e.context.createBuffer(2, i, s.context.sampleRate), d = l.getChannelData(0), p = l.getChannelData(1);
      for (n = 0; i > n; n++)
        t = this.reverse ? i - n : n, d[n] = (2 * Math.random() - 1) * Math.pow(1 - t / i, this.decay), p[n] = (2 * Math.random() - 1) * Math.pow(1 - t / i, this.decay);
      this.reverbNode.buffer && (this.inputNode.disconnect(this.reverbNode), this.reverbNode.disconnect(this.wetGainNode), this.reverbNode = e.context.createConvolver(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode)), this.reverbNode.buffer = l;
    }
    function h(t) {
      for (var n = s.context.sampleRate, i = new Float32Array(n), l = Math.PI / 180, d = 0; n > d; d++) {
        var p = 2 * d / n - 1;
        i[d] = (3 + t) * p * 20 * l / (Math.PI + t * Math.abs(p));
      }
      return i;
    }
    var e = {}, s = e, f = o.exports;
    f ? o.exports = e : r.Pizzicato = r.Pz = e;
    var g = r.AudioContext || r.webkitAudioContext;
    if (!g)
      return void console.error("No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.");
    e.context = new g();
    var x = e.context.createGain();
    x.connect(e.context.destination), e.Util = { isString: function(t) {
      return toString.call(t) === "[object String]";
    }, isObject: function(t) {
      return toString.call(t) === "[object Object]";
    }, isFunction: function(t) {
      return toString.call(t) === "[object Function]";
    }, isNumber: function(t) {
      return toString.call(t) === "[object Number]" && t === +t;
    }, isArray: function(t) {
      return toString.call(t) === "[object Array]";
    }, isInRange: function(t, n, i) {
      return s.Util.isNumber(t) && s.Util.isNumber(n) && s.Util.isNumber(i) ? t >= n && i >= t : !1;
    }, isBool: function(t) {
      return typeof t == "boolean";
    }, isOscillator: function(t) {
      return t && t.toString() === "[object OscillatorNode]";
    }, isAudioBufferSourceNode: function(t) {
      return t && t.toString() === "[object AudioBufferSourceNode]";
    }, isSound: function(t) {
      return t instanceof s.Sound;
    }, isEffect: function(t) {
      for (var n in e.Effects)
        if (t instanceof e.Effects[n])
          return !0;
      return !1;
    }, normalize: function(t, n, i) {
      return s.Util.isNumber(t) && s.Util.isNumber(n) && s.Util.isNumber(i) ? (i - n) * t / 1 + n : void 0;
    }, getDryLevel: function(t) {
      return !s.Util.isNumber(t) || t > 1 || 0 > t ? 0 : 0.5 >= t ? 1 : 1 - 2 * (t - 0.5);
    }, getWetLevel: function(t) {
      return !s.Util.isNumber(t) || t > 1 || 0 > t ? 0 : t >= 0.5 ? 1 : 1 - 2 * (0.5 - t);
    } };
    var w = e.context.createGain(), b = Object.getPrototypeOf(Object.getPrototypeOf(w)), N = b.connect;
    b.connect = function(t) {
      var n = s.Util.isEffect(t) ? t.inputNode : t;
      return N.call(this, n), t;
    }, Object.defineProperty(e, "volume", { enumerable: !0, get: function() {
      return x.gain.value;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && x && (x.gain.value = t);
    } }), Object.defineProperty(e, "masterGainNode", { enumerable: !1, get: function() {
      return x;
    }, set: function(t) {
      console.error("Can't set the master gain node");
    } }), e.Events = { on: function(t, n, i) {
      if (t && n) {
        this._events = this._events || {};
        var l = this._events[t] || (this._events[t] = []);
        l.push({ callback: n, context: i || this, handler: this });
      }
    }, trigger: function(t) {
      if (t) {
        var n, i, l, d;
        if (this._events = this._events || {}, n = this._events[t] || (this._events[t] = [])) {
          for (i = Math.max(0, arguments.length - 1), l = [], d = 0; i > d; d++)
            l[d] = arguments[d + 1];
          for (d = 0; d < n.length; d++)
            n[d].callback.apply(n[d].context, l);
        }
      }
    }, off: function(t) {
      t ? this._events[t] = void 0 : this._events = {};
    } }, e.Sound = function(t, n) {
      function i(m) {
        var M = ["wave", "file", "input", "script", "sound"];
        if (m && !S.isFunction(m) && !S.isString(m) && !S.isObject(m))
          return "Description type not supported. Initialize a sound using an object, a function or a string.";
        if (S.isObject(m)) {
          if (!S.isString(m.source) || M.indexOf(m.source) === -1)
            return "Specified source not supported. Sources can be wave, file, input or script";
          if (!(m.source !== "file" || m.options && m.options.path))
            return "A path is needed for sounds with a file source";
          if (!(m.source !== "script" || m.options && m.options.audioFunction))
            return "An audio function is needed for sounds with a script source";
        }
      }
      function l(m, M) {
        m = m || {}, this.getRawSourceNode = function() {
          var k = this.sourceNode ? this.sourceNode.frequency.value : m.frequency, z = e.context.createOscillator();
          return z.type = m.type || "sine", z.frequency.value = k || 440, z;
        }, this.sourceNode = this.getRawSourceNode(), this.sourceNode.gainSuccessor = s.context.createGain(), this.sourceNode.connect(this.sourceNode.gainSuccessor), S.isFunction(M) && M();
      }
      function d(m, M) {
        m = S.isArray(m) ? m : [m];
        var k = new XMLHttpRequest();
        k.open("GET", m[0], !0), k.responseType = "arraybuffer", k.onload = function(z) {
          e.context.decodeAudioData(z.target.response, function(A) {
            T.getRawSourceNode = function() {
              var it = e.context.createBufferSource();
              return it.loop = this.loop, it.buffer = A, it;
            }, S.isFunction(M) && M();
          }.bind(T), function(A) {
            return console.error("Error decoding audio file " + m[0]), m.length > 1 ? (m.shift(), void d(m, M)) : (A = A || new Error("Error decoding audio file " + m[0]), void (S.isFunction(M) && M(A)));
          }.bind(T));
        }, k.onreadystatechange = function(z) {
          k.readyState === 4 && k.status !== 200 && console.error("Error while fetching " + m[0] + ". " + k.statusText);
        }, k.send();
      }
      function p(m, M) {
        if (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, !navigator.getUserMedia && !navigator.mediaDevices.getUserMedia)
          return void console.error("Your browser does not support getUserMedia");
        var k = function(A) {
          T.getRawSourceNode = function() {
            return e.context.createMediaStreamSource(A);
          }, S.isFunction(M) && M();
        }.bind(T), z = function(A) {
          S.isFunction(M) && M(A);
        };
        navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({ audio: !0 }).then(k).catch(z) : navigator.getUserMedia({ audio: !0 }, k, z);
      }
      function U(m, M) {
        var k = S.isFunction(m) ? m : m.audioFunction, z = S.isObject(m) && m.bufferSize ? m.bufferSize : null;
        if (!z)
          try {
            e.context.createScriptProcessor();
          } catch {
            z = 2048;
          }
        this.getRawSourceNode = function() {
          var A = e.context.createScriptProcessor(z, 1, 1);
          return A.onaudioprocess = k, A;
        };
      }
      function C(m, M) {
        this.getRawSourceNode = m.sound.getRawSourceNode, m.sound.sourceNode && s.Util.isOscillator(m.sound.sourceNode) && (this.sourceNode = this.getRawSourceNode(), this.frequency = m.sound.frequency);
      }
      var T = this, S = e.Util, nt = i(t), O = S.isObject(t) && S.isObject(t.options), yt = 0.04, Nt = 0.04;
      if (nt)
        throw console.error(nt), new Error("Error initializing Pizzicato Sound: " + nt);
      this.detached = O && t.options.detached, this.masterVolume = e.context.createGain(), this.fadeNode = e.context.createGain(), this.fadeNode.gain.value = 0, this.detached || this.masterVolume.connect(e.masterGainNode), this.lastTimePlayed = 0, this.effects = [], this.effectConnectors = [], this.playing = this.paused = !1, this.loop = O && t.options.loop, this.attack = O && S.isNumber(t.options.attack) ? t.options.attack : yt, this.volume = O && S.isNumber(t.options.volume) ? t.options.volume : 1, O && S.isNumber(t.options.release) ? this.release = t.options.release : O && S.isNumber(t.options.sustain) ? (console.warn("'sustain' is deprecated. Use 'release' instead."), this.release = t.options.sustain) : this.release = Nt, t ? S.isString(t) ? d.bind(this)(t, n) : S.isFunction(t) ? U.bind(this)(t, n) : t.source === "file" ? d.bind(this)(t.options.path, n) : t.source === "wave" ? l.bind(this)(t.options, n) : t.source === "input" ? p.bind(this)(t, n) : t.source === "script" ? U.bind(this)(t.options, n) : t.source === "sound" && C.bind(this)(t.options, n) : l.bind(this)({}, n);
    }, e.Sound.prototype = Object.create(e.Events, { play: { enumerable: !0, value: function(t, n) {
      this.playing || (s.Util.isNumber(n) || (n = this.offsetTime || 0), s.Util.isNumber(t) || (t = 0), this.playing = !0, this.paused = !1, this.sourceNode = this.getSourceNode(), this.applyAttack(), s.Util.isFunction(this.sourceNode.start) && (this.lastTimePlayed = e.context.currentTime - n, this.sourceNode.start(s.context.currentTime + t, n)), this.trigger("play"));
    } }, stop: { enumerable: !0, value: function() {
      (this.paused || this.playing) && (this.paused = this.playing = !1, this.stopWithRelease(), this.offsetTime = 0, this.trigger("stop"));
    } }, pause: { enumerable: !0, value: function() {
      if (!this.paused && this.playing) {
        this.paused = !0, this.playing = !1, this.stopWithRelease();
        var t = s.context.currentTime - this.lastTimePlayed;
        this.sourceNode.buffer ? this.offsetTime = t % (this.sourceNode.buffer.length / s.context.sampleRate) : this.offsetTime = t, this.trigger("pause");
      }
    } }, clone: { enumerable: !0, value: function() {
      for (var t = new e.Sound({ source: "sound", options: { loop: this.loop, attack: this.attack, release: this.release, volume: this.volume, sound: this } }), n = 0; n < this.effects.length; n++)
        t.addEffect(this.effects[n]);
      return t;
    } }, onEnded: { enumerable: !0, value: function(t) {
      return function() {
        this.sourceNode && this.sourceNode !== t || (this.playing && this.stop(), this.paused || this.trigger("end"));
      };
    } }, addEffect: { enumerable: !0, value: function(t) {
      if (!s.Util.isEffect(t))
        return console.error("The object provided is not a Pizzicato effect."), this;
      this.effects.push(t);
      var n = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.fadeNode;
      n.disconnect(), n.connect(t);
      var i = s.context.createGain();
      return this.effectConnectors.push(i), t.connect(i), i.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(t) {
      var n = this.effects.indexOf(t);
      if (n === -1)
        return console.warn("Cannot remove effect that is not applied to this sound."), this;
      var i = this.playing;
      i && this.pause();
      var l = n === 0 ? this.fadeNode : this.effectConnectors[n - 1];
      l.disconnect();
      var d = this.effectConnectors[n];
      d.disconnect(), t.disconnect(d), this.effectConnectors.splice(n, 1), this.effects.splice(n, 1);
      var p;
      return p = n > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[n], l.connect(p), i && this.play(), this;
    } }, connect: { enumerable: !0, value: function(t) {
      return this.masterVolume.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.masterVolume.disconnect(t), this;
    } }, connectEffects: { enumerable: !0, value: function() {
      for (var t = [], n = 0; n < this.effects.length; n++) {
        var i = n === this.effects.length - 1, l = i ? this.masterVolume : this.effects[n + 1].inputNode;
        t[n] = s.context.createGain(), this.effects[n].outputNode.disconnect(this.effectConnectors[n]), this.effects[n].outputNode.connect(l);
      }
    } }, volume: { enumerable: !0, get: function() {
      return this.masterVolume ? this.masterVolume.gain.value : void 0;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && this.masterVolume && (this.masterVolume.gain.value = t);
    } }, frequency: { enumerable: !0, get: function() {
      return this.sourceNode && s.Util.isOscillator(this.sourceNode) ? this.sourceNode.frequency.value : null;
    }, set: function(t) {
      this.sourceNode && s.Util.isOscillator(this.sourceNode) && (this.sourceNode.frequency.value = t);
    } }, sustain: { enumerable: !0, get: function() {
      return console.warn("'sustain' is deprecated. Use 'release' instead."), this.release;
    }, set: function(t) {
      console.warn("'sustain' is deprecated. Use 'release' instead."), s.Util.isInRange(t, 0, 10) && (this.release = t);
    } }, getSourceNode: { enumerable: !0, value: function() {
      if (this.sourceNode) {
        var t = this.sourceNode;
        t.gainSuccessor.gain.setValueAtTime(t.gainSuccessor.gain.value, s.context.currentTime), t.gainSuccessor.gain.linearRampToValueAtTime(1e-4, s.context.currentTime + 0.2), setTimeout(function() {
          t.disconnect(), t.gainSuccessor.disconnect();
        }, 200);
      }
      var n = this.getRawSourceNode();
      return n.gainSuccessor = s.context.createGain(), n.connect(n.gainSuccessor), n.gainSuccessor.connect(this.fadeNode), this.fadeNode.connect(this.getInputNode()), s.Util.isAudioBufferSourceNode(n) && (n.onended = this.onEnded(n).bind(this)), n;
    } }, getInputNode: { enumerable: !0, value: function() {
      return this.effects.length > 0 ? this.effects[0].inputNode : this.masterVolume;
    } }, applyAttack: { enumerable: !1, value: function() {
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(s.context.currentTime), !this.attack)
        return void this.fadeNode.gain.setTargetAtTime(1, s.context.currentTime, 1e-3);
      var t = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, n = this.attack;
      t || (n = (1 - this.fadeNode.gain.value) * this.attack), this.fadeNode.gain.setTargetAtTime(1, s.context.currentTime, 2 * n);
    } }, stopWithRelease: { enumerable: !1, value: function(t) {
      var n = this.sourceNode, i = function() {
        return s.Util.isFunction(n.stop) ? n.stop(0) : n.disconnect();
      };
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(s.context.currentTime), !this.release)
        return this.fadeNode.gain.setTargetAtTime(0, s.context.currentTime, 1e-3), void i();
      var l = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, d = this.release;
      l || (d = this.fadeNode.gain.value * this.release), this.fadeNode.gain.setTargetAtTime(1e-5, s.context.currentTime, d / 5), window.setTimeout(function() {
        i();
      }, 1e3 * d);
    } } }), e.Group = function(t) {
      t = t || [], this.mergeGainNode = s.context.createGain(), this.masterVolume = s.context.createGain(), this.sounds = [], this.effects = [], this.effectConnectors = [], this.mergeGainNode.connect(this.masterVolume), this.masterVolume.connect(s.masterGainNode);
      for (var n = 0; n < t.length; n++)
        this.addSound(t[n]);
    }, e.Group.prototype = Object.create(s.Events, { connect: { enumerable: !0, value: function(t) {
      return this.masterVolume.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.masterVolume.disconnect(t), this;
    } }, addSound: { enumerable: !0, value: function(t) {
      return s.Util.isSound(t) ? this.sounds.indexOf(t) > -1 ? void console.warn("The Pizzicato.Sound object was already added to this group") : t.detached ? void console.warn("Groups do not support detached sounds. You can manually create an audio graph to group detached sounds together.") : (t.disconnect(s.masterGainNode), t.connect(this.mergeGainNode), void this.sounds.push(t)) : void console.error("You can only add Pizzicato.Sound objects");
    } }, removeSound: { enumerable: !0, value: function(t) {
      var n = this.sounds.indexOf(t);
      return n === -1 ? void console.warn("Cannot remove a sound that is not part of this group.") : (t.disconnect(this.mergeGainNode), t.connect(s.masterGainNode), void this.sounds.splice(n, 1));
    } }, volume: { enumerable: !0, get: function() {
      return this.masterVolume ? this.masterVolume.gain.value : void 0;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.masterVolume.gain.value = t);
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
      if (!s.Util.isEffect(t))
        return console.error("The object provided is not a Pizzicato effect."), this;
      this.effects.push(t);
      var n = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.mergeGainNode;
      n.disconnect(), n.connect(t);
      var i = s.context.createGain();
      return this.effectConnectors.push(i), t.connect(i), i.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(t) {
      var n = this.effects.indexOf(t);
      if (n === -1)
        return console.warn("Cannot remove effect that is not applied to this group."), this;
      var i = n === 0 ? this.mergeGainNode : this.effectConnectors[n - 1];
      i.disconnect();
      var l = this.effectConnectors[n];
      l.disconnect(), t.disconnect(l), this.effectConnectors.splice(n, 1), this.effects.splice(n, 1);
      var d;
      return d = n > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[n], i.connect(d), this;
    } } }), e.Effects = {};
    var y = Object.create(null, { connect: { enumerable: !0, value: function(t) {
      return this.outputNode.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.outputNode.disconnect(t), this;
    } } });
    e.Effects.Delay = function(t) {
      this.options = {}, t = t || this.options;
      var n = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = e.context.createGain(), this.outputNode = e.context.createGain(), this.dryGainNode = e.context.createGain(), this.wetGainNode = e.context.createGain(), this.feedbackGainNode = e.context.createGain(), this.delayNode = e.context.createDelay(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.delayNode), this.inputNode.connect(this.delayNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, e.Effects.Delay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = e.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = e.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 180) && (this.options.time = t, this.delayNode.delayTime.value = t);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.feedback = parseFloat(t, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), e.Effects.Compressor = function(t) {
      this.options = {}, t = t || this.options;
      var n = { threshold: -24, knee: 30, attack: 3e-3, release: 0.25, ratio: 12 };
      this.inputNode = this.compressorNode = e.context.createDynamicsCompressor(), this.outputNode = e.context.createGain(), this.compressorNode.connect(this.outputNode);
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, e.Effects.Compressor.prototype = Object.create(y, { threshold: { enumerable: !0, get: function() {
      return this.compressorNode.threshold.value;
    }, set: function(t) {
      e.Util.isInRange(t, -100, 0) && (this.compressorNode.threshold.value = t);
    } }, knee: { enumerable: !0, get: function() {
      return this.compressorNode.knee.value;
    }, set: function(t) {
      e.Util.isInRange(t, 0, 40) && (this.compressorNode.knee.value = t);
    } }, attack: { enumerable: !0, get: function() {
      return this.compressorNode.attack.value;
    }, set: function(t) {
      e.Util.isInRange(t, 0, 1) && (this.compressorNode.attack.value = t);
    } }, release: { enumerable: !0, get: function() {
      return this.compressorNode.release.value;
    }, set: function(t) {
      e.Util.isInRange(t, 0, 1) && (this.compressorNode.release.value = t);
    } }, ratio: { enumerable: !0, get: function() {
      return this.compressorNode.ratio.value;
    }, set: function(t) {
      e.Util.isInRange(t, 1, 20) && (this.compressorNode.ratio.value = t);
    } }, getCurrentGainReduction: function() {
      return this.compressorNode.reduction;
    } }), e.Effects.LowPassFilter = function(t) {
      c.call(this, t, "lowpass");
    }, e.Effects.HighPassFilter = function(t) {
      c.call(this, t, "highpass");
    };
    var v = Object.create(y, { frequency: { enumerable: !0, get: function() {
      return this.filterNode.frequency.value;
    }, set: function(t) {
      e.Util.isInRange(t, 10, 22050) && (this.filterNode.frequency.value = t);
    } }, peak: { enumerable: !0, get: function() {
      return this.filterNode.Q.value;
    }, set: function(t) {
      e.Util.isInRange(t, 1e-4, 1e3) && (this.filterNode.Q.value = t);
    } } });
    e.Effects.LowPassFilter.prototype = v, e.Effects.HighPassFilter.prototype = v, e.Effects.Distortion = function(t) {
      this.options = {}, t = t || this.options;
      var n = { gain: 0.5 };
      this.waveShaperNode = e.context.createWaveShaper(), this.inputNode = this.outputNode = this.waveShaperNode;
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, e.Effects.Distortion.prototype = Object.create(y, { gain: { enumerable: !0, get: function() {
      return this.options.gain;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.gain = t, this.adjustGain());
    } }, adjustGain: { writable: !1, configurable: !1, enumerable: !1, value: function() {
      for (var t, n = s.Util.isNumber(this.options.gain) ? parseInt(100 * this.options.gain, 10) : 50, i = 44100, l = new Float32Array(i), d = Math.PI / 180, p = 0; i > p; ++p)
        t = 2 * p / i - 1, l[p] = (3 + n) * t * 20 * d / (Math.PI + n * Math.abs(t));
      this.waveShaperNode.curve = l;
    } } }), e.Effects.Flanger = function(t) {
      this.options = {}, t = t || this.options;
      var n = { time: 0.45, speed: 0.2, depth: 0.1, feedback: 0.1, mix: 0.5 };
      this.inputNode = e.context.createGain(), this.outputNode = e.context.createGain(), this.inputFeedbackNode = e.context.createGain(), this.wetGainNode = e.context.createGain(), this.dryGainNode = e.context.createGain(), this.delayNode = e.context.createDelay(), this.oscillatorNode = e.context.createOscillator(), this.gainNode = e.context.createGain(), this.feedbackNode = e.context.createGain(), this.oscillatorNode.type = "sine", this.inputNode.connect(this.inputFeedbackNode), this.inputNode.connect(this.dryGainNode), this.inputFeedbackNode.connect(this.delayNode), this.inputFeedbackNode.connect(this.wetGainNode), this.delayNode.connect(this.wetGainNode), this.delayNode.connect(this.feedbackNode), this.feedbackNode.connect(this.inputFeedbackNode), this.oscillatorNode.connect(this.gainNode), this.gainNode.connect(this.delayNode.delayTime), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode), this.oscillatorNode.start(0);
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, e.Effects.Flanger.prototype = Object.create(y, { time: { enumberable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.time = t, this.delayNode.delayTime.value = s.Util.normalize(t, 1e-3, 0.02));
    } }, speed: { enumberable: !0, get: function() {
      return this.options.speed;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.speed = t, this.oscillatorNode.frequency.value = s.Util.normalize(t, 0.5, 5));
    } }, depth: { enumberable: !0, get: function() {
      return this.options.depth;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.depth = t, this.gainNode.gain.value = s.Util.normalize(t, 5e-4, 5e-3));
    } }, feedback: { enumberable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.feedback = t, this.feedbackNode.gain.value = s.Util.normalize(t, 0, 0.8));
    } }, mix: { enumberable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = e.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = e.Util.getWetLevel(this.mix));
    } } }), e.Effects.StereoPanner = function(t) {
      this.options = {}, t = t || this.options;
      var n = { pan: 0 };
      this.inputNode = e.context.createGain(), this.outputNode = e.context.createGain(), e.context.createStereoPanner ? (this.pannerNode = e.context.createStereoPanner(), this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : e.context.createPanner ? (console.warn("Your browser does not support the StereoPannerNode. Will use PannerNode instead."), this.pannerNode = e.context.createPanner(), this.pannerNode.type = "equalpower", this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : (console.warn("Your browser does not support the Panner effect."), this.inputNode.connect(this.outputNode));
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, e.Effects.StereoPanner.prototype = Object.create(y, { pan: { enumerable: !0, get: function() {
      return this.options.pan;
    }, set: function(t) {
      if (s.Util.isInRange(t, -1, 1) && (this.options.pan = t, this.pannerNode)) {
        var n = this.pannerNode.toString().indexOf("StereoPannerNode") > -1;
        n ? this.pannerNode.pan.value = t : this.pannerNode.setPosition(t, 0, 1 - Math.abs(t));
      }
    } } }), e.Effects.Convolver = function(t, n) {
      this.options = {}, t = t || this.options;
      var i = this, l = new XMLHttpRequest(), d = { mix: 0.5 };
      this.callback = n, this.inputNode = e.context.createGain(), this.convolverNode = e.context.createConvolver(), this.outputNode = e.context.createGain(), this.wetGainNode = e.context.createGain(), this.dryGainNode = e.context.createGain(), this.inputNode.connect(this.convolverNode), this.convolverNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var p in d)
        this[p] = t[p], this[p] = this[p] === void 0 || this[p] === null ? d[p] : this[p];
      return t.impulse ? (l.open("GET", t.impulse, !0), l.responseType = "arraybuffer", l.onload = function(U) {
        var C = U.target.response;
        e.context.decodeAudioData(C, function(T) {
          i.convolverNode.buffer = T, i.callback && s.Util.isFunction(i.callback) && i.callback();
        }, function(T) {
          T = T || new Error("Error decoding impulse file"), i.callback && s.Util.isFunction(i.callback) && i.callback(T);
        });
      }, l.onreadystatechange = function(U) {
        l.readyState === 4 && l.status !== 200 && console.error("Error while fetching " + t.impulse + ". " + l.statusText);
      }, void l.send()) : void console.error("No impulse file specified.");
    }, e.Effects.Convolver.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = e.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = e.Util.getWetLevel(this.mix));
    } } }), e.Effects.PingPongDelay = function(t) {
      this.options = {}, t = t || this.options;
      var n = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = e.context.createGain(), this.outputNode = e.context.createGain(), this.delayNodeLeft = e.context.createDelay(), this.delayNodeRight = e.context.createDelay(), this.dryGainNode = e.context.createGain(), this.wetGainNode = e.context.createGain(), this.feedbackGainNode = e.context.createGain(), this.channelMerger = e.context.createChannelMerger(2), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNodeLeft.connect(this.channelMerger, 0, 0), this.delayNodeRight.connect(this.channelMerger, 0, 1), this.delayNodeLeft.connect(this.delayNodeRight), this.feedbackGainNode.connect(this.delayNodeLeft), this.delayNodeRight.connect(this.feedbackGainNode), this.inputNode.connect(this.feedbackGainNode), this.channelMerger.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, e.Effects.PingPongDelay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = e.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = e.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 180) && (this.options.time = t, this.delayNodeLeft.delayTime.value = t, this.delayNodeRight.delayTime.value = t);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.feedback = parseFloat(t, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), e.Effects.Reverb = function(t) {
      this.options = {}, t = t || this.options;
      var n = { mix: 0.5, time: 0.01, decay: 0.01, reverse: !1 };
      this.inputNode = e.context.createGain(), this.reverbNode = e.context.createConvolver(), this.outputNode = e.context.createGain(), this.wetGainNode = e.context.createGain(), this.dryGainNode = e.context.createGain(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
      u.bind(this)();
    }, e.Effects.Reverb.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = e.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = e.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      s.Util.isInRange(t, 1e-4, 10) && (this.options.time = t, u.bind(this)());
    } }, decay: { enumerable: !0, get: function() {
      return this.options.decay;
    }, set: function(t) {
      s.Util.isInRange(t, 1e-4, 10) && (this.options.decay = t, u.bind(this)());
    } }, reverse: { enumerable: !0, get: function() {
      return this.options.reverse;
    }, set: function(t) {
      s.Util.isBool(t) && (this.options.reverse = t, u.bind(this)());
    } } }), e.Effects.Tremolo = function(t) {
      this.options = {}, t = t || this.options;
      var n = { speed: 4, depth: 1, mix: 0.8 };
      this.inputNode = e.context.createGain(), this.outputNode = e.context.createGain(), this.dryGainNode = e.context.createGain(), this.wetGainNode = e.context.createGain(), this.tremoloGainNode = e.context.createGain(), this.tremoloGainNode.gain.value = 0, this.lfoNode = e.context.createOscillator(), this.shaperNode = e.context.createWaveShaper(), this.shaperNode.curve = new Float32Array([0, 1]), this.shaperNode.connect(this.tremoloGainNode.gain), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.lfoNode.connect(this.shaperNode), this.lfoNode.type = "sine", this.lfoNode.start(0), this.inputNode.connect(this.tremoloGainNode), this.tremoloGainNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, e.Effects.Tremolo.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = e.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = e.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 20) && (this.options.speed = t, this.lfoNode.frequency.value = t);
    } }, depth: { enumerable: !0, get: function() {
      return this.options.depth;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.depth = t, this.shaperNode.curve = new Float32Array([1 - t, 1]));
    } } }), e.Effects.DubDelay = function(t) {
      this.options = {}, t = t || this.options;
      var n = { feedback: 0.6, time: 0.7, mix: 0.5, cutoff: 700 };
      this.inputNode = e.context.createGain(), this.outputNode = e.context.createGain(), this.dryGainNode = e.context.createGain(), this.wetGainNode = e.context.createGain(), this.feedbackGainNode = e.context.createGain(), this.delayNode = e.context.createDelay(), this.bqFilterNode = e.context.createBiquadFilter(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.bqFilterNode), this.bqFilterNode.connect(this.delayNode), this.delayNode.connect(this.feedbackGainNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    }, e.Effects.DubDelay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = e.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = e.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 180) && (this.options.time = t, this.delayNode.delayTime.value = t);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.feedback = parseFloat(t, 10), this.feedbackGainNode.gain.value = this.feedback);
    } }, cutoff: { enumerable: !0, get: function() {
      return this.options.cutoff;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 4e3) && (this.options.cutoff = t, this.bqFilterNode.frequency.value = this.cutoff);
    } } }), e.Effects.RingModulator = function(t) {
      this.options = {}, t = t || this.options;
      var n = { speed: 30, distortion: 1, mix: 0.5 };
      this.inputNode = e.context.createGain(), this.outputNode = e.context.createGain(), this.dryGainNode = e.context.createGain(), this.wetGainNode = e.context.createGain(), this.vIn = e.context.createOscillator(), this.vIn.start(0), this.vInGain = e.context.createGain(), this.vInGain.gain.value = 0.5, this.vInInverter1 = e.context.createGain(), this.vInInverter1.gain.value = -1, this.vInInverter2 = e.context.createGain(), this.vInInverter2.gain.value = -1, this.vInDiode1 = new a(e.context), this.vInDiode2 = new a(e.context), this.vInInverter3 = e.context.createGain(), this.vInInverter3.gain.value = -1, this.vcInverter1 = e.context.createGain(), this.vcInverter1.gain.value = -1, this.vcDiode3 = new a(e.context), this.vcDiode4 = new a(e.context), this.outGain = e.context.createGain(), this.outGain.gain.value = 3, this.compressor = e.context.createDynamicsCompressor(), this.compressor.threshold.value = -24, this.compressor.ratio.value = 16, this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.vcInverter1), this.inputNode.connect(this.vcDiode4.node), this.vcInverter1.connect(this.vcDiode3.node), this.vIn.connect(this.vInGain), this.vInGain.connect(this.vInInverter1), this.vInGain.connect(this.vcInverter1), this.vInGain.connect(this.vcDiode4.node), this.vInInverter1.connect(this.vInInverter2), this.vInInverter1.connect(this.vInDiode2.node), this.vInInverter2.connect(this.vInDiode1.node), this.vInDiode1.connect(this.vInInverter3), this.vInDiode2.connect(this.vInInverter3), this.vInInverter3.connect(this.compressor), this.vcDiode3.connect(this.compressor), this.vcDiode4.connect(this.compressor), this.compressor.connect(this.outGain), this.outGain.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in n)
        this[i] = t[i], this[i] = this[i] === void 0 || this[i] === null ? n[i] : this[i];
    };
    var a = function(t) {
      this.context = t, this.node = this.context.createWaveShaper(), this.vb = 0.2, this.vl = 0.4, this.h = 1, this.setCurve();
    };
    return a.prototype.setDistortion = function(t) {
      return this.h = t, this.setCurve();
    }, a.prototype.setCurve = function() {
      var t, n, i, l, d, p, U;
      for (n = 1024, d = new Float32Array(n), t = p = 0, U = d.length; U >= 0 ? U > p : p > U; t = U >= 0 ? ++p : --p)
        i = (t - n / 2) / (n / 2), i = Math.abs(i), l = i <= this.vb ? 0 : this.vb < i && i <= this.vl ? this.h * (Math.pow(i - this.vb, 2) / (2 * this.vl - 2 * this.vb)) : this.h * i - this.h * this.vl + this.h * (Math.pow(this.vl - this.vb, 2) / (2 * this.vl - 2 * this.vb)), d[t] = l;
      return this.node.curve = d;
    }, a.prototype.connect = function(t) {
      return this.node.connect(t);
    }, e.Effects.RingModulator.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = e.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = e.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 2e3) && (this.options.speed = t, this.vIn.frequency.value = t);
    } }, distortion: { enumerable: !0, get: function() {
      return this.options.distortion;
    }, set: function(t) {
      if (s.Util.isInRange(t, 0.2, 50)) {
        this.options.distortion = parseFloat(t, 10);
        for (var n = [this.vInDiode1, this.vInDiode2, this.vcDiode3, this.vcDiode4], i = 0, l = n.length; l > i; i++)
          n[i].setDistortion(t);
      }
    } } }), e.Effects.Quadrafuzz = function(t) {
      this.options = {}, t = t || this.options;
      var n = { lowGain: 0.6, midLowGain: 0.8, midHighGain: 0.5, highGain: 0.6 };
      this.inputNode = s.context.createGain(), this.outputNode = s.context.createGain(), this.dryGainNode = s.context.createGain(), this.wetGainNode = s.context.createGain(), this.lowpassLeft = s.context.createBiquadFilter(), this.lowpassLeft.type = "lowpass", this.lowpassLeft.frequency.value = 147, this.lowpassLeft.Q.value = 0.7071, this.bandpass1Left = s.context.createBiquadFilter(), this.bandpass1Left.type = "bandpass", this.bandpass1Left.frequency.value = 587, this.bandpass1Left.Q.value = 0.7071, this.bandpass2Left = s.context.createBiquadFilter(), this.bandpass2Left.type = "bandpass", this.bandpass2Left.frequency.value = 2490, this.bandpass2Left.Q.value = 0.7071, this.highpassLeft = s.context.createBiquadFilter(), this.highpassLeft.type = "highpass", this.highpassLeft.frequency.value = 4980, this.highpassLeft.Q.value = 0.7071, this.overdrives = [];
      for (var i = 0; 4 > i; i++)
        this.overdrives[i] = s.context.createWaveShaper(), this.overdrives[i].curve = h();
      this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode);
      var l = [this.lowpassLeft, this.bandpass1Left, this.bandpass2Left, this.highpassLeft];
      for (i = 0; i < l.length; i++)
        this.wetGainNode.connect(l[i]), l[i].connect(this.overdrives[i]), this.overdrives[i].connect(this.outputNode);
      for (var d in n)
        this[d] = t[d], this[d] = this[d] === void 0 || this[d] === null ? n[d] : this[d];
    }, e.Effects.Quadrafuzz.prototype = Object.create(y, { lowGain: { enumerable: !0, get: function() {
      return this.options.lowGain;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.lowGain = t, this.overdrives[0].curve = h(s.Util.normalize(this.lowGain, 0, 150)));
    } }, midLowGain: { enumerable: !0, get: function() {
      return this.options.midLowGain;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.midLowGain = t, this.overdrives[1].curve = h(s.Util.normalize(this.midLowGain, 0, 150)));
    } }, midHighGain: { enumerable: !0, get: function() {
      return this.options.midHighGain;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.midHighGain = t, this.overdrives[2].curve = h(s.Util.normalize(this.midHighGain, 0, 150)));
    } }, highGain: { enumerable: !0, get: function() {
      return this.options.highGain;
    }, set: function(t) {
      s.Util.isInRange(t, 0, 1) && (this.options.highGain = t, this.overdrives[3].curve = h(s.Util.normalize(this.highGain, 0, 150)));
    } } }), e;
  })(typeof window < "u" ? window : Rt);
})(It);
const Q = 22e3, K = 0;
function jt(o) {
  const { annotations: r, duration: c, playhead: u, transportState: h, setTransport: e, setTransportState: s } = L(), f = I(null), g = I(new V.Effects.LowPassFilter({ frequency: Q, peak: 10 })), x = I(new V.Effects.HighPassFilter({ frequency: K, peak: 10 }));
  Y(E(
    () => {
      let v, a, t, n;
      switch (h.type) {
        case "stop":
          x.current.frequency = K, g.current.frequency = Q, u.x = h.progress;
          break;
        case "play":
          x.current.frequency = K, g.current.frequency = Q, v = (Date.now() - h.timeRef) / 1e3, u.x = h.progress + v / c;
          break;
        case "loop":
          if (v = (Date.now() - h.timeRef) / 1e3, u.x = h.progress + v / c, a = r.get(h.annotation.id), a == null)
            return N();
          t = a.rect, n = a.unit, a.yaxis.unit === "hertz" ? (x.current.frequency = n.y, g.current.frequency = n.y + n.height) : (x.current.frequency = K, g.current.frequency = Q), (u.x < t.x || u.x >= t.x + t.width) && b(a);
          break;
      }
    },
    [r, h, c]
  ));
  const w = E(
    () => {
      s((v) => {
        if (f.current == null)
          return v;
        switch (v.type) {
          case "stop":
            return f.current.play(0, v.progress * c), ut(v.progress, Date.now());
          case "play":
          case "loop":
            return v;
        }
      });
    },
    [c]
  ), b = E(
    (v) => {
      const { rect: a, unit: t } = v;
      s((n) => f.current == null ? n : (f.current.stop(), f.current.play(0, t.x), Mt(a.x, Date.now(), v)));
    },
    [c]
  ), N = E(
    () => {
      s((v) => {
        if (f.current == null)
          return v;
        switch (v.type) {
          case "stop":
            return v;
          case "play":
          case "loop":
            f.current.stop();
            const a = (Date.now() - v.timeRef) / 1e3;
            return et(v.progress + a / c);
        }
      });
    },
    [c]
  ), y = E(
    (v) => {
      s((a) => {
        if (f.current == null)
          return a;
        switch (a.type) {
          case "stop":
            return et(v);
          case "play":
          case "loop":
            return f.current.stop(), f.current.play(0, v * c), ut(v, Date.now());
        }
      });
    },
    [c]
  );
  return _(
    () => {
      const v = new V.Sound(
        o.url,
        (a) => {
          if (a)
            return console.error(a);
          f.current != null && f.current.stop(), v.addEffect(g.current), v.addEffect(x.current), f.current = v, e({ play: w, loop: b, stop: N, seek: y });
        }
      );
      return N;
    },
    [o.url, w, b, N, y]
  ), /* @__PURE__ */ G(bt, {});
}
function qt(o) {
  const { state: r, setState: c, value: u, unit: h } = o, { input: e } = L(), s = I(null), f = 5 * Math.PI / 4, g = -Math.PI / 4, { x, y: w } = D(
    () => {
      const b = f - r * (f - g);
      return { x: Math.cos(b) * 4 / 5, y: -Math.sin(b) * 4 / 5 };
    },
    [r]
  );
  return _(
    () => {
      const b = s.current;
      function N(y) {
        y.preventDefault();
        const v = y.deltaY / (e.ctrl ? 1e4 : 1e3);
        c(v);
      }
      return b.addEventListener("wheel", N, { passive: !1 }), () => {
        b.removeEventListener("wheel", N);
      };
    },
    [c]
  ), /* @__PURE__ */ $(
    "svg",
    {
      ref: s,
      width: "60",
      height: "60",
      viewBox: "-1.1 -1.1 2.2 2.2",
      children: [
        /* @__PURE__ */ G("path", { className: "encoder", d: `
      M ${Math.cos(f)} ${-Math.sin(f)}
      A 1 1 0 1 1 ${Math.cos(g)} ${-Math.sin(g)}
    ` }),
        /* @__PURE__ */ G(
          "circle",
          {
            className: "encoder-marker",
            cx: x,
            cy: w,
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
            children: u.toFixed(2)
          }
        ),
        /* @__PURE__ */ G(
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
function vt(o) {
  return Math.sqrt(o.x * o.x + o.y * o.y);
}
function W(o) {
  o.setAttribute("display", "none");
}
function tt(o) {
  o.setAttribute("display", "inline");
}
function zt(o, r, c = String) {
  r.x < 0.5 ? (B(o, r.x, void 0, c), o.setAttribute("text-anchor", "start")) : (B(o, r.x, void 0, c), o.setAttribute("text-anchor", "end")), r.y < 0.5 ? (H(o, r.y + 0.01, void 0, c), o.setAttribute("dominant-baseline", "hanging")) : (H(o, r.y - 0.01, void 0, c), o.setAttribute("dominant-baseline", "text-top"));
}
function At(o, r) {
  o.setAttribute("d", r);
}
function Et(o, r, c = String) {
  o.setAttribute("x", c(r.x)), o.setAttribute("y", c(r.y)), o.setAttribute("width", c(r.width)), o.setAttribute("height", c(r.height));
}
function Lt(o, r) {
  o.textContent = r;
}
function Tt(o, r, c) {
  o.setAttribute(
    "transform",
    `translate(${-r.x}, ${-r.y}) scale(${c.x}, ${c.y})`
  );
}
function B(o, r, c = r, u = String) {
  switch (o.constructor) {
    case SVGTextElement:
      o.setAttribute("x", u(r));
    case SVGLineElement:
      o.setAttribute("x1", u(r)), o.setAttribute("x2", u(c));
      break;
    case SVGRectElement:
      o.setAttribute("x", u(r)), o.setAttribute("width", u(c));
  }
}
function H(o, r, c = r, u = String) {
  switch (o.constructor) {
    case SVGTextElement:
      o.setAttribute("y", u(r));
    case SVGLineElement:
      o.setAttribute("y1", u(r)), o.setAttribute("y2", u(c));
      break;
    case SVGRectElement:
      o.setAttribute("y", u(r)), o.setAttribute("height", u(c));
  }
}
function mt(o) {
  const { xaxis: r, yaxis: c } = o, { annotations: u, playhead: h, transportState: e } = L(), s = I(null);
  return Y(E(
    () => {
      const f = s.current;
      let g, x;
      switch (e.type) {
        case "stop":
        case "play":
          B(f, h.x), H(f, 0, 1);
          break;
        case "loop":
          if (g = u.get(e.annotation.id), g == null)
            return;
          x = F(g.rect, r === g.xaxis, c === g.yaxis), B(f, h.x), H(f, x.y, x.y + x.height);
          break;
      }
    },
    [u, e]
  )), /* @__PURE__ */ G(
    "line",
    {
      ref: s,
      className: "playhead",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "100%"
    }
  );
}
function gt(o) {
  const { annotation: r, xaxis: c, yaxis: u } = o, { selection: h } = L(), e = D(
    () => F(r.rect, c == r.xaxis, u == r.yaxis),
    [r, c, u]
  );
  return /* @__PURE__ */ G(
    "rect",
    {
      className: h.has(r.id) ? "annotation annotation-selected" : "annotation",
      x: String(e.x),
      y: String(e.y),
      width: String(e.width),
      height: String(e.height)
    },
    r.id
  );
}
const Z = () => {
};
function Vt(o) {
  const { imageUrl: r, xaxis: c, yaxis: u } = o, { annotations: h, command: e, input: s, mouseup: f, mouseRect: g, scroll: x, zoom: w, toolState: b, transportState: N } = L(), y = I(null), v = I(null);
  Y(E(
    () => {
      At(v.current, `
        M 0 0
        h 1
        v 1
        h -1
        z
        M ${x.x / w.x} ${x.y / w.y}
        v ${1 / w.y}
        h ${1 / w.x}
        v ${-1 / w.y}
        z
      `);
    },
    []
  ));
  const a = pt({
    xaxis: null,
    yaxis: null,
    onContextMenu: Z,
    onMouseDown: Z,
    onMouseEnter: Z,
    onMouseLeave: Z,
    onMouseMove: E(
      (t) => {
        s.buttons & 1 && e.scroll(
          t.movementX / t.currentTarget.clientWidth * w.x,
          t.movementY / t.currentTarget.clientHeight * w.y
        );
      },
      [b]
    ),
    onMouseUp: E(
      (t) => {
        if (s.buttons & 1 && vt({ x: g.width, y: g.height }) < 0.01)
          switch (b) {
            case "annotate":
            case "select":
            case "pan":
              e.scrollTo({
                x: f.rel.x * w.x - 0.5,
                y: f.rel.y * w.y - 0.5
              });
              break;
            case "zoom":
              e.resetView();
              break;
          }
      },
      [b]
    )
  });
  return xt(y, 1), /* @__PURE__ */ G(
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
          ...a,
          children: [
            /* @__PURE__ */ G(
              "image",
              {
                href: r,
                width: "100%",
                height: "100%",
                preserveAspectRatio: "none"
              }
            ),
            Array.from(h.values()).map(
              (t) => /* @__PURE__ */ G(
                gt,
                {
                  annotation: t,
                  xaxis: c,
                  yaxis: u
                },
                t.id
              )
            ),
            /* @__PURE__ */ G(
              "path",
              {
                ref: v,
                className: "mask",
                d: ""
              }
            ),
            /* @__PURE__ */ G(mt, { xaxis: c, yaxis: u })
          ]
        }
      )
    }
  );
}
function Dt(o) {
  const { parent: r, xaxis: c, yaxis: u } = o, { input: h, mouseup: e, unitUp: s } = L(), f = I(null), g = I(null), x = I(null), w = I(null);
  return Y(E(
    () => {
      const b = f.current;
      if (h.alt) {
        const N = g.current, y = x.current, v = w.current;
        let a, t;
        tt(b), r.current == h.focus || c == h.xaxis ? (a = ct(c, s.x), B(N, e.rel.x, void 0, ot), tt(N)) : (a = "", W(N)), r.current == h.focus || u == h.yaxis ? (t = ct(u, s.y), H(y, e.rel.y, void 0, ot), tt(y)) : (t = "", W(y)), Lt(v, a && t ? `(${a}, ${t})` : a || t), zt(v, e.rel, ot);
      } else
        W(b);
    },
    [c, u]
  )), /* @__PURE__ */ $("g", { ref: f, children: [
    /* @__PURE__ */ G(
      "line",
      {
        ref: g,
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
        ref: x,
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
function Wt(o) {
  const { imageUrl: r, xaxis: c, yaxis: u } = o, { command: h, input: e, mouseup: s, mouseRect: f, unitDown: g, unitUp: x, scroll: w, zoom: b } = L(), { toolState: N, transportState: y, transport: v } = L(), { annotations: a } = L(), { selection: t } = L(), n = I(null), i = I(null), l = I(null);
  Y(E(
    () => {
      const p = i.current, U = l.current;
      switch (Tt(p, w, b), N) {
        case "annotate":
        case "select":
        case "zoom":
          e.buttons & 1 ? (tt(U), Et(U, F(f, c === e.xaxis, u === e.yaxis))) : W(U);
          break;
        case "pan":
          W(U);
          break;
      }
    },
    [N, c, u]
  ));
  const d = pt({
    xaxis: c,
    yaxis: u,
    onContextMenu: J,
    onMouseDown: J,
    onMouseEnter: J,
    onMouseLeave: J,
    onMouseMove: E(
      (p) => {
        if (e.buttons & 1) {
          const U = p.movementX / p.currentTarget.clientWidth, C = p.movementY / p.currentTarget.clientHeight;
          switch (N) {
            case "annotate":
            case "select":
            case "zoom":
              break;
            case "pan":
              t.size == 0 ? h.scroll(-U, -C) : h.moveSelection(U, C);
              break;
          }
        }
      },
      [N, t, c, u]
    ),
    onMouseUp: E(
      (p) => {
        if (e.buttons & 1)
          if (vt({ x: f.width, y: f.height }) < 0.01)
            switch (N) {
              case "annotate":
                h.deselect();
                break;
              case "select":
                h.selectPoint(s.abs);
                break;
              case "zoom":
                h.zoomPoint(s.abs);
                break;
            }
          else
            switch (N) {
              case "annotate":
                h.annotate({ ...f }, dt(g, x), c, u);
                break;
              case "select":
                h.selectArea(f);
                break;
              case "zoom":
                h.zoomArea(f);
                break;
            }
        e.buttons & 2 && v.seek(s.abs.x);
      },
      [a, N, v, c, u]
    )
  });
  return xt(n, -1), /* @__PURE__ */ G(
    "div",
    {
      className: `visualization ${N} ${y.type}`,
      children: /* @__PURE__ */ $(
        "svg",
        {
          ref: n,
          width: "100%",
          height: "100%",
          ...d,
          children: [
            /* @__PURE__ */ G(
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
                      /* @__PURE__ */ G(
                        "image",
                        {
                          preserveAspectRatio: "none",
                          href: r,
                          width: "100%",
                          height: "100%"
                        }
                      ),
                      Array.from(a.values()).map(
                        (p) => /* @__PURE__ */ G(
                          gt,
                          {
                            annotation: p,
                            xaxis: c,
                            yaxis: u
                          },
                          p.id
                        )
                      ),
                      /* @__PURE__ */ G(
                        "rect",
                        {
                          ref: l,
                          className: "selection",
                          x: "0",
                          y: "0",
                          width: "0",
                          height: "0"
                        }
                      ),
                      /* @__PURE__ */ G(mt, { xaxis: c, yaxis: u })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ G(Dt, { parent: n, xaxis: c, yaxis: u })
          ]
        }
      )
    }
  );
}
export {
  jt as Audio,
  qt as Encoder,
  Vt as Navigator,
  Ot as Specviz,
  Wt as Visualization,
  L as useSpecviz
};
