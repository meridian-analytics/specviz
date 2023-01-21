import type { trect } from "./rect"
import type { tvector2 } from "./vector2"

type tannotation = {
  id: string,
  rect: trect,
  data: Object,
}

type tmouse = trect & {
  lmb: boolean,
}

type tfunctional<T> = T | ((prevState: T) => T)

type tnullable<T> = T | null

type tcontext = {
  annotations: Map<string, tannotation>,
  duration: number,
  mouse: tmouse,
  scroll: tvector2,
  zoom: tvector2,
  transport: ttransport,
  transportState: ttransportstate,
  setAnnotations: (func: tfunctional<Map<string, tannotation>>) => void,
  setTransport: (func: tfunctional<ttransport>) => void,
  setTransportState: (func: tfunctional<ttransportstate>) => void,
}

type ttransportstate =
  | { type: "play", offset: number, timeRef: number }
  | { type: "stop", offset: number }

type ttransport = {
  play: () => void,
  stop: () => void,
  seek: (offset: number) => void,
}

export type {
  tannotation,
  tmouse,
  tfunctional,
  tnullable,
  tcontext,
  ttransportstate,
  ttransport,
}
