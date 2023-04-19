/// <reference types="react" />
import { tannotation, tserialannotation } from "./types.jsx";
import { taxis } from "./axis.jsx";
declare function Annotation(props: {
    annotation: tannotation;
    xaxis: taxis;
    yaxis: taxis;
}): JSX.Element;
declare function deserialize(serialAnnotations: Array<tserialannotation>, axes: Map<string, taxis>): Map<string, tannotation>;
declare function serialize(annotations: Map<string, tannotation>): Array<tserialannotation>;
export default Annotation;
export { deserialize, serialize };
