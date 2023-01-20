function randomBytes(count: number) {
  const a = new Uint8Array(count)
  window.crypto.getRandomValues(a)
  return Array.from(a, byte => byte.toString(16).padStart(2, "0")).join('')
}

export { randomBytes }
