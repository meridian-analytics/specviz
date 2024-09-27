import * as R from "react"
import * as RDC from "react-dom/client"
import * as RR from "react-router-dom"
import * as App from "./app"

const router = RR.createBrowserRouter([
  {
    path: "/",
    element: App.element,
  },
])

const root = document.getElementById("root")

if (root == null) throw Error("#root element not found")

RDC.createRoot(root).render(
  <R.StrictMode>
    <RR.RouterProvider router={router} />
  </R.StrictMode>,
)
