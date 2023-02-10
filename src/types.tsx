import type { trect } from "./rect"
import type { tvector2 } from "./vector2"

type tannotation = {
  id: string,
  rect: trect,
  data: Object,
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
  | { type: "stop", progress: number }

type ttransport = {
  play: () => void,
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
