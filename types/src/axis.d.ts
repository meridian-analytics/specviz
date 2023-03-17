import { taxis, tnullable } from "./types.jsx";
import { trect } from "./rect.jsx";
declare function computeUnit(t: tnullable<taxis>, q: number): number;
declare function computeRect(tx: taxis, ty: taxis, rect: trect): trect;
declare function formatUnit(t: taxis, q: number): string;
export { computeRect, computeUnit, formatUnit };
