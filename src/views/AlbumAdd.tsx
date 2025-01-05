import { IAlbum, IArtist } from '../Interfaces'
import { useState } from 'react'
import spotifyService from '../services/spotify'
import albumService from '../services/album'
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
    const [artistTitleSuggestions, setArtistTitleSuggestions] = useState<string[]>([])
    const [albumTitleSuggestions, setAlbumTitleSuggestions] = useState<string[]>([])
    const [artist, setArtist] = useState('')
    const [title, setTitle] = useState('')
    const [spotifyAlbum, setSpotifyAlbum] = useState<IAlbum>()
  
    const addAlbum = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault()

      const artistObject: IArtist = {
        title: artist 
      }

      let album: IAlbum = {
        artist: artistObject,
        title: title,
      }

      try {
        if (spotifyAlbum) {
          album = spotifyAlbum
        }
        album = await albumService.create(album)
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

      if (artist.length > 1) {
        const spotifyArtists = await spotifyService.getArtistByArtistName(artist)
        if (spotifyArtists) {
          setArtistTitleSuggestions(spotifyArtists.map((sa) => sa.title))
          const spotifyAlbums = await spotifyService.getAlbumsByArtistName(artist)
          if (spotifyAlbums) {
            setAlbumTitleSuggestions(spotifyAlbums.map((sa) => sa.title))
          }
        }
        findAlbumFromSpotify(artist, title)
      }
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

    const getArtistTitleSuggestions = (): Suggestion[] => {
      return artistTitleSuggestions.map((ats) => ({
        label: ats
      }))
    }

    const getAlbumTitleSuggestions = (): Suggestion[] => {
      return albumTitleSuggestions.map((ats) => ({
        label: ats
      }))
    }
  
    type Suggestion = {
      label: string
    }
  
  function changeAlbumTitle(title: string): void {
    setTitle(title)
    findAlbumFromSpotify(artist, title)
  }

    return (
      <div>
        <br/>
        <br/>
        <div className="albumInformation">
          <form onSubmit={addAlbum}>
            <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
              <Autocomplete
                sx={{ width: 500 }}
                freeSolo={true}
                options={getArtistTitleSuggestions()}
                onInputChange={(event, newValue) => changeArtist(newValue)}
                renderInput={(params) => (
                  <TextField {...params} size="small" label={strings.artist} variant="outlined" value={title} required />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option.label, inputValue, { insideWords: true })
                  const parts = parse(option.label, matches)
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
              <Link to={`/artists`}><img src="../icons8-edit.png" className="staticIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/><img src="../icons8-edit.gif" className="activeIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/></Link>
            </div>
            <Autocomplete
              sx={{ width: 500 }}
              freeSolo={true}
              options={getAlbumTitleSuggestions()}
              onInputChange={(event, newValue) => changeAlbumTitle(newValue)}
              renderInput={(params) => (
                <TextField {...params} size="small" label={strings.album} variant="outlined" value={title} required/>
              )}
              renderOption={(props, option, { inputValue }) => {
                const matches = match(option.label, inputValue, { insideWords: true })
                const parts = parse(option.label, matches)
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
