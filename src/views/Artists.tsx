import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import artistService from '../services/artist'
import { IArtist } from '../Interfaces'
import { FeedbackMessageContext } from '../FeedbackMessageContext'
import { FeedbackMessageType } from '../App'

export const Artists = () => {
  const { id } = useParams() as { id: string }
  const [artists, setArtists] = useState<IArtist[]>([])
  const {setFeedbackMessage} = useContext(FeedbackMessageContext) as any
  const [newArtistTitle, setNewArtistTitle] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    artistService.getAll().then((data) => setArtists(data))
  }, [])

  const removeArtist = async (e: React.FormEvent, artist: IArtist): Promise<void> => {
    e.preventDefault()
    if (artist.id) {
      if (window.confirm(`Are you sure you want to remove album: ${artist.title}?`)) {
        await artistService.remove(artist.id)
        artistService.getAll().then((data) => setArtists(data))
        setFeedbackMessage({ text: `Artist removed: ${artist.title}`, feedbackMessageType: FeedbackMessageType.Info , useTimer: true })
      }
    }
  }

  const editArtistTitle = async (artist: IArtist, artistTitle: string): Promise<void> => {
    if (artist.title !== artistTitle) {
      if (artistTitle.length === 0) {
        setFeedbackMessage( {text: `Artist title cannot be empty`, feedbackMessageType: FeedbackMessageType.Error} )
        return
      } else if (artists.some(a => a.title === artistTitle)) {
        setFeedbackMessage( {text: `Artist already found with title: ${artistTitle}`  , feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (artist.id && artist.title !== artistTitle) {
        const changedArtist: {} = { title: artistTitle }
        await artistService.patch(artist.id, changedArtist)
        artistService.getAll().then((data) => setArtists(data))
        setFeedbackMessage( { text: `Artist title edited: ${artist.title} → ${artistTitle}`, feedbackMessageType: FeedbackMessageType.Info} )
      }
    }
  }

  const addArtist = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (artists.some(a => a.title === newArtistTitle)) {
      setFeedbackMessage( {text: `Artist already found with title: ${newArtistTitle}`, feedbackMessageType: FeedbackMessageType.Error} )
      return
    }
    const artist: IArtist = {
      title: newArtistTitle,
    }

    await artistService.create(artist)
    artistService.getAll().then((data) => setArtists(data))
    setFeedbackMessage( { text: `Artist added: ${artist.title}`, feedbackMessageType: FeedbackMessageType.Info })
      
    setNewArtistTitle('')
  }

  const getArtistRemoveButtonText = (artist: IArtist): string => {
    if (artist.albums === undefined || artist.albums?.length > 0) {
      return 'cannot remove (is being used by ' + artist.albums?.length + ' albums)'
    }
    return 'remove'
  }

  const getArtistRemoveButtonIcon = (artist: IArtist): string => {
    if (artist.albums === undefined || artist.albums?.length > 0) {
      return '../icons8-delete-disabled.png'
    }
    return '../icons8-delete.png'
  }


  return (
    <div>
      <Link to={'..'} onClick={(e) => {navigate(-1)}}><img src="../icons8-go-back.png" className="staticIcon" alt="back" title="back"/><img src="../icons8-go-back.gif" className="activeIcon" alt="back" title="back"/></Link>
      <br/>
      <br/>
      <div className="artistsInformation">
        <form onSubmit={(e) => addArtist(e)}>
          <table>
            <thead>
              <tr>
                <th>Artists</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((a) => (
                <tr key={a.id}>
                  <td><input required type="text" placeholder="Artist title" name="artistTitle" defaultValue={a.title} onBlur={(e) => editArtistTitle(a, e.target.value)} /></td>
                  <td><button disabled={a.albums === undefined || a.albums.length > 0} onClick={(e) => removeArtist(e, a)}><img src={getArtistRemoveButtonIcon(a)} alt={getArtistRemoveButtonText(a)} title={getArtistRemoveButtonText(a)} /></button></td>
                </tr>
              ))}
              <tr>
                <td><input required type="text" placeholder="Artist title" name="newArtistTitle" value={newArtistTitle} onChange={(e) => setNewArtistTitle(e.target.value)} /></td>
                <td><button type="submit"><img src="../icons8-plus.png" alt="add artist" title="add artist" /></button></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )

}
