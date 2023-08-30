/// <reference types="react" />
import { tregion } from "./types.js";
declare function Encoder(props: {
    state: number;
    setState: (nextState: number) => void;
    value: number;
    unit: string;
}): JSX.Element;
declare namespace Encoder {
    var X: (region: tregion) => JSX.Element;
    var X2: (region: tregion) => JSX.Element;
    var Y1: (region: tregion) => JSX.Element;
    var Y2: (region: tregion) => JSX.Element;
}
export default Encoder;
