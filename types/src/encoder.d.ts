/// <reference types="react" />
declare function Encoder(props: {
    state: number;
    setState: (nextState: number) => void;
    value: number;
    unit: string;
}): JSX.Element;
export default Encoder;
