import { ITrack, IGenre } from "./Interfaces"

const SECONDSONMINUTE: number = 60

export const getTracksFullLength = (tracks: ITrack[] | undefined): string => {
  let seconds: number = 0
  tracks?.forEach(track =>  {
    seconds += Number(track.seconds)
  })
  return getTrackFullLength(seconds)
}

export const getTrackFullLength = (totalSeconds: number): string => {
  const minutes = getMinutes(totalSeconds)
  const seconds = getSeconds(totalSeconds)
  const secondsString: string = seconds < 10 ? "0" + String(seconds) : String(seconds)
  return minutes + ":" + secondsString
}

export const getFullLengthSeconds = (minutes: number, seconds: number): number => {
  return minutes * 60 + seconds
}

export const getMinutes = (seconds: number): number => {
  return Math.floor(seconds / SECONDSONMINUTE)
}

export const getSeconds = (seconds: number): number => {
  return seconds % SECONDSONMINUTE
}

export enum ItemGroup {
  Artist = 'artist',
  Album = 'album',
  Track = 'track'
}

export type Genre = {
  value: IGenre,
  label: string
}