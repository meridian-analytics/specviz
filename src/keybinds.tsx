import * as R from "react"

type tcontext = {
  onKeyUps: R.RefObject<Set<(e: KeyboardEvent) => void>>
  onKeyDowns: R.RefObject<Set<(e: KeyboardEvent) => void>>
}

const KeybindsContext = R.createContext<tcontext>({
  onKeyUps: { current: new Set() },
  onKeyDowns: { current: new Set() },
})

function Bindings(props: {
  children: R.ReactNode
}) {
  const onKeyUps = R.useRef<Set<(e: KeyboardEvent) => void>>(new Set())
  const onKeyDowns = R.useRef<Set<(e: KeyboardEvent) => void>>(new Set())
  R.useEffect(() => {
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
  }, [])
  return (
    <KeybindsContext.Provider
      value={{
        onKeyUps,
        onKeyDowns,
      }}
      children={props.children}
    />
  )
}

function Keypress(props: {
  bind: string
  onKeyDown?: (e: KeyboardEvent) => void
  onKeyUp?: (e: KeyboardEvent) => void
}) {
  const { onKeyUps, onKeyDowns } = R.useContext(KeybindsContext)
  R.useEffect(() => {
    function onDown(e: KeyboardEvent) {
      if (props.onKeyDown && e.key === props.bind) props.onKeyDown(e)
    }
    function onUp(e: KeyboardEvent) {
      if (props.onKeyUp && e.key === props.bind) props.onKeyUp(e)
    }
    if (onKeyDowns.current) onKeyDowns.current.add(onDown)
    if (onKeyUps.current) onKeyUps.current.add(onUp)
    return () => {
      if (onKeyDowns.current) onKeyDowns.current.delete(onDown)
      if (onKeyUps.current) onKeyUps.current.delete(onUp)
    }
  }, [props.onKeyDown, props.onKeyUp, props.bind, onKeyUps, onKeyDowns])
  return <></>
}

export { Bindings, Keypress }
