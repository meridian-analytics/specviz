import { ReactNode, createContext, useContext, useState, useCallback } from "react"

type tvector = { x: number, y: number }

type tfunctional<T> = (t: T) => T

type tcontext = {
  scroll: tvector,
  zoom: number,
  setScroll: (func: tfunctional<tvector>) => void,
  setZoom: (func: tfunctional<number>) => void,
}

type tprops = {
  children: ReactNode
}

const SpecvizContext = createContext<tcontext>({
  scroll: { x: 0, y: 0 },
  zoom: 1,
  setScroll: _ => { console.error("setScroll called outside of Specviz context") },
  setZoom: _ => { console.error("setZoom called outside of Specviz context") },
})

function Specviz(props: tprops) {
  const { children } = props
  const [scroll, setScroll] = useState<tvector>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  return <SpecvizContext.Provider value={{
    scroll,
    zoom,
    setScroll,
    setZoom,
  }}>
    {children}
  </SpecvizContext.Provider>
}

function useSpecviz() {
  return useContext(SpecvizContext)
}

export { Specviz, useSpecviz }
