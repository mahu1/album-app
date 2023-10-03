import axios from 'axios'
import { IGenre } from '../Interfaces'

//const baseUrl = '/api/genres'
const baseUrl = 'http://localhost:8080'
const basePath = 'genres'


const getById = (id: number): Promise<IGenre> => {  
  return axios
    .get<IGenre>(baseUrl + '/' + basePath + '/' + id)
    .then(response => response.data)
}

const getAll = (): Promise<IGenre[]> => {
  return axios
    .get<IGenre[]>(baseUrl + '/' + basePath)
    .then(response => response.data)
}

const exportedObject = {
  getById,
  getAll
}

export default exportedObject
