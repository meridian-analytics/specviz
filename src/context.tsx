import { createContext } from "react"
import { tcontext } from "./types.jsx"
import { stop } from "./transport.jsx"

const SpecvizContext = createContext<tcontext>({
  annotations: new Map(),
  input: { buttons: 0, alt: false, ctrl: false, focus: null, xaxis: null, yaxis: null },
  mousedown: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseup: { abs: { x: 0, y: 0 }, rel: { x: 0, y: 0 } },
  mouseRect: { x: 0, y: 0, width: 0, height: 0 },
  unitDown: { x: 0, y: 0 },
  unitUp: { x: 0, y: 0 },
  scroll: { x: 0, y: 0 },
  zoom: { x: 0, y: 0 },
  playhead: { x: 0, y: 0 },
  selection: new Set(),
  command: {
    annotate: () => { console.error("command.annotate called outside of Specviz context") },
    delete: () => { console.error("command.delete called outside of Specviz context") },
    deselect: () => { console.error("command.deselect called outside of Specviz context") },
    moveSelection: () => { console.error("command.moveSelection called outside of Specviz context") },
    resetView: () => { console.error("command.resetView called outside of Specviz context") },
    scroll: () => { console.error("command.scroll called outside of Specviz context") },
    scrollTo: () => { console.error("command.scrollTo called outside of Specviz context") },
    selectPoint: () => { console.error("command.selectPoint called outside of Specviz context") },
    selectArea: () => { console.error("command.selectArea called outside of Specviz context") },
    setRectX: () => { console.error("command.setRectX called outside of Specviz context") },
    setRectX1: () => { console.error("command.setRectX1 called outside of Specviz context") },
    setRectX2: () => { console.error("command.setRectX2 called outside of Specviz context") },
    setRectY: () => { console.error("command.setRectY called outside of Specviz context") },
    setRectY1: () => { console.error("command.setRectY1 called outside of Specviz context") },
    setRectY2: () => { console.error("command.setRectY2 called outside of Specviz context") },
    tool: () => { console.error("command.tool called outside of Specviz context") },
    zoom: () => { console.error("command.zoom called outside of Specviz context") },
    zoomPoint: () => { console.error("command.zoomPoint called outside of Specviz context") },
    zoomArea: () => { console.error("command.zoomArea called outside of Specviz context") },
  },
  toolState: "annotate",
  transport: {
    play: () => { console.error("transport.play called outside of Specviz context") },
    loop: () => { console.error("transport.loop called outside of Specviz context") },
    stop: () => { console.error("transport.stop called outside of Specviz context") },
    seek: () => { console.error("transport.seek called outside of Specviz context") },
  },
  transportState: stop(0),
  setAnnotations: _ => { console.error("setAnnotations called outside of Specviz context") },
  setSelection: _ => { console.error("setSelection called outside of Specviz context") },
  setTransport: _ => { console.error("setTransport called outside of Specviz context") },
  setTransportState: _ => { console.error("setTransportState called outside of Specviz context") },
})

export default SpecvizContext
