import * as Func from "./func"

export type Undo<T> = {
  equal: EqualFn<T>
  state: T
  undo: List<T>
  redo: List<T>
}

export type EqualFn<T> = (p: T, q: T) => boolean

export function init<T>(
  state: Func.InitialState<T>,
  equalFn?: EqualFn<T>,
  undo?: List<T>,
  redo?: List<T>,
): Undo<T> {
  return {
    equal: equalFn ?? Object.is,
    state: Func.applyInitialState(state),
    undo: undo ?? empty,
    redo: redo ?? empty,
  }
}

export function setState<T>(
  s: Undo<T>,
  state: T,
  undo?: List<T>,
  redo?: List<T>,
): Undo<T> {
  if (s.equal(s.state, state)) return s
  return {
    equal: s.equal,
    state,
    undo: undo === undefined ? cons(s.state, s.undo) : undo,
    redo: redo === undefined ? empty : redo,
  }
}

export function undo<T>(s: Undo<T>): Undo<T> {
  if (s.undo == empty) return s
  return {
    equal: s.equal,
    state: s.undo.value,
    undo: s.undo.next,
    redo: cons(s.state, s.redo),
  }
}

export function redo<T>(s: Undo<T>): Undo<T> {
  if (s.redo == empty) return s
  return {
    equal: s.equal,
    state: s.redo.value,
    undo: cons(s.state, s.undo),
    redo: s.redo.next,
  }
}

// internals
type List<T> = null | { value: T; next: List<T> }

const empty = null

function cons<T>(value: T, next: List<T>): List<T> {
  return { value, next }
}
