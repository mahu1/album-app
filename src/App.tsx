import { Routes, Route } from 'react-router-dom'
import { FeedbackMessageContextProvider } from "./FeedbackMessageContextProvider"
import { AlbumSearch } from './views/AlbumSearch'
import { Album } from './views/Album'
import { AlbumAdd } from './views/AlbumAdd'
import { AlbumEdit } from './views/AlbumEdit'
import { NotFoundError } from './views/NotFoundError'
import { Artists } from './views/Artists'
import { Genres } from './views/Genres'

export const App = () => {

  return (
    <>
      <FeedbackMessageContextProvider>
        <Routes>
          <Route path="/" Component={AlbumSearch} />
          <Route path="/album/:id" Component={Album} />
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
