import { Routes, Route } from 'react-router-dom'
import { FeedbackMessageContextProvider } from "./FeedbackMessageContextProvider"
import { AlbumSearch } from './views/AlbumSearch'
import { AlbumView } from './views/AlbumView'
import { AlbumAdd } from './views/AlbumAdd'
import { AlbumEdit } from './views/AlbumEdit'
import { NotFoundError } from './views/NotFoundError'
import { Artists } from './views/Artists'
import { Genres } from './views/Genres'
import { Link } from 'react-router-dom'
import { strings } from './Localization'
import { useLocation } from 'react-router-dom'

export const App = () => {

  return (
    <>
      {useLocation().pathname !== '/' ? <Link to={`/`}><img src="../icons8-go-back.png" className="staticIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/><img src="../icons8-go-back.gif" className="activeIcon" alt={strings.back_to_album_search} title={strings.back_to_album_search}/></Link> : ''}
      <FeedbackMessageContextProvider>
        <Routes>
          <Route path="/" Component={AlbumSearch} />
          <Route path="/album/:id" Component={AlbumView} />
          <Route path="/albumAdd" Component={AlbumAdd} />
          <Route path="/albumEdit/:id" Component={AlbumEdit} />
          <Route path="/artists" Component={Artists} />
          <Route path="/genres" Component={Genres} />
          <Route path="*" Component={NotFoundError} />
        </Routes>
      </FeedbackMessageContextProvider>
    </>
  )
}
