import { IAlbum } from '../Interfaces'
import { useEffect, useState } from 'react'
import albumService from '../services/album'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getTracksFullLength, getTrackFullLength } from '../AlbumUtils'
import { strings } from '../Localization'
import { StarRate } from '../components/StarRate'

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
          <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back} title={strings.back}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back} title={strings.back}/></Link>
          <Link to={`/albumEdit/${album.id}`}><img src="../icons8-edit.png" className="editStaticIcon" alt={strings.edit} title={strings.edit}/><img src="../icons8-edit.gif" className="editActiveIcon" alt={strings.edit} title={strings.edit}/></Link>
          <br/>
          <br/>
          <div className="albumImgAndRating">
            <img className="albumImg" src={album.cover} alt={album.title} title={album.artist.title + " - " + album.title} />
            <div className="textCenter"><StarRate album={album} /></div>
          </div>
          <div className="albumInformation" key={album.id}>
            <div className="strongText">{album.artist.title} - {album.title}</div>
            <div>{album.releaseDate}</div>
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
      )}
    </>
  )
}
