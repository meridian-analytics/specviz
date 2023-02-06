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

type tfunctional<T> = T | ((prevState: T) => T)

type tinput = {
  buttons: number,
  alt: boolean,
  focus: tnullable<SVGSVGElement>,
  xaxis: tnullable<taxis>,
  yaxis: tnullable<taxis>,
}

type tnullable<T> = T | null

type tcontext = {
  annotations: Map<string, tannotation>,
  duration: number,
  input: tinput,
  mousedown: tvector2,
  mouseup: tvector2,
  scroll: tvector2,
  zoom: tvector2,
  playhead: tvector2,
  selection: tselection,
  tool: ttool,
  toolState: ttoolstate,
  transport: ttransport,
  transportState: ttransportstate,
  setAnnotations: (func: tfunctional<Map<string, tannotation>>) => void,
  setSelection: (func: tfunctional<tselection>) => void,
  setTransport: (func: tfunctional<ttransport>) => void,
  setTransportState: (func: tfunctional<ttransportstate>) => void,
}

type tselection = Set<tannotation>

type ttool = {
  annotate: () => void,
  select: () => void,
  zoom: () => void,
  pan: () => void,
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
  tfunctional,
  tinput,
  tnullable,
  tcontext,
  tselection,
  ttool,
  ttoolstate,
  ttransportstate,
  ttransport,
}
