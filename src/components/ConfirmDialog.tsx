import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { strings } from '../Localization'

interface DialogProps {
  open: boolean
  close: () => void
  action: () => Promise<void>
  titleText: string
  contentText: string
  actionButtonText: string
}

export const ConfirmDialog: React.FC<DialogProps> = ( {open, close, action, titleText, contentText, actionButtonText} ) => {

  return (
    <Dialog
      open={open}
      onClose={close}>
      <DialogTitle style={{whiteSpace: 'pre-line'}}>
        {titleText}
      </DialogTitle>
      <DialogContent>
          <DialogContentText style={{whiteSpace: 'pre-line'}}>
            {contentText}
          </DialogContentText>
        </DialogContent>
      <DialogActions>
        <Button onClick={close}>{strings.formatString(strings.cancel)}</Button>
        <Button onClick={action} autoFocus>{actionButtonText}</Button>
      </DialogActions>
    </Dialog>
  )
}
