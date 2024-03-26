import * as R from "react"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Region from "./region"

export type ProviderProps = {
  axes: Axis.Context
  children: R.ReactNode
  regions?: Region.Context["regions"]
  selection?: Region.Context["selection"]
  setRegions?: Region.Context["setRegions"]
  setSelection?: Region.Context["setSelection"]
}

export function Provider(props: ProviderProps) {
  return (
    <Input.Provider>
      <Axis.Provider value={props.axes}>
        <Region.Provider
          regions={props.regions}
          selection={props.selection}
          setRegions={props.setRegions}
          setSelection={props.setSelection}
        >
          {props.children}
        </Region.Provider>
      </Axis.Provider>
    </Input.Provider>
  )
}

export const useAxis = Axis.useContext
export const useInput = Input.useContext
export const useRegions = Region.useContext
