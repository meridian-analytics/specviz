import * as R from "react"
import * as Audio2 from "./audio2"
import { useSpecviz } from "./hooks.js"
import * as T from "./types"

type State = {
  focusRegion: null | string
}

interface Context extends Audio2.FxContext {
  region: null | T.tregion
  setFocusRegion: (regionId: State["focusRegion"]) => void
}

const defaultContext: Context = {
  region: null,
  setFocusRegion() {
    throw Error("setFocusRegion called outside of context")
  },
}

const Context = R.createContext(defaultContext)

export type ProviderProps = {
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  const specviz = useSpecviz()
  const [state, setState] = R.useState<State>({
    focusRegion: null, 
  })
  const setFocusRegion: Context["setFocusRegion"] = (regionId) => {
    setState(prev => {
      if (prev.focusRegion === regionId) {
        return { focusRegion: null }
      }
      return { focusRegion: regionId }
    })
  }

  const region = state.focusRegion
    ? specviz.regions.get(state.focusRegion) ?? null
    : null
  
  if (region == null) {
    return (
      <Context.Provider
        children={props.children}
        value={{
          region: null,
          setFocusRegion,
        }}
      />
    )  
  }

  const hpf = region.yunit === "hertz" ? region.y : undefined
  const lpf = region.yunit === "hertz" ? region.y + region.height : undefined
  const loopStart = region.x
  const loopEnd = region.x + region.width

  return (
    <Context.Provider 
      children={props.children}
      value={{
        region,
        setFocusRegion,
        hpf,
        lpf,
        loop: [loopStart, loopEnd],
      }}
    />
  )
}

export function useContext() {
  return R.useContext(Context)
}

export default Context