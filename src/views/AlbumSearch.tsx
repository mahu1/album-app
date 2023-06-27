import { useState, useEffect, useContext } from 'react'
import albumService from '../services/album'
import { IAlbum } from '../Interfaces'
import { Link } from 'react-router-dom'
import { FeedbackMessageContext } from '../FeedbackMessageContext'
import { FeedbackMessageType } from '../App'
import { strings } from '../Localization'

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
    albumService.getAll().then((data) => setAlbums(data))
  }, [])

  
  const doSearch = (searchValue: string, searchGroup: ItemGroup): void => {
    setSearchValue(searchValue)
    setSearchGroup(searchGroup)
    setFeedbackMessage( {text: ``, feedbackMessageType: ''} )

    const regExp = new RegExp('^[a-öA-Ö0-9_ ]*$');
    if (!regExp.test(searchValue)) {
      setFeedbackMessage( {text: strings.do_not_use_special_characters, feedbackMessageType: FeedbackMessageType.Error} )
      return
    }
    

    if (searchValue === '') {
      albumService.getAll().then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Artist) {
      albumService.getByArtist(searchValue).then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Album) {
      albumService.getByAlbumTitle(searchValue).then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Track) {
      albumService.getByTrackTitle(searchValue).then(data => {
        setAlbums(data)
      })
    }

  }

  return (
    <div>
      <div>
        <Link to={`/albumAdd`}><img src="../icons8-add.png" className="addNewStaticIcon" alt={strings.add_album} title={strings.add_album}/><img src="../icons8-add.gif" className="addNewActiveIcon" alt={strings.add_album} title={strings.add_album}/></Link>
        <input className="searchField" value={searchValue} onChange={(e) => doSearch(e.target.value, searchGroup)} placeholder={strings.search} />
        <div className="searchButtons">
          <label>
            <input defaultChecked onChange={(e) => doSearch(searchValue, ItemGroup.Artist)} type="radio" value="artist" name="searchGroup" />{strings.artist}
          </label>
          <label>
            <input onChange={(e) => doSearch(searchValue, ItemGroup.Album)} type="radio" value="album" name="searchGroup" />{strings.album}
          </label>
          <label>
            <input onChange={(e) => doSearch(searchValue, ItemGroup.Track)} type="radio" value="track" name="searchGroup" />{strings.track}
          </label>
        </div>
      </div>
      {albums.map((a) => (
        <div key={a.id} className="image-container">
          <div>
            <Link to={`/album/${a.id}`}>
              <img className="searchResultImg" src={a.cover} alt={a.title} />
              <div className="overlay">
                <div className="heavyText">{a.artist.title}</div>
                <div>{a.title}</div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
