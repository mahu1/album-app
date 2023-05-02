import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AlbumInformation } from '../components/AlbumInformation'


export const AlbumEdit = () => {
    const { id } = useParams() as { id: string }

    return (
        <div>
          <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt="back" title="back"/><img src="../icons8-go-back.gif" className="activeIcon" alt="back" title="back"/></Link>
          <AlbumInformation albumId={+id} />
        </div>
    )
}
