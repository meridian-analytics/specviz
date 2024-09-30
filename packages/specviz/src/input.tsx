import * as R from "react"
import type * as Axis from "./axis"
import * as Coord from "./coord"
import * as Vector2 from "./vector2"

type State = {
  alt: boolean
  buttons: number
  focus: null | (EventTarget & Element)
  xaxis: null | Axis.Axis
  yaxis: null | Axis.Axis
}

export type Context = {
  input: State
  mousedown: Coord.Coord
  mouseup: Coord.Coord
  unitDown: Vector2.Vector2
  unitUp: Vector2.Vector2
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
    let xaxis: null | Axis.Axis = null
    let yaxis: null | Axis.Axis = null
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

  const mousedown: Context["mousedown"] = R.useMemo(Coord.mutable, [])
  const mouseup: Context["mouseup"] = R.useMemo(Coord.mutable, [])
  const unitDown: Context["unitDown"] = R.useMemo(Vector2.mutable, [])
  const unitUp: Context["unitUp"] = R.useMemo(Vector2.mutable, [])

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
