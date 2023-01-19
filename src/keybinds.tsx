import type { ReactNode, RefObject } from "react"
import { createContext, useContext, useEffect, useRef } from "react"

type tcontext = {
  onKeyUps: RefObject<Set<(e: KeyboardEvent) => void>>,
  onKeyDowns: RefObject<Set<(e: KeyboardEvent) => void>>,
}

const KeybindsContext = createContext<tcontext>({
  onKeyUps: { current: new Set() },
  onKeyDowns: { current: new Set() },
})

function Bindings(props: {
  children: ReactNode,
}) {
  const onKeyUps = useRef<Set<(e: KeyboardEvent) => void>>(new Set())
  const onKeyDowns = useRef<Set<(e: KeyboardEvent) => void>>(new Set())
  useEffect(
    () => {
      function onKeyDown(e: KeyboardEvent) {
        for (const listener of onKeyDowns.current) listener(e)
      }
      function onKeyUp(e: KeyboardEvent) {
        for (const listener of onKeyUps.current) listener(e)
      }
      window.addEventListener("keydown", onKeyDown)
      window.addEventListener("keyup", onKeyUp)
      return () => {
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
      }
    },
    [onKeyUps, onKeyDowns]
  )
  return <KeybindsContext.Provider
    value={{
      onKeyUps,
      onKeyDowns
    }}
    children={props.children}
  />
}

function Keypress(
  props: {
    bind: string,
    onKeyDown?: (e: KeyboardEvent) => void,
    onKeyUp?: (e: KeyboardEvent) => void,
  }
) {
  const { onKeyUps, onKeyDowns } = useContext(KeybindsContext)
  useEffect(
    () => {
      function onDown(e: KeyboardEvent) {
        if (props.onKeyDown && e.key === props.bind) props.onKeyDown(e)
      }
      function onUp(e: KeyboardEvent) {
        if (props.onKeyUp && e.key === props.bind) props.onKeyUp(e)
      }
      onKeyDowns.current!.add(onDown)
      onKeyUps.current!.add(onUp)
      return () => {
        onKeyDowns.current!.delete(onDown)
        onKeyUps.current!.delete(onUp)
      }
    },
    [props.onKeyDown, props.onKeyUp, props.bind, onKeyUps, onKeyDowns]
  )
  return <></>
}

export { Bindings, Keypress }
