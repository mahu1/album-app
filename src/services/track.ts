import axios from 'axios'
import { ITrack } from '../Interfaces'

//const baseUrl = '/api/tracks'
const baseUrl = 'http://localhost:8080'
const basePath = 'tracks'


const create = (albumId: number, track: ITrack): Promise<ITrack> => {
  const request = axios.post(baseUrl + '/' + basePath + '?albumId=' + albumId, track)
  return request.then(response => response.data)
}

const patch = (id: number, changes: {}) => {
  const request = axios.patch(baseUrl  + '/' + basePath + '/' + id, changes)
  return request.then(response => response.data)
}

const remove = (id: number) => {
  const request = axios.delete(baseUrl + '/' + basePath + '/' + id)
  return request.then(response => response.data)
}

export default { create, remove, patch }
