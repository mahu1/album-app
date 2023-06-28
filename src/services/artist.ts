import axios from 'axios'
import { IArtist } from '../Interfaces'

//const baseUrl = '/api/albums'
const baseUrl = 'http://localhost:8080'
const basePath = 'artists'

const getAll = (getAlbums: boolean): Promise<IArtist[]> => {
  const albumsUrl = getAlbums ? '?_embed=ALBUMS' : ''
  return axios
    .get<IArtist[]>(baseUrl + '/' + basePath + albumsUrl)
    .then(response => response.data)
}

const patch = (id: number, changes: {}) => {
  const request = axios.patch(baseUrl  + '/' + basePath + '/' + id, changes)
  return request.then(response => response.data)
}

const remove = (id: number) => {
  const request = axios.delete(baseUrl  + '/' + basePath + '/' + id)
  return request.then(response => response.data)
}

const create = (artist: IArtist): Promise<IArtist> => {
  const request = axios.post(baseUrl + '/' + basePath, artist)
  return request.then(response => response.data)
}

const exportedObject = {
  getAll,
  patch,
  remove,
  create
}

export default exportedObject