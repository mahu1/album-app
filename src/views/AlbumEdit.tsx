import { useParams, Link } from 'react-router-dom'
import { AlbumInformation } from '../components/AlbumInformation'
import { strings } from '../Localization'

export const AlbumEdit = () => {
    const { id } = useParams() as { id: string }

    return (
        <div>
          <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/></Link>
          <AlbumInformation albumId={+id} />  
        </div>
    )
}
