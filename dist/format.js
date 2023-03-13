function o(t) {
  return t < 1e3 ? t.toFixed(0) + " Hz" : (t / 1e3).toFixed(3) + " kHz";
}
function e(t) {
  return (t * 100).toFixed(3) + "%";
}
function a(t) {
  const n = Math.floor(t / 60), r = t - n;
  return `${n}:${r.toFixed(3).padStart(2, "0")}`;
}
function i(t) {
  const n = new Uint8Array(t);
  return window.crypto.getRandomValues(n), Array.from(n, (r) => r.toString(16).padStart(2, "0")).join("");
}
export {
  o as formatHz,
  e as formatPercent,
  a as formatTimestamp,
  i as randomBytes
};
