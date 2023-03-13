import { jsx as u, Fragment as s } from "react/jsx-runtime";
import { createContext as f, useRef as d, useEffect as w, useContext as K } from "react";
const y = f({
  onKeyUps: { current: /* @__PURE__ */ new Set() },
  onKeyDowns: { current: /* @__PURE__ */ new Set() }
});
function U(n) {
  const t = d(/* @__PURE__ */ new Set()), o = d(/* @__PURE__ */ new Set());
  return w(
    () => {
      function r(e) {
        for (const c of o.current)
          c(e);
      }
      function i(e) {
        for (const c of t.current)
          c(e);
      }
      return window.addEventListener("keydown", r), window.addEventListener("keyup", i), () => {
        window.removeEventListener("keydown", r), window.removeEventListener("keyup", i);
      };
    },
    [t, o]
  ), /* @__PURE__ */ u(
    y.Provider,
    {
      value: {
        onKeyUps: t,
        onKeyDowns: o
      },
      children: n.children
    }
  );
}
function a(n) {
  const { onKeyUps: t, onKeyDowns: o } = K(y);
  return w(
    () => {
      function r(e) {
        n.onKeyDown && e.key === n.bind && n.onKeyDown(e);
      }
      function i(e) {
        n.onKeyUp && e.key === n.bind && n.onKeyUp(e);
      }
      return o.current.add(r), t.current.add(i), () => {
        o.current.delete(r), t.current.delete(i);
      };
    },
    [n.onKeyDown, n.onKeyUp, n.bind, t, o]
  ), /* @__PURE__ */ u(s, {});
}
export {
  U as Bindings,
  a as Keypress
};
