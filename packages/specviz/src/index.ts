// types
export { type AnnotationProps } from "./annotation"
export { type taxis as Axis, type Context as Axes } from "./axis"
export {
  type UseMouseClickHandler,
  type UseMouseContextMenuHandler,
  type UseMouseMoveHandler,
  type UseMouseRectHandler,
  type UseMouseWheelHandler,
} from "./hooks"
export { type NavigatorProps } from "./navigator"
export {
  type Region,
  type RegionState,
  type RegionValue,
  type SelectionState,
  SelectionMode, // enum
} from "./region"
export {
  ZoomDirection, // enum
} from "./viewport"
export { type VisualizationProps } from "./visualization"

// components
export { default as Encoder } from "./encoder"
export { Keypress, Bindings } from "./keybinds"
export { default as Navigator } from "./navigator"
export { default as Visualization } from "./visualization"

// contexts
export * as AxisContext from "./axis"
export * as FocusContext from "./focus"
export * as InputContext from "./input"
export * as PlaneContext from "./plane"
export * as RegionContext from "./region"
export * as ToolContext from "./tool"
export * as ViewportContext from "./viewport"

export { Provider as AxisProvider } from "./axis"
export { Provider as FocusProvider } from "./focus"
export { Provider as InputProvider } from "./input"
export { Provider as PlaneProvider } from "./plane"
export { Provider as RegionProvider } from "./region"
export { Provider as ToolProvider } from "./tool"
export { Provider as ViewportProvider } from "./viewport"

export { useContext as useAxis } from "./axis"
export { useContext as useFocus } from "./focus"
export { useContext as useInput } from "./input"
export { useContext as usePlane } from "./plane"
export { useContext as useRegion } from "./region"
export { useContext as useTool } from "./tool"
export { useContext as useViewport } from "./viewport"

// hooks
export { useAnimationFrame, useMouse } from "./hooks"

// package
import pkg from "../../../package.json"
export const version = pkg.version
