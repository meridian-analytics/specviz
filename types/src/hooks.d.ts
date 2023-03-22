import { MouseEvent, RefObject } from "react";
import { tnullable, tcoord } from "./types.jsx";
import { taxis } from "./axis.jsx";
import { trect } from "./rect.jsx";
import { tvector2 } from "./vector2.jsx";
declare function useAnimationFrame(callback: (frameId: number) => void): void;
declare function useMouse(props: {
    xaxis: tnullable<taxis>;
    yaxis: tnullable<taxis>;
    onMouseDown: (e: MouseEvent<SVGSVGElement>) => void;
    onMouseMove: (e: MouseEvent<SVGSVGElement>) => void;
    onMouseUp: (e: MouseEvent<SVGSVGElement>) => void;
    onMouseEnter: (e: MouseEvent<SVGSVGElement>) => void;
    onMouseLeave: (e: MouseEvent<SVGSVGElement>) => void;
    onContextMenu: (e: MouseEvent<SVGSVGElement>) => void;
}): {
    onContextMenu(e: MouseEvent<SVGSVGElement>): void;
    onMouseDown(e: MouseEvent<SVGSVGElement>): void;
    onMouseMove(e: MouseEvent<SVGSVGElement>): void;
    onMouseUp(e: MouseEvent<SVGSVGElement>): void;
    onMouseEnter(e: MouseEvent<SVGSVGElement>): void;
    onMouseLeave(e: MouseEvent<SVGSVGElement>): void;
};
declare function useMutableVector2(): tvector2;
declare function useMutableCoord(): tcoord;
declare function useMutableRect(): trect;
declare function useWheel(ref: RefObject<SVGSVGElement>, direction: 1 | -1): void;
declare function useSpecviz(): import("./types.jsx").tcontext;
export { useAnimationFrame, useMouse, useMutableVector2, useMutableCoord, useMutableRect, useSpecviz, useWheel };
