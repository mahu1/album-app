import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import genreService from '../services/genre'
import { IGenre } from '../Interfaces'
import { strings } from '../Localization'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export const Genres = () => {

  const [genres, setGenres] = useState<IGenre[]>([])

  useEffect(() => {
    genreService.getAll().then((data) => setGenres(data))
  }, [])

  return (
    <div>
      <Link to={'/'}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/></Link>
      <br/>
      <br/>
      <div className="artistsInformation">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, maxWidth: 850 }}>
            <TableHead>
              <TableRow>
                <TableCell>{strings.genre}</TableCell>
                <TableCell>{strings.albums}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {genres.map((genre) => (
                <TableRow
                  key={genre.id}>
                    <TableCell>
                      {genre.title}
                    </TableCell>
                    <TableCell>
                        {genre.albums?.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1).map((album) => (
                          <div className="smallText"><Link to={`/album/${album.id}`}>{album.artist} - {album.title}</Link></div>
                        ))}
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )

}
