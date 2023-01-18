import { useEffect } from "react"
import { Sound } from "pizzicato"
import { useSpecviz } from "./specviz"

function Audio(props: {
  url: string,
}) {
  const { url } = props
  const { setTransport, setTransportState } = useSpecviz()

  useEffect(
    () => {
      const sound = new Sound(
        url,
        err => {
          if (err) return console.error(err)
          setTransport({
            play: () => {
              setTransportState(t => {
                switch(t.type) {
                  case "stop":
                    sound.play(0, t.offset)
                    return { type: "play", offset: t.offset, timeRef: Date.now() }
                  case "play":
                    return t
                }
              })
            },
            stop: () => {
              setTransportState(t => {
                switch(t.type) {
                  case "stop":
                    return t
                  case "play":
                    sound.pause()
                    return { type: "stop", offset: t.offset + (Date.now() - t.timeRef) / 1000 }
                }
              })
            },
          })
        }
      )
      return () => {
        sound.stop()
      }
    },
    [url]
  )

  return <></>
}

export default Audio
