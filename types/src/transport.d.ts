import { tannotation, ttransportstate } from "./types.jsx";
declare function play(progress: number, timeRef: number): ttransportstate;
declare function stop(progress: number): ttransportstate;
declare function loop(progress: number, timeRef: number, annotation: tannotation): ttransportstate;
export { play, stop, loop };
