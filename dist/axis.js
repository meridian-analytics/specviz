import { normalize as a } from "./rect.js";
function h(t, i) {
  if (t == null)
    return -1 / 0;
  const { intervals: e } = t;
  if (e.length < 2)
    return -1 / 0;
  let n, r, o, l, u = 0;
  for (; u < e.length - 1; ) {
    if ([n, r] = e[u], [o, l] = e[u + 1], n <= i && i <= o)
      return r + (l - r) * (i - n) / (o - n);
    u += 1;
  }
  return -1 / 0;
}
function y(t, i) {
  if (t == null)
    return -1 / 0;
  const e = [...t.intervals].sort(([m, c], [x, s]) => c - s);
  if (e.length < 2)
    return -1 / 0;
  let n, r, o, l, u = 0;
  for (; u < e.length - 1; ) {
    if ([n, r] = e[u], [o, l] = e[u + 1], r <= i && i <= l)
      return n + (o - n) * (i - r) / (l - r);
    u += 1;
  }
  return -1 / 0;
}
function f(t) {
  return (i, e, n) => {
    const r = t(i, n.x), o = t(e, n.y);
    return a({
      x: r,
      y: o,
      width: t(i, n.x + n.width) - r,
      height: t(e, n.y + n.height) - o
    });
  };
}
const g = f(h), I = f(y);
function b(t, i) {
  return t.format(i);
}
function v(t, i, e = "percent", n = String) {
  return {
    unit: e,
    format: n,
    intervals: [[0, t], [1, i]]
  };
}
function w(t, i = "percent", e = String) {
  return {
    unit: i,
    format: e,
    intervals: t
  };
}
export {
  g as computeRect,
  I as computeRectInverse,
  h as computeUnit,
  y as computeUnitInverse,
  b as formatUnit,
  v as linear,
  w as nonlinear
};
