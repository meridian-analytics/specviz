import { createContext } from "react"
import { tcontext } from "./types"

const SpecvizContext = createContext<tcontext>({
  input: {
    buttons: 0,
    alt: false,
    ctrl: false,
    focus: null,
    xaxis: null,
    yaxis: null,
  },
  mousedown: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseup: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseRect: { x: 0, y: 0, width: 0, height: 0 },
  unitDown: { x: 0, y: 0 },
  unitUp: { x: 0, y: 0 },
  scroll: { x: 0, y: 0 },
  zoom: { x: 0, y: 0 },
  playhead: { x: 0, y: 0 },
  regions: new Map(),
  regionCache: new Map(),
  selection: new Set(),
  command: {
    annotate: () => {
      throw Error("command.annotate called outside of Specviz context")
    },
    delete: () => {
      throw Error("command.delete called outside of Specviz context")
    },
    deselect: () => {
      throw Error("command.deselect called outside of Specviz context")
    },
    moveSelection: () => {
      throw Error("command.moveSelection called outside of Specviz context")
    },
    resetView: () => {
      throw Error("command.resetView called outside of Specviz context")
    },
    scroll: () => {
      throw Error("command.scroll called outside of Specviz context")
    },
    scrollTo: () => {
      throw Error("command.scrollTo called outside of Specviz context")
    },
    selectPoint: () => {
      throw Error("command.selectPoint called outside of Specviz context")
    },
    selectArea: () => {
      throw Error("command.selectArea called outside of Specviz context")
    },
    setRectX: () => {
      throw Error("command.setRectX called outside of Specviz context")
    },
    setRectX1: () => {
      throw Error("command.setRectX1 called outside of Specviz context")
    },
    setRectX2: () => {
      throw Error("command.setRectX2 called outside of Specviz context")
    },
    setRectY: () => {
      throw Error("command.setRectY called outside of Specviz context")
    },
    setRectY1: () => {
      throw Error("command.setRectY1 called outside of Specviz context")
    },
    setRectY2: () => {
      throw Error("command.setRectY2 called outside of Specviz context")
    },
    tool: () => {
      throw Error("command.tool called outside of Specviz context")
    },
    zoom: () => {
      throw Error("command.zoom called outside of Specviz context")
    },
    zoomPoint: () => {
      throw Error("command.zoomPoint called outside of Specviz context")
    },
    zoomArea: () => {
      throw Error("command.zoomArea called outside of Specviz context")
    },
  },
  toolState: "annotate",
  setRegions: _ => {
    throw Error("setRegions called outside of Specviz context")
  },
  setSelection: _ => {
    throw Error("setSelection called outside of Specviz context")
  },
})

export default SpecvizContext
