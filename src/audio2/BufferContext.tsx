import * as R from "react"

const defaultContext = new AudioBuffer({ length: 1, sampleRate: 44100 })

const Context = R.createContext(defaultContext)

type ProviderProps = {
  url: string
  children: R.ReactNode
}

export function Provider(props: ProviderProps) {
  const [buffer, setBuffer] = R.useState<null | AudioBuffer>(null)
  R.useEffect(() => {
    fetch(props.url)
      .then(response => response.arrayBuffer())
      .then(buffer => new AudioContext().decodeAudioData(buffer))
      .then(buffer => setBuffer(buffer))
      .catch(console.error)
  }, [props.url])
  if (buffer == null) return <p>Loading audio...</p>
  return <Context.Provider value={buffer} children={props.children} />
}

export function useContext() {
  return R.useContext(Context)
}
