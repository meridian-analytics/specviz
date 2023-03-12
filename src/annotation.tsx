import { tannotation, taxis } from "./types"
import { useMemo } from "react"
import { useSpecviz } from "./hooks"
import { logical } from "./rect"

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
