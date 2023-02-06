import type { tannotation } from "./types"
import { useSpecviz } from "./specviz"

function Annotation(props: { annotation: tannotation }) {
  const { selection } = useSpecviz()
  const { id, rect } = props.annotation
  return <rect
    key={id}
    className={selection.has(props.annotation) ? "annotation annotation-selected" : "annotation"}
    x={String(rect.x)}
    y={String(rect.y)}
    width={String(rect.width)}
    height={String(rect.height)}
  />
}

export default Annotation
