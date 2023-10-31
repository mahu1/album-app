import { useState, useEffect } from 'react'
import albumService from '../services/album'
import genreService from '../services/genre'
import trackService from '../services/track'
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
import Grid from '@mui/material/Unstable_Grid2'
import Container from '@mui/material/Container'
import Autocomplete from '@mui/material/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

export const AlbumSearch = () => {
  const [searchWord, setSearchWord] = useState('')
  const [searchGroup, setSearchGroup] = useState(ItemGroup.Album)
  const [rating, setRating] = useState(0)
  const [genres, setGenres] = useState<IGenre[]>([])
  const [allTrackTitles, setAllTrackTitles] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [releaseDateStart, setReleaseDateStart] = useState<Date | undefined | null>(undefined)
  const [releaseDateEnd, setReleaseDateEnd] = useState<Date | undefined | null>(undefined)
  const [albums, setAlbums] = useState<IAlbumPlain[]>([])

  useEffect(() => {
    albumService.getAll().then((data) => setAlbums(data))
    genreService.getAll().then((data) => setGenres(data))
    trackService.getAllTrackTitles().then((data) => setAllTrackTitles(data))
  }, [])

  const allGenresList: Genre[] = genres.map((genre) =>({
    value: genre,
    label: genre.title
  }))

  const doSearch = (searchWord: string, searchGroup: ItemGroup, rating: number, selectedGenres: Genre[], releaseDateStart: Date | undefined | null,  releaseDateEnd: Date | undefined | null): void => {
    if (releaseDateStart) {
      const convertedDate = new Date(releaseDateStart)
      if (isNaN(convertedDate.getTime())) {
        return
      }
    }
    if (releaseDateEnd) {
      const convertedDate = new Date(releaseDateEnd)
      if (isNaN(convertedDate.getTime())) {
        return
      }
    }

    setSearchWord(searchWord)
    setSearchGroup(searchGroup)
    setRating(rating)
    setSelectedGenres(selectedGenres)
    setReleaseDateStart(releaseDateStart)
    setReleaseDateEnd(releaseDateEnd)

    albumService.getBySearchCriterias(searchWord, searchGroup, rating, selectedGenres.map(g => g.value.id), releaseDateStart, releaseDateEnd).then(data => {
      setAlbums(data)
    })
  }

  const getResultText = (): string => {
    if (albums.length === 1) {
      return strings.formatString(strings.result, '' + albums.length) as string
    }
    return strings.formatString(strings.results, '' + albums.length) as string
  }

  const getSuggestions = (): Suggestion[] => {
    const albumsCopy = [...albums]
    if (ItemGroup.Artist === searchGroup) {
      return albumsCopy.filter((obj, index) => albumsCopy.findIndex((album) => album.artistTitle === obj.artistTitle) === index).sort((a, b) => a.artistTitle > b.artistTitle ? 1 : -1).map((album) => ({
        label: album.artistTitle
      }))
    } else if (ItemGroup.Album === searchGroup) {
      return albumsCopy.sort((a, b) => a.title > b.title ? 1 : -1).map((album) => ({
        label: album.title  
      }))
    } else {
      return allTrackTitles.map((track) => ({
        label: track
      }))
    }
  }

  type Suggestion = {
    label: string
  }

  return (
    <div>
      <Link to={`/albumAdd`}><img src="../icons8-add.png" className="addNewStaticIcon" alt={strings.add_album} title={strings.add_album}/><img src="../icons8-add.gif" className="addNewActiveIcon" alt={strings.add_album} title={strings.add_album}/></Link>
      <br/>
      <Container>
        <Grid container minHeight={100}>
          <Grid container xs={12} md={12}>
            <Autocomplete
              sx={{ width: 500 }}
              freeSolo={true}
              options={getSuggestions()}
              onInputChange={(event, newValue) => doSearch(newValue, searchGroup, rating, selectedGenres, releaseDateStart, releaseDateEnd)}
              renderInput={(params) => (
                <TextField {...params} size="small" label={strings.search} variant="outlined" value={searchWord} />
              )}
              renderOption={(props, option, { inputValue }) => {
                const matches = match(option.label, inputValue, { insideWords: true });
                const parts = parse(option.label, matches);
                return (
                  <li {...props}>
                    <div>
                        {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </li>
                )
              }}
            />
            <ToggleButtonGroup sx={{ height: '80%' }} color="primary" size="small" value={searchGroup} exclusive onChange={(e, value) => value != null ? doSearch(searchWord, value, rating, selectedGenres, releaseDateStart, releaseDateEnd) : ''}>
              <ToggleButton defaultChecked value="album">{strings.album}</ToggleButton>
              <ToggleButton value="artist">{strings.artist}</ToggleButton>
              <ToggleButton value="track">{strings.track}</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid paddingRight={2} xs={12} md={4}>
            <Select options={allGenresList} placeholder={strings.genres} value={selectedGenres} onChange={(value) => doSearch(searchWord, searchGroup, rating, value as Genre[], releaseDateStart, releaseDateEnd)} isSearchable={true} isMulti />
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid xs={6} md={3}>
              <DatePicker sx={{ width: "100% " }} format="DD-MM-YYYY" defaultValue={undefined} slotProps={{ field: { clearable: true }, textField: { size: "small" }}} label={strings.from} onChange={(releaseDateStart) => doSearch(searchWord, searchGroup, rating, selectedGenres, releaseDateStart, releaseDateEnd)} />
            </Grid>
            <Grid xs={6} md={3}>
              <DatePicker sx={{ width: "100% " }} format="DD-MM-YYYY" defaultValue={undefined} slotProps={{ field: { clearable: true }, textField: { size: "small" }}} label={strings.to} onChange={(releaseDateEnd) => doSearch(searchWord, searchGroup, rating, selectedGenres, releaseDateStart, releaseDateEnd)} />
            </Grid>
          </LocalizationProvider>
          <Grid paddingLeft={2} xs={12} md={2}>
            <StyledRating 
              title={strings.rating_at_least}
              defaultValue={0}
              precision={0.5}
              size="large"
              onChange={(event, newRating) => {
                if (newRating !== null) {
                  doSearch(searchWord, searchGroup, newRating, selectedGenres, releaseDateStart, releaseDateEnd)
                } else {
                  doSearch(searchWord, searchGroup, 0, selectedGenres, releaseDateStart, releaseDateEnd)
                }
              }} />
          </Grid>
        </Grid>
      </Container>
      <div className="smallText">{getResultText()}</div>
      {albums.map((a) => (
        <div key={a.id} className="image-container">
          <div>
            <Link to={`/album/${a.id}`}>
              <img className="searchResultImg" src={a.cover} alt={a.title} />
              <div className="overlay">
                <div className="heavyText">{a.artistTitle}</div>
                <div>{a.title}</div>
                <div>
                  <StyledRating defaultValue={a.rating} precision={0.5} size="small" readOnly />
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
