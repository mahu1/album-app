import { useState, useEffect } from 'react'
import albumService from '../services/album'
import genreService from '../services/genre'
import { IAlbumPlain, IGenre } from '../Interfaces'
import { Link } from 'react-router-dom'
import { strings } from '../Localization'
import Select from "react-select"
import { ItemGroup, Genre } from '../AlbumUtils'

export const AlbumSearch = () => {
  const [searchWord, setSearchWord] = useState('')
  const [searchGroup, setSearchGroup] = useState(ItemGroup.Artist)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [genres, setGenres] = useState<IGenre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [albums, setAlbums] = useState<IAlbumPlain[]>([])

  useEffect(() => {
    albumService.getAll().then((data) => setAlbums(data))
    genreService.getAll().then((data) => setGenres(data))
  }, [])

  const allGenresList: Genre[] = genres.map((genre) =>({
    value: genre,
    label: genre.title
  }))

  const doSearch = (searchWord: string, searchGroup: ItemGroup, rating: number, selectedGenres: Genre[]): void => {
    setSearchWord(searchWord)
    setSearchGroup(searchGroup)
    setRating(rating)
    setSelectedGenres(selectedGenres)

    if (searchWord === '' && rating === 0 && genres.length === 0) {
      albumService.getAll().then(data => {
        setAlbums(data)
      })
    } else {
      albumService.getBySearchCriterias(searchWord, searchGroup, rating, selectedGenres.map(g => g.value.id)).then(data => {
        setAlbums(data)
      })
    }
  }

  const clearRating = (): void => {
    setHover(0)
    doSearch(searchWord, searchGroup, 0, selectedGenres)
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

  const changeGenreValue = (selectedGenres: any): void => {
    doSearch(searchWord, searchGroup, rating, selectedGenres)
  }

  return (
    <div>
      <Link to={`/albumAdd`}><img src="../icons8-add.png" className="addNewStaticIcon" alt={strings.add_album} title={strings.add_album}/><img src="../icons8-add.gif" className="addNewActiveIcon" alt={strings.add_album} title={strings.add_album}/></Link>
      <div className="searchFields">
        <input className="searchTextField" value={searchWord} onChange={(e) => doSearch(e.target.value, searchGroup, rating, selectedGenres)} placeholder={strings.search} />
          <label>
            <input defaultChecked onChange={() => doSearch(searchWord, ItemGroup.Artist, rating, selectedGenres)} type="radio" value="artist" name="searchGroup" />{strings.artist}
          </label>
          <label>
            <input onChange={() => doSearch(searchWord, ItemGroup.Album, rating, selectedGenres)} type="radio" value="album" name="searchGroup" />{strings.album}
          </label>
          <label>
            <input onChange={() => doSearch(searchWord, ItemGroup.Track, rating, selectedGenres)} type="radio" value="track" name="searchGroup" />{strings.track}
          </label>
          <div className="searchPageFilters">
            <Select className="searchPageSelectListInput" options={allGenresList} placeholder={strings.select_genres} value={selectedGenres} onChange={changeGenreValue} isSearchable={true} isMulti />
            {[...Array(5)].map((star, index) => {
              index++
              return (
                <button title={getStarRateButtonText(index)} key={index} className={index <= (hover || rating) ? "starOn" : "starOff"} onClick={() => doSearch(searchWord, searchGroup, index, selectedGenres)} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(rating)}>
                  <span className="star">&#9733;</span>
                </button>
            )})}
            <button title={strings.clear_rating} className={rating === 0 ? "hide" : "unRate"} onClick={() => clearRating()}>
              <span>&#8709;</span>
            </button>
          </div>
        </div>
      <div className="smallText">{getResultText()}</div>
      {albums.map((a) => (
        <div key={a.id} className="image-container">
          <div>
            <Link to={`/album/${a.id}`}>
              <img className="searchResultImg" src={a.cover} alt={a.title} />
              <div className="overlay">
                <div className="heavyText">{a.artist}</div>
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
