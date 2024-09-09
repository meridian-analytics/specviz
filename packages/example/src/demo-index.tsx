import * as R from "react"
import * as RDC from "react-dom/client"
import * as RR from "react-router-dom"
import * as DemoAnnotation from "./demo-annotation"
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
        path: "/annotation",
        loader: DemoAnnotation.loader,
        element: DemoAnnotation.element,
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

const css = `
  body {
    background-color: seashell;
    background-image: 
      linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
      linear-gradient(180deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 1rem 1rem;
    color: #333;
    font-family: monospace; 
    margin: 0;
  }

  button {
    font-family: monospace;
    padding: 0.5rem;
    cursor: pointer;
  }

  button ~ button {
    margin-left: 0.5rem;
  }

  h3 {
    font-size: 1rem;
    margin: 0;
  }
`

function Demo() {
  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "2rem auto 0",
      }}
    >
      <style children={css} />
      <Navigation />
      <div
        style={{
          boxShadow: "0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.25)",
        }}
      >
        <RR.Outlet />
      </div>
    </div>
  )
}

function Navigation() {
  return (
    <nav
      style={{
        backgroundColor: "honeydew",
        border: "1px solid mediumseagreen",
        marginBottom: "1rem",
      }}
    >
      <ul style={{ padding: 0 }}>
        <NavLink to="/basic-png" children="Basic PNG" />
        <NavLink to="/basic-audio" children="Basic Audio" />
        <NavLink to="/interactive-png" children="Interactive PNG" />
        <NavLink to="/annotation" children="Annotation" />
        <NavLink to="/full" children="Full" />
      </ul>
    </nav>
  )
}

function NavLink(props: RR.LinkProps) {
  return (
    <li style={{ display: "inline-block", marginLeft: "0.5rem" }}>
      <RR.NavLink
        {...props}
        style={linkState =>
          linkState.isActive
            ? {
                backgroundColor: "mediumseagreen",
                color: "honeydew",
                padding: "0.5rem",
                textDecoration: "none",
              }
            : {
                color: "mediumseagreen",
                padding: "0.5rem",
              }
        }
      />
    </li>
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
