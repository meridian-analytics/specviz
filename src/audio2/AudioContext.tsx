import * as R from "react"

const defaultContext = new AudioContext()

const Context = R.createContext(defaultContext)

export type ProviderProps = {
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  return <Context.Provider children={props.children} value={defaultContext} />
}

export function useContext() {
  return R.useContext(Context)
}
