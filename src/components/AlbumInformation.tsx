import { IAlbum, ITrack, IArtist } from '../Interfaces'
import { useState, useEffect, useContext } from 'react'
import albumService from '../services/album'
import trackService from '../services/track'
import artistService from '../services/artist'
import { FeedbackMessageContext } from '../FeedbackMessageContext'
import { getTracksFullLength, getTrackFullLength, getFullLengthSeconds, getMinutes, getSeconds } from '../AlbumUtils'
import { FeedbackMessageType } from '../App'
import { useNavigate, Link } from 'react-router-dom'


export const AlbumInformation = (props: { albumId: number }) => {
    const { albumId } = props;
    const [artists, setArtists] = useState<IArtist[]>([])
    const [newTrackTitle, setNewTrackTitle] = useState('')
    const [newTrackLengthMinutes, setNewTrackLengthMinutes] = useState(0)
    const [newTrackLengthSeconds, setNewTrackLengthSeconds] = useState(0)
    const [album, setAlbum] = useState<IAlbum>()
    const {setFeedbackMessage} = useContext(FeedbackMessageContext) as any
    const navigate = useNavigate()

    useEffect(() => {
      albumService.getById(albumId).then(data => {
        setAlbum(data)
      })
      artistService.getAll().then(data => {
        setArtists(data)
      })
    }, [albumId])


    const editArtist = async (album: IAlbum, artist: string): Promise<void> => {
      if (artist.length === 0) {
        setFeedbackMessage( {text: `Artist cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album.id && album.artist.title !== artist) {
        const artistObject: IArtist = { title: artist }
        const editedAlbum = { ...album, artist: artistObject }
        try {
          await albumService.put(album.id, editedAlbum)
          setAlbum(await albumService.getById(album.id))
          setFeedbackMessage( {text: `Artist edited: ${album.artist.title} → ${artist}`, feedbackMessageType: FeedbackMessageType.Info} )
        } catch (error) {
          if (error instanceof Error && error.message === 'Request failed with status code 302') {
            setFeedbackMessage( {text: `Album ${artist} - ${album.title} already found`, feedbackMessageType: FeedbackMessageType.Error} )
          }
        }
      }
    }

    const editTitle = async (album: IAlbum, title: string): Promise<void> => {
      if (title.length === 0) {
        setFeedbackMessage( {text: `Album title cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album.id && album.title !== title) {
        const changedTitle: {} = { title: title }
        try {
          await albumService.patch(album.id, changedTitle)
          setAlbum(await albumService.getById(album.id))
          setFeedbackMessage( {text: `Album title edited: ${album.title} → ${title}`, feedbackMessageType: FeedbackMessageType.Info} )
        } catch (error) {
          if (error instanceof Error && error.message === 'Request failed with status code 302') {
            setFeedbackMessage( {text: `Album ${album.artist.title} - ${title} already found`, feedbackMessageType: FeedbackMessageType.Error} )
          }
        }
      }
    }

    const editReleaseDate = async (album: IAlbum, releaseDate: string): Promise<void> => {
      if (releaseDate.length === 0) {
        setFeedbackMessage( {text: `Release date cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album.id && album.releaseDate !== releaseDate) {
        const changedReleaseDate: {} = { releaseDate: releaseDate }
        await albumService.patch(album.id, changedReleaseDate)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( {text: `Release date edited: ${album.releaseDate} → ${releaseDate}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editCover = async (album: IAlbum, cover: string): Promise<void> => {
      if (cover.length === 0) {
        setFeedbackMessage( {text: `Cover cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album.id && album.cover !== cover) {
        const changedCover: {} = { cover: cover }
        await albumService.patch(album.id, changedCover)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( { text: `Cover edited: ${album.cover.split('/').pop()} → ${cover.split('/').pop()}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTrackNumber = async (track: ITrack, trackNumber: number): Promise<void> => {
      if (isNaN(trackNumber)) {
        setFeedbackMessage( { text: `Track number cannot be empty`, feedbackMessageType: FeedbackMessageType.Error } )
        return
      } else if (trackNumber === 0) {
        setFeedbackMessage( {text: `Track number cannot be 0`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      } else if (album?.tracks?.find(t => t.trackNumber === trackNumber)) {
        setFeedbackMessage( {text: `Track number already exists on album`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (track.id && track.trackNumber !== trackNumber) {
        const changedTrack: {} = { trackNumber: trackNumber }
        await trackService.patch(track.id, changedTrack)
        albumService.getById(albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track number edited: ${track.trackNumber} → ${trackNumber}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTrackTitle = async (track: ITrack, trackTitle: string): Promise<void> => {
      if (trackTitle.length === 0) {
        setFeedbackMessage( {text: `Track title cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (track.id && track.title !== trackTitle) {
        const changedTrack: {} = { title: trackTitle }
        await trackService.patch(track.id, changedTrack)
        albumService.getById(albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track title edited: ${track.title} → ${trackTitle}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTrackLengthMinutes = async (track: ITrack, trackLengthMinutes: number): Promise<void> => {
      if (track.id && getMinutes(track.seconds) !== trackLengthMinutes) {
        if (isNaN(trackLengthMinutes)) {
          setFeedbackMessage( { text: `Track minutes cannot be empty`, feedbackMessageType: FeedbackMessageType.Error } )
          return
        } else if (trackLengthMinutes < 0) {
          setFeedbackMessage( { text: `Track minutes cannot be negative`, feedbackMessageType: FeedbackMessageType.Error } )
          return
        }
        const trackLength = getFullLengthSeconds(trackLengthMinutes, getSeconds(track.seconds))
        const changedTrack: {} = { seconds: trackLength }
        await trackService.patch(track.id, changedTrack)
        albumService.getById(albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track length edited: ${getTrackFullLength(track.seconds)} → ${getTrackFullLength(trackLength)}`, feedbackMessageType: FeedbackMessageType.Info } )
      }
    }

    const editTrackLengthSeconds = async (track: ITrack, trackLengthSeconds: number): Promise<void> => {
      if (track.id && getSeconds(track.seconds) !== trackLengthSeconds) {
        if (isNaN(trackLengthSeconds)) {
          setFeedbackMessage( { text: `Track seconds cannot be empty`, feedbackMessageType: FeedbackMessageType.Error } )
          return
        } else if (trackLengthSeconds < 0) {
          setFeedbackMessage( { text: `Track seconds cannot be negative`, feedbackMessageType: FeedbackMessageType.Error } )
          return
        }
        const trackLength = getFullLengthSeconds(getMinutes(track.seconds), trackLengthSeconds)
        const changedTrack: {} = { seconds: trackLength }
        await trackService.patch(track.id, changedTrack)
        albumService.getById(albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track length edited: ${getTrackFullLength(track.seconds)} → ${getTrackFullLength(trackLength)}`, feedbackMessageType: FeedbackMessageType.Info } )
      }
    }

    const removeAlbum = async (album: IAlbum): Promise<void> => {
      if (album.id) {
        if (window.confirm(`Are you sure you want to remove album: ${album.artist.title} - ${album.title}?`)) {
          await albumService.remove(album.id)
          setFeedbackMessage({ text: `Album removed: ${album.artist.title} - ${album.title}`, feedbackMessageType: FeedbackMessageType.Info , useTimer: true })
          navigate('/')
        }
      }
    }

    const addTrack = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault()
      if (album?.id && album.tracks) {
        const track: ITrack = {
          trackNumber: Math.max(...album.tracks.map(o => o.trackNumber), 0) + 1,
          title: newTrackTitle,
          seconds: getFullLengthSeconds(newTrackLengthMinutes, newTrackLengthSeconds),
          albumId: album.id
          }

        await trackService.create(albumId, track)
        albumService.getById(albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track added: ${track.title}`, feedbackMessageType: FeedbackMessageType.Info })
        
        setNewTrackTitle('')
        setNewTrackLengthMinutes(0)
        setNewTrackLengthSeconds(0)
      }
    }
    
    const removeTrack = async (e: React.FormEvent, track: ITrack): Promise<void> => {
      e.preventDefault()
      if (track.id) {
        if (window.confirm(`Are you sure you want to remove track: ${track.title}?`)) {
          await trackService.remove(track.id)
          albumService.getById(albumId).then(data => {
            setAlbum(data)
          })
          setFeedbackMessage({ text: `Track removed: ${track.title}`, feedbackMessageType: FeedbackMessageType.Info })
        }
      }
    }

    return (
      <>
        {!album ? (
          <div></div>
        ) : (
          <div>
            <br/>
            <br/>
            <img className="albumImg" src={album.cover} alt={album.title} title={album.artist.title + " - " + album.title} />
            <div className="albumInformation">
              <select value={album.artist.title} onChange={(e) => editArtist(album, e.target.value)}>
                {artists.map((artist) => (
                  <option key={artist.title} value={artist.title}>{artist.title}</option>
                ))}
              </select>
              <Link to={`/artists`}><img src="../icons8-edit.png" className="staticEditArtistIcon" alt="edit artists" title="edit artists"/><img src="../icons8-edit.gif" className="activeEditArtistIcon" alt="edit artists" title="edit artists"/></Link>
              <input required type="text" placeholder="Album title" name="title" key={'album: ' + album.title} defaultValue={album.title} onBlur={(e) => editTitle(album, e.target.value)} />
              <input required type="date" placeholder="Release date" name="releaseDate" key={'releaseDate: ' + album.releaseDate} defaultValue={album.releaseDate} onChange={(e) => editReleaseDate(album, e.target.value)} />
              <input required type="text" placeholder="Cover" name="cover" key={'cover: ' + album.cover} defaultValue={album.cover} onBlur={(e) => editCover(album, e.target.value)} />
              <button onClick={() => removeAlbum(album)}><img src="../icons8-delete.png" alt="remove album" title="remove album" /></button>
            </div>
            <br/>
            <br/>
            <div className="tracksInformation">
              <form onSubmit={(e) => addTrack(e)}>
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Title</th>
                      <th>Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {album.tracks?.sort((a, b) => a.trackNumber > b.trackNumber ? 1 : -1).map((t) => (
                    <tr key={t.id}>
                      <td><input required type="number" placeholder="Track number" name="trackNumber" defaultValue={t.trackNumber} onBlur={(e) => editTrackNumber(t, e.target.valueAsNumber)} /></td>
                      <td><input required type="text" placeholder="Track title" name="trackTitle" defaultValue={t.title} onBlur={(e) => editTrackTitle(t, e.target.value)} /></td>
                      <td><input required type="number" placeholder="MM" min="0" name="trackLengthMinutes" defaultValue={getMinutes(t.seconds)} onBlur={(e) => editTrackLengthMinutes(t, e.target.valueAsNumber)} />:<input required type="number" placeholder="SS" min="0" name="trackLengthSeconds" defaultValue={getSeconds(t.seconds)} onBlur={(e) => editTrackLengthSeconds(t, e.target.valueAsNumber)} /></td>
                      <td><button onClick={(e) => removeTrack(e, t)}><img src="../icons8-delete.png" alt="remove track" title="remove track" /></button></td>
                    </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td><input required type="text" placeholder="Track title" name="newTrackTitle" value={newTrackTitle} onChange={(e) => setNewTrackTitle(e.target.value)} /></td>
                      <td><input required type="number" placeholder="MM" min="0" name="newTrackLengthMinutes" value={newTrackLengthMinutes} onChange={(e) => setNewTrackLengthMinutes(isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)} />:<input required type="number" placeholder="SS" min="0" name="newTrackLengthSeconds" value={newTrackLengthSeconds} onChange={(e) => setNewTrackLengthSeconds(isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)} /></td>
                      <td><button type="submit"><img src="../icons8-plus.png" alt="add track" title="add track" /></button></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td/>
                      <td/>
                      <td>{getTracksFullLength(album.tracks)}</td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            </div>
          </div>
        )}
      </>
    )
}
