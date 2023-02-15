import { tannotation, tnullable, ttransportstate } from "./types"
import { useCallback, useEffect, useRef } from "react"
import { Sound, Effects } from "pizzicato"
import { useSpecviz } from "./specviz"
import { useAnimationFrame } from "./hooks"
import { trect } from "./rect"

const LPF = 22000
const HPF = 0

function playState(progress: number, timeRef: number): ttransportstate {
  return { type: "play", progress, timeRef }
}

function stopState(progress: number): ttransportstate {
  return { type: "stop", progress }
}

function loopState(progress: number, timeRef: number, annotation: tannotation): ttransportstate {
  return { type: "loop", progress, timeRef, annotation }
}

function Audio(props: {
  url: string,
}) {
  const { annotations, duration, playhead, transportState, setTransport, setTransportState } = useSpecviz()
  const sound = useRef<tnullable<Sound>>(null)
  const fxLPF = useRef(new Effects.LowPassFilter({ frequency: LPF, peak: 10 }))
  const fxHPF = useRef(new Effects.HighPassFilter({ frequency: HPF, peak: 10 }))

  useAnimationFrame(useCallback(
    () => {
      let delta: number
      let focus: tannotation | undefined
      let rect: trect
      let unit: trect
      switch (transportState.type) {
        case "stop":
          // frequency filter
          fxHPF.current.frequency = HPF
          fxLPF.current.frequency = LPF
          // playhead
          playhead.x = transportState.progress
          break
        case "play":
          // frequency filter
          fxHPF.current.frequency = HPF
          fxLPF.current.frequency = LPF
          // playhead
          delta = (Date.now() - transportState.timeRef) / 1000
          playhead.x = transportState.progress + delta / duration
          break
        case "loop":
          // playhead
          delta = (Date.now() - transportState.timeRef) / 1000
          playhead.x = transportState.progress + delta / duration
          // transport annotation could be stale
          focus = annotations.get(transportState.annotation.id) // todo: antipattern?
          if (focus == null) return stop() // focus was deleted, stop audio
          rect = focus.rect
          unit = focus.unit
          // frequency filter
          if (focus.yaxis.unit === "hertz") {
            fxHPF.current.frequency = unit.y
            fxLPF.current.frequency = unit.y + unit.height
          }
          else {
            fxHPF.current.frequency = HPF
            fxLPF.current.frequency = LPF
          }
          // loop
          if (playhead.x < rect.x || playhead.x >= rect.x + rect.width) {
            loop(focus)
          }
          break
      }
    },
    [annotations, transportState, duration]
  ))

  const play = useCallback(
    () => {
      setTransportState(t => {
        if (sound.current == null) return t
        switch(t.type) {
          case "stop":
            sound.current.play(0, t.progress * duration)
            return playState(t.progress, Date.now())
          case "play":
          case "loop":
            return t
        }
      })
    },
    [sound, duration]
  )

  const loop = useCallback(
    (annotation: tannotation) => {
      const { rect, unit } = annotation
      setTransportState(t => {
        if (sound.current == null) return t
        sound.current.stop()
        sound.current.play(0, unit.x)
        return loopState(rect.x, Date.now(), annotation)
      })
    },
    [duration]
  )

  const stop = useCallback(
    () => {
      setTransportState(t => {
        if (sound.current == null) return t
        switch(t.type) {
          case "stop":
            return t
          case "play":
          case "loop":
            sound.current.stop()
            const delta = (Date.now() - t.timeRef) / 1000
            return stopState(t.progress + delta / duration)
        }
      })
    },
    [duration]
  )

  const seek = useCallback(
    (progress: number) => {
      setTransportState(t => {
        if (sound.current == null) return t
        switch(t.type) {
          case "stop":
            return stopState(progress)
          case "play":
          case "loop":
            sound.current.stop()
            sound.current.play(0, progress * duration)
            return playState(progress, Date.now())
        }
      })
    },
    [duration]
  )

  useEffect(
    () => {
      const newSound = new Sound(
        props.url,
        err => {
          if (err) return console.error(err)
          if (sound.current != null) sound.current.stop()
          newSound.addEffect(fxLPF.current)
          newSound.addEffect(fxHPF.current)
          sound.current = newSound
          setTransport({ play, loop, stop, seek })
        }
      )
      return stop
    },
    [props.url, play, loop, stop, seek]
  )

  return <></>
}

export default Audio
