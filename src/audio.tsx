import type { ttransportstate } from "./types"
import { useCallback, useEffect } from "react"
import { Sound } from "pizzicato"
import { useSpecviz } from "./specviz"
import { useAnimationFrame } from "./hooks"

function playState(progress: number, timeRef: number): ttransportstate {
  return { type: "play", progress, timeRef }
}

function stopState(progress: number): ttransportstate {
  return { type: "stop", progress }
}

function Audio(props: {
  url: string,
}) {
  const { duration, playhead, transportState, setTransport, setTransportState } = useSpecviz()

  useAnimationFrame(useCallback(
    () => {
      switch (transportState.type) {
        case "stop":
          playhead.x = transportState.progress
          break
        case "play":
          const delta = (Date.now() - transportState.timeRef) / 1000
          playhead.x = transportState.progress + delta / duration
          break
      }
    },
    [transportState, duration]
  ))

  useEffect(
    () => {
      const sound = new Sound(
        props.url,
        err => {
          if (err) return console.error(err)
          setTransport({
            play: () => {
              setTransportState(t => {
                switch(t.type) {
                  case "stop":
                    sound.play(0, t.progress * duration)
                    return playState(t.progress, Date.now())
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
                    const delta = (Date.now() - t.timeRef) / 1000
                    return stopState(t.progress + delta / duration)
                }
              })
            },
            seek: (progress) => {
              setTransportState(t => {
                switch(t.type) {
                  case "stop":
                    return stopState(progress)
                  case "play":
                    sound.stop()
                    sound.play(0, progress * duration)
                    return playState(progress, Date.now())
                }
              })
            }
          })
        }
      )
      return () => {
        // preserve playhead location on audio unmount
        setTransportState(t => {
          switch(t.type) {
            case "stop":
              return t
            case "play":
              sound.stop()
              const delta = (Date.now() - t.timeRef) / 1000
              return stopState(t.progress + delta / duration)
          }
        })
      }
    },
    [props.url, duration]
  )

  return <></>
}

export default Audio
