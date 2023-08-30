import { DependencyList, MouseEvent, RefObject } from "react";
import { tcoord, tregion } from "./types.jsx";
import { taxis } from "./axis.jsx";
import { trect } from "./rect.jsx";
import { tvector2 } from "./vector2.jsx";
declare function useAnimationFrame(callback: (frameId: number) => void): void;
/** useAxes: returns a memoized object for use with Specviz axes property */
declare function useAxes(props: () => Record<string, taxis>, deps?: DependencyList): Record<string, taxis>;
/** useRegionState: provides state control for Specviz component */
declare function useRegionState(init?: Map<string, tregion> | (() => Map<string, tregion>)): [Map<string, tregion>, import("react").Dispatch<import("react").SetStateAction<Map<string, tregion>>>];
declare function useMouse(props: {
    xaxis?: taxis;
    yaxis?: taxis;
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
export { useAnimationFrame, useAxes, useMouse, useMutableVector2, useMutableCoord, useMutableRect, useRegionState, useSpecviz, useWheel, };
