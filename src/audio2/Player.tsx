import * as R from "react"
import Seek from "./Seek.jsx"
import Scrubber from "./Scrubber.jsx"
import * as Audio from "./Audio.jsx"

export default function Player() {
  const audio = Audio.useAudio()
  const loopStartRef = R.useRef<HTMLInputElement>(null)
  const loopStartDefault = "0"
  const loopEndRef = R.useRef<HTMLInputElement>(null)
  const loopEndDefault = String(audio.buffer.duration)
  return (
    <div style={{ padding: 2 }}>
      <pre>{JSON.stringify(audio.transport.state, null, 2)}</pre>
      <input
        min={0}
        max={20000}
        onChange={e => audio.transport.setHpf(Number(e.target.value))}
        type="range"
        value={audio.transport.state.hpf}
      />
      <input
        min={0}
        max={20000}
        onChange={e => audio.transport.setLpf(Number(e.target.value))}
        type="range"
        value={audio.transport.state.lpf}
      />
      <div>
        {audio.transport.state.pause ? (
          <button
          children="Play"
          onClick={() => audio.transport.play()}
          type="button"
          />
        ) : (
          <button type="button" children="Stop" onClick={() => audio.transport.stop()} />
        )}
        <label>Loop Start: <input
          disabled={audio.transport.state.loop != null}
          ref={loopStartRef}
          defaultValue={loopStartDefault}
        /></label>
        <label>Loop End: <input
          disabled={audio.transport.state.loop != null}
          ref={loopEndRef}
          defaultValue={loopEndDefault}
        /></label>
        {audio.transport.state.loop ? (
          <button
            type="button"
            children="Loop"
            onClick={() => audio.transport.unloop()}
            color="success"
          />
        ) : (
          <button
            type="button"
            children="Loop"
            onClick={() => {
              audio.transport.loop([
                Number(loopStartRef.current?.value ?? loopStartDefault),
                Number(loopEndRef.current?.value ?? loopEndDefault),
              ])
            }}
          />
        )}
      </div>
      <div>
        <Seek />
        <Scrubber />
      </div>
    </div>
  )
}
