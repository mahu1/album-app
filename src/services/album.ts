import axios from 'axios'
import { IAlbum } from '../Interfaces'
import { AlbumExistsException } from '../AlbumExistsException'

const baseUrl = '/api/albums'

const getAll = (): Promise<IAlbum[]> => {
  return axios
    .get<IAlbum[]>(baseUrl + "?_sort=releaseDate")
    .then(response => response.data)
}

const getByArtist = (searchValue: string): Promise<IAlbum[]>  => {
  return axios
    .get<IAlbum[]>(baseUrl + "?artist_like=" + searchValue + "&_sort=releaseDate")
    .then(response => response.data)
}

const getByAlbumTitle = (searchValue: string): Promise<IAlbum[]> => {
  return axios
    .get<IAlbum[]>(baseUrl + "?title_like=" + searchValue + "&_sort=releaseDate")
    .then(response => response.data)
}

const getByIds = (ids: Set<number>): Promise<IAlbum[]> => {
  let idValues: string = "?"
  let iterateCounter: number = 0
  ids.forEach(id =>  {
    iterateCounter++
    idValues += "id=" + id
    if (ids.size > iterateCounter) {
      idValues += "&"
    }
  })

  return axios
    .get<IAlbum[]>(baseUrl + idValues + "&_sort=releaseDate")
    .then(response => response.data)
}

const getByArtistAndTitle = (artist: string, title: string): Promise<IAlbum> => {
  return axios
    .get<IAlbum[]>(baseUrl + "?artist=" + artist + "&title=" + title)
    .then(response => response.data[0])
}


const getById = (id: number): Promise<IAlbum> => {
  return axios
    .get<IAlbum>(baseUrl + "/" + id + "/" + "?_embed=tracks")
    .then(response => response.data)
}

const create = async (album: IAlbum): Promise<IAlbum> => {
  const data = await getByArtistAndTitle(album.artist, album.title)
  if (data) {
    throw new AlbumExistsException(`Album already found: ${album.artist} - ${album.title}`)
  }
  const request = axios.post(baseUrl, album)
  return request.then(response => response.data)
}

const update = (id: number, newObject: IAlbum) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const patch = (id: number, changes: {}) => {
  const request = axios.patch(`${baseUrl}/${id}`, changes)
  return request.then(response => response.data)
}

const remove = (id: number) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, getByArtist, getByAlbumTitle, create, update, remove, getById, patch, getByIds }