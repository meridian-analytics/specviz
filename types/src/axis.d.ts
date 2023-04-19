import { trect } from "./rect.jsx";
type taxisunit = "hertz" | "seconds" | "percent";
type taxisformat = (x: number) => string;
type taxis = {
    unit: taxisunit;
    format: taxisformat;
    intervals: Array<[number, number]>;
};
declare function computeUnit(t: taxis, q: number): number;
declare function computeUnitInverse(t: taxis, q: number): number;
declare const computeRect: (tx: taxis, ty: taxis, rect: trect) => trect;
declare const computeRectInverse: (tx: taxis, ty: taxis, rect: trect) => trect;
declare function formatUnit(t: taxis, q: number): string;
declare function linear(min: number, max: number, unit?: taxisunit, format?: taxisformat): taxis;
declare function nonlinear(intervals: Array<[number, number]>, unit?: taxisunit, format?: taxisformat): taxis;
export type { taxis };
export { computeRect, computeRectInverse, computeUnit, computeUnitInverse, formatUnit, linear, nonlinear };
