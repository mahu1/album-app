import { useLocation } from 'react-router-dom'
import './App.css'
import { strings } from './Localization'
import { createContext, useState, useContext, useEffect, ReactNode } from 'react'

export const useFeedbackContext = () => useContext(FeedbackMessageContext)

export enum FeedbackMessageType {
    Error = 'feedbackMessageError',
    Info = 'feedbackMessageInfo'
}

type Message = {
    text: string | string[],
    feedbackMessageType: FeedbackMessageType,
    useTimer?: boolean
}

interface Ctx {
    setFeedbackMessage: (message: Message) => void
}

const FeedbackMessageContext = createContext<Ctx>({} as Ctx)

interface Props {
    children: ReactNode
}

export function FeedbackMessageContextProvider( { children }: Props ) {

    const location = useLocation()
    
    const [feedbackMessage, setFeedbackMessage] = useState<Message | null>(null)

    const FeedbackMessage = (): JSX.Element | null => {
        if (feedbackMessage) {
          const prefix = feedbackMessage.feedbackMessageType === FeedbackMessageType.Error ? strings.error : ''
          return <div className={feedbackMessage.feedbackMessageType}>{prefix + feedbackMessage.text}</div>
        }
        return null
      }

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

    return (
        <>
            <FeedbackMessage />
            <FeedbackMessageContext.Provider value={{setFeedbackMessage}}>
                {children}
            </FeedbackMessageContext.Provider>
        </>
    )
}
