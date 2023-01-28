import type { tannotation } from "./types"

function Annotation(props: { annotation: tannotation }) {
  const { id, rect } = props.annotation
  return <rect
    key={id}
    className="annotation"
    x={String(rect.x)}
    y={String(rect.y)}
    width={String(rect.width)}
    height={String(rect.height)}
  />
}


export default Annotation
