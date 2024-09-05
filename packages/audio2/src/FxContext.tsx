import * as R from "react"

export type Loop = [number, number]

export type Context = {
  hpf?: number
  lpf?: number
  loop?: Loop
}

const defaultContext: Context = {}

export const Context = R.createContext(defaultContext)

export const Provider = Context.Provider

export function useContext() {
  return R.useContext(Context)
}

export default defaultContext

export type TransformProps = {
  children: R.ReactNode
  fn: (context: Context) => Context
}

export function Transform(props: TransformProps) {
  const prev = R.useContext(Context)
  const next = R.useMemo(() => props.fn(prev), [prev, props.fn])
  return <Context.Provider children={props.children} value={next} />
}
