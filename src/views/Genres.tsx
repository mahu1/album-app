import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import genreService from '../services/genre'
import { IGenre } from '../Interfaces'
import { useFeedbackContext } from '../FeedbackMessageContextProvider'
import { FeedbackMessageType } from '../FeedbackMessageContextProvider'
import { strings } from '../Localization'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { getAlbumsListText } from '../AlbumUtils'

export const Genres = () => {
  const { setFeedbackMessage } = useFeedbackContext()
  const [genres, setGenres] = useState<IGenre[]>([])
  const [newGenreTitle, setNewGenreTitle] = useState('')
  const [genre, setGenre] = useState<IGenre>()
  const [openGenreRemoveConfirmDialog, setOpenGenreRemoveConfirmDialog] = useState(false)

  useEffect(() => {
    genreService.getAll().then((data) => setGenres(data))
  }, [])

  const removeGenreClick = async (e: React.FormEvent, genre: IGenre): Promise<void> => {
    e.preventDefault()
    setGenre(genre)
    setOpenGenreRemoveConfirmDialog(true)
  }

  const removeGenre = async (): Promise<void> => {
    if (genre && genre.id) {
      await genreService.remove(genre.id)
      genreService.getAll().then((data) => setGenres(data))
      setOpenGenreRemoveConfirmDialog(false)
      setFeedbackMessage( { text: strings.formatString(strings.genre_removed, genre.title), feedbackMessageType: FeedbackMessageType.Info} )
    }
  }

  const editGenreTitle = async (genre: IGenre, genreTitle: string): Promise<void> => {
    if (genre.title !== genreTitle) {
      if (genreTitle.length === 0) {
        setFeedbackMessage( {text: strings.artist_title_cannot_be_empty, feedbackMessageType: FeedbackMessageType.Error} )
        return
      } else if (genres.some(a => a.title === genreTitle)) {
        setFeedbackMessage( {text: strings.formatString(strings.genre_already_found, genre.title), feedbackMessageType: FeedbackMessageType.Error} )
        return
      }

      if (genre.id && genre.title !== genreTitle) {
        const changedGenre: {} = { title: genreTitle }
        await genreService.patch(genre.id, changedGenre)
        genreService.getAll().then((data) => setGenres(data))
        setFeedbackMessage( { text: strings.formatString(strings.artist_title_edited, genre.title, genreTitle), feedbackMessageType: FeedbackMessageType.Info} )
      }
    }
  }

  const addArtist = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (genres.some(a => a.title === newGenreTitle)) {
      setFeedbackMessage( { text: strings.formatString(strings.artist_already_found, newGenreTitle), feedbackMessageType: FeedbackMessageType.Error} )
      return
    }
    const genre: IGenre = {
      title: newGenreTitle,
    }
    await genreService.create(genre)
    genreService.getAll().then((data) => setGenres(data))
    setFeedbackMessage( { text: strings.formatString(strings.genre_added, genre.title), feedbackMessageType: FeedbackMessageType.Info })
    setNewGenreTitle('')
  }

  const getRemoveGenresFromAlbumsConfirmText = (): string => {
    let genreRemoveConfirmText = ''
    if (genre && genre.albums && genre.albums.length > 0) {
      genreRemoveConfirmText = strings.formatString(strings.also_genre_will_be_removed_from_all_related_albums, getAlbumsListText(genre.albums)) as string
    }
    return genreRemoveConfirmText
  }

  return (
    <div>
      <br/>
      <br/>
      <div className="artistsInformation">
        <form onSubmit={(e) => addArtist(e)}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, maxWidth: 850 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{strings.genre}</TableCell>
                  <TableCell>{strings.albums}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {genres.map((genre) => (
                <TableRow key={genre.id}>
                  <TableCell>
                    <input required type="text" key={genre.title} placeholder={strings.genre_title} name="editGenreTitle" defaultValue={genre.title} onBlur={(e) => editGenreTitle(genre, e.target.value)} />
                  </TableCell>
                  <TableCell>
                  {genre.albums?.sort((a, b) => {
                    if ( a.releaseDate !==  b.releaseDate) {
                      return a.releaseDate > b.releaseDate ? 1 : -1
                    } else {
                      return a.title > b.title ? 1 : -1
                    }
                  }).map((album) => (
                    <div key={album.title} className="smallText"><Link to={`/album/${album.id}`}>{album.title}</Link></div>
                  ))}
                  </TableCell>
                  <TableCell><button onClick={(e) => removeGenreClick(e, genre)}><img src="../icons8-delete.png" title={strings.remove} alt={strings.remove} /></button></TableCell>
                </TableRow>
                ))}
              <TableRow>
                <TableCell><input required type="text" placeholder={strings.artist_title} name="newGenreTitle" value={newGenreTitle} onChange={(e) => setNewGenreTitle(e.target.value)} /></TableCell>
                <TableCell />
                <TableCell><button type="submit"><img src="../icons8-plus.png" alt={strings.add_genre} title={strings.add_genre} /></button></TableCell>
              </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </div>
      <ConfirmDialog 
        open={openGenreRemoveConfirmDialog} 
        close={() => setOpenGenreRemoveConfirmDialog(false)}
        action={() => removeGenre()}
        titleText={strings.formatString(strings.are_you_sure_you_want_to_remove_genre, genre ? genre.title : '') as string}
        contentText={getRemoveGenresFromAlbumsConfirmText()}
        actionButtonText={strings.remove} />
    </div>
  )

}
