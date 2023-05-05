import { Routes, Route } from 'react-router-dom'
import { FeedbackMessageContext } from "./FeedbackMessageContext";
import { AlbumSearch } from './views/AlbumSearch'
import { Album } from './views/Album'
import { AlbumAdd } from './views/AlbumAdd'
import { AlbumEdit } from './views/AlbumEdit'
import { NotFoundError } from './views/NotFoundError'
import { useState } from 'react'



export enum FeedbackMessageType {
  Error = 'feedbackMessageError',
  Info = 'feedbackMessageInfo'
}


export const App = () => {
  const [feedbackMessage, setFeedbackMessage] = useState( {text: ``, feedbackMessageType: '', useTimer: false} )

  const runTimer = () => {
    setTimeout(
      () => {
        setFeedbackMessage( {text : ``, feedbackMessageType: '', useTimer: false} )
      }, 5000);
  }

  const FeedbackMessage = () => {
    if (feedbackMessage.useTimer) {
      runTimer()
    }

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
