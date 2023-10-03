import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import genreService from '../services/genre'
import { IGenre } from '../Interfaces'
import { strings } from '../Localization'

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
        <table>
          <thead>
            <tr>
              <th>{strings.genre}</th>
              <th>{strings.albums}</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((genre) => (
              <tr key={genre.id}>
                <td>{genre.title}</td>
                <td>
                  <ul className="smallText">
                    {genre.albums?.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1).map((album) => (
                      <li key={album.id}><Link to={`/album/${album.id}`}>{album.artist} - {album.title}</Link></li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

}
