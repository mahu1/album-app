import axios, { AxiosResponse } from 'axios'
import { IAlbum, IArtist, IGenre } from '../Interfaces'
//import lyricsService from '../services/lyrics'

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
  

  const getArtistAlbums = async (artistId: string, token: string): Promise<IAlbum[]> => {
    const url = `https://api.spotify.com/v1/artists/${artistId}/albums`
    const headers = {
      'Authorization': `Bearer ${token}`,
    }
  
    const limit = 50  // Max limit per request
    let offset = 0
    let allAlbums: IAlbum[] = []
    let fetching = true
    const albumTitles = new Set<string>()
  
    while (fetching) {
      try {
        const response = await axios.get(url, {
          headers,
          params: { limit, offset, include_groups: 'album,single,compilation' },
        })
  
        const albums = response.data.items
        console.log(`Fetched ${albums.length} albums from offset ${offset}`)
  
        for (const album of albums) {
          // Ensure unique albums by title
          if (!albumTitles.has(album.name)) {
            albumTitles.add(album.name)
  
            const artistObject: IArtist = {
              title: album.artists[0].name
            }
  
            // Safeguard: Ensure album.genres is defined and is an array
            const genresObject: IGenre[] = [{
              title: album.genres && Array.isArray(album.genres) ? album.genres.join(", ") : "Unknown"
            }]
  
            const albumObject: IAlbum = {
              artist: artistObject,
              title: album.name,
              releaseDate: parseAlbumReleaseDate(album.release_date),
              cover: album.images[0]?.url,  // Safe access in case the images array is empty
              genres: genresObject,
            }
            allAlbums.push(albumObject)
          }
        }
  
        // If fewer albums are returned than the limit, it means we've fetched all available albums
        if (albums.length < limit) {
          fetching = false
        } else {
          offset += limit  // Move the offset forward to fetch the next batch
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching albums from Spotify:', error.response?.data)
          console.error('Error status:', error.response?.status)
        } else {
          console.error('Error message:', error.message)
        }
        fetching = false
      }
    }
  
    // Sort the albums by release date before returning
    return allAlbums.sort((a, b) => new Date(a.releaseDate!).getTime() - new Date(b.releaseDate!).getTime())
  }
      
  
  const searchArtists = async (artistName: string, token: string): Promise<IArtist[]> => {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
  
    const limit = 50; // Limit number of results per page
    const maxPages = 5; // Maximum number of pages to fetch in parallel
    const allArtists: IArtist[] = [];
  
    // Generate the requests for parallel fetching
    const requests: Promise<AxiosResponse>[] = [];
    for (let offset = 0; offset < maxPages * limit; offset += limit) {
      requests.push(
        axios.get(url, {
          headers,
          params: { limit, offset },
        })
      );
    }
  
    try {
      // Make all requests in parallel
      const responses = await Promise.all(requests);
  
      const uniqueArtistTitles = new Set<string>(); // Track unique artist names
  
      // Process all responses
      responses.forEach((response) => {
        const artists = response.data.artists.items;
  
        // Filter and process artist data
        artists.forEach((artist: any) => {
          // Case-insensitive check for artistName match
          if (artist.name.toLowerCase().includes(artistName.toLowerCase())) {
            // Ensure the artist name is unique
            if (!uniqueArtistTitles.has(artist.name)) {
              uniqueArtistTitles.add(artist.name); // Add artist's name to Set
              const artistObject: IArtist = {
                title: artist.name,
              };
              allArtists.push(artistObject); // Add the artist to the result list
            }
          }
        });
      });
    } catch (error: any) {
      console.error('Error fetching artists:', error.message || error);
    }
  
    console.log('All Artists:', allArtists);
    return allArtists;
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

  const getArtistByArtistName = async (artistName: string) => { 
    const token = await getSpotifyToken()
    if (!token) {
      console.error('Failed to get access token')
      return
    } 
    const artists = await searchArtists(artistName, token)
    return artists
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
        genresObject = artistDetails.genres.map((genre: string) => ({
          title: genre,
        }))
      }

      const albumObject: IAlbum = {
        artist: artistObject,
        title: albumDetails.name,
        releaseDate: parseAlbumReleaseDate(albumDetails.release_date),
        cover: albumDetails.images[0].url,
        genres: genresObject,
        tracks: await Promise.all(
          albumDetails.tracks.items.map(async (track: any, index: number) => ({
            trackNumber: index + 1,
            title: track.name,
            seconds: track.duration_ms / 1000,
            discNumber: track.disc_number,
            //lyrics: await lyricsService.fetchLyrics(artistObject.title, track.name) || '',  // Return empty string if no lyrics
          }))
        )
      }

      //lyricsService.fetchLyrics('Aerosmith12', 'Angel12')
      //.then(lyrics => console.log('Lyrics:', lyrics))
      //.catch(error => console.log('Error:', 'error'));

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
  getAlbumsByArtistName,
  getArtistByArtistName
}

export default exportedObject