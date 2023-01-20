import type { tannotation } from "./types"
import { percent } from "./mathx"

function Annotation(props: { annotation: tannotation }) {
  const { id, rect } = props.annotation
  return <rect
    key={id}
    className="annotation"
    x={percent(rect.x)}
    y={percent(rect.y)}
    width={percent(rect.width)}
    height={percent(rect.height)}
    rx="3"
  />
}


export default Annotation
