function subscribe(
  target: Window | HTMLElement,
  event: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions | undefined,
) {
  target.addEventListener(event, listener, options)
  return () => target.removeEventListener(event, listener, options)
}

export { subscribe }
