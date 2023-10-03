import { getTracksFullLength } from './AlbumUtils';
import { IArtist, IAlbum, ITrack } from './Interfaces'



describe('calculateTotalLengthOfTracks', () => {
  it('calculates the total length of tracks', () => {
    const artist: IArtist = { "id": 1, "title": "Iron & Wine" }
    const album: IAlbum = { "id": 1, "artist": artist, "title": "The Creek Drank the Cradle", "releaseDate": "2002.09.24", "cover": "https://m.media-amazon.com/images/I/51XdzcVR2bL._AC_.jpg" }
    const firstTrack: ITrack = { "trackNumber": 1, "title": "Lion's Mane", "seconds": 169, "albumId": 1, "id": 161 }
    const secondTrack: ITrack = { "trackNumber": 2, "title": "Bird Stealing Bread", "seconds": 261, "albumId": 1, "id": 162 }
    const thirdTrack: ITrack = { "trackNumber": 3,  "title": "Faded from the Winter", "seconds": 197, "albumId": 1, "id": 163 }
    const allTracks: ITrack[] = [firstTrack, secondTrack, thirdTrack]
    expect(getTracksFullLength(allTracks)).toBe('10:27');
  })
})