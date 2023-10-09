import { IAlbum } from '../Interfaces'
import { useEffect, useState } from 'react'
import albumService from '../services/album'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getTracksFullLength, getTrackFullLength } from '../AlbumUtils'
import { strings } from '../Localization'
import { StarRate } from '../components/StarRate'
import { format } from 'date-fns'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { TableFooter } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

const AlbumTitlePaper = styled(Paper)(() => ({
  background: '#fafafa'
}))

export const Album = () => {
  const { id } = useParams() as { id: string }
  const [album, setAlbum] = useState<IAlbum>()

  useEffect(() => {
    albumService.getById(+id).then(data => {
      setAlbum(data)
    })
  }, [id])

  return (
    <>
      {!album ? (
        <div></div>
      ) : (
        <div>
          <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/></Link>
          <Link to={`/albumEdit/${album.id}`}><img src="../icons8-edit.png" className="editStaticIcon" alt={strings.edit} title={strings.edit}/><img src="../icons8-edit.gif" className="editActiveIcon" alt={strings.edit} title={strings.edit}/></Link>
          <br/>
          <br/>
          <div className="albumInformation">
            <AlbumTitlePaper elevation={1}>
              <div className="strongText">{album.artist.title} - {album.title}</div>
              <div>{format(new Date(album.releaseDate), 'dd-MM-yyy')}</div>
              <div>{album.genres !== undefined ? album.genres.map((g) => g.title).sort().join(', ') : ''}</div>
            </AlbumTitlePaper>
            <div className="albumImgAndRating">
              <img className="albumImg" src={album.cover} alt={album.title} title={album.artist.title + " - " + album.title} />
              <div className="textCenter"><StarRate album={album} /></div>
            </div>
            <div className="albumInformation" key={album.id}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, maxWidth: 850 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{strings.no}</TableCell>
                      <TableCell>{strings.title}</TableCell>
                      <TableCell>{strings.length}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {album.tracks?.sort((a, b) => a.trackNumber > b.trackNumber ? 1 : -1).map((track) => (
                      <TableRow key={track.id}>
                        <TableCell>{track.trackNumber}</TableCell>
                        <TableCell>{track.title}</TableCell>
                        <TableCell>{getTrackFullLength(track.seconds)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell />
                      <TableCell />
                      <TableCell>{getTracksFullLength(album.tracks)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
