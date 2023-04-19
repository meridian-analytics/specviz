import { useMemo } from "react"
import { tannotation, tserialannotation } from "./types.jsx"
import { taxis, computeRectInverse } from "./axis.jsx"
import { useSpecviz } from "./hooks.jsx"
import { logical } from "./rect.jsx"

function Annotation(props: {
  annotation: tannotation,
  xaxis: taxis,
  yaxis: taxis,
}) {
  const { annotation:a, xaxis, yaxis } = props
  const { selection } = useSpecviz()
  const lrect = useMemo(
    () => logical(a.rect, xaxis == a.xaxis, yaxis == a.yaxis),
    [a, xaxis, yaxis]
  )
  return <rect
    key={a.id}
    className={selection.has(a.id) ? "annotation annotation-selected" : "annotation"}
    x={String(lrect.x)}
    y={String(lrect.y)}
    width={String(lrect.width)}
    height={String(lrect.height)}
  />
}

function deserialize(serialAnnotations: Array<tserialannotation>, axes: Map<string, taxis>): Map<string, tannotation> {
  const state = new Map<string, tannotation>()
  for (const a of serialAnnotations) {
    const xaxis = axes.get(a.xunit)
    const yaxis = axes.get(a.yunit)
    if (xaxis == null || yaxis == null) {
      console.error("missing axis context for annotation:", a)
      continue
    }
    const rect = computeRectInverse(xaxis, yaxis, a.unit)
    state.set(a.id, { id: a.id, rect, unit: a.unit, xaxis, yaxis })
  }
  return state
}

function serialize(annotations: Map<string, tannotation>): Array<tserialannotation> {
  return Array.from(annotations.values(), a => ({
    id: a.id,
    unit: a.unit,
    xunit: a.xaxis.unit,
    yunit: a.yaxis.unit,
  }))
}

export default Annotation
export { deserialize, serialize }
