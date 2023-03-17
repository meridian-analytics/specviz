type tvector2 = {
    x: number;
    y: number;
};
declare function magnitude(a: tvector2): number;
declare function subtract(a: tvector2, b: tvector2): tvector2;
export type { tvector2 };
export { magnitude, subtract };
