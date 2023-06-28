import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import artistService from '../services/artist'
import { IArtist } from '../Interfaces'
import { FeedbackMessageContext } from '../FeedbackMessageContext'
import { FeedbackMessageType } from '../App'
import { strings } from '../Localization'

export const Artists = () => {
  const [artists, setArtists] = useState<IArtist[]>([])
  const {setFeedbackMessage} = useContext(FeedbackMessageContext) as any
  const [newArtistTitle, setNewArtistTitle] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    artistService.getAll(true).then((data) => setArtists(data))
  }, [])

  const removeArtist = async (e: React.FormEvent, artist: IArtist): Promise<void> => {
    e.preventDefault()
    if (artist.id) {
      if (window.confirm(strings.formatString(strings.are_you_sure_you_want_to_remove_artist, artist.title) as string)) {
        await artistService.remove(artist.id)
        artistService.getAll(true).then((data) => setArtists(data))
        setFeedbackMessage( { text: strings.formatString(strings.artist_removed, artist.title), feedbackMessageType: FeedbackMessageType.Info} )
      }
    }
  }

  const editArtistTitle = async (artist: IArtist, artistTitle: string): Promise<void> => {
    if (artist.title !== artistTitle) {
      if (artistTitle.length === 0) {
        setFeedbackMessage( {text: strings.artist_title_cannot_be_empty, feedbackMessageType: FeedbackMessageType.Error} )
        return
      } else if (artists.some(a => a.title === artistTitle)) {
        setFeedbackMessage( {text: strings.formatString(strings.artist_already_found, artist.title), feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (artist.id && artist.title !== artistTitle) {
        const changedArtist: {} = { title: artistTitle }
        await artistService.patch(artist.id, changedArtist)
        artistService.getAll(true).then((data) => setArtists(data))
        setFeedbackMessage( { text: strings.formatString(strings.artist_title_edited, artist.title, artistTitle), feedbackMessageType: FeedbackMessageType.Info} )
      }
    }
  }

  const addArtist = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (artists.some(a => a.title === newArtistTitle)) {
      setFeedbackMessage( { text: strings.formatString(strings.artist_already_found, newArtistTitle), feedbackMessageType: FeedbackMessageType.Error} )
      return
    }
    const artist: IArtist = {
      title: newArtistTitle,
    }

    await artistService.create(artist)
    artistService.getAll(true).then((data) => setArtists(data))
    setFeedbackMessage( { text: strings.formatString(strings.artist_added, artist.title), feedbackMessageType: FeedbackMessageType.Info })
      
    setNewArtistTitle('')
  }

  const getArtistRemoveButtonText = (artist: IArtist): string => {
    if (artist.albums !== undefined && artist.albums.length > 0) {
      return strings.formatString(strings.cannot_remove, artist.albums.length) as string
    }
    return strings.remove
  }

  const getArtistRemoveButtonIcon = (artist: IArtist): string => {
    if (artist.albums !== undefined && artist.albums.length > 0) {
      return '../icons8-delete-disabled.png'
    }
    return '../icons8-delete.png'
  }


  return (
    <div>
      <Link to={'..'} onClick={(e) => {navigate(-1)}}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back} title={strings.back}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back} title={strings.back}/></Link>
      <br/>
      <br/>
      <div className="artistsInformation">
        <form onSubmit={(e) => addArtist(e)}>
          <table>
            <thead>
              <tr>
                <th>{strings.artists}</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((a) => (
                <tr key={a.id}>
                  <td><input required type="text" placeholder={strings.artist_title} name="artistTitle" defaultValue={a.title} onBlur={(e) => editArtistTitle(a, e.target.value)} /></td>
                  <td><button disabled={a.albums !== undefined && a.albums.length > 0} onClick={(e) => removeArtist(e, a)}><img src={getArtistRemoveButtonIcon(a)} alt={getArtistRemoveButtonText(a)} title={getArtistRemoveButtonText(a)} /></button></td>
                </tr>
              ))}
              <tr>
                <td><input required type="text" placeholder={strings.artist_title} name="newArtistTitle" value={newArtistTitle} onChange={(e) => setNewArtistTitle(e.target.value)} /></td>
                <td><button type="submit"><img src="../icons8-plus.png" alt={strings.add_artist} title={strings.add_artist} /></button></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )

}
