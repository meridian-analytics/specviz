import * as R from "react"
import type * as Axis from "./axis"
import * as Hooks from "./hooks"
import * as Vector2 from "./vector2"

export type tcoord = {
  abs: Vector2.tvector2
  rel: Vector2.tvector2
}

type tinput = {
  alt: boolean
  buttons: number
  focus: null | (EventTarget & Element)
  xaxis: null | Axis.taxis
  yaxis: null | Axis.taxis
}

type Context = {
  input: tinput
  mousedown: tcoord
  mouseup: tcoord
  unitDown: Vector2.tvector2
  unitUp: Vector2.tvector2
}

const defaultContext: Context = {
  input: {
    alt: false,
    buttons: 0,
    focus: null,
    xaxis: null,
    yaxis: null,
  },
  mousedown: { abs: Vector2.zero, rel: Vector2.zero },
  mouseup: { abs: Vector2.zero, rel: Vector2.zero },
  unitDown: Vector2.zero,
  unitUp: Vector2.zero,
}

const Context = R.createContext(defaultContext)

export type ProviderProps = {
  children: React.ReactNode
}

export function Provider(props: ProviderProps) {
  const input: Context["input"] = R.useMemo(() => {
    let buttons = 0
    let alt = false
    let focus: null | SVGElement = null
    let xaxis: null | Axis.taxis = null
    let yaxis: null | Axis.taxis = null
    return {
      get buttons() {
        return buttons
      },
      set buttons(v) {
        buttons = v
      },
      get alt() {
        return alt
      },
      set alt(v) {
        alt = v
      },
      get focus() {
        return focus
      },
      set focus(v) {
        focus = v
      },
      get xaxis() {
        return xaxis
      },
      set xaxis(v) {
        xaxis = v
      },
      get yaxis() {
        return yaxis
      },
      set yaxis(v) {
        yaxis = v
      },
    }
  }, [])

  const mousedown: Context["mousedown"] = Hooks.useMutableCoord()
  const mouseup: Context["mouseup"] = Hooks.useMutableCoord()
  const unitDown: Context["unitDown"] = Hooks.useMutableVector2()
  const unitUp: Context["unitUp"] = Hooks.useMutableVector2()

  const value: Context = {
    input,
    mousedown,
    mouseup,
    unitDown,
    unitUp,
  }

  // todo: expose via command and keybind
  R.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key == "Alt") {
        input.alt = true
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key == "Alt") {
        input.alt = false
      }
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [input])

  return <Context.Provider children={props.children} value={value} />
}

export function useContext() {
  return R.useContext(Context)
}

export default defaultContext
