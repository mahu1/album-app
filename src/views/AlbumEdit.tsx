import { useParams, Link } from 'react-router-dom'
import { AlbumInformation } from '../components/AlbumInformation'
import { strings } from '../Localization'

export const AlbumEdit = () => {
    const { id } = useParams() as { id: string }

    return (
        <div>
          <Link to={`/album/${id}`}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back} title={strings.back}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back} title={strings.back}/></Link>
          <AlbumInformation albumId={+id} />  
        </div>
    )
}
