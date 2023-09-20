import { useState, useEffect } from 'react'
import albumService from '../services/album'
import { IAlbum } from '../Interfaces'
import { Link } from 'react-router-dom'
import { strings } from '../Localization'

enum ItemGroup {
  Artist = 'artist',
  Album = 'album',
  Track = 'track'
}

export const AlbumSearch = () => {
  const [searchValue, setSearchValue] = useState('')
  const [searchGroup, setSearchGroup] = useState(ItemGroup.Artist)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [albums, setAlbums] = useState<IAlbum[]>([])

  useEffect(() => {
    albumService.getAll().then((data) => setAlbums(data))
  }, [])

  const doSearch = (searchValue: string, searchGroup: ItemGroup, rating: number): void => {
    setSearchValue(searchValue)
    setSearchGroup(searchGroup)
    setRating(rating)

    if (searchValue === '' && rating === 0) {
      albumService.getAll().then(data => {
        setAlbums(data)
      })
    } else if (searchValue === '') {
      albumService.getByRating(rating).then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Artist) {
      albumService.getByArtist(searchValue, rating).then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Album) {
      albumService.getByAlbumTitle(searchValue, rating).then(data => {
        setAlbums(data)
      })
    } else if (searchGroup === ItemGroup.Track) {
      albumService.getByTrackTitle(searchValue, rating).then(data => {
        setAlbums(data)
      })
    }
  }

  const clearRating = (): void => {
    setHover(0)
    doSearch(searchValue, searchGroup, 0)
  }

  const getResultText = (): string => {
    if (albums.length === 1) {
      return strings.formatString(strings.result, '' + albums.length) as string
    }
    return strings.formatString(strings.results, '' + albums.length) as string
  }

  const getStarRateButtonText = (star: number): string => {
    if (star === 1) {
        return strings.formatString(strings.star_at_least, star) as string
    }
    return strings.formatString(strings.stars_at_least, star) as string
}

  return (
    <div>
      <div>
        <Link to={`/albumAdd`}><img src="../icons8-add.png" className="addNewStaticIcon" alt={strings.add_album} title={strings.add_album}/><img src="../icons8-add.gif" className="addNewActiveIcon" alt={strings.add_album} title={strings.add_album}/></Link>
        <input className="searchField" value={searchValue} onChange={(e) => doSearch(e.target.value, searchGroup, rating)} placeholder={strings.search} />
        <div className="searchButtons">
          <label>
            <input defaultChecked onChange={(e) => doSearch(searchValue, ItemGroup.Artist, rating)} type="radio" value="artist" name="searchGroup" />{strings.artist}
          </label>
          <label>
            <input onChange={(e) => doSearch(searchValue, ItemGroup.Album, rating)} type="radio" value="album" name="searchGroup" />{strings.album}
          </label>
          <label>
            <input onChange={(e) => doSearch(searchValue, ItemGroup.Track, rating)} type="radio" value="track" name="searchGroup" />{strings.track}
          </label>
          <div>
            {[...Array(5)].map((star, index) => {
              index++
              return (
                <button type="button" title={getStarRateButtonText(index)} key={index} className={index <= (hover || rating) ? "starOn" : "starOff"} onClick={() => doSearch(searchValue, searchGroup, index)} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(rating)}>
                  <span className="star">&#9733;</span>
                </button>
                )})}
                <button type="button" title={strings.clear_rating} className={rating === 0 ? "hide" : "unRate"} onClick={() => clearRating()}>
                  <span>&#8709;</span>
                </button>
          </div>
        </div>
        <div className="smallText">{getResultText()}</div>
      </div>
      {albums.map((a) => (
        <div key={a.id} className="image-container">
          <div>
            <Link to={`/album/${a.id}`}>
              <img className="searchResultImg" src={a.cover} alt={a.title} />
              <div className="overlay">
                <div className="heavyText">{a.artist.title}</div>
                <div>{a.title}</div>
                <div>
                  {[...Array(5)].map((star, index) => {
                  index++
                  return (
                    <span key={index} className={(a.rating !== undefined && index > a.rating) ? "starOn" : "starOff"}>&#9733;</span>
                  )})}
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
