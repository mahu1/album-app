import { IAlbum, IArtist } from '../Interfaces'
import { useState, useContext } from 'react'
import albumService from '../services/album'
import { Link } from 'react-router-dom'
import { AlbumInformation } from '../components/AlbumInformation'
import { FeedbackMessageContext } from '../FeedbackMessageContext'
import { FeedbackMessageType } from '../App'

export const AlbumAdd = () => {
    const [artist, setArtist] = useState('')
    const [title, setTitle] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [cover, setCover] = useState('')
    const [albumId, setAlbumId] = useState(0)
    const {setFeedbackMessage} = useContext(FeedbackMessageContext) as any
    
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
          setFeedbackMessage( {text: `Album added: ${data.artist.title} - ${data.title}`, feedbackMessageType: FeedbackMessageType.Info} )

          setArtist('')
          setTitle('')
          setReleaseDate('')
          setCover('')
        }
      } catch(error) {
        if (error instanceof Error && error.message === 'Request failed with status code 302') {
          setFeedbackMessage( {text: `Album ${album.artist.title} - ${title} already found`, feedbackMessageType: FeedbackMessageType.Error} )
        }
      }
    }

    return (
        <div>
          <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt="back" title="back"/><img src="../icons8-go-back.gif" className="activeIcon" alt="back" title="back"/></Link>
          <br/>
          <br/>
          <div className="albumAdd">
            <form onSubmit={addAlbum}>
                <input required placeholder="Artist" value={artist} type="text" name="artist" onChange={(e) => setArtist(e.target.value)} />
                <input required placeholder="Album title" value={title} type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
                <input required placeholder="Release date" value={releaseDate} type="date" name="releaseDate" onChange={(e) => setReleaseDate(e.target.value)} />
                <input required type="url" placeholder="Cover" value={cover} name="cover" onChange={(e) => setCover(e.target.value)} />
                <button type="submit"><img src="../icons8-plus.png" alt="add album" title="add album" /></button>
            </form>
            {albumId !== 0 ? (<AlbumInformation albumId={albumId} />) : <div/>}
          </div>
        </div>
    )
}
