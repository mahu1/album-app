import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import artistService from '../services/artist'
import { IArtist } from '../Interfaces'
import { useFeedbackContext } from '../FeedbackMessageContextProvider'
import { FeedbackMessageType } from '../FeedbackMessageContextProvider'
import { strings } from '../Localization'
import { AlertDialog } from '../components/AlertDialog'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export const Artists = () => {
  const [artists, setArtists] = useState<IArtist[]>([])
  const {setFeedbackMessage} = useFeedbackContext()
  const [newArtistTitle, setNewArtistTitle] = useState('')
  const [openAlertDialog, setOpenAlertDialog] = useState(false)
  const [artist, setArtist] = useState<IArtist>()

  useEffect(() => {
    artistService.getAll().then((data) => setArtists(data))
  }, [])

  const handleClose = () => {
    setOpenAlertDialog(false);
  }

  const removeArtistClick = async (e: React.FormEvent, artist: IArtist): Promise<void> => {
    e.preventDefault()
    setOpenAlertDialog(true)
    setArtist(artist)
  }

  const removeArtist = async (): Promise<void> => {
    if (artist && artist.id) {
      await artistService.remove(artist.id)
      artistService.getAll().then((data) => setArtists(data))
      setFeedbackMessage( { text: strings.formatString(strings.artist_removed, artist.title), feedbackMessageType: FeedbackMessageType.Info} )
      setOpenAlertDialog(false)
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
        artistService.getAll().then((data) => setArtists(data))
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
    artistService.getAll().then((data) => setArtists(data))
    setFeedbackMessage( { text: strings.formatString(strings.artist_added, artist.title), feedbackMessageType: FeedbackMessageType.Info })
    setNewArtistTitle('')
  }

  const getArtistRemoveConfirmText = (): string => {
    let artistRemoveConfirmText = ''
    if (artist && artist.albums && artist.albums.length > 0) {
      let albumsList: string = '\n'
      artist.albums.forEach((album) => {
        const albumItem: string = ' * ' + album.title + '\n'
        albumsList += albumItem
      })
      artistRemoveConfirmText = strings.formatString(strings.also_artists_all_albums_will_be_removed, albumsList) as string
    }
    return artistRemoveConfirmText
  }

  return (
    <div>
      <Link to={'/'}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/></Link>
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
                {artists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>
                    {artist.title}
                  </TableCell>
                  <TableCell>
                  {artist.albums?.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1).map((album) => (
                    <div className="smallText"><Link to={`/album/${album.id}`}>{album.title}</Link></div>
                  ))}
                  </TableCell>
                  <TableCell><button onClick={(e) => removeArtistClick(e, artist)}><img src="../icons8-delete.png" title={strings.remove} alt={strings.remove} /></button></TableCell>
                </TableRow>
                ))}
              <TableRow>
                <TableCell><input required type="text" placeholder={strings.artist_title} name="newArtistTitle" value={newArtistTitle} onChange={(e) => setNewArtistTitle(e.target.value)} /></TableCell>
                <TableCell />
                <TableCell><button type="submit"><img src="../icons8-plus.png" alt={strings.add_artist} title={strings.add_artist} /></button></TableCell>
              </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </form>
        <div><AlertDialog openDialog={openAlertDialog} /></div>
      </div>
      <div>
        <Dialog
          open={openAlertDialog}
          onClose={handleClose}>
          <DialogTitle>
            {strings.formatString(strings.are_you_sure_you_want_to_remove_artist, artist ? artist.title : '')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{whiteSpace: 'pre-line'}}>
              {getArtistRemoveConfirmText()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{strings.formatString(strings.cancel)}</Button>
            <Button onClick={removeArtist} autoFocus>{strings.formatString(strings.remove)}</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )

}
