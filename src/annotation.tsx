import { useMemo } from "react"
import { taxis } from "./axis.jsx"
import { useSpecviz } from "./hooks.jsx"
import { logical } from "./rect.jsx"
import { tregion } from "./types.jsx"

function Annotation(props: {
  region: tregion
  xaxis: taxis
  yaxis: taxis
}) {
  const { region, xaxis, yaxis } = props
  const { selection, regionCache } = useSpecviz()
  const lrect = useMemo(
    () => {
      const rect = regionCache.get(region.id)!
      return logical(rect, xaxis.unit == region.xunit, yaxis.unit == region.yunit)
    },
    [region, xaxis, yaxis]
  )
  return <rect
    key={region.id}
    className={selection.has(region.id) ? "annotation annotation-selected" : "annotation"}
    x={String(lrect.x)}
    y={String(lrect.y)}
    width={String(lrect.width)}
    height={String(lrect.height)}
  />
}

export default Annotation
