import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import { useEffect, useState } from 'react'
import { ISavedSecret } from '../../src/state'
import Grid from '@mui/material/Grid'
import { DisableGrammarlyProps } from '../common/common'

export interface ISaveSecretDialog {
  isOpen: boolean
  initialValue: string
  handleClose: () => void
  handleSave: (secret: ISavedSecret) => void
}

enum EExpiration {
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}

const DefaultFormState = {
  label: '',
  value: '',
  expiration: EExpiration.Week,
  isError: false,
  isOpened: false,
}

function getExpirationDate(expiration: EExpiration): Date {
  const now = new Date()
  const getDate = {
    [EExpiration.Hour]: () => now.setHours(now.getHours() + 1),
    [EExpiration.Day]: () => now.setDate(now.getDate() + 1),
    [EExpiration.Week]: () => now.setDate(now.getDate() + 7),
    [EExpiration.Month]: () => now.setMonth(now.getMonth() + 1),
    [EExpiration.Year]: () => now.setMonth(now.getMonth() + 12),
  }
  getDate[expiration]()
  return now
}

export default function SaveSecretDialog(props: ISaveSecretDialog) {
  const { isOpen, initialValue, handleClose, handleSave } = props
  const [state, setState] = useState({ ...DefaultFormState, value: initialValue, isOpened: isOpen })

  useEffect(() => {
    // Reset form on dialog open/close
    setState({ ...DefaultFormState, value: initialValue, isOpened: isOpen })
  }, [isOpen, initialValue])

  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, label: e.target.value, isOpened: false }))
  }

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, value: e.target.value, isOpened: false }))
  }

  const onExpirationChange = (e: SelectChangeEvent<EExpiration>) => {
    setState((state) => ({ ...state, expiration: e.target.value as EExpiration, isOpened: false }))
  }

  const handleSaveClick = () => {
    if (!state.label || !state.value) {
      setState((state) => ({ ...state, isError: true, isOpened: false }))
      return
    }
    const expiration = getExpirationDate(state.expiration)
    const { label, value } = state
    handleSave({ expiration, label, value })
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Save secret</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your secret will be saved in local storage and deleted after the expiration date.
        </DialogContentText>
        <DialogContentText>Note: saved secrets are not visible.</DialogContentText>
        <Grid
          item
          container
          direction={'row'}
          alignItems={'flex-end'}
          justifyContent={'space-between'}
          sx={{ mt: 2 }}
        >
          <Grid item sm={4.5} xs={12}>
            <TextField
              helperText=" "
              required
              value={state.label}
              onChange={onLabelChange}
              error={state.isError && !state.label}
              sx={{ width: '100%' }}
              inputRef={(input) => state.isOpened && input?.focus()}
              id="label"
              label="Label"
              variant="standard"
            />
          </Grid>
          <Grid item sm={4.5} xs={12}>
            <TextField
              helperText=" "
              required
              value={state.value}
              error={state.isError && !state.value}
              onChange={onValueChange}
              sx={{ width: '100%' }}
              id="secret"
              label="Value"
              variant="standard"
              inputProps={DisableGrammarlyProps}
            />
          </Grid>
          <Grid item sm={'auto'} xs={12}>
            <FormControl>
              <Select value={state.expiration} variant="standard" onChange={onExpirationChange}>
                <MenuItem value={EExpiration.Hour}>1 hour</MenuItem>
                <MenuItem value={EExpiration.Day}>1 day</MenuItem>
                <MenuItem value={EExpiration.Week}>1 week</MenuItem>
                <MenuItem value={EExpiration.Month}>1 month</MenuItem>
                <MenuItem value={EExpiration.Year}>1 year</MenuItem>
              </Select>
              <FormHelperText>Delete after</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onMouseDown={handleClose}>Cancel</Button>
        <Button onClick={handleSaveClick}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
