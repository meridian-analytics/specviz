import type { trect } from "./rect"

type tannotation = {
  id: string,
  rect: trect,
  data: Object,
}

type tvector2 = { x: number, y: number }

type tfunctional<T> = T | ((prevState: T) => T)

type tnullable<T> = T | null

type tcontext = {
  annotations: Map<string, tannotation>,
  duration: number,
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
  trect,
  tannotation,
  tvector2,
  tfunctional,
  tnullable,
  tcontext,
  ttransportstate,
  ttransport,
}
