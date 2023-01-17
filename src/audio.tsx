import { useEffect } from "react"
import { Sound } from "pizzicato"
import { useSpecviz } from "./specviz"

function Audio(props: {
  url: string,
}) {
  const { url } = props
  const { setSound } = useSpecviz()

  useEffect(
    () => {
      const sound = new Sound(
        url,
        err => {
          if (err)
            console.error(err)
          else
            setSound(sound)
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
