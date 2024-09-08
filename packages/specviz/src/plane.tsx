import * as R from "react"
import * as Axis from "./axis"

export type Context = {
  xaxis: Axis.Axis
  yaxis: Axis.Axis
}

const defaultContext: Context = {
  xaxis: Axis.linear(0, 100, "x"),
  yaxis: Axis.linear(0, 100, "y"),
}

const Context = R.createContext(defaultContext)

export type ProviderProps = {
  children: R.ReactNode
  xaxis: string
  yaxis: string
}

export function Provider(props: ProviderProps) {
  const axes = Axis.useContext()
  const xaxis = axes[props.xaxis]
  const yaxis = axes[props.yaxis]
  if (xaxis == null) throw Error(`axis not found: ${props.xaxis}`)
  if (yaxis == null) throw Error(`axis not found: ${props.yaxis}`)
  return (
    <Context.Provider
      children={props.children}
      value={{
        xaxis,
        yaxis,
      }}
    />
  )
}

export function useContext() {
  return R.useContext(Context)
}
