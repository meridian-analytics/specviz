import * as R from "react"
import * as Axis from "./axis"
import type * as Format from "./format"
import * as Hooks from "./hooks"
import * as Note from "./note"
import * as Rect from "./rect"

const min = (5 * Math.PI) / 4
const max = -Math.PI / 4

export enum EncodeDirection {
  CounterClockwise = -1,
  Clockwise = 1,
}

export type EncoderProps = {
  direction?: EncodeDirection
  format?: Format.FormatFn
  label?: boolean | string
  setState: (nextState: number) => void
  state: number
  unit: string
  value: number
}

export type FieldEncoderProps = {
  format?: EncoderProps["format"]
  label?: EncoderProps["label"]
  region: Note.Region
  direction?: EncoderProps["direction"]
}

export default function Encoder(props: EncoderProps) {
  const ref = R.useRef<null | SVGSVGElement>(null)

  const { x, y } = R.useMemo(() => {
    const rad = min - props.state * (min - max)
    return { x: (Math.cos(rad) * 4) / 5, y: (-Math.sin(rad) * 4) / 5 }
  }, [props.state])

  const onWheel: Hooks.UseMouseWheelHandler = R.useCallback(
    ({ dy, event }) => {
      props.setState(
        (dy * (props.direction ?? EncodeDirection.Clockwise)) /
          (event.ctrlKey || event.metaKey ? 1000 : 100),
      )
    },
    [props.setState, props.direction],
  )

  Hooks.useWheel(ref, onWheel)

  return (
    <svg ref={ref} width="60" height="60" viewBox="-1.1 -1.1 2.2 2.2">
      <path
        className="encoder"
        d={`
      M ${Math.cos(min)} ${-Math.sin(min)}
      A 1 1 0 1 1 ${Math.cos(max)} ${-Math.sin(max)}
    `}
      />
      <circle className="encoder-marker" cx={x} cy={y} r="0.10" />
      <text
        className="encoder-text"
        textAnchor="middle"
        x="0"
        y="0.15"
        children={props.format?.(props.value) ?? props.value.toFixed(2)}
      />
      {props.label && (
        <text
          className="encoder-text"
          textAnchor="middle"
          x="0"
          y="0.45"
          children={props.label == true ? props.unit : props.label}
        />
      )}
    </svg>
  )
}

Encoder.X = function EncoderX(props: FieldEncoderProps) {
  const axis = Axis.useContext()
  const note = Note.useContext()
  const rect = Note.computeRectInverse(props.region, axis)
  return (
    <Encoder
      direction={props.direction}
      format={props.format}
      label={props.label}
      setState={v =>
        note.move(new Set([props.region.id]), rect => Rect.setX(rect, v))
      }
      state={rect.x}
      unit={props.region.xunit}
      value={props.region.x}
    />
  )
}

Encoder.X2 = function EncoderX2(props: FieldEncoderProps) {
  const axis = Axis.useContext()
  const note = Note.useContext()
  const rect = Note.computeRectInverse(props.region, axis)
  return (
    <Encoder
      direction={props.direction}
      format={props.format}
      label={props.label}
      setState={v =>
        note.move(new Set([props.region.id]), rect => Rect.setX2(rect, v))
      }
      state={rect.width}
      unit={props.region.xunit}
      value={props.region.width}
    />
  )
}

Encoder.Y1 = function EncoderY1(props: FieldEncoderProps) {
  const axis = Axis.useContext()
  const note = Note.useContext()
  const rect = Note.computeRectInverse(props.region, axis)
  return (
    <Encoder
      direction={props.direction}
      format={props.format}
      label={props.label}
      setState={v =>
        note.move(new Set([props.region.id]), rect => Rect.setY1(rect, v))
      }
      state={1 - rect.y}
      unit={props.region.yunit}
      value={props.region.y + props.region.height}
    />
  )
}

Encoder.Y2 = function EncoderY2(props: FieldEncoderProps) {
  const axis = Axis.useContext()
  const note = Note.useContext()
  const rect = Note.computeRectInverse(props.region, axis)
  return (
    <Encoder
      direction={props.direction}
      format={props.format}
      label={props.label}
      setState={v =>
        note.move(new Set([props.region.id]), rect => Rect.setY2(rect, v))
      }
      state={1 - rect.y - rect.height}
      unit={props.region.yunit}
      value={props.region.y}
    />
  )
}
