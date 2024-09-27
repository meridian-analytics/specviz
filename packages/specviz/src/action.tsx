import * as React from "react"
import type * as Hooks from "./hooks"

export type Action = Required<Hooks.UseMouseProps>

export type Context = Hooks.UseMouseProps

const defaultContext: Context = {}

const Context = React.createContext(defaultContext)

export type ProviderProps = Context & {
  children: React.ReactNode
}

export function Provider(props: ProviderProps) {
  const prev = React.useContext(Context)
  const next = React.useMemo(() => ({ ...prev, ...props }), [prev, props])
  return <Context.Provider children={props.children} value={next} />
}

export function useContext() {
  return React.useContext(Context)
}
