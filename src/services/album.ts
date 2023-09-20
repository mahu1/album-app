import axios from 'axios'
import { IAlbum } from '../Interfaces'

//const baseUrl = '/api/albums'
const baseUrl = 'http://localhost:8080'
const basePath = 'albums'

const getAll = (): Promise<IAlbum[]> => {
  return axios
    .get<IAlbum[]>(baseUrl)
    .then(response => response.data)
}

const getByRating = (rating: number): Promise<IAlbum[]>  => {
  return axios
    .get<IAlbum[]>(baseUrl + '/' + basePath + '?rating=' + rating)
    .then(response => response.data)
}


const getByArtist = (searchValue: string, rating: number): Promise<IAlbum[]>  => {
  const searchValueEscaped = escapeSearchValue(searchValue)
  return axios
    .get<IAlbum[]>(baseUrl + '/' + basePath + '?artist=' + searchValueEscaped + (rating > 0 ? '&rating=' + rating : ''))
    .then(response => response.data)
}

const getByAlbumTitle = (searchValue: string, rating: number): Promise<IAlbum[]> => {
  const searchValueEscaped = escapeSearchValue(searchValue)
  return axios
    .get<IAlbum[]>(baseUrl + '/' + basePath + '?albumtitle=' + searchValueEscaped + (rating > 0 ? '&rating=' + rating : ''))
    .then(response => response.data)
}

const getByTrackTitle = (searchValue: string, rating: number): Promise<IAlbum[]> => {
  const searchValueEscaped = escapeSearchValue(searchValue)
  return axios
    .get<IAlbum[]>(baseUrl + '/' + basePath + '?tracktitle=' + searchValueEscaped + (rating > 0 ? '&rating=' + rating : ''))
    .then(response => response.data)
}

const getById = (id: number): Promise<IAlbum> => {  
  return axios
    .get<IAlbum>(baseUrl + '/' + basePath + '/' + id + '?_embed=TRACKS')
    .then(response => response.data)
}

const create = (album: IAlbum): Promise<IAlbum> => {
  const request = axios.post(baseUrl  + '/' + basePath, album)
  return request.then(response => response.data)
}

const patch = (id: number, changes: {}) => {
  const request = axios.patch(baseUrl  + '/' + basePath + '/' + id, changes)
  return request.then(response => response.data)
}

const remove = (id: number) => {
  const request = axios.delete(baseUrl  + '/' + basePath + '/' + id)
  return request.then(response => response.data)
}

const put = (id: number, album: IAlbum) => {
  const request = axios.put(baseUrl  + '/' + basePath + '/' + id, album)
  return request.then(response => response.data)
}

const escapeSearchValue = (searchValue: string): string => {
  const searchValueEscaped = searchValue.replace('&', '%26')
  return searchValueEscaped
}


const exportedObject = {
  getAll,
  getByRating,
  getByArtist,
  getByAlbumTitle,
  getByTrackTitle,
  create,
  remove,
  getById,
  patch,
  put
}

export default exportedObject