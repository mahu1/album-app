import { ITrack, IGenre, IAlbumPlain } from "./Interfaces"
import { strings } from "./Localization"

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

export const getDiscsLengths = (discs: Record<number, ITrack[]>): string => {
  const discsLengths: string[] = []
  Object.entries(discs).forEach(([key, data]) => {
    discsLengths.push(strings.disc + " " + key + ". " + " " + getTracksFullLength(data))
  })
  return discsLengths.join(", ")
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

export const getAlbumsListText = (albums: IAlbumPlain[]): string => {
  let albumsList: string = '\n'
  albums.forEach((album) => {
    const albumItem: string = ' * ' + album.title + '\n'
    albumsList += albumItem
  })
  return albumsList
}

export const mapTracksToRecord = (tracks: ITrack[]): Record<number, ITrack[]> => {
  const groupedTracks = tracks.reduce((acc, track) => {
    if (!acc[track.discNumber]) {
      acc[track.discNumber] = [];
    }
    acc[track.discNumber].push(track);
    return acc;
  }, {} as Record<number, ITrack[]>);

  const sortedGroupedTracks = Object.keys(groupedTracks)
    .sort((a, b) => Number(a) - Number(b))
    .reduce((acc, discNumber) => {
      acc[Number(discNumber)] = groupedTracks[Number(discNumber)].sort((a, b) => a.trackNumber - b.trackNumber);
      return acc;
    }, {} as Record<number, ITrack[]>);
  return sortedGroupedTracks;
};

export enum ItemGroup {
  Artist = 'artist',
  Album = 'album',
  Track = 'track'
}

export type Genre = {
  value: IGenre,
  label: string
}