import { useMemo } from "react"
import { tannotation, taxis } from "./types.jsx"
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

export default Annotation
