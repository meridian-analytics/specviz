import { jsx as y, Fragment as xt, jsxs as V } from "react/jsx-runtime";
import { useMemo as C, useState as B, useCallback as I, useEffect as ot, useRef as E } from "react";
import { computeRectInverse as Nt, computeRect as yt, formatUnit as st } from "./axis.js";
import { c as T, s as it, S as bt, u as rt, a as wt, b as et, d as M, e as Y, p as at, l as Gt, f as dt, g as lt } from "./hooks-62079b03.js";
import { h as Xt, i as Ht } from "./hooks-62079b03.js";
import { intersectRect as ct, logical as z, intersectPoint as ut, fromPoints as St } from "./rect.js";
import { randomBytes as Rt, formatPercent as nt } from "./format.js";
const ht = 5, X = () => {
};
function qt(s) {
  const r = C(
    () => {
      let a = 0, t = !1, n = !1, e = null, u = null, l = null;
      return {
        get buttons() {
          return a;
        },
        set buttons(d) {
          a = d;
        },
        get alt() {
          return t;
        },
        set alt(d) {
          t = d;
        },
        get ctrl() {
          return n;
        },
        set ctrl(d) {
          n = d;
        },
        get focus() {
          return e;
        },
        set focus(d) {
          e = d;
        },
        get xaxis() {
          return u;
        },
        set xaxis(d) {
          u = d;
        },
        get yaxis() {
          return l;
        },
        set yaxis(d) {
          l = d;
        }
      };
    },
    []
  ), c = C(
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
          a = T(n, 1, ht);
        },
        set y(n) {
          t = T(n, 1, ht);
        }
      };
    },
    []
  ), h = C(
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
          a = T(n, 0, c.x - 1);
        },
        set y(n) {
          t = T(n, 0, c.y - 1);
        }
      };
    },
    []
  ), [f, i] = B(() => /* @__PURE__ */ new Set()), o = C(
    () => new Map(Array.from(
      s.regions.values(),
      (a) => (s.axes[a.xunit] == null && console.error(`Specviz.axes does not specify ${a.xunit}`, s.axes), s.axes[a.yunit] == null && console.error(`Specviz.axes does not specify ${a.yunit}`, s.axes), [a.id, Nt(s.axes[a.xunit], s.axes[a.yunit], a)])
    )),
    [s.axes, s.regions]
  ), m = I(
    (a, t) => ({
      ...a,
      ...yt(
        s.axes[a.xunit],
        s.axes[a.yunit],
        t(o.get(a.id))
      )
    }),
    [o, s.axes]
  ), b = C(
    () => ({
      annotate(a, t, n, e) {
        const u = Rt(10);
        s.setRegions((l) => new Map(l).set(
          u,
          { id: u, ...t, xunit: n.unit, yunit: e.unit }
        )), i(/* @__PURE__ */ new Set([u]));
      },
      delete() {
        s.setRegions((a) => new Map(function* () {
          for (const [t, n] of a.entries())
            f.has(t) || (yield [t, n]);
        }())), i(/* @__PURE__ */ new Set());
      },
      deselect() {
        i(/* @__PURE__ */ new Set());
      },
      moveSelection(a, t) {
        s.setRegions((n) => new Map(Array.from(
          n,
          ([e, u]) => f.has(e) ? [e, m(u, (l) => {
            var d, p;
            return {
              x: T(l.x + (((d = r.xaxis) == null ? void 0 : d.unit) == u.xunit ? a : 0), 0, 1 - l.width),
              y: T(l.y + (((p = r.yaxis) == null ? void 0 : p.unit) == u.yunit ? t : 0), 0, 1 - l.height),
              width: l.width,
              height: l.height
            };
          })] : [e, u]
        )));
      },
      resetView() {
        c.x = 1, c.y = 1, h.x = 0, h.y = 0;
      },
      scroll(a, t) {
        h.x += a, h.y += t;
      },
      scrollTo(a) {
        h.x = a.x, h.y = a.y;
      },
      selectArea(a) {
        i((t) => {
          var n, e, u, l;
          if (r.ctrl) {
            const d = new Set(t);
            for (const p of s.regions.values())
              ct(
                z(
                  o.get(p.id),
                  ((n = r.xaxis) == null ? void 0 : n.unit) == p.xunit,
                  ((e = r.yaxis) == null ? void 0 : e.unit) == p.yunit
                ),
                a
              ) && (d.has(p.id) ? d.delete(p.id) : d.add(p.id));
            return d;
          } else {
            const d = /* @__PURE__ */ new Set();
            for (const p of s.regions.values())
              ct(
                z(
                  o.get(p.id),
                  ((u = r.xaxis) == null ? void 0 : u.unit) == p.xunit,
                  ((l = r.yaxis) == null ? void 0 : l.unit) == p.yunit
                ),
                a
              ) && d.add(p.id);
            return d;
          }
        });
      },
      selectPoint(a) {
        i((t) => {
          var n, e, u, l;
          if (r.ctrl) {
            const d = new Set(t);
            for (const p of s.regions.values())
              ut(
                z(
                  o.get(p.id),
                  ((n = r.xaxis) == null ? void 0 : n.unit) == p.xunit,
                  ((e = r.yaxis) == null ? void 0 : e.unit) == p.yunit
                ),
                a
              ) && (d.has(p.id) ? d.delete(p.id) : d.add(p.id));
            return d;
          } else {
            const d = /* @__PURE__ */ new Set();
            for (const p of s.regions.values())
              ut(
                z(
                  o.get(p.id),
                  ((u = r.xaxis) == null ? void 0 : u.unit) == p.xunit,
                  ((l = r.yaxis) == null ? void 0 : l.unit) == p.yunit
                ),
                a
              ) && d.add(p.id);
            return d;
          }
        });
      },
      setRectX(a, t) {
        s.setRegions((n) => new Map(n).set(a.id, m(a, (e) => ({
          x: T(e.x + t, 0, 1 - e.width),
          y: e.y,
          width: e.width,
          height: e.height
        }))));
      },
      setRectX1(a, t) {
      },
      setRectX2(a, t) {
        s.setRegions((n) => new Map(n).set(a.id, m(a, (e) => ({
          x: e.x,
          y: e.y,
          width: T(e.width + t, 0.01, 1 - e.x),
          height: e.height
        }))));
      },
      setRectY(a, t) {
        s.setRegions((n) => new Map(n).set(a.id, m(a, (e) => ({
          x: e.x,
          y: T(e.y + t, 0, 1 - e.height),
          width: e.width,
          height: e.height
        }))));
      },
      setRectY1(a, t) {
        s.setRegions((n) => new Map(n).set(a.id, m(a, (e) => ({
          x: e.x,
          y: T(e.y + t, 0, e.y + e.height - 0.01),
          width: e.width,
          height: T(e.height - Math.max(t, -e.y), 0.01, 1 - e.y)
        }))));
      },
      setRectY2(a, t) {
        s.setRegions((n) => new Map(n).set(a.id, m(a, (e) => ({
          x: e.x,
          y: e.y,
          width: e.width,
          height: T(e.height + t, 0.01, 1 - e.y)
        }))));
      },
      tool(a) {
        x(a);
      },
      zoom(a, t) {
        c.x += a, c.y += t;
      },
      zoomArea(a) {
        c.x = 1 / a.width, c.y = 1 / a.height, h.x = -0.5 + (a.x + a.width / 2) * c.x, h.y = -0.5 + (a.y + a.height / 2) * c.y;
      },
      zoomPoint(a) {
        const t = a.x * c.x - h.x, n = a.y * c.y - h.y;
        c.x += 0.5, c.y += 0.5, h.x = a.x * c.x - t, h.y = a.y * c.y - n;
      }
    }),
    [s.regions, o, f, m]
  ), [g, x] = B("annotate"), [w, G] = B({
    play: X,
    loop: X,
    stop: X,
    seek: X
  }), [N, S] = B(it(0));
  return ot(
    () => {
      function a(n) {
        n.key == "Alt" ? r.alt = !0 : n.key == "Control" && (r.ctrl = !0);
      }
      function t(n) {
        n.key == "Alt" ? r.alt = !1 : n.key == "Control" && (r.ctrl = !1);
      }
      return window.addEventListener("keydown", a), window.addEventListener("keyup", t), () => {
        window.removeEventListener("keydown", a), window.removeEventListener("keyup", t);
      };
    },
    []
  ), /* @__PURE__ */ y(bt.Provider, { value: {
    input: r,
    mousedown: rt(),
    mouseup: rt(),
    mouseRect: wt(),
    unitDown: et(),
    unitUp: et(),
    scroll: h,
    zoom: c,
    playhead: et(),
    regions: s.regions,
    regionCache: o,
    selection: f,
    command: b,
    toolState: g,
    transport: w,
    transportState: N,
    setRegions: s.setRegions,
    setSelection: i,
    setTransport: G,
    setTransportState: S
  }, children: s.children });
}
var Ut = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, j = {}, kt = {
  get exports() {
    return j;
  },
  set exports(s) {
    j = s;
  }
};
(function(s) {
  (function(r) {
    function c(t, n) {
      this.options = {}, t = t || this.options;
      var e = { frequency: 350, peak: 1 };
      this.inputNode = this.filterNode = o.context.createBiquadFilter(), this.filterNode.type = n, this.outputNode = i.context.createGain(), this.filterNode.connect(this.outputNode);
      for (var u in e)
        this[u] = t[u], this[u] = this[u] === void 0 || this[u] === null ? e[u] : this[u];
    }
    function h() {
      var t, n, e = o.context.sampleRate * this.time, u = i.context.createBuffer(2, e, o.context.sampleRate), l = u.getChannelData(0), d = u.getChannelData(1);
      for (n = 0; e > n; n++)
        t = this.reverse ? e - n : n, l[n] = (2 * Math.random() - 1) * Math.pow(1 - t / e, this.decay), d[n] = (2 * Math.random() - 1) * Math.pow(1 - t / e, this.decay);
      this.reverbNode.buffer && (this.inputNode.disconnect(this.reverbNode), this.reverbNode.disconnect(this.wetGainNode), this.reverbNode = i.context.createConvolver(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode)), this.reverbNode.buffer = u;
    }
    function f(t) {
      for (var n = o.context.sampleRate, e = new Float32Array(n), u = Math.PI / 180, l = 0; n > l; l++) {
        var d = 2 * l / n - 1;
        e[l] = (3 + t) * d * 20 * u / (Math.PI + t * Math.abs(d));
      }
      return e;
    }
    var i = {}, o = i, m = s.exports;
    m ? s.exports = i : r.Pizzicato = r.Pz = i;
    var b = r.AudioContext || r.webkitAudioContext;
    if (!b)
      return void console.error("No AudioContext found in this environment. Please ensure your window or global object contains a working AudioContext constructor function.");
    i.context = new b();
    var g = i.context.createGain();
    g.connect(i.context.destination), i.Util = { isString: function(t) {
      return toString.call(t) === "[object String]";
    }, isObject: function(t) {
      return toString.call(t) === "[object Object]";
    }, isFunction: function(t) {
      return toString.call(t) === "[object Function]";
    }, isNumber: function(t) {
      return toString.call(t) === "[object Number]" && t === +t;
    }, isArray: function(t) {
      return toString.call(t) === "[object Array]";
    }, isInRange: function(t, n, e) {
      return o.Util.isNumber(t) && o.Util.isNumber(n) && o.Util.isNumber(e) ? t >= n && e >= t : !1;
    }, isBool: function(t) {
      return typeof t == "boolean";
    }, isOscillator: function(t) {
      return t && t.toString() === "[object OscillatorNode]";
    }, isAudioBufferSourceNode: function(t) {
      return t && t.toString() === "[object AudioBufferSourceNode]";
    }, isSound: function(t) {
      return t instanceof o.Sound;
    }, isEffect: function(t) {
      for (var n in i.Effects)
        if (t instanceof i.Effects[n])
          return !0;
      return !1;
    }, normalize: function(t, n, e) {
      return o.Util.isNumber(t) && o.Util.isNumber(n) && o.Util.isNumber(e) ? (e - n) * t / 1 + n : void 0;
    }, getDryLevel: function(t) {
      return !o.Util.isNumber(t) || t > 1 || 0 > t ? 0 : 0.5 >= t ? 1 : 1 - 2 * (t - 0.5);
    }, getWetLevel: function(t) {
      return !o.Util.isNumber(t) || t > 1 || 0 > t ? 0 : t >= 0.5 ? 1 : 1 - 2 * (0.5 - t);
    } };
    var x = i.context.createGain(), w = Object.getPrototypeOf(Object.getPrototypeOf(x)), G = w.connect;
    w.connect = function(t) {
      var n = o.Util.isEffect(t) ? t.inputNode : t;
      return G.call(this, n), t;
    }, Object.defineProperty(i, "volume", { enumerable: !0, get: function() {
      return g.gain.value;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && g && (g.gain.value = t);
    } }), Object.defineProperty(i, "masterGainNode", { enumerable: !1, get: function() {
      return g;
    }, set: function(t) {
      console.error("Can't set the master gain node");
    } }), i.Events = { on: function(t, n, e) {
      if (t && n) {
        this._events = this._events || {};
        var u = this._events[t] || (this._events[t] = []);
        u.push({ callback: n, context: e || this, handler: this });
      }
    }, trigger: function(t) {
      if (t) {
        var n, e, u, l;
        if (this._events = this._events || {}, n = this._events[t] || (this._events[t] = [])) {
          for (e = Math.max(0, arguments.length - 1), u = [], l = 0; e > l; l++)
            u[l] = arguments[l + 1];
          for (l = 0; l < n.length; l++)
            n[l].callback.apply(n[l].context, u);
        }
      }
    }, off: function(t) {
      t ? this._events[t] = void 0 : this._events = {};
    } }, i.Sound = function(t, n) {
      function e(v) {
        var U = ["wave", "file", "input", "script", "sound"];
        if (v && !R.isFunction(v) && !R.isString(v) && !R.isObject(v))
          return "Description type not supported. Initialize a sound using an object, a function or a string.";
        if (R.isObject(v)) {
          if (!R.isString(v.source) || U.indexOf(v.source) === -1)
            return "Specified source not supported. Sources can be wave, file, input or script";
          if (!(v.source !== "file" || v.options && v.options.path))
            return "A path is needed for sounds with a file source";
          if (!(v.source !== "script" || v.options && v.options.audioFunction))
            return "An audio function is needed for sounds with a script source";
        }
      }
      function u(v, U) {
        v = v || {}, this.getRawSourceNode = function() {
          var k = this.sourceNode ? this.sourceNode.frequency.value : v.frequency, A = i.context.createOscillator();
          return A.type = v.type || "sine", A.frequency.value = k || 440, A;
        }, this.sourceNode = this.getRawSourceNode(), this.sourceNode.gainSuccessor = o.context.createGain(), this.sourceNode.connect(this.sourceNode.gainSuccessor), R.isFunction(U) && U();
      }
      function l(v, U) {
        v = R.isArray(v) ? v : [v];
        var k = new XMLHttpRequest();
        k.open("GET", v[0], !0), k.responseType = "arraybuffer", k.onload = function(A) {
          i.context.decodeAudioData(A.target.response, function(L) {
            D.getRawSourceNode = function() {
              var tt = i.context.createBufferSource();
              return tt.loop = this.loop, tt.buffer = L, tt;
            }, R.isFunction(U) && U();
          }.bind(D), function(L) {
            return console.error("Error decoding audio file " + v[0]), v.length > 1 ? (v.shift(), void l(v, U)) : (L = L || new Error("Error decoding audio file " + v[0]), void (R.isFunction(U) && U(L)));
          }.bind(D));
        }, k.onreadystatechange = function(A) {
          k.readyState === 4 && k.status !== 200 && console.error("Error while fetching " + v[0] + ". " + k.statusText);
        }, k.send();
      }
      function d(v, U) {
        if (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, !navigator.getUserMedia && !navigator.mediaDevices.getUserMedia)
          return void console.error("Your browser does not support getUserMedia");
        var k = function(L) {
          D.getRawSourceNode = function() {
            return i.context.createMediaStreamSource(L);
          }, R.isFunction(U) && U();
        }.bind(D), A = function(L) {
          R.isFunction(U) && U(L);
        };
        navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({ audio: !0 }).then(k).catch(A) : navigator.getUserMedia({ audio: !0 }, k, A);
      }
      function p(v, U) {
        var k = R.isFunction(v) ? v : v.audioFunction, A = R.isObject(v) && v.bufferSize ? v.bufferSize : null;
        if (!A)
          try {
            i.context.createScriptProcessor();
          } catch {
            A = 2048;
          }
        this.getRawSourceNode = function() {
          var L = i.context.createScriptProcessor(A, 1, 1);
          return L.onaudioprocess = k, L;
        };
      }
      function F(v, U) {
        this.getRawSourceNode = v.sound.getRawSourceNode, v.sound.sourceNode && o.Util.isOscillator(v.sound.sourceNode) && (this.sourceNode = this.getRawSourceNode(), this.frequency = v.sound.frequency);
      }
      var D = this, R = i.Util, J = e(t), O = R.isObject(t) && R.isObject(t.options), gt = 0.04, mt = 0.04;
      if (J)
        throw console.error(J), new Error("Error initializing Pizzicato Sound: " + J);
      this.detached = O && t.options.detached, this.masterVolume = i.context.createGain(), this.fadeNode = i.context.createGain(), this.fadeNode.gain.value = 0, this.detached || this.masterVolume.connect(i.masterGainNode), this.lastTimePlayed = 0, this.effects = [], this.effectConnectors = [], this.playing = this.paused = !1, this.loop = O && t.options.loop, this.attack = O && R.isNumber(t.options.attack) ? t.options.attack : gt, this.volume = O && R.isNumber(t.options.volume) ? t.options.volume : 1, O && R.isNumber(t.options.release) ? this.release = t.options.release : O && R.isNumber(t.options.sustain) ? (console.warn("'sustain' is deprecated. Use 'release' instead."), this.release = t.options.sustain) : this.release = mt, t ? R.isString(t) ? l.bind(this)(t, n) : R.isFunction(t) ? p.bind(this)(t, n) : t.source === "file" ? l.bind(this)(t.options.path, n) : t.source === "wave" ? u.bind(this)(t.options, n) : t.source === "input" ? d.bind(this)(t, n) : t.source === "script" ? p.bind(this)(t.options, n) : t.source === "sound" && F.bind(this)(t.options, n) : u.bind(this)({}, n);
    }, i.Sound.prototype = Object.create(i.Events, { play: { enumerable: !0, value: function(t, n) {
      this.playing || (o.Util.isNumber(n) || (n = this.offsetTime || 0), o.Util.isNumber(t) || (t = 0), this.playing = !0, this.paused = !1, this.sourceNode = this.getSourceNode(), this.applyAttack(), o.Util.isFunction(this.sourceNode.start) && (this.lastTimePlayed = i.context.currentTime - n, this.sourceNode.start(o.context.currentTime + t, n)), this.trigger("play"));
    } }, stop: { enumerable: !0, value: function() {
      (this.paused || this.playing) && (this.paused = this.playing = !1, this.stopWithRelease(), this.offsetTime = 0, this.trigger("stop"));
    } }, pause: { enumerable: !0, value: function() {
      if (!this.paused && this.playing) {
        this.paused = !0, this.playing = !1, this.stopWithRelease();
        var t = o.context.currentTime - this.lastTimePlayed;
        this.sourceNode.buffer ? this.offsetTime = t % (this.sourceNode.buffer.length / o.context.sampleRate) : this.offsetTime = t, this.trigger("pause");
      }
    } }, clone: { enumerable: !0, value: function() {
      for (var t = new i.Sound({ source: "sound", options: { loop: this.loop, attack: this.attack, release: this.release, volume: this.volume, sound: this } }), n = 0; n < this.effects.length; n++)
        t.addEffect(this.effects[n]);
      return t;
    } }, onEnded: { enumerable: !0, value: function(t) {
      return function() {
        this.sourceNode && this.sourceNode !== t || (this.playing && this.stop(), this.paused || this.trigger("end"));
      };
    } }, addEffect: { enumerable: !0, value: function(t) {
      if (!o.Util.isEffect(t))
        return console.error("The object provided is not a Pizzicato effect."), this;
      this.effects.push(t);
      var n = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.fadeNode;
      n.disconnect(), n.connect(t);
      var e = o.context.createGain();
      return this.effectConnectors.push(e), t.connect(e), e.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(t) {
      var n = this.effects.indexOf(t);
      if (n === -1)
        return console.warn("Cannot remove effect that is not applied to this sound."), this;
      var e = this.playing;
      e && this.pause();
      var u = n === 0 ? this.fadeNode : this.effectConnectors[n - 1];
      u.disconnect();
      var l = this.effectConnectors[n];
      l.disconnect(), t.disconnect(l), this.effectConnectors.splice(n, 1), this.effects.splice(n, 1);
      var d;
      return d = n > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[n], u.connect(d), e && this.play(), this;
    } }, connect: { enumerable: !0, value: function(t) {
      return this.masterVolume.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.masterVolume.disconnect(t), this;
    } }, connectEffects: { enumerable: !0, value: function() {
      for (var t = [], n = 0; n < this.effects.length; n++) {
        var e = n === this.effects.length - 1, u = e ? this.masterVolume : this.effects[n + 1].inputNode;
        t[n] = o.context.createGain(), this.effects[n].outputNode.disconnect(this.effectConnectors[n]), this.effects[n].outputNode.connect(u);
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
      var n = this.getRawSourceNode();
      return n.gainSuccessor = o.context.createGain(), n.connect(n.gainSuccessor), n.gainSuccessor.connect(this.fadeNode), this.fadeNode.connect(this.getInputNode()), o.Util.isAudioBufferSourceNode(n) && (n.onended = this.onEnded(n).bind(this)), n;
    } }, getInputNode: { enumerable: !0, value: function() {
      return this.effects.length > 0 ? this.effects[0].inputNode : this.masterVolume;
    } }, applyAttack: { enumerable: !1, value: function() {
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.attack)
        return void this.fadeNode.gain.setTargetAtTime(1, o.context.currentTime, 1e-3);
      var t = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, n = this.attack;
      t || (n = (1 - this.fadeNode.gain.value) * this.attack), this.fadeNode.gain.setTargetAtTime(1, o.context.currentTime, 2 * n);
    } }, stopWithRelease: { enumerable: !1, value: function(t) {
      var n = this.sourceNode, e = function() {
        return o.Util.isFunction(n.stop) ? n.stop(0) : n.disconnect();
      };
      if (this.fadeNode.gain.value, this.fadeNode.gain.cancelScheduledValues(o.context.currentTime), !this.release)
        return this.fadeNode.gain.setTargetAtTime(0, o.context.currentTime, 1e-3), void e();
      var u = navigator.userAgent.toLowerCase().indexOf("firefox") > -1, l = this.release;
      u || (l = this.fadeNode.gain.value * this.release), this.fadeNode.gain.setTargetAtTime(1e-5, o.context.currentTime, l / 5), window.setTimeout(function() {
        e();
      }, 1e3 * l);
    } } }), i.Group = function(t) {
      t = t || [], this.mergeGainNode = o.context.createGain(), this.masterVolume = o.context.createGain(), this.sounds = [], this.effects = [], this.effectConnectors = [], this.mergeGainNode.connect(this.masterVolume), this.masterVolume.connect(o.masterGainNode);
      for (var n = 0; n < t.length; n++)
        this.addSound(t[n]);
    }, i.Group.prototype = Object.create(o.Events, { connect: { enumerable: !0, value: function(t) {
      return this.masterVolume.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.masterVolume.disconnect(t), this;
    } }, addSound: { enumerable: !0, value: function(t) {
      return o.Util.isSound(t) ? this.sounds.indexOf(t) > -1 ? void console.warn("The Pizzicato.Sound object was already added to this group") : t.detached ? void console.warn("Groups do not support detached sounds. You can manually create an audio graph to group detached sounds together.") : (t.disconnect(o.masterGainNode), t.connect(this.mergeGainNode), void this.sounds.push(t)) : void console.error("You can only add Pizzicato.Sound objects");
    } }, removeSound: { enumerable: !0, value: function(t) {
      var n = this.sounds.indexOf(t);
      return n === -1 ? void console.warn("Cannot remove a sound that is not part of this group.") : (t.disconnect(this.mergeGainNode), t.connect(o.masterGainNode), void this.sounds.splice(n, 1));
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
      var n = this.effectConnectors.length > 0 ? this.effectConnectors[this.effectConnectors.length - 1] : this.mergeGainNode;
      n.disconnect(), n.connect(t);
      var e = o.context.createGain();
      return this.effectConnectors.push(e), t.connect(e), e.connect(this.masterVolume), this;
    } }, removeEffect: { enumerable: !0, value: function(t) {
      var n = this.effects.indexOf(t);
      if (n === -1)
        return console.warn("Cannot remove effect that is not applied to this group."), this;
      var e = n === 0 ? this.mergeGainNode : this.effectConnectors[n - 1];
      e.disconnect();
      var u = this.effectConnectors[n];
      u.disconnect(), t.disconnect(u), this.effectConnectors.splice(n, 1), this.effects.splice(n, 1);
      var l;
      return l = n > this.effects.length - 1 || this.effects.length === 0 ? this.masterVolume : this.effects[n], e.connect(l), this;
    } } }), i.Effects = {};
    var N = Object.create(null, { connect: { enumerable: !0, value: function(t) {
      return this.outputNode.connect(t), this;
    } }, disconnect: { enumerable: !0, value: function(t) {
      return this.outputNode.disconnect(t), this;
    } } });
    i.Effects.Delay = function(t) {
      this.options = {}, t = t || this.options;
      var n = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.feedbackGainNode = i.context.createGain(), this.delayNode = i.context.createDelay(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.delayNode), this.inputNode.connect(this.delayNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    }, i.Effects.Delay.prototype = Object.create(N, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 180) && (this.options.time = t, this.delayNode.delayTime.value = t);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.feedback = parseFloat(t, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), i.Effects.Compressor = function(t) {
      this.options = {}, t = t || this.options;
      var n = { threshold: -24, knee: 30, attack: 3e-3, release: 0.25, ratio: 12 };
      this.inputNode = this.compressorNode = i.context.createDynamicsCompressor(), this.outputNode = i.context.createGain(), this.compressorNode.connect(this.outputNode);
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    }, i.Effects.Compressor.prototype = Object.create(N, { threshold: { enumerable: !0, get: function() {
      return this.compressorNode.threshold.value;
    }, set: function(t) {
      i.Util.isInRange(t, -100, 0) && (this.compressorNode.threshold.value = t);
    } }, knee: { enumerable: !0, get: function() {
      return this.compressorNode.knee.value;
    }, set: function(t) {
      i.Util.isInRange(t, 0, 40) && (this.compressorNode.knee.value = t);
    } }, attack: { enumerable: !0, get: function() {
      return this.compressorNode.attack.value;
    }, set: function(t) {
      i.Util.isInRange(t, 0, 1) && (this.compressorNode.attack.value = t);
    } }, release: { enumerable: !0, get: function() {
      return this.compressorNode.release.value;
    }, set: function(t) {
      i.Util.isInRange(t, 0, 1) && (this.compressorNode.release.value = t);
    } }, ratio: { enumerable: !0, get: function() {
      return this.compressorNode.ratio.value;
    }, set: function(t) {
      i.Util.isInRange(t, 1, 20) && (this.compressorNode.ratio.value = t);
    } }, getCurrentGainReduction: function() {
      return this.compressorNode.reduction;
    } }), i.Effects.LowPassFilter = function(t) {
      c.call(this, t, "lowpass");
    }, i.Effects.HighPassFilter = function(t) {
      c.call(this, t, "highpass");
    };
    var S = Object.create(N, { frequency: { enumerable: !0, get: function() {
      return this.filterNode.frequency.value;
    }, set: function(t) {
      i.Util.isInRange(t, 10, 22050) && (this.filterNode.frequency.value = t);
    } }, peak: { enumerable: !0, get: function() {
      return this.filterNode.Q.value;
    }, set: function(t) {
      i.Util.isInRange(t, 1e-4, 1e3) && (this.filterNode.Q.value = t);
    } } });
    i.Effects.LowPassFilter.prototype = S, i.Effects.HighPassFilter.prototype = S, i.Effects.Distortion = function(t) {
      this.options = {}, t = t || this.options;
      var n = { gain: 0.5 };
      this.waveShaperNode = i.context.createWaveShaper(), this.inputNode = this.outputNode = this.waveShaperNode;
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    }, i.Effects.Distortion.prototype = Object.create(N, { gain: { enumerable: !0, get: function() {
      return this.options.gain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.gain = t, this.adjustGain());
    } }, adjustGain: { writable: !1, configurable: !1, enumerable: !1, value: function() {
      for (var t, n = o.Util.isNumber(this.options.gain) ? parseInt(100 * this.options.gain, 10) : 50, e = 44100, u = new Float32Array(e), l = Math.PI / 180, d = 0; e > d; ++d)
        t = 2 * d / e - 1, u[d] = (3 + n) * t * 20 * l / (Math.PI + n * Math.abs(t));
      this.waveShaperNode.curve = u;
    } } }), i.Effects.Flanger = function(t) {
      this.options = {}, t = t || this.options;
      var n = { time: 0.45, speed: 0.2, depth: 0.1, feedback: 0.1, mix: 0.5 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.inputFeedbackNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.delayNode = i.context.createDelay(), this.oscillatorNode = i.context.createOscillator(), this.gainNode = i.context.createGain(), this.feedbackNode = i.context.createGain(), this.oscillatorNode.type = "sine", this.inputNode.connect(this.inputFeedbackNode), this.inputNode.connect(this.dryGainNode), this.inputFeedbackNode.connect(this.delayNode), this.inputFeedbackNode.connect(this.wetGainNode), this.delayNode.connect(this.wetGainNode), this.delayNode.connect(this.feedbackNode), this.feedbackNode.connect(this.inputFeedbackNode), this.oscillatorNode.connect(this.gainNode), this.gainNode.connect(this.delayNode.delayTime), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode), this.oscillatorNode.start(0);
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    }, i.Effects.Flanger.prototype = Object.create(N, { time: { enumberable: !0, get: function() {
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
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } } }), i.Effects.StereoPanner = function(t) {
      this.options = {}, t = t || this.options;
      var n = { pan: 0 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), i.context.createStereoPanner ? (this.pannerNode = i.context.createStereoPanner(), this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : i.context.createPanner ? (console.warn("Your browser does not support the StereoPannerNode. Will use PannerNode instead."), this.pannerNode = i.context.createPanner(), this.pannerNode.type = "equalpower", this.inputNode.connect(this.pannerNode), this.pannerNode.connect(this.outputNode)) : (console.warn("Your browser does not support the Panner effect."), this.inputNode.connect(this.outputNode));
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    }, i.Effects.StereoPanner.prototype = Object.create(N, { pan: { enumerable: !0, get: function() {
      return this.options.pan;
    }, set: function(t) {
      if (o.Util.isInRange(t, -1, 1) && (this.options.pan = t, this.pannerNode)) {
        var n = this.pannerNode.toString().indexOf("StereoPannerNode") > -1;
        n ? this.pannerNode.pan.value = t : this.pannerNode.setPosition(t, 0, 1 - Math.abs(t));
      }
    } } }), i.Effects.Convolver = function(t, n) {
      this.options = {}, t = t || this.options;
      var e = this, u = new XMLHttpRequest(), l = { mix: 0.5 };
      this.callback = n, this.inputNode = i.context.createGain(), this.convolverNode = i.context.createConvolver(), this.outputNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.inputNode.connect(this.convolverNode), this.convolverNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var d in l)
        this[d] = t[d], this[d] = this[d] === void 0 || this[d] === null ? l[d] : this[d];
      return t.impulse ? (u.open("GET", t.impulse, !0), u.responseType = "arraybuffer", u.onload = function(p) {
        var F = p.target.response;
        i.context.decodeAudioData(F, function(D) {
          e.convolverNode.buffer = D, e.callback && o.Util.isFunction(e.callback) && e.callback();
        }, function(D) {
          D = D || new Error("Error decoding impulse file"), e.callback && o.Util.isFunction(e.callback) && e.callback(D);
        });
      }, u.onreadystatechange = function(p) {
        u.readyState === 4 && u.status !== 200 && console.error("Error while fetching " + t.impulse + ". " + u.statusText);
      }, void u.send()) : void console.error("No impulse file specified.");
    }, i.Effects.Convolver.prototype = Object.create(N, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } } }), i.Effects.PingPongDelay = function(t) {
      this.options = {}, t = t || this.options;
      var n = { feedback: 0.5, time: 0.3, mix: 0.5 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.delayNodeLeft = i.context.createDelay(), this.delayNodeRight = i.context.createDelay(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.feedbackGainNode = i.context.createGain(), this.channelMerger = i.context.createChannelMerger(2), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.delayNodeLeft.connect(this.channelMerger, 0, 0), this.delayNodeRight.connect(this.channelMerger, 0, 1), this.delayNodeLeft.connect(this.delayNodeRight), this.feedbackGainNode.connect(this.delayNodeLeft), this.delayNodeRight.connect(this.feedbackGainNode), this.inputNode.connect(this.feedbackGainNode), this.channelMerger.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    }, i.Effects.PingPongDelay.prototype = Object.create(N, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, time: { enumerable: !0, get: function() {
      return this.options.time;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 180) && (this.options.time = t, this.delayNodeLeft.delayTime.value = t, this.delayNodeRight.delayTime.value = t);
    } }, feedback: { enumerable: !0, get: function() {
      return this.options.feedback;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.feedback = parseFloat(t, 10), this.feedbackGainNode.gain.value = this.feedback);
    } } }), i.Effects.Reverb = function(t) {
      this.options = {}, t = t || this.options;
      var n = { mix: 0.5, time: 0.01, decay: 0.01, reverse: !1 };
      this.inputNode = i.context.createGain(), this.reverbNode = i.context.createConvolver(), this.outputNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.inputNode.connect(this.reverbNode), this.reverbNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.wetGainNode.connect(this.outputNode);
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
      h.bind(this)();
    }, i.Effects.Reverb.prototype = Object.create(N, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
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
    } } }), i.Effects.Tremolo = function(t) {
      this.options = {}, t = t || this.options;
      var n = { speed: 4, depth: 1, mix: 0.8 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.tremoloGainNode = i.context.createGain(), this.tremoloGainNode.gain.value = 0, this.lfoNode = i.context.createOscillator(), this.shaperNode = i.context.createWaveShaper(), this.shaperNode.curve = new Float32Array([0, 1]), this.shaperNode.connect(this.tremoloGainNode.gain), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.lfoNode.connect(this.shaperNode), this.lfoNode.type = "sine", this.lfoNode.start(0), this.inputNode.connect(this.tremoloGainNode), this.tremoloGainNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    }, i.Effects.Tremolo.prototype = Object.create(N, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 20) && (this.options.speed = t, this.lfoNode.frequency.value = t);
    } }, depth: { enumerable: !0, get: function() {
      return this.options.depth;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.depth = t, this.shaperNode.curve = new Float32Array([1 - t, 1]));
    } } }), i.Effects.DubDelay = function(t) {
      this.options = {}, t = t || this.options;
      var n = { feedback: 0.6, time: 0.7, mix: 0.5, cutoff: 700 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.feedbackGainNode = i.context.createGain(), this.delayNode = i.context.createDelay(), this.bqFilterNode = i.context.createBiquadFilter(), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.feedbackGainNode), this.feedbackGainNode.connect(this.bqFilterNode), this.bqFilterNode.connect(this.delayNode), this.delayNode.connect(this.feedbackGainNode), this.delayNode.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    }, i.Effects.DubDelay.prototype = Object.create(N, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
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
    } } }), i.Effects.RingModulator = function(t) {
      this.options = {}, t = t || this.options;
      var n = { speed: 30, distortion: 1, mix: 0.5 };
      this.inputNode = i.context.createGain(), this.outputNode = i.context.createGain(), this.dryGainNode = i.context.createGain(), this.wetGainNode = i.context.createGain(), this.vIn = i.context.createOscillator(), this.vIn.start(0), this.vInGain = i.context.createGain(), this.vInGain.gain.value = 0.5, this.vInInverter1 = i.context.createGain(), this.vInInverter1.gain.value = -1, this.vInInverter2 = i.context.createGain(), this.vInInverter2.gain.value = -1, this.vInDiode1 = new a(i.context), this.vInDiode2 = new a(i.context), this.vInInverter3 = i.context.createGain(), this.vInInverter3.gain.value = -1, this.vcInverter1 = i.context.createGain(), this.vcInverter1.gain.value = -1, this.vcDiode3 = new a(i.context), this.vcDiode4 = new a(i.context), this.outGain = i.context.createGain(), this.outGain.gain.value = 3, this.compressor = i.context.createDynamicsCompressor(), this.compressor.threshold.value = -24, this.compressor.ratio.value = 16, this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode), this.inputNode.connect(this.vcInverter1), this.inputNode.connect(this.vcDiode4.node), this.vcInverter1.connect(this.vcDiode3.node), this.vIn.connect(this.vInGain), this.vInGain.connect(this.vInInverter1), this.vInGain.connect(this.vcInverter1), this.vInGain.connect(this.vcDiode4.node), this.vInInverter1.connect(this.vInInverter2), this.vInInverter1.connect(this.vInDiode2.node), this.vInInverter2.connect(this.vInDiode1.node), this.vInDiode1.connect(this.vInInverter3), this.vInDiode2.connect(this.vInInverter3), this.vInInverter3.connect(this.compressor), this.vcDiode3.connect(this.compressor), this.vcDiode4.connect(this.compressor), this.compressor.connect(this.outGain), this.outGain.connect(this.wetGainNode), this.wetGainNode.connect(this.outputNode);
      for (var e in n)
        this[e] = t[e], this[e] = this[e] === void 0 || this[e] === null ? n[e] : this[e];
    };
    var a = function(t) {
      this.context = t, this.node = this.context.createWaveShaper(), this.vb = 0.2, this.vl = 0.4, this.h = 1, this.setCurve();
    };
    return a.prototype.setDistortion = function(t) {
      return this.h = t, this.setCurve();
    }, a.prototype.setCurve = function() {
      var t, n, e, u, l, d, p;
      for (n = 1024, l = new Float32Array(n), t = d = 0, p = l.length; p >= 0 ? p > d : d > p; t = p >= 0 ? ++d : --d)
        e = (t - n / 2) / (n / 2), e = Math.abs(e), u = e <= this.vb ? 0 : this.vb < e && e <= this.vl ? this.h * (Math.pow(e - this.vb, 2) / (2 * this.vl - 2 * this.vb)) : this.h * e - this.h * this.vl + this.h * (Math.pow(this.vl - this.vb, 2) / (2 * this.vl - 2 * this.vb)), l[t] = u;
      return this.node.curve = l;
    }, a.prototype.connect = function(t) {
      return this.node.connect(t);
    }, i.Effects.RingModulator.prototype = Object.create(N, { mix: { enumerable: !0, get: function() {
      return this.options.mix;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.mix = t, this.dryGainNode.gain.value = i.Util.getDryLevel(this.mix), this.wetGainNode.gain.value = i.Util.getWetLevel(this.mix));
    } }, speed: { enumerable: !0, get: function() {
      return this.options.speed;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 2e3) && (this.options.speed = t, this.vIn.frequency.value = t);
    } }, distortion: { enumerable: !0, get: function() {
      return this.options.distortion;
    }, set: function(t) {
      if (o.Util.isInRange(t, 0.2, 50)) {
        this.options.distortion = parseFloat(t, 10);
        for (var n = [this.vInDiode1, this.vInDiode2, this.vcDiode3, this.vcDiode4], e = 0, u = n.length; u > e; e++)
          n[e].setDistortion(t);
      }
    } } }), i.Effects.Quadrafuzz = function(t) {
      this.options = {}, t = t || this.options;
      var n = { lowGain: 0.6, midLowGain: 0.8, midHighGain: 0.5, highGain: 0.6 };
      this.inputNode = o.context.createGain(), this.outputNode = o.context.createGain(), this.dryGainNode = o.context.createGain(), this.wetGainNode = o.context.createGain(), this.lowpassLeft = o.context.createBiquadFilter(), this.lowpassLeft.type = "lowpass", this.lowpassLeft.frequency.value = 147, this.lowpassLeft.Q.value = 0.7071, this.bandpass1Left = o.context.createBiquadFilter(), this.bandpass1Left.type = "bandpass", this.bandpass1Left.frequency.value = 587, this.bandpass1Left.Q.value = 0.7071, this.bandpass2Left = o.context.createBiquadFilter(), this.bandpass2Left.type = "bandpass", this.bandpass2Left.frequency.value = 2490, this.bandpass2Left.Q.value = 0.7071, this.highpassLeft = o.context.createBiquadFilter(), this.highpassLeft.type = "highpass", this.highpassLeft.frequency.value = 4980, this.highpassLeft.Q.value = 0.7071, this.overdrives = [];
      for (var e = 0; 4 > e; e++)
        this.overdrives[e] = o.context.createWaveShaper(), this.overdrives[e].curve = f();
      this.inputNode.connect(this.wetGainNode), this.inputNode.connect(this.dryGainNode), this.dryGainNode.connect(this.outputNode);
      var u = [this.lowpassLeft, this.bandpass1Left, this.bandpass2Left, this.highpassLeft];
      for (e = 0; e < u.length; e++)
        this.wetGainNode.connect(u[e]), u[e].connect(this.overdrives[e]), this.overdrives[e].connect(this.outputNode);
      for (var l in n)
        this[l] = t[l], this[l] = this[l] === void 0 || this[l] === null ? n[l] : this[l];
    }, i.Effects.Quadrafuzz.prototype = Object.create(N, { lowGain: { enumerable: !0, get: function() {
      return this.options.lowGain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.lowGain = t, this.overdrives[0].curve = f(o.Util.normalize(this.lowGain, 0, 150)));
    } }, midLowGain: { enumerable: !0, get: function() {
      return this.options.midLowGain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.midLowGain = t, this.overdrives[1].curve = f(o.Util.normalize(this.midLowGain, 0, 150)));
    } }, midHighGain: { enumerable: !0, get: function() {
      return this.options.midHighGain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.midHighGain = t, this.overdrives[2].curve = f(o.Util.normalize(this.midHighGain, 0, 150)));
    } }, highGain: { enumerable: !0, get: function() {
      return this.options.highGain;
    }, set: function(t) {
      o.Util.isInRange(t, 0, 1) && (this.options.highGain = t, this.overdrives[3].curve = f(o.Util.normalize(this.highGain, 0, 150)));
    } } }), i;
  })(typeof window < "u" ? window : Ut);
})(kt);
function It(s, r, c, h) {
  return s.addEventListener(r, c, h), () => s.removeEventListener(r, c, h);
}
const H = 22e3, _ = 0;
function Vt(s) {
  const { src: r, duration: c } = s, { regions: h, regionCache: f, playhead: i, transportState: o, setTransport: m, setTransportState: b } = M(), g = E(null), x = E(new j.Effects.LowPassFilter({ frequency: H, peak: 10 })), w = E(new j.Effects.HighPassFilter({ frequency: _, peak: 10 }));
  Y(I(
    () => {
      let t, n, e, u;
      switch (o.type) {
        case "stop":
          w.current.frequency = _, x.current.frequency = H, i.x = o.progress;
          break;
        case "play":
          w.current.frequency = _, x.current.frequency = H, t = (Date.now() - o.timeRef) / 1e3, i.x = o.progress + t / c;
          break;
        case "loop":
          if (t = (Date.now() - o.timeRef) / 1e3, i.x = o.progress + t / c, n = h.get(o.id), n == null)
            return S();
          u = n, e = f.get(n.id), n.yunit === "hertz" ? (w.current.frequency = u.y, x.current.frequency = u.y + u.height) : (w.current.frequency = _, x.current.frequency = H), (i.x < e.x || i.x >= e.x + e.width) && N(n.id);
          break;
      }
    },
    [h, f, o, c]
  ));
  const G = I(
    () => {
      b((t) => {
        if (g.current == null)
          return t;
        switch (t.type) {
          case "stop":
            return g.current.play(0, t.progress * c), at(t.progress, Date.now());
          case "play":
          case "loop":
            return t;
        }
      });
    },
    [c]
  ), N = I(
    (t) => {
      const n = h.get(t), e = f.get(t);
      b((u) => g.current == null ? u : (g.current.stop(), g.current.play(0, n.x), Gt(e.x, Date.now(), t)));
    },
    [h, f]
  ), S = I(
    () => {
      b((t) => {
        if (g.current == null)
          return t;
        switch (t.type) {
          case "stop":
            return t;
          case "play":
          case "loop":
            g.current.stop();
            const n = (Date.now() - t.timeRef) / 1e3;
            return it(t.progress + n / c);
        }
      });
    },
    [c]
  ), a = I(
    (t) => {
      b((n) => {
        if (g.current == null)
          return n;
        switch (n.type) {
          case "stop":
            return it(t);
          case "play":
          case "loop":
            return g.current.stop(), g.current.play(0, t * c), at(t, Date.now());
        }
      });
    },
    [c]
  );
  return ot(
    () => {
      const t = It(window, "blur", S), n = new j.Sound(
        r,
        (e) => {
          if (e)
            return console.error(e);
          g.current != null && g.current.stop(), n.addEffect(x.current), n.addEffect(w.current), g.current = n, m({ play: G, loop: N, stop: S, seek: a });
        }
      );
      return () => {
        S(), t();
      };
    },
    [r, G, N, S, a]
  ), /* @__PURE__ */ y(xt, {});
}
function P(s) {
  const { state: r, setState: c, value: h, unit: f } = s, { input: i } = M(), o = E(null), m = 5 * Math.PI / 4, b = -Math.PI / 4, { x: g, y: x } = C(
    () => {
      const w = m - r * (m - b);
      return { x: Math.cos(w) * 4 / 5, y: -Math.sin(w) * 4 / 5 };
    },
    [r]
  );
  return ot(
    () => {
      const w = o.current;
      function G(N) {
        N.preventDefault();
        const S = N.deltaY / (i.ctrl ? 1e4 : 1e3);
        c(S);
      }
      return w.addEventListener("wheel", G, { passive: !1 }), () => {
        w.removeEventListener("wheel", G);
      };
    },
    [c]
  ), /* @__PURE__ */ V(
    "svg",
    {
      ref: o,
      width: "60",
      height: "60",
      viewBox: "-1.1 -1.1 2.2 2.2",
      children: [
        /* @__PURE__ */ y("path", { className: "encoder", d: `
      M ${Math.cos(m)} ${-Math.sin(m)}
      A 1 1 0 1 1 ${Math.cos(b)} ${-Math.sin(b)}
    ` }),
        /* @__PURE__ */ y(
          "circle",
          {
            className: "encoder-marker",
            cx: g,
            cy: x,
            r: "0.10"
          }
        ),
        /* @__PURE__ */ y(
          "text",
          {
            className: "encoder-text",
            textAnchor: "middle",
            x: "0",
            y: "0.15",
            children: h.toFixed(2)
          }
        ),
        /* @__PURE__ */ y(
          "text",
          {
            className: "encoder-text",
            textAnchor: "middle",
            x: "0",
            y: "0.45",
            children: f
          }
        )
      ]
    }
  );
}
P.X = function(r) {
  const { command: c, regionCache: h } = M(), f = h.get(r.id);
  return /* @__PURE__ */ y(
    P,
    {
      state: f.x,
      setState: (i) => c.setRectX(r, i),
      value: r.x,
      unit: r.xunit
    }
  );
};
P.X2 = function(r) {
  const { command: c, regionCache: h } = M(), f = h.get(r.id);
  return /* @__PURE__ */ y(
    P,
    {
      state: f.width,
      setState: (i) => c.setRectX2(r, i),
      value: r.width,
      unit: r.xunit
    }
  );
};
P.Y1 = function(r) {
  const { command: c, regionCache: h } = M(), f = h.get(r.id);
  return /* @__PURE__ */ y(
    P,
    {
      state: 1 - f.y,
      setState: (i) => c.setRectY1(r, i),
      value: r.y + r.height,
      unit: r.yunit
    }
  );
};
P.Y2 = function(r) {
  const { command: c, regionCache: h } = M(), f = h.get(r.id);
  return /* @__PURE__ */ y(
    P,
    {
      state: 1 - f.y - f.height,
      setState: (i) => c.setRectY2(r, i),
      value: r.y,
      unit: r.yunit
    }
  );
};
function ft(s) {
  return Math.sqrt(s.x * s.x + s.y * s.y);
}
function q(s) {
  s.setAttribute("display", "none");
}
function Z(s) {
  s.setAttribute("display", "inline");
}
function Et(s, r, c = String) {
  r.x < 0.5 ? ($(s, r.x, void 0, c), s.setAttribute("text-anchor", "start")) : ($(s, r.x, void 0, c), s.setAttribute("text-anchor", "end")), r.y < 0.5 ? (W(s, r.y + 0.01, void 0, c), s.setAttribute("dominant-baseline", "hanging")) : (W(s, r.y - 0.01, void 0, c), s.setAttribute("dominant-baseline", "text-top"));
}
function Mt(s, r) {
  s.setAttribute("d", r);
}
function At(s, r, c = String) {
  s.setAttribute("x", c(r.x)), s.setAttribute("y", c(r.y)), s.setAttribute("width", c(r.width)), s.setAttribute("height", c(r.height));
}
function Lt(s, r) {
  s.textContent = r;
}
function Tt(s, r, c) {
  s.setAttribute(
    "transform",
    `translate(${-r.x}, ${-r.y}) scale(${c.x}, ${c.y})`
  );
}
function $(s, r, c = r, h = String) {
  switch (s.constructor) {
    case SVGTextElement:
      s.setAttribute("x", h(r));
    case SVGLineElement:
      s.setAttribute("x1", h(r)), s.setAttribute("x2", h(c));
      break;
    case SVGRectElement:
      s.setAttribute("x", h(r)), s.setAttribute("width", h(c));
  }
}
function W(s, r, c = r, h = String) {
  switch (s.constructor) {
    case SVGTextElement:
      s.setAttribute("y", h(r));
    case SVGLineElement:
      s.setAttribute("y1", h(r)), s.setAttribute("y2", h(c));
      break;
    case SVGRectElement:
      s.setAttribute("y", h(r)), s.setAttribute("height", h(c));
  }
}
function pt(s) {
  const { xaxis: r, yaxis: c } = s, { regions: h, regionCache: f, playhead: i, transportState: o } = M(), m = E(null);
  return Y(I(
    () => {
      const b = m.current;
      let g, x;
      switch (o.type) {
        case "stop":
        case "play":
          $(b, i.x), W(b, 0, 1);
          break;
        case "loop":
          if (g = h.get(o.id), g == null)
            return;
          x = z(
            f.get(o.id),
            r.unit === g.xunit,
            c.unit === g.yunit
          ), $(b, i.x), W(b, x.y, x.y + x.height);
          break;
      }
    },
    [h, f, o]
  )), /* @__PURE__ */ y(
    "line",
    {
      ref: m,
      className: "playhead",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "100%"
    }
  );
}
function vt(s) {
  const { region: r, xaxis: c, yaxis: h } = s, { selection: f, regionCache: i } = M(), o = C(
    () => {
      const m = i.get(r.id);
      return z(m, c.unit == r.xunit, h.unit == r.yunit);
    },
    [r, c, h]
  );
  return /* @__PURE__ */ y(
    "rect",
    {
      className: f.has(r.id) ? "annotation annotation-selected" : "annotation",
      x: String(o.x),
      y: String(o.y),
      width: String(o.width),
      height: String(o.height)
    },
    r.id
  );
}
const Q = () => {
};
function $t(s) {
  const { src: r, xaxis: c, yaxis: h } = s, { regions: f, command: i, input: o, mouseup: m, mouseRect: b, scroll: g, zoom: x, toolState: w, transportState: G } = M(), N = E(null), S = E(null);
  Y(I(
    () => {
      Mt(S.current, `
        M 0 0
        h 1
        v 1
        h -1
        z
        M ${g.x / x.x} ${g.y / x.y}
        v ${1 / x.y}
        h ${1 / x.x}
        v ${-1 / x.y}
        z
      `);
    },
    []
  ));
  const a = dt({
    onContextMenu: Q,
    onMouseDown: Q,
    onMouseEnter: Q,
    onMouseLeave: Q,
    onMouseMove: I(
      (t) => {
        o.buttons & 1 && i.scroll(
          t.movementX / t.currentTarget.clientWidth * x.x,
          t.movementY / t.currentTarget.clientHeight * x.y
        );
      },
      [i, w]
    ),
    onMouseUp: I(
      (t) => {
        if (o.buttons & 1 && ft({ x: b.width, y: b.height }) < 0.01)
          switch (w) {
            case "annotate":
            case "select":
            case "pan":
              i.scrollTo({
                x: m.rel.x * x.x - 0.5,
                y: m.rel.y * x.y - 0.5
              });
              break;
            case "zoom":
              i.resetView();
              break;
          }
      },
      [i, w]
    )
  });
  return lt(N, 1), /* @__PURE__ */ y(
    "div",
    {
      className: `navigator ${w} ${G.type}`,
      children: /* @__PURE__ */ V(
        "svg",
        {
          ref: N,
          width: "100%",
          height: "100%",
          viewBox: "0 0 1 1",
          preserveAspectRatio: "none",
          ...a,
          children: [
            /* @__PURE__ */ y(
              "image",
              {
                href: r,
                width: "100%",
                height: "100%",
                preserveAspectRatio: "none"
              }
            ),
            Array.from(
              f.values(),
              (t) => /* @__PURE__ */ y(
                vt,
                {
                  region: t,
                  xaxis: c,
                  yaxis: h
                },
                t.id
              )
            ),
            /* @__PURE__ */ y(
              "path",
              {
                ref: S,
                className: "mask",
                d: ""
              }
            ),
            /* @__PURE__ */ y(pt, { xaxis: c, yaxis: h })
          ]
        }
      )
    }
  );
}
function Dt(s) {
  const { parent: r, xaxis: c, yaxis: h } = s, { input: f, mouseup: i, unitUp: o } = M(), m = E(null), b = E(null), g = E(null), x = E(null);
  return Y(I(
    () => {
      const w = m.current;
      if (f.alt) {
        const G = b.current, N = g.current, S = x.current;
        let a, t;
        Z(w), r.current == f.focus || c == f.xaxis ? (a = st(c, o.x), $(G, i.rel.x, void 0, nt), Z(G)) : (a = "", q(G)), r.current == f.focus || h == f.yaxis ? (t = st(h, o.y), W(N, i.rel.y, void 0, nt), Z(N)) : (t = "", q(N)), Lt(S, a && t ? `(${a}, ${t})` : a || t), Et(S, i.rel, nt);
      } else
        q(w);
    },
    [c, h]
  )), /* @__PURE__ */ V("g", { ref: m, children: [
    /* @__PURE__ */ y(
      "line",
      {
        ref: b,
        className: "cursor-x",
        x1: "0",
        y1: "0",
        x2: "0",
        y2: "100%"
      }
    ),
    /* @__PURE__ */ y(
      "line",
      {
        ref: g,
        className: "cursor-y",
        x1: "0",
        y1: "0",
        x2: "100%",
        y2: "0"
      }
    ),
    /* @__PURE__ */ y(
      "text",
      {
        ref: x,
        className: "cursor-text",
        x: "0",
        y: "0",
        children: "0:00"
      }
    )
  ] });
}
const K = () => {
};
function Wt(s) {
  const { src: r, xaxis: c, yaxis: h } = s, { command: f, input: i, mouseup: o, mouseRect: m, unitDown: b, unitUp: g, scroll: x, zoom: w } = M(), { toolState: G, transportState: N, transport: S } = M(), { regions: a } = M(), { selection: t } = M(), n = E(null), e = E(null), u = E(null);
  Y(I(
    () => {
      const d = e.current, p = u.current;
      switch (Tt(d, x, w), G) {
        case "annotate":
        case "select":
        case "zoom":
          i.buttons & 1 ? (Z(p), At(p, z(m, c === i.xaxis, h === i.yaxis))) : q(p);
          break;
        case "pan":
          q(p);
          break;
      }
    },
    [G, c, h]
  ));
  const l = dt({
    xaxis: c,
    yaxis: h,
    onContextMenu: K,
    onMouseDown: K,
    onMouseEnter: K,
    onMouseLeave: K,
    onMouseMove: I(
      (d) => {
        if (i.buttons & 1) {
          const p = d.movementX / d.currentTarget.clientWidth, F = d.movementY / d.currentTarget.clientHeight;
          switch (G) {
            case "annotate":
            case "select":
            case "zoom":
              break;
            case "pan":
              t.size == 0 ? f.scroll(-p, -F) : f.moveSelection(p, F);
              break;
          }
        }
      },
      [f, G, t, c, h]
    ),
    onMouseUp: I(
      (d) => {
        if (i.buttons & 1)
          if (ft({ x: m.width, y: m.height }) < 0.01)
            switch (G) {
              case "annotate":
                f.deselect();
                break;
              case "select":
                f.selectPoint(o.abs);
                break;
              case "zoom":
                f.zoomPoint(o.abs);
                break;
            }
          else
            switch (G) {
              case "annotate":
                f.annotate({ ...m }, St(b, g), c, h);
                break;
              case "select":
                f.selectArea(m);
                break;
              case "zoom":
                f.zoomArea(m);
                break;
            }
        i.buttons & 2 && S.seek(o.abs.x);
      },
      [f, G, S, c, h]
    )
  });
  return lt(n, -1), /* @__PURE__ */ y(
    "div",
    {
      className: `visualization ${G} ${N.type}`,
      children: /* @__PURE__ */ V(
        "svg",
        {
          ref: n,
          width: "100%",
          height: "100%",
          ...l,
          children: [
            /* @__PURE__ */ y(
              "svg",
              {
                width: "100%",
                height: "100%",
                viewBox: "0 0 1 1",
                preserveAspectRatio: "none",
                children: /* @__PURE__ */ V(
                  "g",
                  {
                    ref: e,
                    width: "1",
                    height: "1",
                    children: [
                      /* @__PURE__ */ y(
                        "image",
                        {
                          preserveAspectRatio: "none",
                          href: r,
                          width: "100%",
                          height: "100%"
                        }
                      ),
                      Array.from(
                        a.values(),
                        (d) => /* @__PURE__ */ y(
                          vt,
                          {
                            region: d,
                            xaxis: c,
                            yaxis: h
                          },
                          d.id
                        )
                      ),
                      /* @__PURE__ */ y(
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
                      /* @__PURE__ */ y(pt, { xaxis: c, yaxis: h })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ y(Dt, { parent: n, xaxis: c, yaxis: h })
          ]
        }
      )
    }
  );
}
export {
  Vt as Audio,
  P as Encoder,
  $t as Navigator,
  qt as Specviz,
  Wt as Visualization,
  Xt as useAxes,
  Ht as useRegionState,
  M as useSpecviz
};
