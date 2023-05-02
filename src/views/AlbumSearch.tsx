import { useState, useEffect, useContext } from 'react'
import { getAll, getByArtist, getByIds, getByAlbumTitle } from '../services/album'
import { getByTrackTitle } from '../services/track'
import { IAlbum } from '../Interfaces'
import { Link } from 'react-router-dom'
import { FeedbackMessageContext } from '../FeedbackMessageContext'

enum ItemGroup {
  Artist = 'artist',
  Album = 'album',
  Track = 'track'
}

export const AlbumSearch = () => {
  const [searchValue, setSearchValue] = useState('')
  const [searchGroup, setSearchGroup] = useState(ItemGroup.Artist)
  const [albums, setAlbums] = useState<IAlbum[]>([])
  const {setFeedbackMessage} = useContext(FeedbackMessageContext) as any

  useEffect(() => {
    getAll().then((data) => setAlbums(data))
  }, [])

  
  const doSearch = (searchValue: string): void => {
    setSearchValue(searchValue)

    if (searchValue === '') {
      getAll().then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Artist) {
      getByArtist(searchValue).then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Album) {
      getByAlbumTitle(searchValue).then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Track) {
      const albumIds:Set<number> = new Set()
      getByTrackTitle(searchValue).then(data => {
        data.forEach(d => albumIds.add(d.albumId))
        if (albumIds.size === 0) {
          setAlbums([])
        } else {
          getByIds(albumIds).then(album => {
            setAlbums(album)
          })
        }
      })
    }

  }

  return (
    <div>
      <div>
        <Link to={`/albumAdd`}><img src="../icons8-add.png" className="addNewStaticIcon" alt="add album" title="add album"/><img src="../icons8-add.gif" className="addNewActiveIcon" alt="add album" title="add album"/></Link>
        <input className="searchField" value={searchValue} onChange={(e) => doSearch(e.target.value)} placeholder="Search..." />
        <div className="searchButtons">
          <label>
            <input defaultChecked onChange={(e) => setSearchGroup(ItemGroup.Artist)} type="radio" value="artist" name="searchGroup" />Artist
          </label>
          <label>
            <input onChange={(e) => setSearchGroup(ItemGroup.Album)} type="radio" value="album" name="searchGroup" />Album
          </label>
          <label>
            <input onChange={(e) => setSearchGroup(ItemGroup.Track)} type="radio" value="track" name="searchGroup" />Track
          </label>
        </div>
      </div>
      {albums.map((a) => (
        <div key={a.id} className="image-container">
          <div>
            <Link to={`/album/${a.id}`}>
              <img className="searchResultImg" src={a.cover} alt={a.title} />
              <div className="overlay">
                <div>{a.artist}</div>
                <div>{a.title}</div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
