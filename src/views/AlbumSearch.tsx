import { useState, useEffect } from 'react'
import albumService from '../services/album'
import genreService from '../services/genre'
import { IAlbumPlain, IGenre } from '../Interfaces'
import { Link } from 'react-router-dom'
import { strings } from '../Localization'
import Select from "react-select"
import { ItemGroup, Genre } from '../AlbumUtils'
import StyledRating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export const AlbumSearch = () => {
  const [searchWord, setSearchWord] = useState('')
  const [searchGroup, setSearchGroup] = useState(ItemGroup.Artist)
  const [rating, setRating] = useState(0)
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

    if (searchWord === '' && rating === 0 && selectedGenres.length === 0) {
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
    doSearch(searchWord, searchGroup, 0, selectedGenres)
  }

  const getResultText = (): string => {
    if (albums.length === 1) {
      return strings.formatString(strings.result, '' + albums.length) as string
    }
    return strings.formatString(strings.results, '' + albums.length) as string
  }

  const changeGenreValue = (selectedGenres: any): void => {
    doSearch(searchWord, searchGroup, rating, selectedGenres)
  }

  const handleSearchGroupChange = (
    event: React.MouseEvent<HTMLElement>,
    searchGroup: ItemGroup,
  ) => {
    setSearchGroup(searchGroup);
  }

  return (
    <div>
      <Link to={`/albumAdd`}><img src="../icons8-add.png" className="addNewStaticIcon" alt={strings.add_album} title={strings.add_album}/><img src="../icons8-add.gif" className="addNewActiveIcon" alt={strings.add_album} title={strings.add_album}/></Link>
      <div className="searchFields">
        <TextField className="searchTextField" size="small" label={strings.search} variant="outlined" value={searchWord} onChange={(e) => doSearch(e.target.value, searchGroup, rating, selectedGenres)}/>
        <ToggleButtonGroup color="primary" size="small" value={searchGroup} exclusive onChange={handleSearchGroupChange}>
          <ToggleButton value="artist">{strings.artist}</ToggleButton>
          <ToggleButton value="album">{strings.album}</ToggleButton>
          <ToggleButton value="track">{strings.track}</ToggleButton>
        </ToggleButtonGroup>
        <div className="searchPageFilters">
          <Select className="searchPageSelectListInput" options={allGenresList} placeholder={strings.select_genres} value={selectedGenres} onChange={changeGenreValue} isSearchable={true} isMulti />
          <StyledRating 
            name="rating" 
            defaultValue={0}
            precision={0.5}
            size="large"
            onChange={(event, newRating) => {
              if (newRating !== null) {
                doSearch(searchWord, searchGroup, newRating, selectedGenres)
              } else {
                clearRating()
              }
            }} />
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
                  <StyledRating name="rating" defaultValue={a.rating} precision={0.5} size="small" readOnly />
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
