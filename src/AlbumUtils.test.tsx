import { getFullLength } from './AlbumUtils';
import { ITrack } from './Interfaces'



describe('calculateTotalLengthOfTracks', () => {
  it('calculates the total length of tracks', () => {
    const firstTrack: ITrack = { "trackNumber": 1, "title": "Lion's Mane", "length": "2:49", "albumId": 36, "id": 161 }
    const secondTrack: ITrack = { "trackNumber": 2, "title": "Bird Stealing Bread", "length": "4:21", "albumId": 36, "id": 162 }
    const thirdTrack: ITrack = { "trackNumber": 3,  "title": "Faded from the Winter", "length": "3:17", "albumId": 36, "id": 163 }
    const allTracks: ITrack[] = [firstTrack, secondTrack, thirdTrack]
    expect(getFullLength(allTracks)).toBe('10:27');
  })
})