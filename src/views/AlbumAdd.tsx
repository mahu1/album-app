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
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select2 from '@mui/material/Select'

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
          <br/>
          <br/>
          <div className="albumInformation">
            <form onSubmit={addAlbum}>
              <InputLabel id="select-artist-label">{strings.artist}<Link to={`/artists`}><img src="../icons8-edit.png" className="staticIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/><img src="../icons8-edit.gif" className="activeIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/></Link></InputLabel>
              <Select2 required size="small" style={{minWidth: 250}} labelId="select-artist-label" label="Age" value={artist} onChange={(e) => setArtist(e.target.value)}>
                {artists.map((artist) => (
                  <MenuItem key={artist.id} value={artist.title}>{artist.title}</MenuItem>
                ))}
              </Select2>
              <TextField required size="small" label={strings.album_title} variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input required type="date" placeholder={strings.release_date} value={releaseDate} name="releaseDate" onChange={(e) => setReleaseDate(e.target.value)} />
              <TextField required type="url" size="small" label={strings.cover} variant="outlined" value={cover} onChange={(e) => setCover(e.target.value)} />
              <button type="submit"><img src="../icons8-plus.png" alt={strings.add_album} title={strings.add_album} /></button>
              <div className="selectList">
                <Select className="selectListInput" options={allGenresList} placeholder={strings.genres} value={selectedGenres} onChange={changeGenreValue} isSearchable={true} isMulti />
                <Link to={`/genres`}><img src="../icons8-view.png" className="staticIconSmall" alt={strings.view_genres} title={strings.view_genres}/><img src="../icons8-view.gif" className="activeIconSmall" alt={strings.view_genres} title={strings.view_genres}/></Link>
              </div>
            </form>
            {albumId !== 0 ? (<AlbumInformation albumId={albumId} />) : <div/>}
          </div>
        </div>
    )
}
