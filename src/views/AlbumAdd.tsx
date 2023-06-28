import { IAlbum, IArtist } from '../Interfaces'
import { useState, useContext, useEffect } from 'react'
import albumService from '../services/album'
import artistService from '../services/artist'
import { Link } from 'react-router-dom'
import { AlbumInformation } from '../components/AlbumInformation'
import { FeedbackMessageContext } from '../FeedbackMessageContext'
import { FeedbackMessageType } from '../App'
import { strings } from '../Localization'

export const AlbumAdd = () => {
    const [artists, setArtists] = useState<IArtist[]>([])
    const [artist, setArtist] = useState('')
    const [title, setTitle] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [cover, setCover] = useState('')
    const [albumId, setAlbumId] = useState(0)
    const {setFeedbackMessage} = useContext(FeedbackMessageContext) as any

    useEffect(() => {
      artistService.getAll(false).then(data => {
        setArtists(data)
      })
    }, [albumId])
    
    const addAlbum = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault()

      const artistObject: IArtist = {
        title: artist 
      }
      const album: IAlbum = {
        artist: artistObject,
        title: title,
        releaseDate: releaseDate,
        cover: cover
      }

      try {
        const data = await albumService.create(album)
        if (data.id) {
          setAlbumId(data.id)
          setFeedbackMessage( {text: strings.formatString(strings.album_added, album.artist.title, data.title), feedbackMessageType: FeedbackMessageType.Info} )

          setArtist('')
          setTitle('')
          setReleaseDate('')
          setCover('')
        }
      } catch(error) {
        if (error instanceof Error && error.message === 'Request failed with status code 302') {
          setFeedbackMessage( {text: strings.formatString(strings.album_already_found, album.artist.title, title), feedbackMessageType: FeedbackMessageType.Error} )
        }
      }
    }

    return (
        <div>
          <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back} title={strings.back}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back} title={strings.back}/></Link>
          <br/>
          <br/>
          <div className="textCenter">
            <form onSubmit={addAlbum}>
              <select required value={artist} onChange={(e) => setArtist(e.target.value)}>
                <option key="0" value="">{strings.select_artist}</option>
                {artists.map((artist) => (
                  <option key={artist.title} value={artist.title}>{artist.title}</option>
                ))}
              </select>
              <Link to={`/artists`}><img src="../icons8-edit.png" className="staticEditArtistIcon" alt={strings.edit_artists} title={strings.edit_artists}/><img src="../icons8-edit.gif" className="activeEditArtistIcon" alt={strings.edit_artists} title={strings.edit_artists}/></Link>
              <input required placeholder={strings.album_title} value={title} type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
              <input required placeholder={strings.release_date} value={releaseDate} type="date" name="releaseDate" onChange={(e) => setReleaseDate(e.target.value)} />
              <input required type="url" placeholder={strings.cover} value={cover} name="cover" onChange={(e) => setCover(e.target.value)} />
              <button type="submit"><img src="../icons8-plus.png" alt={strings.add_album} title={strings.add_album} /></button>
            </form>
            {albumId !== 0 ? (<AlbumInformation albumId={albumId} />) : <div/>}
          </div>
        </div>
    )
}
