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
  feedbackMessageType: FeedbackMessageType
}

interface Ctx {
  setFeedbackMessage: (message: Message) => void
}

const FeedbackMessageContext = createContext<Ctx>({} as Ctx)

interface Props {
  children: ReactNode
}

export function FeedbackMessageContextProvider( { children }: Props ) {
    
  const [feedbackMessage, setFeedbackMessage] = useState<Message | null>(null)

  useEffect(() => { 
    const timeoutId = setTimeout(() => {
      setFeedbackMessage(null)
    }, 5000)
    return () => clearTimeout(timeoutId)
  }, [feedbackMessage?.text])

  const FeedbackMessage = (): JSX.Element => {
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
                onClick={() => {setFeedbackMessage(null)}}>
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

  return (
    <>
      <FeedbackMessage />
      <FeedbackMessageContext.Provider value={{setFeedbackMessage}}>
        {children}
      </FeedbackMessageContext.Provider>
    </>
  )
}
