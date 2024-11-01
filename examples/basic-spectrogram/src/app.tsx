import * as Specviz from "@meridian-analytics/specviz"
import * as React from "react"

type Props = {
  spectrogram: string
  duration: number
}

export default function (props: Props) {
  const axes: Specviz.Axis.Context = React.useMemo(
    () => ({
      seconds: Specviz.Axis.time(0, props.duration),
      hertz: Specviz.Axis.frequency(20000, 0),
    }),
    [props.duration],
  )
  return (
    <Specviz.Axis.Provider value={axes}>
      <div
        style={{
          backgroundColor: "cornsilk",
          border: "1px solid burlywood",
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "80px 1fr",
          gridTemplateRows: "400px 20px",
          gridTemplateAreas: `
            "y viz"
            ". x"
          `,
          margin: "1.5rem 0",
          padding: "1rem",
        }}
      >
        <Specviz.Plane.Provider xaxis="seconds" yaxis="hertz">
          <div style={{ gridArea: "x" }}>
            <Specviz.Axis.Horizontal />
          </div>
          <div style={{ gridArea: "y" }}>
            <Specviz.Axis.Vertical />
          </div>
          <div style={{ gridArea: "viz" }}>
            <Specviz.Visualization src={props.spectrogram} />
          </div>
        </Specviz.Plane.Provider>
      </div>
    </Specviz.Axis.Provider>
  )
}
