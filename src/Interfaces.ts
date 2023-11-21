export interface IAlbum {
  id?: number
  title: string
  artist: IArtist
  cover: string
  releaseDate: string
  rating?: number
  tracks?: Array<ITrack>
  genres?: Array<IGenre>
}

export interface IAlbumPlain {
  id: number
  title: string
  artistTitle: string
  cover: string
  releaseDate: string
  rating?: number
}

export interface ITrack {
  id?: number
  title: string
  seconds: number
  trackNumber: number
  albumId: number
}

export interface IArtist {
  id?: number
  title: string
  albums?: Array<IAlbumPlain>
}

export interface IGenre {
  id?: number
  title: string
  albums?: Array<IAlbumPlain>
}
