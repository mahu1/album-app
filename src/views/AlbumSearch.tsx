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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'

export const AlbumSearch = () => {
  const [searchWord, setSearchWord] = useState('')
  const [searchGroup, setSearchGroup] = useState(ItemGroup.Artist)
  const [rating, setRating] = useState(0)
  const [genres, setGenres] = useState<IGenre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [releaseDateStart, setReleaseDateStart] = useState<Date | undefined | null>(undefined)
  const [releaseDateEnd, setReleaseDateEnd] = useState<Date | undefined | null>(undefined)
  const [albums, setAlbums] = useState<IAlbumPlain[]>([])

  useEffect(() => {
    albumService.getAll().then((data) => setAlbums(data))
    genreService.getAll().then((data) => setGenres(data))
  }, [])

  const allGenresList: Genre[] = genres.map((genre) =>({
    value: genre,
    label: genre.title
  }))

  const doSearch = (searchWord: string, searchGroup: ItemGroup, rating: number, selectedGenres: Genre[], releaseDateStart: Date | undefined | null,  releaseDateEnd: Date | undefined | null): void => {
    setSearchWord(searchWord)
    setSearchGroup(searchGroup)
    setRating(rating)
    setSelectedGenres(selectedGenres)
    setReleaseDateStart(releaseDateStart)
    setReleaseDateEnd(releaseDateEnd)
    console.log(releaseDateStart)

    if (searchWord === '' && rating === 0 && selectedGenres.length === 0 && releaseDateStart === undefined && releaseDateEnd === undefined === undefined) {
      albumService.getAll().then(data => {
        setAlbums(data)
      })
    } else {
      albumService.getBySearchCriterias(searchWord, searchGroup, rating, selectedGenres.map(g => g.value.id), releaseDateStart, releaseDateEnd).then(data => {
        setAlbums(data)
      })
    }
  }

  const clearRating = (): void => {
    doSearch(searchWord, searchGroup, 0, selectedGenres, releaseDateStart, releaseDateEnd)
  }

  const getResultText = (): string => {
    if (albums.length === 1) {
      return strings.formatString(strings.result, '' + albums.length) as string
    }
    return strings.formatString(strings.results, '' + albums.length) as string
  }

  const changeGenreValue = (selectedGenres: any): void => {
    doSearch(searchWord, searchGroup, rating, selectedGenres, releaseDateStart, releaseDateEnd)
  }

  const handleSearchGroupChange = (
    event: React.MouseEvent<HTMLElement>,
    searchGroup: ItemGroup,
  ) => {
    setSearchGroup(searchGroup);
  }

  const disableKeyboardEntry = (e: any) => {
    if (e?.preventDefault) { 
      e?.preventDefault();
      e?.stopPropagation();
    }
  }

  return (
    <div>
      <Link to={`/albumAdd`}><img src="../icons8-add.png" className="addNewStaticIcon" alt={strings.add_album} title={strings.add_album}/><img src="../icons8-add.gif" className="addNewActiveIcon" alt={strings.add_album} title={strings.add_album}/></Link>
      <div className="searchFields">
        <TextField className="searchTextField" size="small" label={strings.search} variant="outlined" value={searchWord} onChange={(e) => doSearch(e.target.value, searchGroup, rating, selectedGenres, releaseDateStart, releaseDateEnd)}/>
        <ToggleButtonGroup color="primary" size="small" value={searchGroup} exclusive onChange={handleSearchGroupChange}>
          <ToggleButton value="artist">{strings.artist}</ToggleButton>
          <ToggleButton value="album">{strings.album}</ToggleButton>
          <ToggleButton value="track">{strings.track}</ToggleButton>
        </ToggleButtonGroup>
        <div className="searchPageFilters">
          <Select className="searchPageSelectListInput" options={allGenresList} placeholder={strings.genres} value={selectedGenres} onChange={changeGenreValue} isSearchable={true} isMulti />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker format="DD-MM-YYYY" defaultValue={undefined} slotProps={{ field: { clearable: true }, textField: { size: "small", onBeforeInput: disableKeyboardEntry }}} label={strings.from} onChange={(releaseDateStart) => doSearch(searchWord, searchGroup, rating, selectedGenres, releaseDateStart, releaseDateEnd)} />
            <DatePicker format="DD-MM-YYYY" defaultValue={undefined} slotProps={{ field: { clearable: true }, textField: { size: "small", onBeforeInput: disableKeyboardEntry }}} label={strings.to} onChange={(releaseDateEnd) => doSearch(searchWord, searchGroup, rating, selectedGenres, releaseDateStart, releaseDateEnd)} />
          </LocalizationProvider>
          <StyledRating 
            name="rating" 
            className="searchPageRating"
            title={strings.rating_at_least}
            defaultValue={0}
            precision={0.5}
            size="large"
            onChange={(event, newRating) => {
              if (newRating !== null) {
                doSearch(searchWord, searchGroup, newRating, selectedGenres, releaseDateStart, releaseDateEnd)
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
