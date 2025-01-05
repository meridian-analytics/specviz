import { expect, test } from "vitest"
import * as Undo from "../src/undo"

function fromSequence<T>(init: T, ...args: T[]) {
  return args.reduce((r, s) => Undo.setState(r, s), Undo.init(init))
}

function toSequence<T>(u: Undo.Undo<T>): T[] {
  return u.undo ? toSequence(Undo.undo(u)).concat([u.state]) : [u.state]
}

test("get state", () => {
  const A = {}
  const _0 = Undo.init(A)
  expect(_0.state).toBe(A)
})

test("setState", () => {
  const A = {}
  const B = {}
  const _0 = Undo.init(A)
  const _1 = Undo.setState(_0, B)
  expect(_1.state).toBe(B)
})

test("setState after undo", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.undo(_0)
  const _2 = Undo.setState(_1, "D")
  expect(toSequence(_2)).toStrictEqual(["A", "B", "D"])
})

test("setState after redo", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.undo(_0)
  const _2 = Undo.redo(_1)
  const _3 = Undo.setState(_2, "D")
  expect(toSequence(_3)).toStrictEqual(["A", "B", "C", "D"])
})

test("setState after replaceState", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.setState(_0, "D", _0.undo, _0.redo)
  const _2 = Undo.setState(_1, "E")
  expect(toSequence(_2)).toStrictEqual(["A", "B", "D", "E"])
})

test("setState after setState", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.setState(_0, "D")
  const _2 = Undo.setState(_1, "E")
  expect(toSequence(_2)).toStrictEqual(["A", "B", "C", "D", "E"])
})

test("setState does not mutate", () => {
  const _0 = Undo.init("A")
  const _1 = Undo.init("A")
  expect(_1).toStrictEqual(_0)
  Undo.setState(_1, "B")
  expect(_1).toStrictEqual(_0)
})

test("setState with same state is idempotent", () => {
  const A = {}
  const _0 = Undo.init(A)
  const _1 = Undo.setState(_0, A)
  expect(_1).toBe(_0)
  const _2 = Undo.init({ foo: 1 }, (p, q) => p.foo == q.foo)
  const _3 = Undo.setState(_2, { foo: 1 })
  expect(_3).toBe(_2)
})

test("replaceState", () => {
  const _0 = fromSequence("A", "B")
  const _1 = Undo.setState(_0, "C", _0.undo, _0.redo)
  expect(toSequence(_1)).toStrictEqual(["A", "C"])
})

test("replaceState after undo", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.undo(_0)
  const _2 = Undo.setState(_1, "D", _1.undo, _1.redo)
  expect(toSequence(_2)).toStrictEqual(["A", "D"])
})

test("replaceState after redo", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.undo(_0)
  const _2 = Undo.redo(_1)
  const _3 = Undo.setState(_2, "D", _2.undo, _2.redo)
  expect(toSequence(_3)).toStrictEqual(["A", "B", "D"])
})

test("replaceState after replaceState", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.setState(_0, "D", _0.undo, _0.redo)
  const _2 = Undo.setState(_1, "E", _1.undo, _1.redo)
  expect(toSequence(_2)).toStrictEqual(["A", "B", "E"])
})

test("replaceState after setState", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.setState(_0, "D")
  const _2 = Undo.setState(_1, "E", _1.undo, _1.redo)
  expect(toSequence(_2)).toStrictEqual(["A", "B", "C", "E"])
})

test("replaceState does not mutate", () => {
  const _0 = Undo.init("A")
  const _1 = Undo.init("A")
  expect(_1).toStrictEqual(_0)
  Undo.setState(_1, "B", _1.undo, _1.redo)
  expect(_1).toStrictEqual(_0)
})

test("replaceState does not add undo", () => {
  const _0 = Undo.init("A")
  const _1 = Undo.setState(_0, "B", _0.undo, _0.redo)
  expect(_1.undo).toBeNull()
})

test("replaceState with same state is idempotent", () => {
  const A = {}
  const _0 = Undo.init(A)
  const _1 = Undo.setState(_0, A, _0.undo, _0.redo)
  expect(_1).toBe(_0)
  const _2 = Undo.init({ foo: 1 }, (p, q) => p.foo == q.foo)
  const _3 = Undo.setState(_2, { foo: 1 }, _2.undo, _2.redo)
  expect(_3).toBe(_2)
})

test("can undo after setState", () => {
  const _0 = Undo.init("A")
  expect(_0.undo).toBeNull()
  const _1 = Undo.setState(_0, "B")
  expect(_1.undo).not.toBeNull()
})

test("can undo after undo", () => {
  const _0 = fromSequence("A", "B", "C")
  expect(_0.undo).not.toBeNull()
  const _1 = Undo.undo(_0)
  expect(_1.undo).not.toBeNull()
  const _2 = Undo.undo(_1)
  expect(_2.undo).toBeNull()
})

