import { IAlbum, ITrack } from '../Interfaces'
import { useState, useEffect, useContext } from 'react'
import albumService from '../services/album'
import trackService from '../services/track'
import { FeedbackMessageContext } from '../FeedbackMessageContext'
import { getFullLength } from '../AlbumUtils'
import { FeedbackMessageType } from '../App'
import { useNavigate } from 'react-router-dom'



export const AlbumInformation = (props: { albumId: number }) => {
    const { albumId } = props;
    const [artist, setArtist] = useState('')
    const [title, setTitle] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [cover, setCover] = useState('')
    const [trackNumber, setTrackNumber] = useState(0)
    const [trackTitle, setTrackTitle] = useState('')
    const [trackLengthMinutes, setTrackLengthMinutes] = useState(0)
    const [trackLengthSeconds, setTrackLengthSeconds] = useState(0)
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
    }, [albumId])


    const editArtist = async (album: IAlbum | undefined): Promise<void> => {
      if (artist.length === 0) {
        setFeedbackMessage( {text: `Artist cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album && album.id && album.artist !== artist) {
        const changedArtist: {} = { artist: artist }
        await albumService.patch(album.id, changedArtist)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( {text: `Artist edited: ${album.artist} → ${artist}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTitle = async (album: IAlbum | undefined): Promise<void> => {
      if (title.length === 0) {
        setFeedbackMessage( {text: `Album title cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album && album.id && album.title !== title) {
        const changedTitle: {} = { title: title }
        await albumService.patch(album.id, changedTitle)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( {text: `Album title edited: ${album.title} → ${title}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editReleaseDate = async (album: IAlbum | undefined): Promise<void> => {
      if (releaseDate.length === 0) {
        setFeedbackMessage( {text: `Release date cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album && album.id && album.releaseDate !== releaseDate) {
        const changedReleaseDate: {} = { releaseDate: releaseDate }
        await albumService.patch(album.id, changedReleaseDate)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( {text: `Release date edited: ${album.releaseDate} → ${releaseDate}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editCover = async (album: IAlbum | undefined): Promise<void> => {
      if (cover.length === 0) {
        setFeedbackMessage( {text: `Cover cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album && album.id && album.cover !== cover) {
        const changedCover: {} = { cover: cover }
        await albumService.patch(album.id, changedCover)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( { text: `Cover edited: ${album.cover.split('/').pop()} → ${cover.split('/').pop()}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTrackNumber = async (track: ITrack): Promise<void> => {
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
        const changedTrack: ITrack = { ...track, trackNumber: trackNumber }
        await trackService.update(track.id, changedTrack)
        albumService.getById(track.albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track number edited: ${track.trackNumber} → ${changedTrack.trackNumber}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTrackTitle = async (track: ITrack): Promise<void> => {
      if (trackTitle.length === 0) {
        setFeedbackMessage( {text: `Track title cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (track.id && track.title !== trackTitle) {
        const changedTrack: ITrack = { ...track, title: trackTitle }
        await trackService.update(track.id, changedTrack)
        albumService.getById(track.albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track title edited: ${track.title} → ${changedTrack.title}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTrackLengthMinutes = async (track: ITrack): Promise<void> => {
      if (track.id && track.length !== trackLengthMinutes + ':' + track.length.split(':').at(1)) {
        if (isNaN(trackLengthMinutes)) {
          setFeedbackMessage( { text: `Track minutes cannot be empty`, feedbackMessageType: FeedbackMessageType.Error } )
          return
        } else if (trackLengthMinutes < 0) {
          setFeedbackMessage( { text: `Track minutes cannot be negative`, feedbackMessageType: FeedbackMessageType.Error } )
          return
        }
        const changedTrack: ITrack = { ...track, length: trackLengthMinutes + ':' + track.length.split(':').at(1) }
        await trackService.update(track.id, changedTrack)
        albumService.getById(track.albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track length edited: ${track.length} → ${changedTrack.length}`, feedbackMessageType: FeedbackMessageType.Info } )
      }
    }

    const editTrackLengthSeconds = async (track: ITrack): Promise<void> => {
      const trackLengthSecondsWithLeadingZero: string = addLeadingZeroToSeconds(trackLengthSeconds)
      if (track.id && track.length !== track.length.split(':').at(0) + ':' + trackLengthSecondsWithLeadingZero) {
        if (isNaN(trackLengthSeconds)) {
          setFeedbackMessage( { text: `Track seconds cannot be empty`, feedbackMessageType: FeedbackMessageType.Error } )
          return
        } else if (trackLengthSeconds < 0) {
          setFeedbackMessage( { text: `Track seconds cannot be negative`, feedbackMessageType: FeedbackMessageType.Error } )
          return
        }
        const changedTrack: ITrack = { ...track, length: track.length.split(':').at(0) + ':' + trackLengthSecondsWithLeadingZero }
        await trackService.update(track.id, changedTrack)
        albumService.getById(track.albumId).then(data => {
          setAlbum(data)
        })
        setFeedbackMessage( { text: `Track length edited: ${track.length} → ${changedTrack.length}`, feedbackMessageType: FeedbackMessageType.Info } )
      }
    }

    const addLeadingZeroToSeconds = (seconds: number): string => {
      let trackLengthSecondsWithLeadingZero:string = String(seconds)
      if (trackLengthSecondsWithLeadingZero.toString().length === 1) {
        trackLengthSecondsWithLeadingZero = "0" + seconds
      }
      return trackLengthSecondsWithLeadingZero
    }

    const removeAlbum = async (album: IAlbum | undefined): Promise<void> => {
      if (album && album.id) {
        if (window.confirm(`Are you sure you want to remove album: ${album.artist} - ${album.title}?`)) {
          await albumService.remove(album.id)
          setAlbum(undefined)
          setFeedbackMessage( { text: `Album removed: ${album.artist} - ${album.title}`, feedbackMessageType: FeedbackMessageType.Info } )
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
          length: newTrackLengthMinutes + ':' + addLeadingZeroToSeconds(newTrackLengthSeconds),
          albumId: album.id
          }

        await trackService.create(track)
        albumService.getById(track.albumId).then(data => {
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
          await trackService.remove(track)
          albumService.getById(track.albumId).then(data => {
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
          <img className="albumImg" src={album.cover} alt={album.title} title={album.artist + " - " + album.title} />
          <div className="albumInformation">
            <input required type="text" placeholder="Artist" name="artist" key={'artist: ' + album.artist} defaultValue={album.artist} onFocus={(e) => setArtist(e.target.value)} onChange={(e) => setArtist(e.target.value)} onBlur={() => editArtist(album)} />
            <input required type="text" placeholder="Album title" name="title" key={'album: ' + album.title} defaultValue={album.title} onFocus={(e) => setTitle(e.target.value)} onChange={(e) => setTitle(e.target.value)} onBlur={() => editTitle(album)} />
            <input required type="date" placeholder="Release date" name="releaseDate" key={'releaseDate: ' + album.releaseDate} defaultValue={album.releaseDate} onFocus={(e) => setReleaseDate(e.target.value)} onChange={(e) => setReleaseDate(e.target.value)} onBlur={() => editReleaseDate(album)} />
            <input required type="text" placeholder="Cover" name="cover" key={'cover: ' + album.cover} defaultValue={album.cover} onFocus={(e) => setCover(e.target.value)} onChange={(e) => setCover(e.target.value)} onBlur={() => editCover(album)} />
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
                    <td><input required type="number" placeholder="Track number" name="trackNumber" defaultValue={t.trackNumber} onFocus={(e) => setTrackNumber(e.target.valueAsNumber)} onChange={(e) => setTrackNumber(e.target.valueAsNumber)} onBlur={() => editTrackNumber(t)} /></td>
                    <td><input required type="text" placeholder="Track title" name="trackTitle" defaultValue={t.title} onFocus={(e) => setTrackTitle(e.target.value)} onChange={(e) => setTrackTitle(e.target.value)} onBlur={() => editTrackTitle(t)} /></td>
                    <td><input required type="number" placeholder="MM" min="0" name="trackLengthMinutes" defaultValue={t.length.split(':').at(0)} onFocus={(e) => setTrackLengthMinutes(e.target.valueAsNumber)} onChange={(e) => setTrackLengthMinutes(e.target.valueAsNumber)} onBlur={() => editTrackLengthMinutes(t)} />:<input required type="number" placeholder="SS" min="0" name="trackLengthSeconds" defaultValue={t.length.split(':').at(1)} onFocus={(e) => setTrackLengthSeconds(e.target.valueAsNumber)} onChange={(e) => setTrackLengthSeconds(e.target.valueAsNumber)} onBlur={() => editTrackLengthSeconds(t)} /></td>
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
                    <td>{getFullLength(album.tracks)}</td>
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
