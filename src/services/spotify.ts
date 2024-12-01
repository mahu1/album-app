import axios, { AxiosResponse } from 'axios'
import { IAlbum, IArtist, IGenre } from '../Interfaces'

const getSpotifyToken = async (): Promise<string | null> => {
  const clientId: string = '899530afd3fc40d38b9d6cb9710e7be6'
  const clientSecret: string = 'c2d1fd49f053414b88357b1ea81bf471'
  const tokenUrl: string = 'https://accounts.spotify.com/api/token'

  const params: URLSearchParams = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  
  const authHeader: string = 'Basic ' + window.btoa(`${clientId}:${clientSecret}`)
  
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': authHeader,
  }

  try {
    const response: AxiosResponse = await axios.post(tokenUrl, params, { headers })
    
    return response.data.access_token ?? null
  } catch (error: any) {
    return null
  }
}


const searchArtist = async (artistName: string, token: string) => { 
  const url = 'https://api.spotify.com/v1/search'
  const headers = { 'Authorization': `Bearer ${token}`, }
  const params = { q: artistName, type: 'artist', limit: 1, }
  try { 
    const response = await axios.get(url, { headers, params })
    const artists = response.data.artists.items
    if (artists.length > 0) { 
      return artists[0].id
    } else { 
      return null
    } 
  } catch (error) { 
    return null
    } 
  }
  
  const getArtistAlbums = async (artistId: string, token: string): Promise<IAlbum[] | null> => {
    const url = `https://api.spotify.com/v1/artists/${artistId}/albums`
    const headers = {
      'Authorization': `Bearer ${token}`,
    }
  
    const limit = 50
    let offset = 0
    let allAlbums: IAlbum[] = []
    let fetching = true
  
    while (fetching) {
      try {
        const response = await axios.get(url, {
          headers,
          params: { limit, offset, include_groups: 'album' },
        })
  
        const albums = response.data.items
        for (const album of albums) {
          const artistObject: IArtist = {
            title: album.artists[0].name
          }

          const genresObject: IGenre[] = [{
            title: album.genres
          }]

          const albumObject: IAlbum = {
            artist: artistObject,
            title: album.name,
            releaseDate: parseAlbumReleaseDate(album.release_date),
            cover: album.images[0].url,
            genres: genresObject,
          }
          allAlbums.push(albumObject)
        }

        offset += limit
  
        if (albums.length < limit) {
          fetching = false
        }
      } catch (error: any) {
        fetching = false
      }
    }
  
    allAlbums.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
    return allAlbums
  }
  
  
  
  const getAlbumsByArtistName = async (artistName: string) => { 
    const token = await getSpotifyToken()
    if (!token) { console.error('Failed to get access token')
      return
    } 
    const artistId = await searchArtist(artistName, token)
    if (!artistId) { 
      console.error('Failed to find artist')
      return
    } 
    const albums = await getArtistAlbums(artistId, token)
    return albums
  }


  const getAlbum = async (artistQuery: string, albumQuery: string): Promise<IAlbum | null> => {
    try {
      const token = await getSpotifyToken()
  
      if (!token) {
        return null
      }
  
      const searchUrl = 'https://api.spotify.com/v1/search'
      const query = `${artistQuery} ${albumQuery}`
      const type = 'album'
      
      const searchResponse = await axios.get(searchUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          q: query, 
          type: type,
          limit: 50,
        },
      })
  
      const albums = searchResponse.data.albums.items

      const album = albums.find((album: any) => 
        album.name.toLowerCase().trim() === albumQuery.toLowerCase().trim() && 
        (album.artists.some((artist: any) => artist.name.toLowerCase().trim().includes(artistQuery.toLowerCase().trim()) || artistQuery.toLowerCase().trim().includes(artist.name.toLowerCase().trim()))))


      if (!album) { 
        return null
      }
  
      const albumId = album.id
      const albumDetailsResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
  
      const albumDetails = albumDetailsResponse.data
  
      const artistId = albumDetails.artists[0].id
      const artistDetailsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
  
      const artistDetails = artistDetailsResponse.data
      if (!artistDetails) {
        return null
      }
  
      const artistObject: IArtist = {
        title: artistQuery,
      }
  
      let genresObject: IGenre[] = []
      if (albumDetails.genres && albumDetails.genres.length > 0) {
        genresObject = albumDetails.genres.map((genre: string) => ({
          title: genre,
        }))
      } else if (artistDetails.genres && artistDetails.genres.length > 0) {
        genresObject= artistDetails.genres.map((genre: string) => ({
          title: genre,
        }))
      }

      const albumObject: IAlbum = {
        artist: artistObject,
        title: albumDetails.name,
        releaseDate: parseAlbumReleaseDate(albumDetails.release_date),
        cover: albumDetails.images[0].url,
        genres: genresObject,
        tracks: albumDetails.tracks.items.map((track: any, index: number) => ({
          trackNumber: index + 1,
          title: track.name,
          seconds: track.duration_ms / 1000,
          discNumber: track.disc_number,
        })),
      }
      return albumObject
  
    } catch (error: any) {
      return null
    }
  }

  const parseAlbumReleaseDate = (date: string): string => {
    if (date.length === 4) {
      return `${date}-01-01`
    } else if (date.length === 7) {
      return `${date}-01`
    }
    return date
  }


const exportedObject = {
  getAlbum,
  getAlbumsByArtistName
}

export default exportedObject