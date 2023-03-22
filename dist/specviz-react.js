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
      function a(u) {
        r(u), c = window.requestAnimationFrame(a);
      }
      return c = window.requestAnimationFrame(a), () => {
        window.cancelAnimationFrame(c);
      };
    },
    [r]
  );
}
function pe(r) {
  const { input: c, mousedown: a, mouseup: u, mouseRect: l, unitDown: n, unitUp: o, scroll: f, zoom: g } = L();
  return D(
    () => ({
      onContextMenu(v) {
        v.preventDefault(), r.onContextMenu(v);
      },
      onMouseDown(v) {
        v.preventDefault(), c.buttons = v.buttons, r.onMouseDown(v);
      },
      onMouseMove(v) {
        const b = v.currentTarget.getBoundingClientRect(), N = (v.clientX - b.x) / b.width, y = (v.clientY - b.y) / b.height;
        c.buttons & 1 ? (u.rel.x = N, u.rel.y = y, u.abs.x = (N + f.x) / g.x, u.abs.y = (y + f.y) / g.y, o.x = Y(r.xaxis, I(u.abs.x, 0, 1)), o.y = Y(r.yaxis, I(u.abs.y, 0, 1))) : (a.rel.x = u.rel.x = N, a.rel.y = u.rel.y = y, a.abs.x = u.abs.x = (N + f.x) / g.x, a.abs.y = u.abs.y = (y + f.y) / g.y, n.x = o.x = Y(r.xaxis, I(a.abs.x, 0, 1)), n.y = o.y = Y(r.yaxis, I(a.abs.y, 0, 1)));
        const x = de(a.abs, u.abs);
        l.x = x.x, l.y = x.y, l.width = x.width, l.height = x.height, r.onMouseMove(v);
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
      let r = 0, c = 0, a = 0, u = 0;
      return {
        abs: {
          get x() {
            return r;
          },
          set x(l) {
            r = l;
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
            return u;
          },
          set y(l) {
            u = l;
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
      let r = 0, c = 0, a = 0, u = 0;
      return {
        get x() {
          return r;
        },
        get y() {
          return c;
        },
        set x(l) {
          r = l;
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
          return u;
        },
        set height(l) {
          u = l;
        }
      };
    },
    []
  );
}
function ve(r, c) {
  const { mousedown: a, scroll: u, zoom: l } = L();
  H(
    () => {
      const n = r.current;
      function o(f) {
        f.preventDefault();
        const g = f.deltaX / n.clientWidth, v = f.deltaY / n.clientHeight;
        f.altKey ? (l.x = l.x + g * c, l.y = l.y + v * c, u.x = a.abs.x * l.x - a.rel.x, u.y = a.abs.y * l.y - a.rel.y) : (u.x -= g * c, u.y -= v * c);
      }
      return n.addEventListener("wheel", o, { passive: !1 }), () => {
        n.removeEventListener("wheel", o);
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
  const [c, a] = O(/* @__PURE__ */ new Map()), [u, l] = O(/* @__PURE__ */ new Set()), n = D(
    () => {
      let s = 0, e = !1, t = !1, i = null, h = null, d = null;
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
          return t;
        },
        set ctrl(p) {
          t = p;
        },
        get focus() {
          return i;
        },
        set focus(p) {
          i = p;
        },
        get xaxis() {
          return h;
        },
        set xaxis(p) {
          h = p;
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
        set x(t) {
          s = I(t, 1, le);
        },
        set y(t) {
          e = I(t, 1, le);
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
        set x(t) {
          s = I(t, 0, o.x - 1);
        },
        set y(t) {
          e = I(t, 0, o.y - 1);
        }
      };
    },
    []
  ), g = D(
    () => ({
      annotate(s, e, t, i) {
        const h = Se(10), d = { id: h, rect: s, unit: e, xaxis: t, yaxis: i };
        a((p) => new Map(p).set(h, d)), l(/* @__PURE__ */ new Set([d.id]));
      },
      delete() {
        a((s) => {
          const e = new Map(s);
          for (const t of u)
            e.delete(t);
          return e;
        }), l(/* @__PURE__ */ new Set());
      },
      deselect() {
        l(/* @__PURE__ */ new Set());
      },
      moveSelection(s, e) {
        a((t) => {
          let i;
          return new Map(Array.from(
            t,
            ([h, d]) => [
              h,
              u.has(d.id) ? {
                ...d,
                rect: i = {
                  x: I(d.rect.x + (n.xaxis == d.xaxis ? s : 0), 0, 1 - d.rect.width),
                  y: I(d.rect.y + (n.yaxis == d.yaxis ? e : 0), 0, 1 - d.rect.height),
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
        o.x = 1, o.y = 1, f.x = 0, f.y = 0;
      },
      scroll(s, e) {
        f.x += s, f.y += e;
      },
      scrollTo(s) {
        f.x = s.x, f.y = s.y;
      },
      selectArea(s) {
        l((e) => {
          if (n.ctrl) {
            const t = new Set(e);
            for (const i of c.values())
              ce(P(i.rect, n.xaxis == i.xaxis, n.yaxis == i.yaxis), s) && (t.has(i.id) ? t.delete(i.id) : t.add(i.id));
            return t;
          } else {
            const t = /* @__PURE__ */ new Set();
            for (const i of c.values())
              ce(P(i.rect, n.xaxis == i.xaxis, n.yaxis == i.yaxis), s) && t.add(i.id);
            return t;
          }
        });
      },
      selectPoint(s) {
        l((e) => {
          if (n.ctrl) {
            const t = new Set(e);
            for (const i of c.values())
              ae(P(i.rect, n.xaxis == i.xaxis, n.yaxis == i.yaxis), s) && (t.has(i.id) ? t.delete(i.id) : t.add(i.id));
            return t;
          } else {
            const t = /* @__PURE__ */ new Set();
            for (const i of c.values())
              ae(P(i.rect, n.xaxis == i.xaxis, n.yaxis == i.yaxis), s) && t.add(i.id);
            return t;
          }
        });
      },
      setRectX(s, e) {
        a((t) => {
          const i = new Map(t), h = {
            x: I(s.rect.x + e, 0, 1 - s.rect.width),
            y: s.rect.y,
            width: s.rect.width,
            height: s.rect.height
          };
          return i.set(
            s.id,
            { ...s, rect: h, unit: q(s.xaxis, s.yaxis, h) }
          );
        });
      },
      setRectY(s, e) {
        a((t) => {
          const i = new Map(t), h = {
            x: s.rect.x,
            y: I(s.rect.y + e, 0, 1 - s.rect.height),
            width: s.rect.width,
            height: s.rect.height
          };
          return i.set(
            s.id,
            { ...s, rect: h, unit: q(s.xaxis, s.yaxis, h) }
          );
        });
      },
      setRectWidth(s, e) {
        a((t) => {
          const i = new Map(t), h = {
            x: s.rect.x,
            y: s.rect.y,
            width: I(s.rect.width + e, 0.01, 1 - s.rect.x),
            height: s.rect.height
          };
          return i.set(
            s.id,
            { ...s, rect: h, unit: q(s.xaxis, s.yaxis, h) }
          );
        });
      },
      setRectHeight(s, e) {
        a((t) => {
          const i = new Map(t), h = {
            x: s.rect.x,
            y: s.rect.y,
            width: s.rect.width,
            height: I(s.rect.height + e, 0.01, 1 - s.rect.y)
          };
          return i.set(
            s.id,
            { ...s, rect: h, unit: q(s.xaxis, s.yaxis, h) }
          );
        });
      },
      tool(s) {
        w(s);
      },
      zoomArea(s) {
        o.x = 1 / s.width, o.y = 1 / s.height, f.x = -0.5 + (s.x + s.width / 2) * o.x, f.y = -0.5 + (s.y + s.height / 2) * o.y;
      },
      zoomPoint(s) {
        const e = s.x * o.x - f.x, t = s.y * o.y - f.y;
        o.x += 0.5, o.y += 0.5, f.x = s.x * o.x - e, f.y = s.y * o.y - t;
      }
    }),
    [c, u]
  ), [v, w] = O("annotate"), [b, N] = O({
    play: X,
    loop: X,
    stop: X,
    seek: X
  }), [y, x] = O(te(0));
  return H(
    () => {
      function s(t) {
        t.key == "Alt" ? n.alt = !0 : t.key == "Control" && (n.ctrl = !0);
      }
      function e(t) {
        t.key == "Alt" ? n.alt = !1 : t.key == "Control" && (n.ctrl = !1);
      }
      return window.addEventListener("keydown", s), window.addEventListener("keyup", e), () => {
        window.removeEventListener("keydown", s), window.removeEventListener("keyup", e);
      };
    },
    []
  ), /* @__PURE__ */ G(fe.Provider, { value: {
    annotations: c,
    duration: r.duration,
    input: n,
    mousedown: he(),
    mouseup: he(),
    mouseRect: ke(),
    unitDown: se(),
    unitUp: se(),
    scroll: f,
    zoom: o,
    playhead: se(),
    selection: u,
    command: g,
    toolState: v,
    transport: b,
    transportState: y,
    setAnnotations: a,
    setSelection: l,
    setTransport: N,
    setTransportState: x
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
    function a(e, t) {
      this.options = {}, e = e || this.options;
      var i = { frequency: 350, peak: 1 };
      this.inputNode = this.filterNode = o.context.createBiquadFilter(), this.filterNode.type = t, this.outputNode = n.context.createGain(), this.filterNode.connect(this.outputNode);
      for (var h in i)
        this[h] = e[h], this[h] = this[h] === void 0 || this[h] === null ? i[h] : this[h];
    }
    function u() {
      var e, t, i = o.context.sampleRate * this.time, h = n.context.createBuffer(2, i, o.context.sampleRate), d = h.getChannelData(0), p = h.getChannelData(1);
      for (t = 0; i > t; t++)
        e = this.reverse ? i - t : t, d[t] = (2 * Math.random() - 1) * Math.pow(1 - e / i, this.decay), p[t] = (2 * Math.random() - 1) * Math.pow(1 - e / i, this.decay);
      this.reverbNode.buffer && (this.inputNode.disconnect(this.reverbNode), this.reverbNode.disconnect(this.wetGainNode), this.reverbNode = n.context.createConvolver(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode)), this.reverbNode.buffer = h;
    }
    function l(e) {
      for (var t = o.context.sampleRate, i = new Float32Array(t), h = Math.PI / 180, d = 0; t > d; d++) {
        var p = 2 * d / t - 1;
        i[d] = (3 + e) * p * 20 * h / (Math.PI + e * Math.abs(p));
      }
      return i;
    }
    var n = {}, o = n, f = r.exports;
    f ? r.exports = n : c.Pizzicato = c.Pz = n;
    var g = c.AudioContext || c.webkitAudioContext;
    if (!g)
      return void console.error("No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.");
    n.context = new g();
    var v = n.context.createGain();
    v.connect(n.context.destination), n.Util = { isString: function(e) {
      return toString.call(e) === "[object String]";
    }, isObject: function(e) {
      return toString.call(e) === "[object Object]";
    }, isFunction: function(e) {
      return toString.call(e) === "[object Function]";
    }, isNumber: function(e) {
      return toString.call(e) === "[object Number]" && e === +e;
    }, isArray: function(e) {
      return toString.call(e) === "[object Array]";
    }, isInRange: function(e, t, i) {
      return o.Util.isNumber(e) && o.Util.isNumber(t) && o.Util.isNumber(i) ? e >= t && i >= e : !1;
    }, isBool: function(e) {
      return typeof e == "boolean";
    }, isOscillator: function(e) {
      return e && e.toString() === "[object OscillatorNode]";
    }, isAudioBufferSourceNode: function(e) {
      return e && e.toString() === "[object AudioBufferSourceNode]";
    }, isSound: function(e) {
      return e instanceof o.Sound;
    }, isEffect: function(e) {
      for (var t in n.Effects)
        if (e instanceof n.Effects[t])
          return !0;
      return !1;
    }, normalize: function(e, t, i) {
      return o.Util.isNumber(e) && o.Util.isNumber(t) && o.Util.isNumber(i) ? (i - t) * e / 1 + t : void 0;
    }, getDryLevel: function(e) {
      return !o.Util.isNumber(e) || e > 1 || 0 > e ? 0 : 0.5 >= e ? 1 : 1 - 2 * (e - 0.5);
    }, getWetLevel: function(e) {
      return !o.Util.isNumber(e) || e > 1 || 0 > e ? 0 : e >= 0.5 ? 1 : 1 - 2 * (0.5 - e);
    } };
    var w = n.context.createGain(), b = Object.getPrototypeOf(Object.getPrototypeOf(w)), N = b.connect;
    b.connect = function(e) {
      var t = o.Util.isEffect(e) ? e.inputNode : e;
      return N.call(this, t), e;
    }, Object.defineProperty(n, "volume", { enumerable: !0, get: function() {
      return v.gain.value;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && v && (v.gain.value = e);
    } }), Object.defineProperty(n, "masterGainNode", { enumerable: !1, get: function() {
      return v;
    }, set: function(e) {
      console.error("Can't set the master gain node");
    } }), n.Events = { on: function(e, t, i) {
      if (e && t) {
        this._events = this._events || {};
        var h = this._events[e] || (this._events[e] = []);
        h.push({ callback: t, context: i || this, handler: this });
      }
    }, trigger: function(e) {
      if (e) {
        var t, i, h, d;
        if (this._events = this._events || {}, t = this._events[e] || (this._events[e] = [])) {
          for (i = Math.max(0, arguments.length - 1), h = [], d = 0; i > d; d++)
            h[d] = arguments[d + 1];
          for (d = 0; d < t.length; d++)
            t[d].callback.apply(t[d].context, h);
        }
      }
    }, off: function(e) {
      e ? this._events[e] = void 0 : this._events = {};
    } }, n.Sound = function(e, t) {
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
      function h(m, k) {
        m = m || {}, this.getRawSourceNode = function() {
          var R = this.sourceNode ? this.sourceNode.frequency.value : m.frequency, z = n.context.createOscillator();
          return z.type = m.type || "sine", z.frequency.value = R || 440, z;
        }, this.sourceNode = this.getRawSourceNode(), this.sourceNode.gainSuccessor = o.context.createGain(), this.sourceNode.connect(this.sourceNode.gainSuccessor), S.isFunction(k) && k();
      }
      function d(m, k) {
        m = S.isArray(m) ? m : [m];
        var R = new XMLHttpRequest();
        R.open("GET", m[0], !0), R.responseType = "arraybuffer", R.onload = function(z) {
          n.context.decodeAudioData(z.target.response, function(A) {
            T.getRawSourceNode = function() {
              var ie = n.context.createBufferSource();
              return ie.loop = this.loop, ie.buffer = A, ie;
            }, S.isFunction(k) && k();
          }.bind(T), function(A) {
            return console.error("Error decoding audio file " + m[0]), m.length > 1 ? (m.shift(), void d(m, k)) : (A = A || new Error("Error decoding audio file " + m[0]), void (S.isFunction(k) && k(A)));
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
            return n.context.createMediaStreamSource(A);
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
            n.context.createScriptProcessor();
          } catch {
            z = 2048;
          }
        this.getRawSourceNode = function() {
          var A = n.context.createScriptProcessor(z, 1, 1);
          return A.onaudioprocess = R, A;
        };
      }
      function F(m, k) {
        this.getRawSourceNode = m.sound.getRawSourceNode, m.sound.sourceNode && o.Util.isOscillator(m.sound.sourceNode) && (this.sourceNode = this.getRawSourceNode(), this.frequency = m.sound.frequency);
      }
      var T = this, S = n.Util, ne = i(e), C = S.isObject(e) && S.isObject(e.options), ye = 0.04, Ne = 0.04;
      if (ne)
        throw console.error(ne), new Error("Error initializing Pizzicato Sound: " + ne);
      this.detached = C && e.options.detached, this.masterVolume = n.context.createGain(), this.fadeNode = n.context.createGain(), this.fadeNode.gain.value = 0, this.detached || this.masterVolume.connect(n.masterGainNode), this.lastTimePlayed = 0, this.effects = [], this.effectConnectors = [], this.playing = this.paused = !1, this.loop = C && e.options.loop, this.attack = C && S.isNumber(e.options.attack) ? e.options.attack : ye, this.volume = C && S.isNumber(e.options.volume) ? e.options.volume : 1, C && S.isNumber(e.options.release) ? this.release = e.options.release : C && S.isNumber(e.options.sustain) ? (console.warn("'sustain' is deprecated. Use 'release' instead."), this.release = e.options.sustain) : this.release = Ne, e ? S.isString(e) ? d.bind(this)(e, t) : S.isFunction(e) ? U.bind(this)(e, t) : e.source === "file" ? d.bind(this)(e.options.path, t) : e.source === "wave" ? h.bind(this)(e.options, t) : e.source === "input" ? p.bind(this)(e, t) : e.source === "script" ? U.bind(this)(e.options, t) : e.source === "sound" && F.bind(this)(e.options, t) : h.bind(this)({}, t);
    }, n.Sound.prototype = Object.create(n.Events, { play: { enumerable: !0, value: function(e, t) {
      this.playing || (o.Util.isNumber(t) || (t = this.offsetTime || 0), o.Util.isNumber(e) || (e = 0), this.playing = !0, this.paused = !1, this.sourceNode = this.getSourceNode(), this.applyAttack(), o.Util.isFunction(this.sourceNode.start) && (this.lastTimePlayed = n.context.currentTime - t, this.sourceNode.start(o.context.currentTime + e, t)), this.trigger("play"));
    } }, stop: { enumerable: !0, value: function() {
      (this.paused || this.playing) && (this.paused = this.playing = !1, this.stopWithRelease(), this.offsetTime = 0, this.trigger("stop"));
    } }, pause: { enumerable: !0, value: function() {
      if (!this.paused && this.playing) {
        this.paused = !0, this.playing = !1, this.stopWithRelease();
        var e = o.context.currentTime - this.lastTimePlayed;
        this.sourceNode.buffer ? this.offsetTime = e % (this.sourceNode.buffer.length / o.context.sampleRate) : this.offsetTime = e, this.trigger("pause");
      }
    } }, clone: { enumerable: !0, value: function() {
      for (var e = new n.Sound({ source: "sound", options: { loop: this.loop, attack: this.attack, release: this.release, volume: this.volume, sound: this } }), t = 0; t < this.effects.length; t++)
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
      var i = o.context.createGain();
      return this.effectConnectors.push(i), e.connect(i), i.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(e) {
      var t = this.effects.indexOf(e);
      if (t === -1)
        return console.warn("Cannot remove effect that is not applied to this sound."), this;
      var i = this.playing;
      i && this.pause();
      var h = t === 0 ? this.fadeNode : this.effectConnectors[t - 1];
      h.disconnect();
      var d = this.effectConnectors[t];
      d.disconnect(), e.disconnect(d), this.effectConnectors.splice(t, 1), this.effects.splice(t, 1);
      var p;
      return p = t > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[t], h.connect(p), i && this.play(), this;
    } }, connect: { enumerable: !0, value: function(e) {
      return this.masterVolume.connect(e), this;
    } }, disconnect: { enumerable: !0, value: function(e) {
      return this.masterVolume.disconnect(e), this;
    } }, connectEffects: { enumerable: !0, value: function() {
      for (var e = [], t = 0; t < this.effects.length; t++) {
        var i = t === this.effects.length - 1, h = i ? this.masterVolume : this.effects[t + 1].inputNode;
        e[t] = o.context.createGain(), this.effects[t].outputNode.disconnect(this.effectConnectors[t]), this.effects[t].outputNode.connect(h);
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
      var t = this.sourceNode, i = function() {
        return o.Util.isFunction(t.stop) ? t.stop(0) : t.disconnect();
      };
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.release)
        return this.fadeNode.gain.setTargetAtTime(0, o.context.currentTime, 1e-3), void i();
      var h = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, d = this.release;
      h || (d = this.fadeNode.gain.value * this.release), this.fadeNode.gain.setTargetAtTime(1e-5, o.context.currentTime, d / 5), window.setTimeout(function() {
        i();
      }, 1e3 * d);
    } } }), n.Group = function(e) {
      e = e || [], this.mergeGainNode = o.context.createGain(), this.masterVolume = o.context.createGain(), this.sounds = [], this.effects = [], this.effectConnectors = [], this.mergeGainNode.connect(this.masterVolume), this.masterVolume.connect(o.masterGainNode);
      for (var t = 0; t < e.length; t++)
        this.addSound(e[t]);
    }, n.Group.prototype = Object.create(o.Events, { connect: { enumerable: !0, value: function(e) {
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
      var i = o.context.createGain();
      return this.effectConnectors.push(i), e.connect(i), i.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(e) {
      var t = this.effects.indexOf(e);
      if (t === -1)
        return console.warn("Cannot remove effect that is not applied to this group."), this;
      var i = t === 0 ? this.mergeGainNode : this.effectConnectors[t - 1];
      i.disconnect();
      var h = this.effectConnectors[t];
      h.disconnect(), e.disconnect(h), this.effectConnectors.splice(t, 1), this.effects.splice(t, 1);
      var d;
      return d = t > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[t], i.connect(d), this;
    } } }), n.Effects = {};
    var y = Object.create(null, { connect: { enumerable: !0, value: function(e) {
      return this.outputNode.connect(e), this;
    } }, disconnect: { enumerable: !0, value: function(e) {
      return this.outputNode.disconnect(e), this;
    } } });
    n.Effects.Delay = function(e) {
      this.options = {}, e = e || this.options;
      var t = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.feedbackGainNode = n.context.createGain(), this.delayNode = n.context.createDelay(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.delayNode), this.inputNode.connect(this.delayNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    }, n.Effects.Delay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 180) && (this.options.time = e, this.delayNode.delayTime.value = e);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.feedback = parseFloat(e, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), n.Effects.Compressor = function(e) {
      this.options = {}, e = e || this.options;
      var t = { threshold: -24, knee: 30, attack: 3e-3, release: 0.25, ratio: 12 };
      this.inputNode = this.compressorNode = n.context.createDynamicsCompressor(), this.outputNode = n.context.createGain(), this.compressorNode.connect(this.outputNode);
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    }, n.Effects.Compressor.prototype = Object.create(y, { threshold: { enumerable: !0, get: function() {
      return this.compressorNode.threshold.value;
    }, set: function(e) {
      n.Util.isInRange(e, -100, 0) && (this.compressorNode.threshold.value = e);
    } }, knee: { enumerable: !0, get: function() {
      return this.compressorNode.knee.value;
    }, set: function(e) {
      n.Util.isInRange(e, 0, 40) && (this.compressorNode.knee.value = e);
    } }, attack: { enumerable: !0, get: function() {
      return this.compressorNode.attack.value;
    }, set: function(e) {
      n.Util.isInRange(e, 0, 1) && (this.compressorNode.attack.value = e);
    } }, release: { enumerable: !0, get: function() {
      return this.compressorNode.release.value;
    }, set: function(e) {
      n.Util.isInRange(e, 0, 1) && (this.compressorNode.release.value = e);
    } }, ratio: { enumerable: !0, get: function() {
      return this.compressorNode.ratio.value;
    }, set: function(e) {
      n.Util.isInRange(e, 1, 20) && (this.compressorNode.ratio.value = e);
    } }, getCurrentGainReduction: function() {
      return this.compressorNode.reduction;
    } }), n.Effects.LowPassFilter = function(e) {
      a.call(this, e, "lowpass");
    }, n.Effects.HighPassFilter = function(e) {
      a.call(this, e, "highpass");
    };
    var x = Object.create(y, { frequency: { enumerable: !0, get: function() {
      return this.filterNode.frequency.value;
    }, set: function(e) {
      n.Util.isInRange(e, 10, 22050) && (this.filterNode.frequency.value = e);
    } }, peak: { enumerable: !0, get: function() {
      return this.filterNode.Q.value;
    }, set: function(e) {
      n.Util.isInRange(e, 1e-4, 1e3) && (this.filterNode.Q.value = e);
    } } });
    n.Effects.LowPassFilter.prototype = x, n.Effects.HighPassFilter.prototype = x, n.Effects.Distortion = function(e) {
      this.options = {}, e = e || this.options;
      var t = { gain: 0.5 };
      this.waveShaperNode = n.context.createWaveShaper(), this.inputNode = this.outputNode = this.waveShaperNode;
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    }, n.Effects.Distortion.prototype = Object.create(y, { gain: { enumerable: !0, get: function() {
      return this.options.gain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.gain = e, this.adjustGain());
    } }, adjustGain: { writable: !1, configurable: !1, enumerable: !1, value: function() {
      for (var e, t = o.Util.isNumber(this.options.gain) ? parseInt(100 * this.options.gain, 10) : 50, i = 44100, h = new Float32Array(i), d = Math.PI / 180, p = 0; i > p; ++p)
        e = 2 * p / i - 1, h[p] = (3 + t) * e * 20 * d / (Math.PI + t * Math.abs(e));
      this.waveShaperNode.curve = h;
    } } }), n.Effects.Flanger = function(e) {
      this.options = {}, e = e || this.options;
      var t = { time: 0.45, speed: 0.2, depth: 0.1, feedback: 0.1, mix: 0.5 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.inputFeedbackNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.delayNode = n.context.createDelay(), this.oscillatorNode = n.context.createOscillator(), this.gainNode = n.context.createGain(), this.feedbackNode = n.context.createGain(), this.oscillatorNode.type = "sine", this.inputNode.connect(this.inputFeedbackNode), this.inputNode.connect(this.dryGainNode), this.inputFeedbackNode.connect(this.delayNode), this.inputFeedbackNode.connect(this.wetGainNode), this.delayNode.connect(this.wetGainNode), this.delayNode.connect(this.feedbackNode), this.feedbackNode.connect(this.inputFeedbackNode), this.oscillatorNode.connect(this.gainNode), this.gainNode.connect(this.delayNode.delayTime), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode), this.oscillatorNode.start(0);
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    }, n.Effects.Flanger.prototype = Object.create(y, { time: { enumberable: !0, get: function() {
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
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } } }), n.Effects.StereoPanner = function(e) {
      this.options = {}, e = e || this.options;
      var t = { pan: 0 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), n.context.createStereoPanner ? (this.pannerNode = n.context.createStereoPanner(), this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : n.context.createPanner ? (console.warn("Your browser does not support the StereoPannerNode. Will use PannerNode instead."), this.pannerNode = n.context.createPanner(), this.pannerNode.type = "equalpower", this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : (console.warn("Your browser does not support the Panner effect."), this.inputNode.connect(this.outputNode));
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    }, n.Effects.StereoPanner.prototype = Object.create(y, { pan: { enumerable: !0, get: function() {
      return this.options.pan;
    }, set: function(e) {
      if (o.Util.isInRange(e, -1, 1) && (this.options.pan = e, this.pannerNode)) {
        var t = this.pannerNode.toString().indexOf("StereoPannerNode") > -1;
        t ? this.pannerNode.pan.value = e : this.pannerNode.setPosition(e, 0, 1 - Math.abs(e));
      }
    } } }), n.Effects.Convolver = function(e, t) {
      this.options = {}, e = e || this.options;
      var i = this, h = new XMLHttpRequest(), d = { mix: 0.5 };
      this.callback = t, this.inputNode = n.context.createGain(), this.convolverNode = n.context.createConvolver(), this.outputNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.inputNode.connect(this.convolverNode), this.convolverNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var p in d)
        this[p] = e[p], this[p] = this[p] === void 0 || this[p] === null ? d[p] : this[p];
      return e.impulse ? (h.open("GET", e.impulse, !0), h.responseType = "arraybuffer", h.onload = function(U) {
        var F = U.target.response;
        n.context.decodeAudioData(F, function(T) {
          i.convolverNode.buffer = T, i.callback && o.Util.isFunction(i.callback) && i.callback();
        }, function(T) {
          T = T || new Error("Error decoding impulse file"), i.callback && o.Util.isFunction(i.callback) && i.callback(T);
        });
      }, h.onreadystatechange = function(U) {
        h.readyState === 4 && h.status !== 200 && console.error("Error while fetching " + e.impulse + ". " + h.statusText);
      }, void h.send()) : void console.error("No impulse file specified.");
    }, n.Effects.Convolver.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } } }), n.Effects.PingPongDelay = function(e) {
      this.options = {}, e = e || this.options;
      var t = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.delayNodeLeft = n.context.createDelay(), this.delayNodeRight = n.context.createDelay(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.feedbackGainNode = n.context.createGain(), this.channelMerger = n.context.createChannelMerger(2), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNodeLeft.connect(this.channelMerger, 0, 0), this.delayNodeRight.connect(this.channelMerger, 0, 1), this.delayNodeLeft.connect(this.delayNodeRight), this.feedbackGainNode.connect(this.delayNodeLeft), this.delayNodeRight.connect(this.feedbackGainNode), this.inputNode.connect(this.feedbackGainNode), this.channelMerger.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    }, n.Effects.PingPongDelay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 180) && (this.options.time = e, this.delayNodeLeft.delayTime.value = e, this.delayNodeRight.delayTime.value = e);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.feedback = parseFloat(e, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), n.Effects.Reverb = function(e) {
      this.options = {}, e = e || this.options;
      var t = { mix: 0.5, time: 0.01, decay: 0.01, reverse: !1 };
      this.inputNode = n.context.createGain(), this.reverbNode = n.context.createConvolver(), this.outputNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
      u.bind(this)();
    }, n.Effects.Reverb.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(e) {
      o.Util.isInRange(e, 1e-4, 10) && (this.options.time = e, u.bind(this)());
    } }, decay: { enumerable: !0, get: function() {
      return this.options.decay;
    }, set: function(e) {
      o.Util.isInRange(e, 1e-4, 10) && (this.options.decay = e, u.bind(this)());
    } }, reverse: { enumerable: !0, get: function() {
      return this.options.reverse;
    }, set: function(e) {
      o.Util.isBool(e) && (this.options.reverse = e, u.bind(this)());
    } } }), n.Effects.Tremolo = function(e) {
      this.options = {}, e = e || this.options;
      var t = { speed: 4, depth: 1, mix: 0.8 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.tremoloGainNode = n.context.createGain(), this.tremoloGainNode.gain.value = 0, this.lfoNode = n.context.createOscillator(), this.shaperNode = n.context.createWaveShaper(), this.shaperNode.curve = new Float32Array([0, 1]), this.shaperNode.connect(this.tremoloGainNode.gain), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.lfoNode.connect(this.shaperNode), this.lfoNode.type = "sine", this.lfoNode.start(0), this.inputNode.connect(this.tremoloGainNode), this.tremoloGainNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    }, n.Effects.Tremolo.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 20) && (this.options.speed = e, this.lfoNode.frequency.value = e);
    } }, depth: { enumerable: !0, get: function() {
      return this.options.depth;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.depth = e, this.shaperNode.curve = new Float32Array([1 - e, 1]));
    } } }), n.Effects.DubDelay = function(e) {
      this.options = {}, e = e || this.options;
      var t = { feedback: 0.6, time: 0.7, mix: 0.5, cutoff: 700 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.feedbackGainNode = n.context.createGain(), this.delayNode = n.context.createDelay(), this.bqFilterNode = n.context.createBiquadFilter(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.bqFilterNode), this.bqFilterNode.connect(this.delayNode), this.delayNode.connect(this.feedbackGainNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    }, n.Effects.DubDelay.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
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
    } } }), n.Effects.RingModulator = function(e) {
      this.options = {}, e = e || this.options;
      var t = { speed: 30, distortion: 1, mix: 0.5 };
      this.inputNode = n.context.createGain(), this.outputNode = n.context.createGain(), this.dryGainNode = n.context.createGain(), this.wetGainNode = n.context.createGain(), this.vIn = n.context.createOscillator(), this.vIn.start(0), this.vInGain = n.context.createGain(), this.vInGain.gain.value = 0.5, this.vInInverter1 = n.context.createGain(), this.vInInverter1.gain.value = -1, this.vInInverter2 = n.context.createGain(), this.vInInverter2.gain.value = -1, this.vInDiode1 = new s(n.context), this.vInDiode2 = new s(n.context), this.vInInverter3 = n.context.createGain(), this.vInInverter3.gain.value = -1, this.vcInverter1 = n.context.createGain(), this.vcInverter1.gain.value = -1, this.vcDiode3 = new s(n.context), this.vcDiode4 = new s(n.context), this.outGain = n.context.createGain(), this.outGain.gain.value = 3, this.compressor = n.context.createDynamicsCompressor(), this.compressor.threshold.value = -24, this.compressor.ratio.value = 16, this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.vcInverter1), this.inputNode.connect(this.vcDiode4.node), this.vcInverter1.connect(this.vcDiode3.node), this.vIn.connect(this.vInGain), this.vInGain.connect(this.vInInverter1), this.vInGain.connect(this.vcInverter1), this.vInGain.connect(this.vcDiode4.node), this.vInInverter1.connect(this.vInInverter2), this.vInInverter1.connect(this.vInDiode2.node), this.vInInverter2.connect(this.vInDiode1.node), this.vInDiode1.connect(this.vInInverter3), this.vInDiode2.connect(this.vInInverter3), this.vInInverter3.connect(this.compressor), this.vcDiode3.connect(this.compressor), this.vcDiode4.connect(this.compressor), this.compressor.connect(this.outGain), this.outGain.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var i in t)
        this[i] = e[i], this[i] = this[i] === void 0 || this[i] === null ? t[i] : this[i];
    };
    var s = function(e) {
      this.context = e, this.node = this.context.createWaveShaper(), this.vb = 0.2, this.vl = 0.4, this.h = 1, this.setCurve();
    };
    return s.prototype.setDistortion = function(e) {
      return this.h = e, this.setCurve();
    }, s.prototype.setCurve = function() {
      var e, t, i, h, d, p, U;
      for (t = 1024, d = new Float32Array(t), e = p = 0, U = d.length; U >= 0 ? U > p : p > U; e = U >= 0 ? ++p : --p)
        i = (e - t / 2) / (t / 2), i = Math.abs(i), h = i <= this.vb ? 0 : this.vb < i && i <= this.vl ? this.h * (Math.pow(i - this.vb, 2) / (2 * this.vl - 2 * this.vb)) : this.h * i - this.h * this.vl + this.h * (Math.pow(this.vl - this.vb, 2) / (2 * this.vl - 2 * this.vb)), d[e] = h;
      return this.node.curve = d;
    }, s.prototype.connect = function(e) {
      return this.node.connect(e);
    }, n.Effects.RingModulator.prototype = Object.create(y, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.mix = e, this.dryGainNode.gain.value = n.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = n.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 2e3) && (this.options.speed = e, this.vIn.frequency.value = e);
    } }, distortion: { enumerable: !0, get: function() {
      return this.options.distortion;
    }, set: function(e) {
      if (o.Util.isInRange(e, 0.2, 50)) {
        this.options.distortion = parseFloat(e, 10);
        for (var t = [this.vInDiode1, this.vInDiode2, this.vcDiode3, this.vcDiode4], i = 0, h = t.length; h > i; i++)
          t[i].setDistortion(e);
      }
    } } }), n.Effects.Quadrafuzz = function(e) {
      this.options = {}, e = e || this.options;
      var t = { lowGain: 0.6, midLowGain: 0.8, midHighGain: 0.5, highGain: 0.6 };
      this.inputNode = o.context.createGain(), this.outputNode = o.context.createGain(), this.dryGainNode = o.context.createGain(), this.wetGainNode = o.context.createGain(), this.lowpassLeft = o.context.createBiquadFilter(), this.lowpassLeft.type = "lowpass", this.lowpassLeft.frequency.value = 147, this.lowpassLeft.Q.value = 0.7071, this.bandpass1Left = o.context.createBiquadFilter(), this.bandpass1Left.type = "bandpass", this.bandpass1Left.frequency.value = 587, this.bandpass1Left.Q.value = 0.7071, this.bandpass2Left = o.context.createBiquadFilter(), this.bandpass2Left.type = "bandpass", this.bandpass2Left.frequency.value = 2490, this.bandpass2Left.Q.value = 0.7071, this.highpassLeft = o.context.createBiquadFilter(), this.highpassLeft.type = "highpass", this.highpassLeft.frequency.value = 4980, this.highpassLeft.Q.value = 0.7071, this.overdrives = [];
      for (var i = 0; 4 > i; i++)
        this.overdrives[i] = o.context.createWaveShaper(), this.overdrives[i].curve = l();
      this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode);
      var h = [this.lowpassLeft, this.bandpass1Left, this.bandpass2Left, this.highpassLeft];
      for (i = 0; i < h.length; i++)
        this.wetGainNode.connect(h[i]), h[i].connect(this.overdrives[i]), this.overdrives[i].connect(this.outputNode);
      for (var d in t)
        this[d] = e[d], this[d] = this[d] === void 0 || this[d] === null ? t[d] : this[d];
    }, n.Effects.Quadrafuzz.prototype = Object.create(y, { lowGain: { enumerable: !0, get: function() {
      return this.options.lowGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.lowGain = e, this.overdrives[0].curve = l(o.Util.normalize(this.lowGain, 0, 150)));
    } }, midLowGain: { enumerable: !0, get: function() {
      return this.options.midLowGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.midLowGain = e, this.overdrives[1].curve = l(o.Util.normalize(this.midLowGain, 0, 150)));
    } }, midHighGain: { enumerable: !0, get: function() {
      return this.options.midHighGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.midHighGain = e, this.overdrives[2].curve = l(o.Util.normalize(this.midHighGain, 0, 150)));
    } }, highGain: { enumerable: !0, get: function() {
      return this.options.highGain;
    }, set: function(e) {
      o.Util.isInRange(e, 0, 1) && (this.options.highGain = e, this.overdrives[3].curve = l(o.Util.normalize(this.highGain, 0, 150)));
    } } }), n;
  })(typeof window < "u" ? window : Re);
})(Ie);
const Q = 22e3, K = 0;
function je(r) {
  const { annotations: c, duration: a, playhead: u, transportState: l, setTransport: n, setTransportState: o } = L(), f = M(null), g = M(new j.Effects.LowPassFilter({ frequency: Q, peak: 10 })), v = M(new j.Effects.HighPassFilter({ frequency: K, peak: 10 }));
  _(E(
    () => {
      let x, s, e, t;
      switch (l.type) {
        case "stop":
          v.current.frequency = K, g.current.frequency = Q, u.x = l.progress;
          break;
        case "play":
          v.current.frequency = K, g.current.frequency = Q, x = (Date.now() - l.timeRef) / 1e3, u.x = l.progress + x / a;
          break;
        case "loop":
          if (x = (Date.now() - l.timeRef) / 1e3, u.x = l.progress + x / a, s = c.get(l.annotation.id), s == null)
            return N();
          e = s.rect, t = s.unit, s.yaxis.unit === "hertz" ? (v.current.frequency = t.y, g.current.frequency = t.y + t.height) : (v.current.frequency = K, g.current.frequency = Q), (u.x < e.x || u.x >= e.x + e.width) && b(s);
          break;
      }
    },
    [c, l, a]
  ));
  const w = E(
    () => {
      o((x) => {
        if (f.current == null)
          return x;
        switch (x.type) {
          case "stop":
            return f.current.play(0, x.progress * a), ue(x.progress, Date.now());
          case "play":
          case "loop":
            return x;
        }
      });
    },
    [a]
  ), b = E(
    (x) => {
      const { rect: s, unit: e } = x;
      o((t) => f.current == null ? t : (f.current.stop(), f.current.play(0, e.x), Ue(s.x, Date.now(), x)));
    },
    [a]
  ), N = E(
    () => {
      o((x) => {
        if (f.current == null)
          return x;
        switch (x.type) {
          case "stop":
            return x;
          case "play":
          case "loop":
            f.current.stop();
            const s = (Date.now() - x.timeRef) / 1e3;
            return te(x.progress + s / a);
        }
      });
    },
    [a]
  ), y = E(
    (x) => {
      o((s) => {
        if (f.current == null)
          return s;
        switch (s.type) {
          case "stop":
            return te(x);
          case "play":
          case "loop":
            return f.current.stop(), f.current.play(0, x * a), ue(x, Date.now());
        }
      });
    },
    [a]
  );
  return H(
    () => {
      const x = new j.Sound(
        r.url,
        (s) => {
          if (s)
            return console.error(s);
          f.current != null && f.current.stop(), x.addEffect(g.current), x.addEffect(v.current), f.current = x, n({ play: w, loop: b, stop: N, seek: y });
        }
      );
      return N;
    },
    [r.url, w, b, N, y]
  ), /* @__PURE__ */ G(be, {});
}
function Ve(r) {
  const { state: c, setState: a, value: u, unit: l } = r, { input: n } = L(), o = M(null), f = 5 * Math.PI / 4, g = -Math.PI / 4, { x: v, y: w } = D(
    () => {
      const b = f - c * (f - g);
      return { x: Math.cos(b) * 4 / 5, y: -Math.sin(b) * 4 / 5 };
    },
    [c]
  );
  return H(
    () => {
      const b = o.current;
      function N(y) {
        y.preventDefault();
        const x = y.deltaY / (n.ctrl ? 1e4 : 1e3);
        a(x);
      }
      return b.addEventListener("wheel", N, { passive: !1 }), () => {
        b.removeEventListener("wheel", N);
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
      A 1 1 0 1 1 ${Math.cos(g)} ${-Math.sin(g)}
    ` }),
        /* @__PURE__ */ G(
          "circle",
          {
            className: "encoder-marker",
            cx: v,
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
            children: l
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
function $(r, c, a = c, u = String) {
  switch (r.constructor) {
    case SVGTextElement:
      r.setAttribute("x", u(c));
    case SVGLineElement:
      r.setAttribute("x1", u(c)), r.setAttribute("x2", u(a));
      break;
    case SVGRectElement:
      r.setAttribute("x", u(c)), r.setAttribute("width", u(a));
  }
}
function B(r, c, a = c, u = String) {
  switch (r.constructor) {
    case SVGTextElement:
      r.setAttribute("y", u(c));
    case SVGLineElement:
      r.setAttribute("y1", u(c)), r.setAttribute("y2", u(a));
      break;
    case SVGRectElement:
      r.setAttribute("y", u(c)), r.setAttribute("height", u(a));
  }
}
function me(r) {
  const { xaxis: c, yaxis: a } = r, { annotations: u, playhead: l, transportState: n } = L(), o = M(null);
  return _(E(
    () => {
      const f = o.current;
      let g, v;
      switch (n.type) {
        case "stop":
        case "play":
          $(f, l.x), B(f, 0, 1);
          break;
        case "loop":
          if (g = u.get(n.annotation.id), g == null)
            return;
          v = P(g.rect, c === g.xaxis, a === g.yaxis), $(f, l.x), B(f, v.y, v.y + v.height);
          break;
      }
    },
    [u, n]
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
  const { annotation: c, xaxis: a, yaxis: u } = r, { selection: l } = L(), n = D(
    () => P(c.rect, a == c.xaxis, u == c.yaxis),
    [c, a, u]
  );
  return /* @__PURE__ */ G(
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
const Z = () => {
};
function We(r) {
  const { imageUrl: c, xaxis: a, yaxis: u } = r, { annotations: l, command: n, input: o, mouseup: f, mouseRect: g, scroll: v, zoom: w, toolState: b, transportState: N } = L(), y = M(null), x = M(null);
  _(E(
    () => {
      ze(x.current, `
        M 0 0
        h 1
        v 1
        h -1
        z
        M ${v.x / w.x} ${v.y / w.y}
        v ${1 / w.y}
        h ${1 / w.x}
        v ${-1 / w.y}
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
        o.buttons & 1 && n.scroll(
          e.movementX / e.currentTarget.clientWidth * w.x,
          e.movementY / e.currentTarget.clientHeight * w.y
        );
      },
      [b]
    ),
    onMouseUp: E(
      (e) => {
        if (o.buttons & 1 && xe({ x: g.width, y: g.height }) < 0.01)
          switch (b) {
            case "annotate":
            case "select":
            case "pan":
              n.scrollTo({
                x: f.rel.x * w.x - 0.5,
                y: f.rel.y * w.y - 0.5
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
  return ve(y, 1), /* @__PURE__ */ G(
    "div",
    {
      className: `navigator ${b} ${N.type}`,
      children: /* @__PURE__ */ W(
        "svg",
        {
          ref: y,
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
            Array.from(l.values()).map(
              (e) => /* @__PURE__ */ G(
                ge,
                {
                  annotation: e,
                  xaxis: a,
                  yaxis: u
                },
                e.id
              )
            ),
            /* @__PURE__ */ G(
              "path",
              {
                ref: x,
                className: "mask",
                d: ""
              }
            ),
            /* @__PURE__ */ G(me, { xaxis: a, yaxis: u })
          ]
        }
      )
    }
  );
}
function Te(r) {
  const { parent: c, xaxis: a, yaxis: u } = r, { input: l, mouseup: n, unitUp: o } = L(), f = M(null), g = M(null), v = M(null), w = M(null);
  return _(E(
    () => {
      const b = f.current;
      if (l.alt) {
        const N = g.current, y = v.current, x = w.current;
        let s, e;
        ee(b), c.current == l.focus || a == l.xaxis ? (s = re(a, o.x), $(N, n.rel.x, void 0, oe), ee(N)) : (s = "", V(N)), c.current == l.focus || u == l.yaxis ? (e = re(u, o.y), B(y, n.rel.y, void 0, oe), ee(y)) : (e = "", V(y)), Ee(x, s && e ? `(${s}, ${e})` : s || e), Me(x, n.rel, oe);
      } else
        V(b);
    },
    [a, u]
  )), /* @__PURE__ */ W("g", { ref: f, children: [
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
function $e(r) {
  const { imageUrl: c, xaxis: a, yaxis: u } = r, { command: l, input: n, mouseup: o, mouseRect: f, unitDown: g, unitUp: v, scroll: w, zoom: b } = L(), { toolState: N, transportState: y, transport: x } = L(), { annotations: s } = L(), { selection: e } = L(), t = M(null), i = M(null), h = M(null);
  _(E(
    () => {
      const p = i.current, U = h.current;
      switch (Le(p, w, b), N) {
        case "annotate":
        case "select":
        case "zoom":
          n.buttons & 1 ? (ee(U), Ae(U, P(f, a === n.xaxis, u === n.yaxis))) : V(U);
          break;
        case "pan":
          V(U);
          break;
      }
    },
    [N, a, u]
  ));
  const d = pe({
    xaxis: a,
    yaxis: u,
    onContextMenu: J,
    onMouseDown: J,
    onMouseEnter: J,
    onMouseLeave: J,
    onMouseMove: E(
      (p) => {
        if (n.buttons & 1) {
          const U = p.movementX / p.currentTarget.clientWidth, F = p.movementY / p.currentTarget.clientHeight;
          switch (N) {
            case "annotate":
            case "select":
            case "zoom":
              break;
            case "pan":
              e.size == 0 ? l.scroll(-U, -F) : l.moveSelection(U, F);
              break;
          }
        }
      },
      [N, e, a, u]
    ),
    onMouseUp: E(
      (p) => {
        if (n.buttons & 1)
          if (xe({ x: f.width, y: f.height }) < 0.01)
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
                l.annotate({ ...f }, de(g, v), a, u);
                break;
              case "select":
                l.selectArea(f);
                break;
              case "zoom":
                l.zoomArea(f);
                break;
            }
        n.buttons & 2 && x.seek(o.abs.x);
      },
      [s, N, x, a, u]
    )
  });
  return ve(t, -1), /* @__PURE__ */ G(
    "div",
    {
      className: `visualization ${N} ${y.type}`,
      children: /* @__PURE__ */ W(
        "svg",
        {
          ref: t,
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
                            yaxis: u
                          },
                          p.id
                        )
                      ),
                      /* @__PURE__ */ G(
                        "rect",
                        {
                          ref: h,
                          className: "selection",
                          x: "0",
                          y: "0",
                          width: "0",
                          height: "0"
                        }
                      ),
                      /* @__PURE__ */ G(me, { xaxis: a, yaxis: u })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ G(Te, { parent: t, xaxis: a, yaxis: u })
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
