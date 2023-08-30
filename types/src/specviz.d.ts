import { Dispatch, SetStateAction, ReactNode } from "react";
import { tregion } from "./types.jsx";
import { taxis } from "./axis.jsx";
declare function Specviz(props: {
    axes: Record<string, taxis>;
    regions: Map<string, tregion>;
    setRegions: Dispatch<SetStateAction<Map<string, tregion>>>;
    children: ReactNode;
}): JSX.Element;
export default Specviz;
