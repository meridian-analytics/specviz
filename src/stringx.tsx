type tformat = (x: number) => string

function formatHz(hz: number) {
  if (hz < 1000)
    return hz.toFixed(0) + " Hz"
  else
    return (hz / 1000).toFixed(3) + " kHz"
}

function formatPercent(percent: number) {
  return (percent * 100).toFixed(3) + "%"
}

function formatTimestamp(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = time - minutes
  return `${minutes}:${seconds.toFixed(3).padStart(2, "0")}`
}

function randomBytes(count: number) {
  const a = new Uint8Array(count)
  window.crypto.getRandomValues(a)
  return Array.from(a, byte => byte.toString(16).padStart(2, "0")).join('')
}

export type { tformat }
export { formatHz, formatPercent, formatTimestamp, randomBytes }
