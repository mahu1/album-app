import axios from 'axios'
import { ITrack } from '../Interfaces'

//const baseUrl = 'http://ec2-13-53-170-200.eu-north-1.compute.amazonaws.com:5000'
const baseUrl = 'http://localhost:8080'
const basePath = 'tracks'


const create = (track: ITrack): Promise<ITrack> => {
  const request = axios.post(baseUrl + '/' + basePath, track)
  return request.then(response => response.data)
}

const patch = (id: number, changes: {}): Promise<ITrack> => {
  const request = axios.patch(baseUrl  + '/' + basePath + '/' + id, changes)
  return request.then(response => response.data)
}

const remove = (id: number): Promise<ITrack> => {
  const request = axios.delete(baseUrl + '/' + basePath + '/' + id)
  return request.then(response => response.data)
}

const getAllTrackTitles = (): Promise<string[]> => {
  return axios
    .get<string[]>(baseUrl + '/' + basePath)
     .then(response => response.data)
}

const exportedObject = {
  create,
  patch,
  remove,
  getAllTrackTitles
}

export default exportedObject
