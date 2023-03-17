import { RefObject } from "react";
import { taxis } from "./types.jsx";
declare function Cursor(props: {
    parent: RefObject<SVGGElement>;
    xaxis: taxis;
    yaxis: taxis;
}): JSX.Element;
export default Cursor;
