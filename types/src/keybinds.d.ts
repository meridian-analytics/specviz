import type { ReactNode } from "react";
declare function Bindings(props: {
    children: ReactNode;
}): JSX.Element;
declare function Keypress(props: {
    bind: string;
    onKeyDown?: (e: KeyboardEvent) => void;
    onKeyUp?: (e: KeyboardEvent) => void;
}): JSX.Element;
export { Bindings, Keypress };
