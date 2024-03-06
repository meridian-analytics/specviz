import * as R from "react"
import * as Axis from "./axis"
import * as Rect from "./rect"
import * as Vector2 from "./vector2"

type tserialannotation = {
  id: string
  // biome-ignore lint/suspicious/noExplicitAny: user data
  fields: Record<string, any>
  unit: Rect.trect
  xunit: string
  yunit: string
}

interface tregion {
  id: string
  x: number
  y: number
  width: number
  height: number
  xunit: string
  yunit: string
}

type tcoord = {
  abs: Vector2.tvector2
  rel: Vector2.tvector2
}

type tinput = {
  buttons: number
  alt: boolean
  ctrl: boolean
  focus: tnullable<SVGSVGElement>
  xaxis: tnullable<Axis.taxis>
  yaxis: tnullable<Axis.taxis>
}

type tnullable<T> = T | null

type tcontext = {
  input: tinput
  mousedown: tcoord
  mouseup: tcoord
  mouseRect: Rect.trect
  unitDown: Vector2.tvector2
  unitUp: Vector2.tvector2
  scroll: Vector2.tvector2
  zoom: Vector2.tvector2
  playhead: Vector2.tvector2
  regions: Map<string, tregion>
  regionCache: Map<string, Rect.trect>
  selection: tselection
  command: tcommand
  toolState: ttoolstate
  setSelection: R.Dispatch<R.SetStateAction<tselection>>
  setRegions: R.Dispatch<R.SetStateAction<Map<string, tregion>>>
}

type tselection = Set<string>

type tcommand = {
  annotate: (
    rect: Rect.trect,
    unit: Rect.trect,
    xaxis: Axis.taxis,
    yaxis: Axis.taxis,
  ) => void
  delete: () => void
  deselect: () => void
  moveSelection: (dx: number, dy: number) => void
  resetView: () => void
  scroll: (dx: number, dy: number) => void
  scrollTo: (pt: Vector2.tvector2) => void
  selectArea: (rect: Rect.trect) => void
  selectPoint: (pt: Vector2.tvector2) => void
  setRectX: (region: tregion, dx: number) => void
  setRectX1: (region: tregion, dx: number) => void
  setRectX2: (region: tregion, dx: number) => void
  setRectY: (region: tregion, dy: number) => void
  setRectY1: (region: tregion, dy: number) => void
  setRectY2: (region: tregion, dy: number) => void
  tool: (toolState: ttoolstate) => void
  zoom: (dx: number, dy: number) => void
  zoomArea: (rect: Rect.trect) => void
  zoomPoint: (pt: Vector2.tvector2) => void
}

type ttoolstate = "annotate" | "select" | "zoom" | "pan"

export { type taxis } from "./axis"

export type {
  tcoord,
  tinput,
  tnullable,
  tcontext,
  tselection,
  tserialannotation,
  tcommand,
  ttoolstate,
  tregion,
}
