type thunk<T> = {
    computed: false;
    value: () => T;
} | {
    computed: true;
    value: T;
};
declare function thunk<T>(fn: () => T): thunk<T>;
declare function force<T>(t: thunk<T>): T;
export { thunk, force };
