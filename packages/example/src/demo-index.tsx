import * as R from "react"
import * as RDC from "react-dom/client"
import * as RR from "react-router-dom"
import * as DemoBasicAudio from "./demo-basic-audio"
import * as DemoBasicPng from "./demo-basic-png"
import * as DemoFull from "./demo-full"
import * as DemoInteractivePng from "./demo-interactive-png"

const router = RR.createBrowserRouter([
  {
    element: <Demo />,
    errorElement: <ErrorMessage />,
    children: [
      {
        path: "/",
        loader: async () => RR.redirect("/full"),
      },
      {
        path: "/basic-png",
        element: DemoBasicPng.element,
      },
      {
        path: "/basic-audio",
        loader: DemoBasicAudio.loader,
        element: DemoBasicAudio.element,
      },
      {
        path: "/interactive-png",
        loader: DemoInteractivePng.loader,
        element: DemoInteractivePng.element,
      },
      {
        path: "/full",
        loader: DemoFull.loader,
        element: DemoFull.element,
      },
    ],
  },
])

function Demo() {
  return (
    <div id="demo">
      <link rel="stylesheet" href="./demo-index.css" />
      <RR.Outlet />
    </div>
  )
}

function ErrorMessage() {
  const error = RR.useRouteError() as Error
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "tomato" }}>{error.message}</pre>
      <RR.Link to="/" children="Go home" />
    </div>
  )
}

RDC.createRoot(document.getElementById("root") as HTMLElement).render(
  <R.StrictMode>
    <RR.RouterProvider router={router} />
  </R.StrictMode>,
)
