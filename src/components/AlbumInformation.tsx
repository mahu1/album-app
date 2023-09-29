import { IAlbum, ITrack, IArtist, IGenre } from '../Interfaces'
import { useState, useEffect, useContext } from 'react'
import albumService from '../services/album'
import trackService from '../services/track'
import artistService from '../services/artist'
import genreService from '../services/genre'
import { FeedbackMessageContext } from '../FeedbackMessageContext'
import { getTracksFullLength, getTrackFullLength, getFullLengthSeconds, getMinutes, getSeconds } from '../AlbumUtils'
import { FeedbackMessageType } from '../App'
import { useNavigate, Link } from 'react-router-dom'
import { strings } from '../Localization'
import { StarRate } from '../components/StarRate'
import Select from "react-select"
import { Genre } from '../AlbumUtils'

export const AlbumInformation = (props: { albumId: number }) => {
    const { albumId } = props;
    const [artists, setArtists] = useState<IArtist[]>([])
    const [genres, setGenres] = useState<IGenre[]>([])
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
    const [newTrackTitle, setNewTrackTitle] = useState('')
    const [newTrackLengthMinutes, setNewTrackLengthMinutes] = useState(0)
    const [newTrackLengthSeconds, setNewTrackLengthSeconds] = useState(0)
    const [album, setAlbum] = useState<IAlbum>()
    const {setFeedbackMessage} = useContext(FeedbackMessageContext) as any
    const navigate = useNavigate()

    useEffect(() => {
      albumService.getById(albumId).then(data => {
        setAlbum(data)
        setSelectedGenres(albumGenresList(data))
      })
      artistService.getAll(false).then(data => {
        setArtists(data)
      })
      genreService.getAll(false).then(data => {
        setGenres(data)
      })
    }, [albumId]) 

    const selectableGenresList = (album: IAlbum): Genre[] => {
      if (!album.genres) {
        return []
      }

      const selectableGenres: IGenre[] = []
      genres.forEach((genre) => {
        if (!album.genres?.find((albumGenre) => albumGenre.title === genre.title)) {
          selectableGenres.push(genre)
        }
      })

      return selectableGenres.map((genre) => ({
        value: genre,
        label: genre.title
      }))
    }

    const albumGenresList = (album: IAlbum): Genre[] => {
      if (!album.genres) {
        return []
      }
      return album.genres.sort((a, b) => a.title > b.title ? 1 : -1).map((genre) => ({
        value: genre,
        label: genre.title
      }))
    }
    
    const editArtist = async (album: IAlbum, artist: string): Promise<void> => {
      if (album.id) {
        const artistObject: IArtist = { title: artist }
        const editedAlbum = { ...album, artist: artistObject }
        try {
          await albumService.put(album.id, editedAlbum)
          setAlbum(await albumService.getById(album.id))
          setFeedbackMessage( {text: strings.formatString(strings.artist_edited, album.artist.title, artist), feedbackMessageType: FeedbackMessageType.Info} )
        } catch (error) {
          if (error instanceof Error && error.message === 'Request failed with status code 302') {
            setFeedbackMessage( {text: strings.formatString(strings.artist_edited, artist, album.title), feedbackMessageType: FeedbackMessageType.Error} )
          }
        }
      }
    }

    const editTitle = async (album: IAlbum, title: string): Promise<void> => {
      if (title.length === 0) {
        setFeedbackMessage( {text: strings.album_title_cannot_be_empty, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album.id && album.title !== title) {
        const changedTitle: {} = { title: title }
        try {
          await albumService.patch(album.id, changedTitle)
          setAlbum(await albumService.getById(album.id))
          setFeedbackMessage( {text: strings.formatString(strings.album_title_edited, album.title, title), feedbackMessageType: FeedbackMessageType.Info} )
        } catch (error) {
          if (error instanceof Error && error.message === 'Request failed with status code 302') {
            setFeedbackMessage( {text: strings.formatString(strings.album_already_found, album.artist.title, title), feedbackMessageType: FeedbackMessageType.Error} )
          }
        }
      }
    }

    const editReleaseDate = async (album: IAlbum, releaseDate: string): Promise<void> => {
      if (releaseDate.length === 0) {
        setFeedbackMessage( {text: strings.release_date_cannot_be_empty, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album.id && album.releaseDate !== releaseDate) {
        const changedReleaseDate: {} = { releaseDate: releaseDate }
        await albumService.patch(album.id, changedReleaseDate)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( {text: strings.formatString(strings.release_date_edited, album.releaseDate, releaseDate), feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editCover = async (album: IAlbum, cover: string): Promise<void> => {
      if (cover.length === 0) {
        setFeedbackMessage( {text: strings.cover_cannot_be_empty, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (album.id && album.cover !== cover) {
        const changedCover: {} = { cover: cover }
        await albumService.patch(album.id, changedCover)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( { text: strings.formatString(strings.cover_edited, album.cover.split('/').pop() as string, cover.split('/').pop() as string), feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editGenres = async (selectedGenres: any): Promise<void> => {
      setSelectedGenres(selectedGenres)
      let converted = selectedGenres as Genre[]
      if (album && album.id && album.genres) {
        const updateGenres: IGenre[] = []
        genres.forEach((genre) => {
          if (converted.find((albumGenre) => albumGenre.label === genre.title)) {
            updateGenres.push(genre)
          }
        })
        const originalGenres = album.genres
        album.genres = updateGenres
        await albumService.put(album.id, album)
        setAlbum(await albumService.getById(album.id))
        setFeedbackMessage( { text: strings.formatString(strings.genres_edited, originalGenres.map(genre => genre.title).join(', '), converted.map(genre => genre.label).join(', ')), feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTrackTitle = async (track: ITrack, trackTitle: string): Promise<void> => {
      if (trackTitle.length === 0) {
        setFeedbackMessage( {text: strings.track_title_cannot_be_empty, feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (track.id && track.title !== trackTitle) {
        const changedTrack: {} = { title: trackTitle }
        await trackService.patch(track.id, changedTrack)
        setAlbum(await albumService.getById(albumId))
        setFeedbackMessage( { text: strings.formatString(strings.track_title_edited, track.title, trackTitle), feedbackMessageType: FeedbackMessageType.Info} )
      }
    }

    const editTrackLengthMinutes = async (track: ITrack, trackLengthMinutes: number): Promise<void> => {
      if (track.id && getMinutes(track.seconds) !== trackLengthMinutes) {
        if (isNaN(trackLengthMinutes)) {
          setFeedbackMessage( { text: strings.track_minutes_cannot_be_empty, feedbackMessageType: FeedbackMessageType.Error } )
          return
        } else if (trackLengthMinutes < 0) {
          setFeedbackMessage( { text: strings.track_minutes_cannot_be_negative, feedbackMessageType: FeedbackMessageType.Error } )
          return
        } else if (trackLengthMinutes > 99) {
          setFeedbackMessage( { text: strings.track_minutes_maximum_value_is_99, feedbackMessageType: FeedbackMessageType.Error } )
          return
        }
        const trackLength = getFullLengthSeconds(trackLengthMinutes, getSeconds(track.seconds))
        const changedTrack: {} = { seconds: trackLength }
        await trackService.patch(track.id, changedTrack)
        setAlbum(await albumService.getById(albumId))
        setFeedbackMessage( { text: strings.formatString(strings.track_length_edited, getTrackFullLength(track.seconds), getTrackFullLength(trackLength)), feedbackMessageType: FeedbackMessageType.Info } )
      }
    }

    const editTrackLengthSeconds = async (track: ITrack, trackLengthSeconds: number): Promise<void> => {
      if (track.id && getSeconds(track.seconds) !== trackLengthSeconds) {
        if (isNaN(trackLengthSeconds)) {
          setFeedbackMessage( { text: strings.track_seconds_cannot_be_empty, feedbackMessageType: FeedbackMessageType.Error } )
          return
        } else if (trackLengthSeconds < 0) {
          setFeedbackMessage( { text: strings.track_seconds_cannot_be_negative, feedbackMessageType: FeedbackMessageType.Error } )
          return
        } else if (trackLengthSeconds > 59) {
          setFeedbackMessage( { text: strings.track_seconds_maximum_value_is_59, feedbackMessageType: FeedbackMessageType.Error } )
          return
        }
        const trackLength = getFullLengthSeconds(getMinutes(track.seconds), trackLengthSeconds)
        const changedTrack: {} = { seconds: trackLength }
        await trackService.patch(track.id, changedTrack)
        setAlbum(await albumService.getById(albumId))
        setFeedbackMessage( { text: strings.formatString(strings.track_length_edited, getTrackFullLength(track.seconds), getTrackFullLength(trackLength)), feedbackMessageType: FeedbackMessageType.Info } )
      }
    }

    const removeAlbum = async (album: IAlbum): Promise<void> => {
      if (album.id) {
        if (window.confirm(strings.formatString(strings.are_you_sure_you_want_to_remove_album, album.artist.title, album.title) as string)) {
          await albumService.remove(album.id)
          setFeedbackMessage({ text: strings.formatString(strings.album_removed, album.artist.title, album.title), feedbackMessageType: FeedbackMessageType.Info , useTimer: true } )
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
          seconds: getFullLengthSeconds(newTrackLengthMinutes, newTrackLengthSeconds),
          album: album
        }

        await trackService.create(track)
        setAlbum(await albumService.getById(albumId))
        setFeedbackMessage( { text: strings.formatString(strings.track_added, track.title), feedbackMessageType: FeedbackMessageType.Info })
        
        setNewTrackTitle('')
        setNewTrackLengthMinutes(0)
        setNewTrackLengthSeconds(0)
      }
    }
    
    const removeTrack = async (e: React.FormEvent, track: ITrack): Promise<void> => {
      e.preventDefault()
      if (track.id) {
        if (window.confirm(strings.formatString(strings.are_you_sure_you_want_to_remove_track, track.title) as string)) {
          await trackService.remove(track.id)
          setAlbum(await albumService.getById(albumId))
          setFeedbackMessage({ text: strings.formatString(strings.track_removed, track.title), feedbackMessageType: FeedbackMessageType.Info })
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
            <div className="albumInformation">
              <div className="albumImgAndRating">
                <Link to={`/album/${album.id}`}><img className="albumImg" src={album.cover} alt={album.title} title={album.artist.title + " - " + album.title} /></Link>
                <div className="textCenter"><StarRate album={album} /></div>
              </div>
            </div>
            <div className="albumInformation">
              <select value={album.artist.title} onChange={(e) => editArtist(album, e.target.value)}>
                {artists.map((artist) => (
                  <option key={artist.title} value={artist.title}>{artist.title}</option>
                ))}
              </select>
              <Link to={`/artists`}><img src="../icons8-edit.png" className="staticIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/><img src="../icons8-edit.gif" className="activeIconSmall" alt={strings.edit_artists} title={strings.edit_artists}/></Link>
              <input required type="text" placeholder={strings.album_title} name="title" key={album.title} defaultValue={album.title} onBlur={(e) => editTitle(album, e.target.value)} />
              <input required type="date" placeholder={strings.release_date} name="releaseDate" key={album.releaseDate} defaultValue={album.releaseDate} onBlur={(e) => editReleaseDate(album, e.target.value)} />
              <input required type="url" placeholder={strings.cover} name="cover" key={album.cover} defaultValue={album.cover} onBlur={(e) => editCover(album, e.target.value)} />
              <button onClick={() => removeAlbum(album)}><img src="../icons8-delete.png" alt={strings.release_date} title={strings.remove_album} /></button>
              <div className="selectList">
                <Select className="selectListInput" options={selectableGenresList(album)} placeholder={strings.select_genres} value={selectedGenres} onChange={editGenres} isSearchable={true} isMulti />
                <Link to={`/genres`}><img src="../icons8-view.png" className="staticIconSmall" alt={strings.view_genres} title={strings.view_genres}/><img src="../icons8-view.gif" className="activeIconSmall" alt={strings.view_genres} title={strings.view_genres}/></Link>
              </div>
            </div>
            <br/>
            <br/>
            <div className="tracksInformation">
              <form onSubmit={(e) => addTrack(e)}>
                <table>
                  <thead>
                    <tr>
                      <th>{strings.no}</th>
                      <th>{strings.title}</th>
                      <th>{strings.length}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {album.tracks?.sort((a, b) => a.trackNumber > b.trackNumber ? 1 : -1).map((t) => (
                    <tr key={t.id}>
                      <td><input disabled type="number" min="1" placeholder={strings.track_number} name="trackNumber" value={t.trackNumber} /></td>
                      <td><input required type="text" placeholder={strings.track_title} name="trackTitle" defaultValue={t.title} onBlur={(e) => editTrackTitle(t, e.target.value)} /></td>
                      <td><input required type="number" placeholder={strings.mm} min="0" max="99" name="trackLengthMinutes" defaultValue={getMinutes(t.seconds)} onBlur={(e) => editTrackLengthMinutes(t, e.target.valueAsNumber)} />:<input required type="number" placeholder={strings.ss} min="0" max="59" name="trackLengthSeconds" defaultValue={getSeconds(t.seconds)} onBlur={(e) => editTrackLengthSeconds(t, e.target.valueAsNumber)} /></td>
                      <td><button onClick={(e) => removeTrack(e, t)}><img src="../icons8-delete.png" alt={strings.remove_track} title={strings.remove_track} /></button></td>
                    </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td><input required type="text" placeholder={strings.track_title} name="newTrackTitle" value={newTrackTitle} onChange={(e) => setNewTrackTitle(e.target.value)} /></td>
                      <td><input required type="number" placeholder={strings.mm} min="0" max="99" name="newTrackLengthMinutes" value={newTrackLengthMinutes} onChange={(e) => setNewTrackLengthMinutes(isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)} />:<input required type="number" placeholder={strings.ss} min="0" max="59" name="newTrackLengthSeconds" value={newTrackLengthSeconds} onChange={(e) => setNewTrackLengthSeconds(isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)} /></td>
                      <td><button type="submit"><img src="../icons8-plus.png" alt={strings.add_track} title={strings.add_track} /></button></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td/>
                      <td/>
                      <td>{getTracksFullLength(album.tracks)}</td>
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
