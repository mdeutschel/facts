import { useState, type MouseEvent } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import IosShareIcon from '@mui/icons-material/IosShare'

interface ShareButtonProps {
  title: string
  text?: string
  url: string
  variant?: 'button' | 'icon'
  ariaLabel?: string
}

export default function ShareButton({
  title,
  text,
  url,
  variant = 'button',
  ariaLabel = 'Diese Seite teilen',
}: ShareButtonProps) {
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')

  const handleShare = async (event: MouseEvent<HTMLButtonElement>) => {
    // Stop propagation so clicks inside larger clickable containers (e.g. an
    // expandable card header) don't trigger the parent's onClick.
    event.stopPropagation()

    const absoluteUrl = url.startsWith('http')
      ? url
      : `${window.location.origin}${url}`
    const shareData: ShareData = { title, url: absoluteUrl }
    if (text) shareData.text = text

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        // User dismissed the share sheet — silent, no fallback needed.
        if (err instanceof DOMException && err.name === 'AbortError') return
        // Other failures (e.g. permission denied) fall through to clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(absoluteUrl)
      setSnackMessage('Link kopiert')
    } catch {
      setSnackMessage('Teilen fehlgeschlagen — bitte Link aus der Adressleiste kopieren')
    }
    setSnackOpen(true)
  }

  return (
    <>
      {variant === 'icon' ? (
        <IconButton
          onClick={handleShare}
          size="small"
          aria-label={ariaLabel}
          sx={{ color: 'text.secondary' }}
        >
          <IosShareIcon fontSize="small" />
        </IconButton>
      ) : (
        <Button
          onClick={handleShare}
          startIcon={<IosShareIcon />}
          size="small"
          variant="outlined"
          aria-label={ariaLabel}
        >
          Teilen
        </Button>
      )}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />
    </>
  )
}
