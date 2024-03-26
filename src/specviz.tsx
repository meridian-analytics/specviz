import * as R from "react"
import * as Axis from "./axis"
import * as Input from "./input"
import * as Region from "./region"

export type ProviderProps = {
  axes: Record<string, Axis.taxis>
  children: R.ReactNode
  initialRegions?: Region.Regions
  initialSelection?: Region.Selection
}

export function Provider(props: ProviderProps) {
  return (
    <Input.Provider>
      <Axis.Provider value={props.axes}>
        <Region.Provider
          initialRegions={props.initialRegions}
          initialSelection={props.initialSelection}
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
