import { test, expect } from "vitest"
import { linear } from "../src/axis.jsx"
import { deserialize, serialize } from "../src/annotation.jsx"
import { tannotation, tserialannotation } from "../src/types.js"

const xaxis = linear(0, 60, "seconds", String)
const yaxis = linear(20000, 20, "hertz", String)

const serialized: Array<tserialannotation> = [
  {
    id: "one",
    fields: { foo: "bar" },
    unit: { x: 0, y: 20, width: 60, height: 19980 },
    xunit: "seconds",
    yunit: "hertz",
  },
  {
    id: "two",
    fields: {},
    unit: { x: 15, y: 5015, width: 30, height: 9990 },
    xunit: "seconds",
    yunit: "hertz",
  },
]

const deserialized: Map<string, tannotation> = new Map([
  ["one", {
    id: "one",
    fields: { foo: "bar" },
    rect: { x: 0, y: 0, width: 1, height: 1 },
    unit: { x: 0, y: 20, width: 60, height: 19980 },
    xaxis,
    yaxis,
  }],
  ["two", {
    id: "two",
    fields: {},
    rect: { x: 0.25, y: 0.25, width: 0.5, height: 0.5 },
    unit: { x: 15, y: 5015, width: 30, height: 9990 },
    xaxis,
    yaxis,
  }]
])

test("annotation.deserialize", () => {
  const actual = deserialize(serialized, new Map([["seconds", xaxis], ["hertz", yaxis]]))
  expect(actual.size).toBe(2)
  expect(actual).toEqual(deserialized)
})

test("annotation.serialize", () => {
  const actual = serialize(deserialized)
  expect(actual.length).toBe(2)
  expect(actual).toEqual(serialized)
})
