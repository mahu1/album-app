import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { strings } from '../Localization'

interface DialogProps {
  openDialog: boolean
  closeDialog: () => void
  removeObject: () => Promise<void>
  dialogTitle: string
  dialogContent: string
}

export const RemoveConfirmDialog: React.FC<DialogProps> = ( {openDialog, closeDialog, removeObject, dialogTitle, dialogContent} ) => {

  return (
      <Dialog
        open={openDialog}
        onClose={closeDialog}>
        <DialogTitle style={{whiteSpace: 'pre-line'}}>
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
            <DialogContentText style={{whiteSpace: 'pre-line'}}>
              {dialogContent}
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>{strings.formatString(strings.cancel)}</Button>
          <Button onClick={removeObject} autoFocus>{strings.formatString(strings.remove)}</Button>
        </DialogActions>
      </Dialog>
  )
}
