import { IAlbum } from '../Interfaces'
import { useEffect, useState } from 'react'
import albumService from '../services/album'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getTracksFullLength, getTrackFullLength } from '../AlbumUtils'


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
          <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt="back" title="back"/><img src="../icons8-go-back.gif" className="activeIcon" alt="back" title="back"/></Link>
          <Link to={`/albumEdit/${album.id}`}><img src="../icons8-edit.png" className="editStaticIcon" alt="edit" title="edit"/><img src="../icons8-edit.gif" className="editActiveIcon" alt="edit" title="edit"/></Link>
          <br/>
          <br/>
          <img className="albumImg" src={album.cover} alt={album.title} title={album.artist.title + " - " + album.title} />
          <div className="albumInformation" key={album.id}>
            <div className="strongText">{album.artist.title} - {album.title}</div>
            <div>{album.releaseDate}</div>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Length</th>
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
