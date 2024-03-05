import * as AudioContext from "./AudioContext"
import * as BufferContext from "./BufferContext"
import * as TransportContext from "./TransportContext"
import Player from "./Player"

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
