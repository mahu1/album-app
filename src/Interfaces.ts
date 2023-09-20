export interface IAlbum {
    id?: number
    artist: IArtist
    title: string
    releaseDate: string
    cover: string
    rating?: number
    tracks?: Array<ITrack>
}

export interface ITrack {
    id?: number
    title: string
    seconds: number
    albumId: number
    trackNumber: number
}

export interface IArtist {
  id?: number
  title: string
  albums?: Array<IAlbum>
}
