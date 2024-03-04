import * as R from "react"
import * as Audio2 from "./audio2"
import { useSpecviz } from "./hooks.js"
import * as T from "./types"

type State = {
  focusRegion: null | string
}

type Context = {
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
    
  const fx: Audio2.FxContext.Context = R.useMemo(
    () => {
      return region == null
        ? Audio2.FxContext.default
        : {
            hpf: region.yunit === "hertz" ? region.y : undefined,
            lpf: region.yunit === "hertz" ? region.y + region.height : undefined,
            loop: [region.x, region.x + region.width],
          }
    },
    [
      Audio2.FxContext.default,
      region == null,
      region?.yunit,
      region?.x,
      region?.y,
      region?.width,
      region?.height,
    ],
  )
  
  return (
    <Context.Provider 
      value={{
        region,
        setFocusRegion,
      }}
    >
      <Audio2.FxContext.Provider
        children={props.children}
        value={fx}
      />
    </Context.Provider>
  )
}

export function useContext() {
  return R.useContext(Context)
}