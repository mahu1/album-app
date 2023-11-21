import axios from 'axios'
import { IGenre } from '../Interfaces'

//const baseUrl = 'http://ec2-13-53-170-200.eu-north-1.compute.amazonaws.com:5000'
const baseUrl = 'http://localhost:8080'
const basePath = 'genres'


const getAll = (): Promise<IGenre[]> => {
  return axios
    .get<IGenre[]>(baseUrl + '/' + basePath)
    .then(response => response.data)
}

const patch = (id: number, changes: {}): Promise<IGenre> => {
  const request = axios.patch(baseUrl  + '/' + basePath + '/' + id, changes)
  return request.then(response => response.data)
}

const remove = (id: number): Promise<IGenre> => {
  const request = axios.delete(baseUrl  + '/' + basePath + '/' + id)
  return request.then(response => response.data)
}

const create = (artist: IGenre): Promise<IGenre> => {
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
