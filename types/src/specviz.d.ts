import { ReactNode } from "react";
import { tannotation } from "./types.jsx";
declare function Specviz(props: {
    initAnnotations?: Map<string, tannotation>;
    children: ReactNode;
}): JSX.Element;
export default Specviz;
