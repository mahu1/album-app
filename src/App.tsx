import { Routes, Route } from 'react-router-dom'
import { FeedbackMessageContext } from "./FeedbackMessageContext"
import { AlbumSearch } from './views/AlbumSearch'
import { Album } from './views/Album'
import { AlbumAdd } from './views/AlbumAdd'
import { AlbumEdit } from './views/AlbumEdit'
import { NotFoundError } from './views/NotFoundError'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Artists } from './views/Artists'
import { Genres } from './views/Genres'
import { strings } from './Localization'

export enum FeedbackMessageType {
  Error = 'feedbackMessageError',
  Info = 'feedbackMessageInfo'
}

type Message = {
  text: string,
  feedbackMessageType: FeedbackMessageType,
  useTimer: boolean
}

export const App = () => {
  const [feedbackMessage, setFeedbackMessage] = useState<Message | null>(null)

  const location = useLocation()

  useEffect(() => { 
    if (feedbackMessage?.useTimer) {
      emptyFeedbackMessageAfterTimer(3000)
    } else {
      setFeedbackMessage(null)
    }
  }, [location])

  const emptyFeedbackMessageAfterTimer = (time: number) => {
    setTimeout(
      () => {
        setFeedbackMessage(null)
      }, time)
  }

  const FeedbackMessage = (): JSX.Element | null => {
    if (feedbackMessage) {
      const prefix = feedbackMessage.feedbackMessageType === FeedbackMessageType.Error ? strings.error : ''
      return <div className={feedbackMessage.feedbackMessageType}>{prefix + feedbackMessage.text}</div>
    }
    return null
  }

  return (
    <>
      <FeedbackMessage />
      <FeedbackMessageContext.Provider value={{setFeedbackMessage}}>
        <Routes>
          <Route path="/" Component={AlbumSearch} />
          <Route path="/album/:id" Component={Album} />
          <Route path="/albumAdd" Component={AlbumAdd} />
          <Route path="/albumEdit/:id" Component={AlbumEdit} />
          <Route path="/artists" Component={Artists} />
          <Route path="/genres" Component={Genres} />
          <Route path="*" Component={NotFoundError} />
        </Routes>
      </FeedbackMessageContext.Provider>
    </>
  )
}
