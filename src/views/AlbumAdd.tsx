import { IAlbum, IArtist, IGenre } from '../Interfaces'
import { useState, useEffect } from 'react'
import albumService from '../services/album'
import artistService from '../services/artist'
import genreService from '../services/genre'
import { Link } from 'react-router-dom'
import { AlbumInformation } from '../components/AlbumInformation'
import { useFeedbackContext } from '../FeedbackMessageContextProvider'
import { FeedbackMessageType } from '../FeedbackMessageContextProvider'
import { strings } from '../Localization'
import Select from "react-select"
import { Genre } from '../AlbumUtils'

export const AlbumAdd = () => {
    const [artists, setArtists] = useState<IArtist[]>([])
    const [genres, setGenres] = useState<IGenre[]>([])
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
    const [artist, setArtist] = useState('')
    const [title, setTitle] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [cover, setCover] = useState('')
    const [albumId, setAlbumId] = useState(0)
    const {setFeedbackMessage} = useFeedbackContext()

    useEffect(() => {
      artistService.getAll().then(data => {
        setArtists(data)
      })
      genreService.getAll().then(data => {
        setGenres(data)
      })
    }, [albumId])
    
    const allGenresList: Genre[] = genres.map((genre) => ({
      value: genre,
      label: genre.title
    }))

    const changeGenreValue = (selectedGenres: any): void => {
      setSelectedGenres(selectedGenres)
    }

    const addAlbum = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault()

      const artistObject: IArtist = {
        title: artist 
      }

      const album: IAlbum = {
        artist: artistObject,
        title: title,
        releaseDate: releaseDate,
        cover: cover,
        genres: selectedGenres.map(genre => genre.value)
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
          setSelectedGenres([])
        }
      } catch(error) {
        if (error instanceof Error && error.message === 'Request failed with status code 302') {
          setFeedbackMessage( {text: strings.formatString(strings.album_already_found, album.artist.title, title), feedbackMessageType: FeedbackMessageType.Error} )
        }
      }
    }

    return (
        <div>
          <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/></Link>
          <br/>
          <br/>
          <div className="albumInformation">
            <form onSubmit={addAlbum}>
              <select required value={artist} onChange={(e) => setArtist(e.target.value)}>
                <option key="0" value="">{strings.select_artist}</option>
                {artists.map((artist) => (
                  <option key={artist.title} value={artist.title}>{artist.title}</option>
                ))}
              </select>
              <Link to={`/artists`}><img src="../icons8-edit.png" className="staticIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/><img src="../icons8-edit.gif" className="activeIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/></Link>
              <input required type="text" placeholder={strings.album_title} value={title} name="title" onChange={(e) => setTitle(e.target.value)} />
              <input required type="date" placeholder={strings.release_date} value={releaseDate} name="releaseDate" onChange={(e) => setReleaseDate(e.target.value)} />
              <input required type="url" placeholder={strings.cover} value={cover} name="cover" onChange={(e) => setCover(e.target.value)} />
              <button type="submit"><img src="../icons8-plus.png" alt={strings.add_album} title={strings.add_album} /></button>
              <div className="selectList">
                <Select className="selectListInput" options={allGenresList} placeholder={strings.select_genres} value={selectedGenres} onChange={changeGenreValue} isSearchable={true} isMulti />
                <Link to={`/genres`}><img src="../icons8-view.png" className="staticIconSmall" alt={strings.view_genres} title={strings.view_genres}/><img src="../icons8-view.gif" className="activeIconSmall" alt={strings.view_genres} title={strings.view_genres}/></Link>
              </div>
            </form>
            {albumId !== 0 ? (<AlbumInformation albumId={albumId} />) : <div/>}
          </div>
        </div>
    )
}
