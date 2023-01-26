function randomBytes(count: number) {
  const a = new Uint8Array(count)
  window.crypto.getRandomValues(a)
  return Array.from(a, byte => byte.toString(16).padStart(2, "0")).join('')
}

function formatTimestamp(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = time - minutes
  return `${minutes}:${seconds.toFixed(3).padStart(2, "0")}`
}

export { formatTimestamp, randomBytes }
