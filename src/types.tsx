import { Dispatch, SetStateAction } from "react"
import type { taxis } from "./axis"
import type { trect } from "./rect"
import type { tvector2 } from "./vector2"

type tserialannotation = {
  id: string
  // biome-ignore lint/suspicious/noExplicitAny: user data
  fields: Record<string, any>
  unit: trect
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
  abs: tvector2
  rel: tvector2
}

type tinput = {
  buttons: number
  alt: boolean
  ctrl: boolean
  focus: tnullable<SVGSVGElement>
  xaxis: tnullable<taxis>
  yaxis: tnullable<taxis>
}

type tnullable<T> = T | null

type tcontext = {
  input: tinput
  mousedown: tcoord
  mouseup: tcoord
  mouseRect: trect
  unitDown: tvector2
  unitUp: tvector2
  scroll: tvector2
  zoom: tvector2
  playhead: tvector2
  regions: Map<string, tregion>
  regionCache: Map<string, trect>
  selection: tselection
  command: tcommand
  toolState: ttoolstate
  setSelection: Dispatch<SetStateAction<tselection>>
  setRegions: Dispatch<SetStateAction<Map<string, tregion>>>
}

type tselection = Set<string>

type tcommand = {
  annotate: (rect: trect, unit: trect, xaxis: taxis, yaxis: taxis) => void
  delete: () => void
  deselect: () => void
  moveSelection: (dx: number, dy: number) => void
  resetView: () => void
  scroll: (dx: number, dy: number) => void
  scrollTo: (pt: tvector2) => void
  selectArea: (rect: trect) => void
  selectPoint: (pt: tvector2) => void
  setRectX: (region: tregion, dx: number) => void
  setRectX1: (region: tregion, dx: number) => void
  setRectX2: (region: tregion, dx: number) => void
  setRectY: (region: tregion, dy: number) => void
  setRectY1: (region: tregion, dy: number) => void
  setRectY2: (region: tregion, dy: number) => void
  tool: (toolState: ttoolstate) => void
  zoom: (dx: number, dy: number) => void
  zoomArea: (rect: trect) => void
  zoomPoint: (pt: tvector2) => void
}

type ttoolstate = "annotate" | "select" | "zoom" | "pan"

export type {
  taxis,
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
