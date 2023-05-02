export interface IAlbum {
    id?: number
    artist: string
    title: string
    releaseDate: string
    cover: string
    tracks?: Array<ITrack>
  }

export interface ITrack {
    id?: number
    title: string
    length: string
    albumId: number
    trackNumber: number
}
