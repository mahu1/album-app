import { IAlbum, IArtist } from '../Interfaces'
import { useState, useEffect } from 'react'
import spotifyService from '../services/spotify'
import albumService from '../services/album'
import artistService from '../services/artist'
import { useFeedbackContext } from '../FeedbackMessageContextProvider'
import { FeedbackMessageType } from '../FeedbackMessageContextProvider'
import { strings } from '../Localization'
import { useNavigate, Link } from 'react-router-dom'
import { Autocomplete, TextField } from '@mui/material'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

export const AlbumAdd = () => {
    const { setFeedbackMessage } = useFeedbackContext()
    const navigate = useNavigate()
    const [albumTitleSuggestions, setAlbumTitleSuggestions] = useState<string[]>([])
    const [artists, setArtists] = useState<IArtist[]>([])
    const [artist, setArtist] = useState('')
    const [title, setTitle] = useState('')
    const [albumId, setAlbumId] = useState(0)
    const [spotifyAlbum, setSpotifyAlbum] = useState<IAlbum>()

    useEffect(() => {
      artistService.getAll().then(data => {
        setArtists(data)
      })
    }, [albumId])
  
    const addAlbum = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault()

      const artistObject: IArtist = {
        title: artist 
      }

      let album: IAlbum = {
        artist: artistObject,
        title: title,
        releaseDate: '',
        cover: '',
      }

      try {
        if (spotifyAlbum) {
          album = spotifyAlbum
        }
        album = await albumService.create(album)
        setAlbumId(album.id!)
        navigate('/albumEdit/' + album.id)
        setFeedbackMessage( {text: strings.formatString(strings.album_added, album.artist.title, album.title), feedbackMessageType: FeedbackMessageType.Info} )

        setArtist('')
        setTitle('')
      } catch(error) {
        if (error instanceof Error && error.message === 'Request failed with status code 302') {
          setFeedbackMessage( {text: strings.formatString(strings.album_already_found, album.artist.title, title), feedbackMessageType: FeedbackMessageType.Error} )
        }
      }
    }

    const changeArtist = async (artist: string): Promise<void> => {
      setArtist(artist)

      const spotifyAlbums = await spotifyService.getAlbumsByArtistName(artist)
      if (spotifyAlbums) {
        setAlbumTitleSuggestions(spotifyAlbums.map((sa) => sa.title))
      }
      findAlbumFromSpotify(artist, title)
    }

    const changeTitle = async (value: string): Promise<void> => {
      setTitle(value)
      findAlbumFromSpotify(artist, value)
    }

    const findAlbumFromSpotify = async (artist: string, title: string): Promise<void> => {
      if (artist && title) {
        const spotifyAlbum = await spotifyService.getAlbum(artist, title)
        if (spotifyAlbum) {
          setSpotifyAlbum(spotifyAlbum)
          setFeedbackMessage( {text: strings.formatString(strings.album_found_from_spotify, artist, title), feedbackMessageType: FeedbackMessageType.Info} )
        } else {
          setSpotifyAlbum(undefined)
          setFeedbackMessage( {text: strings.formatString(strings.album_not_found_from_spotify, artist, title), feedbackMessageType: FeedbackMessageType.Info} )
        }
      }
    }

    const getSuggestions = (): Suggestion[] => {
      return albumTitleSuggestions.map((ats) => ({
        label: ats
      }))
    }
  
    type Suggestion = {
      label: string
    }
  
    return (
      <div>
        <br/>
        <br/>
        <div className="albumInformation">
          <form onSubmit={addAlbum}>
            <span className="marginRight">
              <select required value={artist} onChange={(e) => changeArtist(e.target.value)}>
                <option key="0" value="">{strings.select_artist}</option>
                {artists.map((artist) => (
                  <option key={artist.title} value={artist.title}>{artist.title}</option>
                ))}
              </select>
              <Link to={`/artists`}><img src="../icons8-edit.png" className="staticIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/><img src="../icons8-edit.gif" className="activeIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/></Link>
            </span>
            <Autocomplete
              sx={{ width: 500 }}
              freeSolo={true}
              options={getSuggestions()}
              onInputChange={(event, newValue) => changeTitle(newValue)}
              renderInput={(params) => (
                <TextField {...params} size="small" label={strings.album} variant="outlined" value={title} />
              )}
              renderOption={(props, option, { inputValue }) => {
                const matches = match(option.label, inputValue, { insideWords: true });
                const parts = parse(option.label, matches);
                return (
                  <li {...props}>
                    <div>
                        {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </li>
                )
              }}
            />
            <span className="marginRight">
              <button type="submit"><img src="../icons8-plus.png" alt={strings.add_album} title={strings.add_album} /></button>
            </span>
          </form>
        </div>
      </div>
    )
}
