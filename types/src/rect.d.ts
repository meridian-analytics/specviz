import { tnullable } from "./types.jsx";
import type { tvector2 } from "./vector2.jsx";
type trect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
declare function fromPoints(pt1: tvector2, pt2: tvector2): trect;
declare function intersectPoint(t: trect, pt: tvector2): boolean;
declare function intersectRect(a: trect, b: trect): tnullable<trect>;
declare function logical(t: trect, x: boolean, y: boolean): trect;
declare function normalize(t: trect): trect;
export type { trect };
export { fromPoints, intersectPoint, intersectRect, logical, normalize };
