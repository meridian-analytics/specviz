import { tnullable } from "./types.jsx";
import { trect } from "./rect.jsx";
type taxisunit = "hertz" | "seconds" | "percent";
type taxisformat = (x: number) => string;
type taxis = {
    unit: taxisunit;
    format: taxisformat;
    intervals: Array<[number, number]>;
};
declare function computeUnit(t: tnullable<taxis>, q: number): number;
declare function computeRect(tx: taxis, ty: taxis, rect: trect): trect;
declare function formatUnit(t: taxis, q: number): string;
declare function linear(min: number, max: number, unit?: taxisunit, format?: taxisformat): taxis;
declare function nonlinear(intervals: Array<[number, number]>, unit?: taxisunit, format?: taxisformat): taxis;
export type { taxis };
export { computeRect, computeUnit, formatUnit, linear, nonlinear };
