import * as AudioContext from "./AudioContext.jsx"
import * as BufferContext from "./BufferContext.jsx"
import * as TransportContext from "./TransportContext.jsx"
import Player from "./Player.jsx"

export default function AudioTest() {
  return (
    <AudioContext.Provider>
      <BufferContext.Provider url="/audio.wav">
        <TransportContext.Provider>
          <Player />
        </TransportContext.Provider>
      </BufferContext.Provider>
    </AudioContext.Provider>
  )
}
