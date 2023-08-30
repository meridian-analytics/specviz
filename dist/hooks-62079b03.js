import { createContext as h, useEffect as S, useMemo as u, useState as p, useContext as w } from "react";
import { computeUnit as y } from "./axis.js";
import { fromPoints as M } from "./rect.js";
function v(e, t, o) {
  return Math.min(Math.max(e, t), o);
}
function D(e, t) {
  return { type: "play", progress: e, timeRef: t };
}
function b(e) {
  return { type: "stop", progress: e };
}
function X(e, t, o) {
  return { type: "loop", progress: e, timeRef: t, id: o };
}
const g = h({
  input: { buttons: 0, alt: !1, ctrl: !1, focus: null, xaxis: null, yaxis: null },
  mousedown: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseup: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseRect: { x: 0, y: 0, width: 0, height: 0 },
  unitDown: { x: 0, y: 0 },
  unitUp: { x: 0, y: 0 },
  scroll: { x: 0, y: 0 },
  zoom: { x: 0, y: 0 },
  playhead: { x: 0, y: 0 },
  regions: /* @__PURE__ */ new Map(),
  regionCache: /* @__PURE__ */ new Map(),
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
  transportState: b(0),
  setRegions: (e) => {
    console.error("setRegions called outside of Specviz context");
  },
  setSelection: (e) => {
    console.error("setSelection called outside of Specviz context");
  },
  setTransport: (e) => {
    console.error("setTransport called outside of Specviz context");
  },
  setTransportState: (e) => {
    console.error("setTransportState called outside of Specviz context");
  }
});
function Y(e) {
  S(
    () => {
      let t;
      function o(n) {
        e(n), t = window.requestAnimationFrame(o);
      }
      return t = window.requestAnimationFrame(o), () => {
        window.cancelAnimationFrame(t);
      };
    },
    [e]
  );
}
function U(e, t) {
  return u(e, t ?? []);
}
function E(e) {
  return p(e ?? /* @__PURE__ */ new Map());
}
function F(e) {
  const { input: t, mousedown: o, mouseup: n, mouseRect: s, unitDown: l, unitUp: a, scroll: r, zoom: i } = z();
  return u(
    () => ({
      onContextMenu(c) {
        c.preventDefault(), e.onContextMenu(c);
      },
      onMouseDown(c) {
        c.preventDefault(), t.buttons = c.buttons, e.onMouseDown(c);
      },
      onMouseMove(c) {
        const x = c.currentTarget.getBoundingClientRect(), d = (c.clientX - x.x) / x.width, m = (c.clientY - x.y) / x.height;
        t.buttons & 1 ? (n.rel.x = d, n.rel.y = m, n.abs.x = (d + r.x) / i.x, n.abs.y = (m + r.y) / i.y, e.xaxis != null && (a.x = y(e.xaxis, v(n.abs.x, 0, 1))), e.yaxis != null && (a.y = y(e.yaxis, v(n.abs.y, 0, 1)))) : (o.rel.x = n.rel.x = d, o.rel.y = n.rel.y = m, o.abs.x = n.abs.x = (d + r.x) / i.x, o.abs.y = n.abs.y = (m + r.y) / i.y, e.xaxis != null && (l.x = a.x = y(e.xaxis, v(o.abs.x, 0, 1))), e.yaxis != null && (l.y = a.y = y(e.yaxis, v(o.abs.y, 0, 1))));
        const f = M(o.abs, n.abs);
        s.x = f.x, s.y = f.y, s.width = f.width, s.height = f.height, e.onMouseMove(c);
      },
      onMouseUp(c) {
        e.onMouseUp(c), t.buttons = 0;
      },
      onMouseEnter(c) {
        t.focus = c.currentTarget, e.xaxis != null && (t.xaxis = e.xaxis), e.yaxis != null && (t.yaxis = e.yaxis), e.onMouseEnter(c);
      },
      onMouseLeave(c) {
        e.onMouseLeave(c), t.buttons = 0, t.focus = null, t.xaxis = null, t.yaxis = null;
      }
    }),
    [
      e.xaxis,
      e.yaxis,
      e.onMouseDown,
      e.onMouseMove,
      e.onMouseUp,
      e.onMouseLeave,
      e.onContextMenu
    ]
  );
}
function L() {
  return u(
    () => {
      let e = 0, t = 0;
      return {
        get x() {
          return e;
        },
        get y() {
          return t;
        },
        set x(o) {
          e = o;
        },
        set y(o) {
          t = o;
        }
      };
    },
    []
  );
}
function P() {
  return u(
    () => {
      let e = 0, t = 0, o = 0, n = 0;
      return {
        abs: {
          get x() {
            return e;
          },
          set x(s) {
            e = s;
          },
          get y() {
            return t;
          },
          set y(s) {
            t = s;
          }
        },
        rel: {
          get x() {
            return o;
          },
          set x(s) {
            o = s;
          },
          get y() {
            return n;
          },
          set y(s) {
            n = s;
          }
        }
      };
    },
    []
  );
}
function _() {
  return u(
    () => {
      let e = 0, t = 0, o = 0, n = 0;
      return {
        get x() {
          return e;
        },
        get y() {
          return t;
        },
        set x(s) {
          e = s;
        },
        set y(s) {
          t = s;
        },
        get width() {
          return o;
        },
        set width(s) {
          o = s;
        },
        get height() {
          return n;
        },
        set height(s) {
          n = s;
        }
      };
    },
    []
  );
}
function V(e, t) {
  const { command: o, mousedown: n, zoom: s } = z();
  S(
    () => {
      const l = e.current;
      function a(r) {
        r.preventDefault();
        const i = r.deltaX / l.clientWidth, c = r.deltaY / l.clientHeight;
        r.altKey ? (o.zoom(
          i * t,
          c * t
        ), o.scrollTo({
          x: n.abs.x * s.x - n.rel.x,
          y: n.abs.y * s.y - n.rel.y
        })) : o.scroll(
          -i * t,
          -c * t
        );
      }
      return l.addEventListener("wheel", a, { passive: !1 }), () => {
        l.removeEventListener("wheel", a);
      };
    },
    [t]
  );
}
function z() {
  return w(g);
}
export {
  g as S,
  _ as a,
  L as b,
  v as c,
  z as d,
  Y as e,
  F as f,
  V as g,
  U as h,
  E as i,
  X as l,
  D as p,
  b as s,
  P as u
};
