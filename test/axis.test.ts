import { test, expect } from "vitest"
import * as axis from "../src/axis.jsx"

test("axis.linear", () => {
  const t = axis.linear(-100, 100, "percent", String)
  expect(axis.computeUnit(t, 0.00)).toBe(-100)
  expect(axis.computeUnit(t, 0.25)).toBe(-50)
  expect(axis.computeUnit(t, 0.50)).toBe(0)
  expect(axis.computeUnit(t, 0.75)).toBe(50)
  expect(axis.computeUnit(t, 1.00)).toBe(100)
})

test("axis.nonlinear", () => {
  const t1 = axis.nonlinear([[0, 0], [.5, 10], [1, 100]], "percent", String)
  expect(axis.computeUnit(t1, 0.00)).toBe(0)
  expect(axis.computeUnit(t1, 0.25)).toBe(5)
  expect(axis.computeUnit(t1, 0.50)).toBe(10)
  expect(axis.computeUnit(t1, 0.75)).toBe(55)
  expect(axis.computeUnit(t1, 1.00)).toBe(100)

  const t2 = axis.nonlinear([[0, -10], [.1, 0], [.5, 10], [1, 0]], "percent", String)
  expect(axis.computeUnit(t2, 0.00)).toBe(-10)
  expect(axis.computeUnit(t2, 0.05)).toBe(-5)
  expect(axis.computeUnit(t2, 0.10)).toBe(0)
  expect(axis.computeUnit(t2, 0.30)).toBeCloseTo(5, 10)
  expect(axis.computeUnit(t2, 0.75)).toBe(5)
  expect(axis.computeUnit(t2, 1.00)).toBe(0)
})

test("axis.formatUnit", () => {
  const t1 = axis.linear(0, 100, "percent", String)
  expect(axis.formatUnit(t1, 50)).toBe("50")

  const t2 = axis.linear(0, 100, "percent", x => `foo ${x} bar`)
  expect(axis.formatUnit(t2, 99)).toBe("foo 99 bar")
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
    y: 20,
    width: 60,
    height: 19980,
  })
})
