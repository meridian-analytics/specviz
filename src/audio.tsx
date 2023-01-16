import { useEffect } from "react"
import { Sound } from "pizzicato"
import { useSpecviz } from "./specviz"

function Audio(props: {
  url: string,
}) {
  const { url } = props
  const { sound, setSound } = useSpecviz()

  // load sound when url changes
  useEffect(
    () => {
      const newSound = new Sound(url, () => {
        setSound(newSound)
      })
    },
    [url]
  )

  // stop sound when component unmounts
  useEffect(
    () => {
      return () => {
        if (sound) {
          sound.stop()
        }
      }
    },
    [sound]
  )

  return <></>
}

export default Audio
