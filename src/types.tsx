import * as Rect from "./rect"

// todo: unused
export type tserialannotation = {
  id: string
  // biome-ignore lint/suspicious/noExplicitAny: user data
  fields: Record<string, any>
  unit: Rect.trect
  xunit: string
  yunit: string
}

export interface tregion {
  id: string
  x: number
  y: number
  width: number
  height: number
  xunit: string
  yunit: string
}
