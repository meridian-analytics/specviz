function y(h, i) {
  return {
    x: Math.min(h.x, i.x),
    y: Math.min(h.y, i.y),
    width: Math.abs(i.x - h.x),
    height: Math.abs(i.y - h.y)
  };
}
function a(h, i) {
  return i.x >= h.x && i.x <= h.x + h.width && i.y >= h.y && i.y <= h.y + h.height;
}
function o(h, i) {
  const n = Math.max(h.x, i.x), t = Math.max(h.y, i.y), e = Math.min(h.x + h.width, i.x + i.width) - n, x = Math.min(h.y + h.height, i.y + i.height) - t;
  return e <= 0 || x <= 0 ? null : { x: n, y: t, width: e, height: x };
}
function r(h, i, n) {
  return {
    x: i ? h.x : 0,
    y: n ? h.y : 0,
    width: i ? h.width : 1,
    height: n ? h.height : 1
  };
}
function c(h) {
  return {
    x: Math.min(h.x, h.x + h.width),
    y: Math.min(h.y, h.y + h.height),
    width: Math.abs(h.width),
    height: Math.abs(h.height)
  };
}
export {
  y as fromPoints,
  a as intersectPoint,
  o as intersectRect,
  r as logical,
  c as normalize
};
