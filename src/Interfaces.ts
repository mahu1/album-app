export interface IAlbum {
    id?: number
    artist: IArtist
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

export interface IArtist {
  id?: number
  title: string
}
