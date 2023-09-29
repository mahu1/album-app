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

const getAll = (getAlbums: boolean): Promise<IGenre[]> => {
  const albumsUrl = getAlbums ? '?_embed=ALBUMS' : ''
  return axios
    .get<IGenre[]>(baseUrl + '/' + basePath + albumsUrl)
    .then(response => response.data)
}

const exportedObject = {
  getById,
  getAll
}

export default exportedObject
