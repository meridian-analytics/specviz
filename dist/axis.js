import { normalize as a } from "./rect.js";
function h(i, t) {
  const { intervals: e } = i;
  if (e.length < 2)
    return -1 / 0;
  let n, r, o, l, u = 0;
  for (; u < e.length - 1; ) {
    if ([n, r] = e[u], [o, l] = e[u + 1], n <= t && t <= o)
      return r + (l - r) * (t - n) / (o - n);
    u += 1;
  }
  return -1 / 0;
}
function m(i, t) {
  const e = i.intervals.sort(([x, f], [y, s]) => f - s);
  if (e.length < 2)
    return -1 / 0;
  let n, r, o, l, u = 0;
  for (; u < e.length - 1; ) {
    if ([n, r] = e[u], [o, l] = e[u + 1], r <= t && t <= l)
      return n + (o - n) * (t - r) / (l - r);
    u += 1;
  }
  return -1 / 0;
}
function c(i) {
  return (t, e, n) => {
    const r = i(t, n.x), o = i(e, n.y);
    return a({
      x: r,
      y: o,
      width: i(t, n.x + n.width) - r,
      height: i(e, n.y + n.height) - o
    });
  };
}
const g = c(h), I = c(m);
function b(i, t) {
  return i.format(t);
}
function v(i, t, e = "percent", n = String) {
  return {
    unit: e,
    format: n,
    intervals: [[0, i], [1, t]]
  };
}
function w(i, t = "percent", e = String) {
  return {
    unit: t,
    format: e,
    intervals: i
  };
}
export {
  g as computeRect,
  I as computeRectInverse,
  h as computeUnit,
  m as computeUnitInverse,
  b as formatUnit,
  v as linear,
  w as nonlinear
};
