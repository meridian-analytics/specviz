// react 18, you might not need an effect
// https://beta.reactjs.org/reference/react/useSyncExternalStore
//
// naive solution, react <= 17
// https://stackoverflow.com/a/60978633

import { RefObject, useMemo, useSyncExternalStore } from "react"

function resizeSubscription(callback: (e: Event) => void) {
  window.addEventListener("resize", callback)
  return () => {
    window.removeEventListener("resize", callback)
  }
}

function useDimensions(ref: RefObject<HTMLElement>) {
  const dimensions = useSyncExternalStore(
    resizeSubscription,
    () => JSON.stringify({
      width: ref.current?.offsetWidth ?? 300,
      height: ref.current?.offsetHeight ?? 200,
    })
  )
  return useMemo(() => JSON.parse(dimensions), [dimensions])
}

export { useDimensions }
