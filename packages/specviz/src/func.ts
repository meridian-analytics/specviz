export type InitialState<T> = T | (() => T)

export type SetStateAction<T> = T | ((prevState: T) => T)

export function applyInitialState<T>(fn: InitialState<T>): T {
  return fn instanceof Function ? fn() : fn
}

export function applySetState<T>(fn: SetStateAction<T>, value: T): T {
  return fn instanceof Function ? fn(value) : fn
}
