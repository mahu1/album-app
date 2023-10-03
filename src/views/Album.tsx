import { IAlbum } from '../Interfaces'
import { useEffect, useState } from 'react'
import albumService from '../services/album'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getTracksFullLength, getTrackFullLength } from '../AlbumUtils'
import { strings } from '../Localization'
import { StarRate } from '../components/StarRate'
import { format } from 'date-fns'

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
            <div className="albumImgAndRating">
              <img className="albumImg" src={album.cover} alt={album.title} title={album.artist.title + " - " + album.title} />
              <div className="textCenter"><StarRate album={album} /></div>
            </div>
            <div className="albumInformation" key={album.id}>
              <div className="strongText">{album.artist.title} - {album.title}</div>
              <div>{format(new Date(album.releaseDate), 'dd-MM-yyy')}</div>
              <div>{album.genres !== undefined ? album.genres.map((g) => g.title).sort().join(', ') : ''}</div>
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
                    <tr key={t.id}><td>{t.trackNumber}</td><td>{t.title}</td><td>{getTrackFullLength(t.seconds)}</td></tr>
                  ))}
                </tbody>
                <tfoot>
                    <tr>
                      <td/>
                      <td/>
                      <td>{getTracksFullLength(album.tracks)}</td>
                    </tr>
                  </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
