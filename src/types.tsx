import type { RefObject } from "react"

type tvector2 = { x: number, y: number }

type tvector3 = { x: number, y: number, z: number }

type tfunctional<T> = T | ((prevState: T) => T)

type tnullable<T> = T | null

type tcontext = {
  scrollZoom: RefObject<tvector3>,
  transport: ttransport,
  transportState: ttransportstate
  setScrollZoom: (dimensions: tvector2, func: tfunctional<tvector3>) => void,
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
  tvector2,
  tvector3,
  tfunctional,
  tnullable,
  tcontext,
  ttransportstate,
  ttransport,
}
