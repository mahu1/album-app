import axios from 'axios'
import { ITrack } from '../Interfaces'

const baseUrl = 'http://localhost:3001/tracks'

const getByTrackTitle = (searchValue: string): Promise<ITrack[]> => {
    return axios
      .get<ITrack[]>("http://localhost:3001/tracks?title_like=" + searchValue)
      .then(response => response.data)
}

const create = (track: ITrack): Promise<ITrack> => {
  const request = axios.post(baseUrl, track)
  return request.then(response => response.data)
}

const update = (id: number, newObject: ITrack) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

//const updateTrackList = (tracks: ITrack[], updatedTrackNumber: number) => {
  //const updateTracks: ITrack[] = []
  //tracks.filter(t => t.trackNumber > updatedTrackNumber).forEach(t => {
    //const changedTrack: ITrack = { ...t, trackNumber: t.trackNumber - 1 }
    //if (t.id) {
      //updateTracks.push(changedTrack)
    //}
  //})
  
  //axios.all([
    //updateTracks.forEach(t => {
    //const request = axios.put(`${baseUrl}/${t.id}`, t)
    //})
  //])
//}

const remove = (track: ITrack) => {
  const request = axios.delete(`${baseUrl}/${track.id}`)
  return request.then(response => response.data)
}

export default { create, update, remove, getByTrackTitle }
