import * as R from "react"

export type Context = AudioContext

export type ProviderProps = {
  children: R.ReactNode
}

const defaultContext: Context = new AudioContext()

const Context = R.createContext(defaultContext)

export function Provider(props: ProviderProps) {
  return <Context.Provider children={props.children} value={defaultContext} />
}

export function useContext() {
  return R.useContext(Context)
}
