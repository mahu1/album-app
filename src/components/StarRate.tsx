import { useState, useEffect } from 'react'
import { IAlbum } from '../Interfaces'
import albumService from '../services/album'
import { strings } from '../Localization'

export const StarRate = (props: { album: IAlbum }) => {

    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)

    useEffect(() => {
        if (props.album.rating) {
            setRating(props.album.rating)
        }
      }, [props.album])

    const rateAlbum = async (album: IAlbum, rating: number): Promise<void> => {
        if (album.id) {
            setRating(rating)
            const editedAlbum = { ...album, rating: rating }
            await albumService.patch(album.id, editedAlbum)
        }
    }

    const unrateAlbum = async (album: IAlbum): Promise<void> => {
        if (album.id) {
            setHover(0)
            setRating(0)
            const editedAlbum = { ...album, rating: undefined }
            await albumService.patch(album.id, editedAlbum)
        }
    }

    const getStarRateButtonText = (star: number): string => {
        if (star === 1) {
            return strings.formatString(strings.star, star) as string
        }
        return strings.formatString(strings.stars, star) as string
    }

    return (
        <>
            {[...Array(5)].map((star, index) => {
                index++
                return (
                    <button title={getStarRateButtonText(index)} key={index} className={index <= (hover || rating) ? "starOn" : "starOff"} onClick={() => rateAlbum(props.album, index)} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(rating)}>
                        <span className="star">&#9733;</span>
                    </button>
                )
            })}
            <button title={strings.clear_rating} className={rating === 0 ? "hide" : "unRate"} onClick={() => unrateAlbum(props.album)}>
                <span>&#8709;</span>
            </button>
        </>
    )
}
