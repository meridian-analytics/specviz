function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function percent(n: number) {
  return (n * 100).toFixed(2) + "%"
}

export { clamp, percent }
