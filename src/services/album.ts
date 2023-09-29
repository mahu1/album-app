import axios from 'axios'
import { IAlbum } from '../Interfaces'
import { ItemGroup } from '../AlbumUtils'

//const baseUrl = '/api/albums'
const baseUrl = 'http://localhost:8080'
const basePath = 'albums'

const getAll = (): Promise<IAlbum[]> => {
  return axios
    .get<IAlbum[]>(baseUrl)
    .then(response => response.data)
}

const getBySearchCriterias = (searchWord: string, searchGroup: ItemGroup, rating: number, genres: string[]): Promise<IAlbum[]>  => {
  let urlParameters: string = ''
  if (ItemGroup.Album === searchGroup) {
    urlParameters += searchWord !== '' ? '?album=' + escapeSearchValue(searchWord) : ''
  } else if (ItemGroup.Artist === searchGroup) {
    urlParameters += searchWord !== '' ? '?artist=' + escapeSearchValue(searchWord) : ''
  } else if (ItemGroup.Track === searchGroup) {
    urlParameters += searchWord !== '' ? '?track=' + escapeSearchValue(searchWord) : ''
  }
  if (rating > 0) {
    urlParameters += urlParameters === '' ? '?' : '&'
    urlParameters += rating !== 0 ? 'rating=' + rating : ''
  }
  if (genres.length > 0) {
    urlParameters += urlParameters === '' ? '?' : '&'
    urlParameters += genres.length !== 0 ? 'genres=' + genres : ''
  }
  return axios
    .get<IAlbum[]>(baseUrl + '/' + basePath + urlParameters)
    .then(response => response.data)
}

const getById = (id: number): Promise<IAlbum> => {
  return axios
    .get<IAlbum>(baseUrl + '/' + basePath + '/' + id + '?_embed=TRACKS,GENRES')
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
  getBySearchCriterias,
  create,
  remove,
  getById,
  patch,
  put
}

export default exportedObject