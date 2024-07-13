import * as React from "react"
import type * as Hooks from "./hooks"

export type Tool = "annotate" | "select" | "zoom" | "pan"

export type Actions = Hooks.UseMouseProps

export type Context = {
  actions: Actions
  tool: Tool
  setTool: React.Dispatch<React.SetStateAction<Tool>>
}

const defaultContext: Context = {
  actions: {},
  tool: "annotate",
  setTool() {
    throw Error("setTool called outside of context")
  },
}

const Context = React.createContext(defaultContext)

export type ProviderProps = {
  actions?: Actions
  children: React.ReactNode
  initialTool?: Tool
}

export function Provider(props: ProviderProps) {
  const [tool, setTool] = React.useState(
    props.initialTool ?? defaultContext.tool,
  )
  const actions = props.actions ?? defaultContext.actions
  const value = React.useMemo<Context>(() => {
    return {
      actions,
      tool,
      setTool,
    }
  }, [actions, tool])
  return <Context.Provider children={props.children} value={value} />
}

export function useContext() {
  return React.useContext(Context)
}
export type TransformProps = {
  fn: (tool: Tool) => Context["actions"]
  children: React.ReactNode
}

export function Transform(props: TransformProps) {
  const context = useContext()
  const actions = React.useMemo<Actions>(() => {
    return props.fn(context.tool)
  }, [context.tool, props.fn])

  return (
    <Context.Provider
      children={props.children}
      value={{ ...context, actions: { ...context.actions, ...actions } }}
    />
  )
}
