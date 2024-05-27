import * as R from "react"
import type * as Axis from "./axis"
import * as Hooks from "./hooks"
import type * as Rect from "./rect"
import * as Vector2 from "./vector2"

export type tcoord = {
  abs: Vector2.tvector2
  rel: Vector2.tvector2
}

type tinput = {
  alt: boolean
  buttons: number
  ctrl: boolean
  focus: null | SVGSVGElement
  xaxis: null | Axis.taxis
  yaxis: null | Axis.taxis
}

type Context = {
  input: tinput
  mousedown: tcoord
  mouseRect: Rect.trect
  mouseup: tcoord
  unitDown: Vector2.tvector2
  unitUp: Vector2.tvector2
}

const defaultContext: Context = {
  input: {
    alt: false,
    buttons: 0,
    ctrl: false,
    focus: null,
    xaxis: null,
    yaxis: null,
  },
  mousedown: { abs: Vector2.zero, rel: Vector2.zero },
  mouseRect: { x: 0, y: 0, width: 0, height: 0 },
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
    let ctrl = false
    let focus: null | SVGSVGElement = null
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
      get ctrl() {
        return ctrl
      },
      set ctrl(v) {
        ctrl = v
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
  const mouseRect: Context["mouseRect"] = Hooks.useMutableRect()
  const unitDown: Context["unitDown"] = Hooks.useMutableVector2()
  const unitUp: Context["unitUp"] = Hooks.useMutableVector2()

  const value: Context = {
    input,
    mousedown,
    mouseRect,
    mouseup,
    unitDown,
    unitUp,
  }

  // todo: expose via command and keybind
  R.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key == "Alt") {
        input.alt = true
      } else if (e.key == "Control") {
        input.ctrl = true
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key == "Alt") {
        input.alt = false
      } else if (e.key == "Control") {
        input.ctrl = false
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
