import { useState } from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import IosShareIcon from '@mui/icons-material/IosShare'

interface ShareButtonProps {
  title: string
  text?: string
  url: string
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')

  const handleShare = async () => {
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
      <Button
        onClick={handleShare}
        startIcon={<IosShareIcon />}
        size="small"
        variant="outlined"
        aria-label="Diese Seite teilen"
      >
        Teilen
      </Button>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />
    </>
  )
}
