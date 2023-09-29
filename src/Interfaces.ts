export interface IAlbum {
    id?: number
    artist: IArtist
    title: string
    releaseDate: string
    cover: string
    rating?: number
    tracks?: Array<ITrack>
    genres?: Array<IGenre>
}

export interface ITrack {
    id?: number
    title: string
    seconds: number
    album: IAlbum
    trackNumber: number
}

export interface IArtist {
  id?: number
  title: string
  albums?: Array<IAlbum>
}

export interface IGenre {
  id: number
  title: string
  albums?: Array<IAlbum>
}
