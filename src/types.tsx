import type { taxis } from "./axis.jsx"
import type { trect } from "./rect.jsx"
import type { tvector2 } from "./vector2.jsx"

type tannotation = {
  id: string,
  rect: trect,
  unit: trect,
  xaxis: taxis,
  yaxis: taxis,
}

type tcoord = {
  abs: tvector2,
  rel: tvector2,
}

type tfunctional<T> = T | ((prevState: T) => T)

type tinput = {
  buttons: number,
  alt: boolean,
  ctrl: boolean,
  focus: tnullable<SVGSVGElement>,
  xaxis: tnullable<taxis>,
  yaxis: tnullable<taxis>,
}

type tnullable<T> = T | null

type tcontext = {
  annotations: Map<string, tannotation>,
  input: tinput,
  mousedown: tcoord,
  mouseup: tcoord,
  mouseRect: trect,
  unitDown: tvector2,
  unitUp: tvector2,
  scroll: tvector2,
  zoom: tvector2,
  playhead: tvector2,
  selection: tselection,
  command: tcommand,
  toolState: ttoolstate,
  transport: ttransport,
  transportState: ttransportstate,
  setAnnotations: (func: tfunctional<Map<string, tannotation>>) => void,
  setSelection: (func: tfunctional<tselection>) => void,
  setTransport: (func: tfunctional<ttransport>) => void,
  setTransportState: (func: tfunctional<ttransportstate>) => void,
}

type tselection = Set<string>

type tcommand = {
  annotate: (rect: trect, unit: trect, xaxis: taxis, yaxis: taxis) => void,
  delete: () => void,
  deselect: () => void,
  moveSelection: (dx: number, dy: number) => void,
  resetView: () => void,
  scroll: (dx: number, dy: number) => void,
  scrollTo: (pt: tvector2) => void,
  selectArea: (rect: trect) => void,
  selectPoint: (pt: tvector2) => void,
  setRectX: (annotation: tannotation, x: number) => void,
  setRectY: (annotation: tannotation, y: number) => void,
  setRectWidth: (annotation: tannotation, width: number) => void,
  setRectHeight: (annotation: tannotation, height: number) => void,
  tool: (toolState: ttoolstate) => void,
  zoomArea: (rect: trect) => void,
  zoomPoint: (pt: tvector2) => void,
}

type ttoolstate = "annotate" | "select" | "zoom" | "pan"

type ttransportstate =
  | { type: "play", progress: number, timeRef: number }
  | { type: "loop", progress: number, timeRef: number, annotation: tannotation }
  | { type: "stop", progress: number }

type ttransport = {
  play: () => void,
  loop: (annotation: tannotation) => void,
  stop: () => void,
  seek: (progress: number) => void,
}

export type {
  tannotation,
  taxis,
  tcoord,
  tfunctional,
  tinput,
  tnullable,
  tcontext,
  tselection,
  tcommand,
  ttoolstate,
  ttransportstate,
  ttransport,
}
