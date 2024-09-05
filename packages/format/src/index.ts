/** todo: unused */
export type FormatFn<T = unknown> = (value: T) => string

export function hz(hz: number) {
  if (hz < 1000) return hz.toFixed(0) + " Hz"
  return (hz / 1000).toFixed(3) + " kHz"
}

export function percent(percent: number) {
  return (percent * 100).toFixed(3) + "%"
}

export function timestamp(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = time - minutes
  return `${minutes}:${seconds.toFixed(3).padStart(2, "0")}`
}

export function randomBytes(count: number) {
  const a = new Uint8Array(count)
  window.crypto.getRandomValues(a)
  return Array.from(a, byte => byte.toString(16).padStart(2, "0")).join("")
}
