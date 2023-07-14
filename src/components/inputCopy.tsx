import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { ContentCopy } from '@mui/icons-material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'

export interface IInputCopyProps {
  value?: string
  visible: boolean
}

export default function InputCopy(props: IInputCopyProps) {
  const { value, visible } = props
  const [openTooltip, setTooltipOpen] = useState(false)

  const handleClickCopy = () => {
    if (!value) return
    navigator.clipboard.writeText(value)
    handleTooltipOpen()
  }

  const handleMouseDownCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleTooltipClose = () => {
    setTooltipOpen(false)
  }

  const handleTooltipOpen = () => {
    setTooltipOpen(true)
    setTimeout(() => setTooltipOpen(false), 600)
  }

  return (
    <InputAdornment position="end">
      {visible && value && (
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={openTooltip}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Copied ✓"
            >
              <IconButton
                aria-label="copy input"
                onClick={handleClickCopy}
                onMouseDown={handleMouseDownCopy}
                edge="end"
                sx={{ mr: -1, ml: -1, mt: -25 }}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </div>
        </ClickAwayListener>
      )}
    </InputAdornment>
  )
}