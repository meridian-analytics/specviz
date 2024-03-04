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