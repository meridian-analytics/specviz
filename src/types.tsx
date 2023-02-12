import type { trect } from "./rect"
import type { tvector2 } from "./vector2"

type tannotation = {
  id: string,
  rect: trect,
  unit: trect,
  xaxis: taxis,
  yaxis: taxis,
}

type taxis = {
  unit: "hertz" | "seconds" | "percent",
  intervals: Array<[number, number]>,
  format: (x: number) => string,
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
  duration: number,
  input: tinput,
  mousedown: tcoord,
  mouseup: tcoord,
  mouseRect: trect,
  unitDown: tvector2,
  unitUp: tvector2,
  scroll: tvector2,
  zoom: tvector2,
  playhead: trect,
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

type tselection = Set<tannotation>

type tcommand = {
  annotate: () => void,
  select: () => void,
  zoom: () => void,
  pan: () => void,
  delete: () => void,
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
