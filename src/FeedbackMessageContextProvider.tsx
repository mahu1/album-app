import { useLocation } from 'react-router-dom'
import './App.css'
import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import CloseIcon from '@mui/icons-material/Close'

export const useFeedbackContext = () => useContext(FeedbackMessageContext)

export enum FeedbackMessageType {
    Error = 'error',
    Info = 'info'
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
      return(
        <Box fontFamily="Verdana" display="flex" justifyContent="center">
          <Collapse in={feedbackMessage ? true : false}>
            <Alert
              severity={feedbackMessage?.feedbackMessageType}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setFeedbackMessage(null);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {feedbackMessage?.text}
            </Alert>
          </Collapse>
        </Box>
      )
    }

    useEffect(() => { 
        if (feedbackMessage?.useTimer) {
          emptyFeedbackMessageAfterTimer(5000)
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
