import { expect, test } from "vitest"
import * as axis from "../src/axis"

test("axis.linear zero to positive", () => {
  const t = axis.linear(0, 100, "percent", String)
  expect(axis.computeUnit(t, -0.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnit(t, 0.0)).toBe(0)
  expect(axis.computeUnit(t, 0.25)).toBe(25)
  expect(axis.computeUnit(t, 0.5)).toBe(50)
  expect(axis.computeUnit(t, 0.75)).toBe(75)
  expect(axis.computeUnit(t, 1.0)).toBe(100)
  expect(axis.computeUnit(t, 1.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, -1)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, 0)).toBe(0.0)
  expect(axis.computeUnitInverse(t, 25)).toBe(0.25)
  expect(axis.computeUnitInverse(t, 50)).toBe(0.5)
  expect(axis.computeUnitInverse(t, 75)).toBe(0.75)
  expect(axis.computeUnitInverse(t, 100)).toBe(1.0)
  expect(axis.computeUnitInverse(t, 101)).toBe(Number.NEGATIVE_INFINITY)
})

test("axis.linear postive to zero", () => {
  const t = axis.linear(100, 0, "percent", String)
  expect(axis.computeUnit(t, -0.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnit(t, 0.0)).toBe(100)
  expect(axis.computeUnit(t, 0.25)).toBe(75)
  expect(axis.computeUnit(t, 0.5)).toBe(50)
  expect(axis.computeUnit(t, 0.75)).toBe(25)
  expect(axis.computeUnit(t, 1.0)).toBe(0)
  expect(axis.computeUnit(t, 1.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, 101)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, 100)).toBe(0.0)
  expect(axis.computeUnitInverse(t, 75)).toBe(0.25)
  expect(axis.computeUnitInverse(t, 50)).toBe(0.5)
  expect(axis.computeUnitInverse(t, 25)).toBe(0.75)
  expect(axis.computeUnitInverse(t, 0)).toBe(1.0)
  expect(axis.computeUnitInverse(t, -1)).toBe(Number.NEGATIVE_INFINITY)
})

test("axis.linear negative to positive", () => {
  const t = axis.linear(-100, 100, "percent", String)
  expect(axis.computeUnit(t, -0.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnit(t, 0.0)).toBe(-100)
  expect(axis.computeUnit(t, 0.25)).toBe(-50)
  expect(axis.computeUnit(t, 0.5)).toBe(0)
  expect(axis.computeUnit(t, 0.75)).toBe(50)
  expect(axis.computeUnit(t, 1.0)).toBe(100)
  expect(axis.computeUnit(t, 1.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, -101)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, -100)).toBe(0.0)
  expect(axis.computeUnitInverse(t, -50)).toBe(0.25)
  expect(axis.computeUnitInverse(t, 0)).toBe(0.5)
  expect(axis.computeUnitInverse(t, 50)).toBe(0.75)
  expect(axis.computeUnitInverse(t, 100)).toBe(1.0)
  expect(axis.computeUnitInverse(t, 101)).toBe(Number.NEGATIVE_INFINITY)
})

test("axis.linear positive to negative", () => {
  const t = axis.linear(100, -100, "percent", String)
  expect(axis.computeUnit(t, -0.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnit(t, 0.0)).toBe(100)
  expect(axis.computeUnit(t, 0.25)).toBe(50)
  expect(axis.computeUnit(t, 0.5)).toBe(0)
  expect(axis.computeUnit(t, 0.75)).toBe(-50)
  expect(axis.computeUnit(t, 1.0)).toBe(-100)
  expect(axis.computeUnit(t, 1.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, 101)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, 100)).toBe(0.0)
  expect(axis.computeUnitInverse(t, 50)).toBe(0.25)
  expect(axis.computeUnitInverse(t, 0)).toBe(0.5)
  expect(axis.computeUnitInverse(t, -50)).toBe(0.75)
  expect(axis.computeUnitInverse(t, -100)).toBe(1.0)
  expect(axis.computeUnitInverse(t, -101)).toBe(Number.NEGATIVE_INFINITY)
})

