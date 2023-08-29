import { ttransportstate } from "./types.jsx"

function play(progress: number, timeRef: number): ttransportstate {
  return { type: "play", progress, timeRef }
}

function stop(progress: number): ttransportstate {
  return { type: "stop", progress }
}

function loop(progress: number, timeRef: number, id: string): ttransportstate {
  return { type: "loop", progress, timeRef, id }
}

export { play, stop, loop }
