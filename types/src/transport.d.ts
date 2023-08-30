import { ttransportstate } from "./types.jsx";
declare function play(progress: number, timeRef: number): ttransportstate;
declare function stop(progress: number): ttransportstate;
declare function loop(progress: number, timeRef: number, id: string): ttransportstate;
export { play, stop, loop };
