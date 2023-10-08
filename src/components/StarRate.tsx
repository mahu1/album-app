import { IAlbum } from '../Interfaces'
import albumService from '../services/album'
import StyledRating from '@mui/material/Rating'

export const StarRate = (props: { album: IAlbum }) => {

    const rateAlbum = async (album: IAlbum, rating: number): Promise<void> => {
        if (album.id) {
            const editedAlbum = { ...album, rating: rating }
            await albumService.patch(album.id, editedAlbum)
        }
    }

    return (
        <>
            <StyledRating 
                name="rating"
                defaultValue={props.album.rating}
                precision={0.5}
                size="large"
                onChange={(event, newRating) => {
                    if (newRating !== null) {
                        rateAlbum(props.album, newRating)
                    }
                }} />

        </>
    )
}
