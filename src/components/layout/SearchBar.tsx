import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

export default function SearchBar() {
  const [expanded, setExpanded] = useState(false)
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      navigate(`/suche?q=${encodeURIComponent(value.trim())}`)
      setExpanded(false)
    }
  }

  const handleClose = () => {
    setExpanded(false)
    setValue('')
  }

  if (!expanded) {
    return (
      <IconButton color="inherit" onClick={() => setExpanded(true)} aria-label="Suche öffnen">
        <SearchIcon />
      </IconButton>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        bgcolor: 'rgba(255,255,255,0.15)',
        borderRadius: 1,
        px: 1,
        ml: 1,
      }}
    >
      <SearchIcon sx={{ color: 'inherit', mr: 0.5 }} />
      <InputBase
        autoFocus
        placeholder="Stichwort suchen…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{ color: 'inherit', flex: 1, '& input::placeholder': { opacity: 0.7 } }}
        inputProps={{ 'aria-label': 'Suche' }}
      />
      <IconButton size="small" color="inherit" onClick={handleClose} aria-label="Suche schließen">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