test("can undo after redo", () => {
  const _0 = fromSequence("A", "B")
  expect(_0.undo).not.toBeNull
  const _1 = Undo.undo(_0)
  expect(_1.undo).toBeNull()
  const _2 = Undo.redo(_1)
  expect(_2.undo).not.toBeNull
})

test("can redo after undo", () => {
  const _0 = fromSequence("A", "B")
  expect(_0.redo).toBeNull()
  const _1 = Undo.undo(_0)
  expect(_1.redo).not.toBeNull()
})

test("can redo after redo", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.undo(Undo.undo(_0))
  expect(_1.redo).not.toBeNull()
  const _2 = Undo.redo(_1)
  expect(_1.redo).not.toBeNull()
  const _3 = Undo.redo(_2)
  expect(_3.redo).toBeNull()
})

test("cannot undo initial state", () => {
  const _0 = Undo.init("A")
  expect(_0.undo).toBeNull()
})

test("cannot redo initial state", () => {
  const _0 = Undo.init(1)
  expect(_0.redo).toBeNull()
})

test("cannot redo final state", () => {
  const _0 = Undo.init("A")
  expect(_0.redo).toBeNull()
  const _1 = Undo.setState(_0, "B")
  expect(_0.redo).toBeNull()
  const _2 = Undo.undo(_1)
  expect(_2.redo).not.toBeNull()
  const _3 = Undo.redo(_2)
  expect(_3.redo).toBeNull()
})

test("undo after setState", () => {
  const A = {}
  const _0 = Undo.init(A)
  const _1 = Undo.setState(_0, "B")
  const _2 = Undo.undo(_1)
  expect(_2.state).toBe(A)
})

test("undo after redo", () => {
  const _0 = fromSequence("A", "B", "C")
  const _1 = Undo.undo(_0)
  expect(_1.state).toBe("B")
  const _2 = Undo.redo(_1)
  expect(_2.state).toBe("C")
  const _3 = Undo.undo(_2)
  expect(_1.state).toBe("B")
})

test("undo does not mutate", () => {
  const _0 = Undo.init("A")
  const _1 = Undo.init("A")
  expect(_1).toStrictEqual(_0)
  Undo.undo(_1)
  expect(_1).toStrictEqual(_0)
})

test("undo goes back to the initial state", () => {
  const _0 = fromSequence("A", "B", "C", "D")
  expect(_0.state).toBe("D")
  const _1 = Undo.undo(_0)
  expect(_1.state).toBe("C")
  const _2 = Undo.undo(_1)
  expect(_2.state).toBe("B")
  const _3 = Undo.undo(_2)
  expect(_3.state).toBe("A")
  expect(_3.undo).toBeNull()
})

test("undo on initial state is idempotent", () => {
  const _0 = Undo.init("A")
  expect(Undo.undo(_0)).toBe(_0)
  const _1 = fromSequence("A", "B")
  const _2 = Undo.undo(_1)
  const _3 = Undo.undo(_2)
  expect(_3).toBe(_2)
})

test("redo after undo", () => {
  const A = {}
  const B = {}
  const _0 = Undo.init(A)
  const _1 = Undo.setState(_0, B)
  const _2 = Undo.undo(_1)
  expect(_2.state).toBe(A)
  const _3 = Undo.redo(_2)
  expect(_3.state).toBe(B)
})

test("redo does not mutate", () => {
  const _0 = Undo.undo(fromSequence("A", "B"))
  const _1 = Undo.undo(fromSequence("A", "B"))
  expect(_1).toStrictEqual(_0)
  Undo.redo(_1)
  expect(_1).toStrictEqual(_0)
})

test("redo goes forward to the final state", () => {
  const _0 = fromSequence("A", "B", "C", "D")
  const _1 = Undo.undo(Undo.undo(Undo.undo(_0)))
  expect(_1.state).toBe("A")
  const _2 = Undo.redo(_1)
  expect(_2.state).toBe("B")
  const _3 = Undo.redo(_2)
  expect(_3.state).toBe("C")
  const _4 = Undo.redo(_3)
  expect(_4.state).toBe("D")
  expect(_4.redo).toBeNull()
})

test("redo on final state is idempotent", () => {
  const _0 = Undo.init("A")
  const _1 = Undo.redo(_0)
  expect(_1).toBe(_0)
  const _2 = Undo.setState(_1, "B")
  const _3 = Undo.redo(_2)
  expect(_3).toBe(_2)
  const _4 = Undo.setState(_3, "C", _3.undo, _3.redo)
  expect(_4.redo).toBeNull()
  const _5 = Undo.redo(_4)
  expect(_5).toBe(_4)
})
