import { normalize as a } from "./rect.js";
function u(i, t) {
  if (i == null)
    return t;
  const { intervals: n } = i;
  if (n.length < 2)
    return -1 / 0;
  let r, e, f, l, o = 0;
  for (; o < n.length - 1; ) {
    if ([r, e] = n[o], [f, l] = n[o + 1], t <= f)
      return e + (l - e) * (t - r) / (f - r);
    o += 1;
  }
  return -1 / 0;
}
function c(i, t, n) {
  const r = u(i, n.x), e = u(t, n.y);
  return a({
    x: r,
    y: e,
    width: u(i, n.x + n.width) - r,
    height: u(t, n.y + n.height) - e
  });
}
function m(i, t) {
  return i.format(t);
}
function g(i, t, n = "percent", r = String) {
  return {
    unit: n,
    format: r,
    intervals: [[0, i], [1, t]]
  };
}
function p(i, t = "percent", n = String) {
  return {
    unit: t,
    format: n,
    intervals: i
  };
}
export {
  c as computeRect,
  u as computeUnit,
  m as formatUnit,
  g as linear,
  p as nonlinear
};