test("axis.nonlinear zero to positive", () => {
  const t = axis.nonlinear([0, 10, 100], "percent", String)
  expect(axis.computeUnit(t, -0.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnit(t, 0.0)).toBe(0)
  expect(axis.computeUnit(t, 0.25)).toBe(5)
  expect(axis.computeUnit(t, 0.5)).toBe(10)
  expect(axis.computeUnit(t, 0.75)).toBe(55)
  expect(axis.computeUnit(t, 1.0)).toBe(100)
  expect(axis.computeUnit(t, 1.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, -1)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, 0)).toBe(0.0)
  expect(axis.computeUnitInverse(t, 5)).toBe(0.25)
  expect(axis.computeUnitInverse(t, 10)).toBe(0.5)
  expect(axis.computeUnitInverse(t, 55)).toBe(0.75)
  expect(axis.computeUnitInverse(t, 100)).toBe(1.0)
  expect(axis.computeUnitInverse(t, 101)).toBe(Number.NEGATIVE_INFINITY)
})

test("axis.nonlinear positive to zero", () => {
  const t = axis.nonlinear([100, 10, 0], "percent", String)
  expect(axis.computeUnit(t, -0.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnit(t, 0.0)).toBe(100)
  expect(axis.computeUnit(t, 0.25)).toBe(55)
  expect(axis.computeUnit(t, 0.5)).toBe(10)
  expect(axis.computeUnit(t, 0.75)).toBe(5)
  expect(axis.computeUnit(t, 1.0)).toBe(0)
  expect(axis.computeUnit(t, 1.01)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, 101)).toBe(Number.NEGATIVE_INFINITY)
  expect(axis.computeUnitInverse(t, 100)).toBe(0.0)
  expect(axis.computeUnitInverse(t, 55)).toBe(0.25)
  expect(axis.computeUnitInverse(t, 10)).toBe(0.5)
  expect(axis.computeUnitInverse(t, 5)).toBe(0.75)
  expect(axis.computeUnitInverse(t, 0)).toBe(1.0)
  expect(axis.computeUnitInverse(t, -1)).toBe(Number.NEGATIVE_INFINITY)
})

test("axis.nonlinear less than 2 stops", () => {
  expect(() => axis.nonlinear([])).toThrow()
  expect(() => axis.nonlinear([4])).toThrow()
})

test("axis.formatUnit", () => {
  const t1 = axis.linear(0, 100, "percent", String)
  expect(t1.format(50)).toBe("50")

  const t2 = axis.linear(0, 100, "percent", x => `foo ${x} bar`)
  expect(t2.format(99)).toBe("foo 99 bar")
})

test("axis.computeUnit isomorphic", () => {
  const t = axis.nonlinear([100, 10, 0], "percent", String)
  expect(axis.computeUnit(t, axis.computeUnitInverse(t, 55))).toBe(55)
  expect(axis.computeUnitInverse(t, axis.computeUnit(t, 0.25))).toBe(0.25)
})

test("axis.computeRect", () => {
  const xaxis = axis.linear(0, 60, "seconds", String)
  const yaxis = axis.linear(20, 20000, "hertz", String)
  const rect = { x: 0, y: 0, width: 1, height: 1 }
  expect(axis.computeRect(xaxis, yaxis, rect)).toEqual({
    x: 0,
    y: 20,
    width: 60,
    height: 19980,
  })
})

test("axis.computeRect normalized", () => {
  const xaxis = axis.linear(0, 60, "seconds", String)
  const yaxis = axis.linear(20000, 20, "hertz", String) // inverse Y
  const rect = { x: 0, y: 0, width: 1, height: 1 }
  expect(axis.computeRect(xaxis, yaxis, rect)).toEqual({
    x: 0,
    y: 20, // normalized
    width: 60,
    height: 19980, // normalized
  })
})

test("axis.computeRectInverse", () => {
  const xaxis = axis.linear(0, 60, "seconds", String)
  const yaxis = axis.linear(20, 20000, "hertz", String)
  const rect = { x: 0, y: 20, width: 60, height: 19980 }
  expect(axis.computeRectInverse(xaxis, yaxis, rect)).toEqual({
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  })
})
