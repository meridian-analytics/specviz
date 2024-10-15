import * as R from "react"
import * as RDC from "react-dom/client"
import * as App from "./app"

const root = document.getElementById("root")

if (root == null) throw Error("#root element not found")

RDC.createRoot(root).render(
  <R.StrictMode>
    <App.default audio="/count_10.flac" spectrogram="/spectrogram_10.png" />
  </R.StrictMode>,
)
