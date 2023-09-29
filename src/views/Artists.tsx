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

  useEffect(() => {
    artistService.getAll(true).then((data) => setArtists(data))
  }, [])

  const removeArtist = async (e: React.FormEvent, artist: IArtist): Promise<void> => {
    e.preventDefault()
    if (artist.id) {
      if (window.confirm(getArtistRemoveConfirmText(artist))) {
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

  const getArtistRemoveConfirmText = (artist: IArtist): string => {
    if (artist.albums !== undefined && artist.albums.length > 0) {
      let albumsList: string = '\n'
      artist.albums.forEach((album) => {
        const albumItem: string = ' * ' + album.title + '\n'
        albumsList += albumItem
    })
      return strings.formatString(strings.are_you_sure_you_want_to_remove_artist_and_albums, artist.title, albumsList) as string
    }
    return strings.formatString(strings.are_you_sure_you_want_to_remove_artist, artist.title) as string
  }

  return (
    <div>
      <Link to={'/'}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/></Link>
      <br/>
      <br/>
      <div className="artistsInformation">
        <form onSubmit={(e) => addArtist(e)}>
          <table>
            <thead>
              <tr>
                <th>{strings.artist}</th>
                <th>{strings.albums}</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id}>
                  <td><input required type="text" placeholder={strings.artist_title} name="artistTitle" defaultValue={artist.title} onBlur={(e) => editArtistTitle(artist, e.target.value)} /></td>
                  <td>
                    <ul className="smallText">
                      {artist.albums?.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1).map((album) => (
                        <li key={album.id}><Link to={`/album/${album.id}`}>{album.title}</Link></li>
                      ))}
                    </ul>
                  </td>
                  <td><button onClick={(e) => removeArtist(e, artist)}><img src="../icons8-delete.png" title={strings.remove} alt={strings.remove} /></button></td>
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
