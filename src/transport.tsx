import { tannotation, ttransportstate } from "./types"

function play(progress: number, timeRef: number): ttransportstate {
  return { type: "play", progress, timeRef }
}

function stop(progress: number): ttransportstate {
  return { type: "stop", progress }
}

function loop(progress: number, timeRef: number, annotation: tannotation): ttransportstate {
  return { type: "loop", progress, timeRef, annotation }
}

export { play, stop, loop }
