import * as R from "react"

export type Context = AudioBuffer

type State =
  | { kind: "loading" }
  | { kind: "error"; error: Error }
  | { kind: "loaded"; buffer: AudioBuffer }

type ProviderProps = {
  children: R.ReactNode
  fallback: R.ReactNode
  url: string
}

const defaultContext: Context = new AudioBuffer({
  length: 1,
  sampleRate: 44100,
})

const Context = R.createContext(defaultContext)

export function Provider(props: ProviderProps) {
  const [state, setState] = R.useState<State>({ kind: "loading" })
  R.useEffect(() => {
    let mounted = true
    fetch(props.url)
      .then(response => {
        if (response.ok) return response.arrayBuffer()
        throw Error(
          `Failed to load audio: ${response.status} ${response.statusText}`,
        )
      })
      .then(buffer => new AudioContext().decodeAudioData(buffer))
      .then(buffer => {
        if (mounted) setState({ kind: "loaded", buffer })
      })
      .catch(error => {
        if (mounted) setState({ kind: "error", error })
      })
    return () => {
      mounted = false
    }
  }, [props.url])
  if (state.kind === "loading") return props.fallback ?? <p>Loading audio...</p>
  if (state.kind === "error") throw state.error
  return <Context.Provider value={state.buffer} children={props.children} />
}

export function useContext() {
  return R.useContext(Context)
}
