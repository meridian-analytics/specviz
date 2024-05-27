import * as R from "react"
import * as Audio2 from "./audio2"
import * as RegionContext from "./region"

type FocusState = null | string

type Context = {
  region: null | RegionContext.Region
  setFocus: (regionId: FocusState) => void
}

const defaultContext: Context = {
  region: null,
  setFocus() {
    throw Error("setFocusRegion called outside of context")
  },
}

const Context = R.createContext(defaultContext)

export type ProviderProps = {
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  const regionCtx = RegionContext.useContext()
  const [focus, originalSetFocus] = R.useState<FocusState>(null)
  const region = focus ? regionCtx.regions.get(focus) ?? null : null
  const setFocus: Context["setFocus"] = next => {
    // setting the same focus will toggle the focus off
    originalSetFocus(prev => (prev == next ? null : next))
  }
  const fx: Audio2.FxContext.Context = R.useMemo(() => {
    return region == null
      ? Audio2.FxContext.default
      : {
          hpf: region.yunit === "hertz" ? region.y : undefined,
          lpf: region.yunit === "hertz" ? region.y + region.height : undefined,
          loop: [region.x, region.x + region.width],
        }
  }, [region])

  return (
    <Context.Provider
      value={{
        region,
        setFocus,
      }}
    >
      <Audio2.FxContext.Provider value={fx}>
        <Audio2.AudioEffect />
        {props.children}
      </Audio2.FxContext.Provider>
    </Context.Provider>
  )
}

export function useContext() {
  return R.useContext(Context)
}
