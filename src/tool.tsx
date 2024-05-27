import * as R from "react"

type Tool = "annotate" | "select" | "zoom" | "pan"

type Context = {
  tool: Tool
  setTool: R.Dispatch<R.SetStateAction<Tool>>
}

const defaultContext: Context = {
  tool: "annotate",
  setTool() {
    throw Error("setTool called outside of context")
  },
}

const Context = R.createContext(defaultContext)

export type ProviderProps = {
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  const [tool, setTool] = R.useState(defaultContext.tool)
  return (
    <Context.Provider
      children={props.children}
      value={{
        tool,
        setTool,
      }}
    />
  )
}

export function useContext() {
  return R.useContext(Context)
}
