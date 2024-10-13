import * as R from "react"
import * as RDC from "react-dom/client"
import * as App from "./app"

const root = document.getElementById("root")

if (root == null) throw Error("#root element not found")

RDC.createRoot(root).render(
  <R.StrictMode>
    <App.default
      audio="/audio.flac"
      spectrogram="/spectrogram.png"
      annotation="/example-basic-annotation.json"
    />
  </R.StrictMode>,
)
