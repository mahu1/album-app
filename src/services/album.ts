import axios from 'axios'
import { IAlbum, IAlbumPlain } from '../Interfaces'
import { ItemGroup } from '../AlbumUtils'
import { format } from 'date-fns'

//const baseUrl = '/api/albums'
const baseUrl = 'http://localhost:8080'
const basePath = 'albums'


const getAll = (): Promise<IAlbumPlain[]> => {
  return axios
    .get<IAlbumPlain[]>(baseUrl)
    .then(response => response.data)
}

const getBySearchCriterias = (searchWord: string, searchGroup: ItemGroup, rating: number, genres: number[], releaseDateStart: Date | undefined | null, releaseDateEnd: Date | undefined | null): Promise<IAlbumPlain[]>  => {
  let releaseDateStartString = ''
  if (releaseDateStart) {
    releaseDateStartString = format(new Date(releaseDateStart), 'dd-MM-yyy')
  }
  let releaseDateEndString = ''
  if (releaseDateEnd) {
    releaseDateEndString = format(new Date(releaseDateEnd), 'dd-MM-yyy')
  }
  const params = {
    album: searchGroup === ItemGroup.Album && searchWord.length > 0 ? searchWord : undefined,
    artist: searchGroup === ItemGroup.Artist && searchWord.length > 0 ? searchWord : undefined,
    track: searchGroup === ItemGroup.Track && searchWord.length > 0 ? searchWord : undefined,
    rating: rating > 0 ? rating : undefined,
    genres: genres.length > 0 ? genres.join(',') : undefined,
    releaseDateStart: releaseDateStartString.length > 0 ? releaseDateStartString : undefined,
    releaseDateEnd: releaseDateEndString.length > 0 ? releaseDateEndString : undefined
  }
  return axios
    .get<IAlbumPlain[]>(baseUrl + '/' + basePath, {params})
    .then(response => response.data)
}

const getById = (id: number): Promise<IAlbum> => {
  return axios
    .get<IAlbum>(baseUrl + '/' + basePath + '/' + id)
    .then(response => response.data)
}

const create = (album: IAlbum): Promise<IAlbum> => {
  const request = axios.post(baseUrl  + '/' + basePath, album)
  return request.then(response => response.data)
}

const patch = (id: number, album: IAlbum) => {
  const request = axios.patch(baseUrl  + '/' + basePath + '/' + id, album)
  return request.then(response => response.data)
}

const remove = (id: number) => {
  const request = axios.delete(baseUrl  + '/' + basePath + '/' + id)
  return request.then(response => response.data)
}

const exportedObject = {
  getAll,
  getBySearchCriterias,
  create,
  remove,
  getById,
  patch
}

export default exportedObject