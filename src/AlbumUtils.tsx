import { ITrack } from "./Interfaces"


export const getFullLength = (tracks: ITrack[] | undefined): string => {
    let minutes: number = 0
    let seconds: number = 0
    tracks?.forEach(track =>  {
      minutes += Number(track.length.split(":").at(0))
      seconds += Number(track.length.split(":").at(1))
    })
    minutes += Math.floor(seconds / 60)
    seconds = seconds % 60
    const secondsString: string = seconds < 10 ? "0" + String(seconds) : String(seconds)
    return minutes + ":" + secondsString
  }