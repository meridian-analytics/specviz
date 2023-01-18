import type { ttransportstate } from "./types"
import { useEffect } from "react"
import { Sound } from "pizzicato"
import { useSpecviz } from "./specviz"

function playState(offset: number, timeRef: number): ttransportstate {
  return { type: "play", offset, timeRef }
}

function stopState(offset: number): ttransportstate {
  return { type: "stop", offset }
}

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
                    return playState(t.offset, Date.now())
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
                    sound.stop()
                    return stopState(t.offset + (Date.now() - t.timeRef) / 1000)
                }
              })
            },
            seek: (offset: number) => {
              setTransportState(t => {
                switch(t.type) {
                  case "stop":
                    return stopState(offset)
                  case "play":
                    sound.stop()
                    sound.play(0, offset)
                    return playState(offset, Date.now())
                }
              })
            }
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
