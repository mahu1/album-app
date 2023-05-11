import { Routes, Route } from 'react-router-dom'
import { FeedbackMessageContext } from "./FeedbackMessageContext";
import { AlbumSearch } from './views/AlbumSearch'
import { Album } from './views/Album'
import { AlbumAdd } from './views/AlbumAdd'
import { AlbumEdit } from './views/AlbumEdit'
import { NotFoundError } from './views/NotFoundError'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'



export enum FeedbackMessageType {
  Error = 'feedbackMessageError',
  Info = 'feedbackMessageInfo'
}


export const App = () => {
  const [feedbackMessage, setFeedbackMessage] = useState( {text: ``, feedbackMessageType: '', useTimer: false} )

  const location = useLocation()

  useEffect(() => { 
    if (feedbackMessage.useTimer) {
      emptyFeedbackMessageAfterTimer(5000)
    } else {
      setFeedbackMessage( {text: ``, feedbackMessageType: '', useTimer: false} )
    }
  }, [location])

  const emptyFeedbackMessageAfterTimer = (time: number) => {
    setTimeout(
      () => {
        setFeedbackMessage( {text: ``, feedbackMessageType: '', useTimer: false} )
      }, time)
  }

  const FeedbackMessage = () => {
    const prefix = feedbackMessage.feedbackMessageType === FeedbackMessageType.Error ? 'Error: ' : ''
    return <div className={feedbackMessage.feedbackMessageType}>{prefix + feedbackMessage.text}</div>
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
          <Route path="*" Component={NotFoundError} />
        </Routes>
      </FeedbackMessageContext.Provider>
    </>
  )
}
