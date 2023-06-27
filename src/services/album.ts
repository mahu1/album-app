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

const getByArtist = (searchValue: string): Promise<IAlbum[]>  => {
  return axios
    .get<IAlbum[]>(baseUrl + '/albums?artist=' + searchValue)
    .then(response => response.data)
}

const getByAlbumTitle = (searchValue: string): Promise<IAlbum[]> => {
  return axios
    .get<IAlbum[]>(baseUrl + '/albums?albumtitle=' + searchValue)
    .then(response => response.data)
}

const getByTrackTitle = (searchValue: string): Promise<IAlbum[]> => {
  return axios
    .get<IAlbum[]>(baseUrl + '/albums?tracktitle=' + searchValue)
    .then(response => response.data)
}

const getById = (id: number): Promise<IAlbum> => {  
  return axios
    .get<IAlbum>(baseUrl  + '/' + basePath + '/' + id + '?_embed=TRACKS')
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

const exportedObject = {
  getAll,
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