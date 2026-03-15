import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import PageMeta from '../components/seo/PageMeta'
import { useTopicIndex } from '../hooks/useTopics'

type SubmissionType = 'existing_topic' | 'new_topic'

interface FeedbackResponse {
  success: boolean
  message: string
}

export default function Feedback() {
  const { topics, loading, error } = useTopicIndex()
  const [submissionType, setSubmissionType] = useState<SubmissionType>('existing_topic')
  const [existingTopicId, setExistingTopicId] = useState('')
  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [argumentText, setArgumentText] = useState('')
  const [sources, setSources] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [startedAt] = useState(() => Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<FeedbackResponse | null>(null)

  const isExistingTopic = submissionType === 'existing_topic'
  const selectedTopicTitle = useMemo(
    () => topics.find((topic) => topic.id === existingTopicId)?.title ?? '',
    [topics, existingTopicId]
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)

    if (isExistingTopic && !existingTopicId) {
      setResult({ success: false, message: 'Bitte wähle ein bestehendes Thema aus.' })
      return
    }

    if (!isExistingTopic && !newTopicTitle.trim()) {
      setResult({ success: false, message: 'Bitte gib einen Titel für das neue Thema an.' })
      return
    }

    if (!argumentText.trim()) {
      setResult({ success: false, message: 'Bitte beschreibe deinen Vorschlag.' })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/feedback.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionType,
          existingTopicId,
          existingTopicTitle: selectedTopicTitle,
          newTopicTitle,
          argumentText,
          sources,
          senderName,
          senderEmail,
          honeypot,
          startedAt,
        }),
      })

      const data = (await response.json()) as FeedbackResponse
      setResult(data)

      if (data.success) {
        setExistingTopicId('')
        setNewTopicTitle('')
        setArgumentText('')
        setSources('')
        setSenderName('')
        setSenderEmail('')
        setHoneypot('')
      }
    } catch {
      setResult({
        success: false,
        message: 'Das Formular konnte gerade nicht gesendet werden. Bitte versuche es später erneut.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box>
      <PageMeta
        title="Feedback"
        description="Feedback, neue Themen und Argumentvorschlaege direkt an Fakten-Stammtisch senden."
        path="/feedback"
      />
      <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
        Feedback
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Hilf mit, Fakten-Stammtisch weiterzuentwickeln.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={1.5}>
            <Typography variant="h6" component="h2">
              Mach mit
            </Typography>
            <Typography variant="body2">
              Du hast ein starkes Argument, eine bessere Formulierung oder ein komplett neues Thema?
              Dann teile es hier direkt mit uns.
            </Typography>
            <Typography variant="body2">
              Je konkreter dein Vorschlag ist und je besser die Quellen, desto schneller können wir
              ihn prüfen und einbauen.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danke, dass du mithilfst, Diskussionen faktenbasiert zu machen.
            </Typography>
          </Stack>
        </Paper>

        <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel id="submission-type-label">Worum geht es?</FormLabel>
              <RadioGroup
                row
                aria-labelledby="submission-type-label"
                value={submissionType}
                onChange={(event) => setSubmissionType(event.target.value as SubmissionType)}
              >
                <FormControlLabel
                  value="existing_topic"
                  control={<Radio />}
                  label="Neues Argument zu bestehendem Thema"
                />
                <FormControlLabel value="new_topic" control={<Radio />} label="Neues Thema" />
              </RadioGroup>
            </FormControl>

            {isExistingTopic ? (
              <TextField
                select
                required
                label="Bestehendes Thema"
                value={existingTopicId}
                onChange={(event) => setExistingTopicId(event.target.value)}
                disabled={loading}
                helperText={loading ? 'Themen werden geladen…' : 'Bitte ein Thema auswählen'}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                required
                label="Titel des neuen Themas"
                value={newTopicTitle}
                onChange={(event) => setNewTopicTitle(event.target.value)}
              />
            )}

            <TextField
              required
              multiline
              minRows={6}
              label="Dein Vorschlag / Argument"
              value={argumentText}
              onChange={(event) => setArgumentText(event.target.value)}
            />

            <TextField
              multiline
              minRows={2}
              label="Quellen (optional)"
              placeholder="Links, Studien oder kurze Hinweise"
              value={sources}
              onChange={(event) => setSources(event.target.value)}
            />

            <TextField
              label="Dein Name (optional)"
              value={senderName}
              onChange={(event) => setSenderName(event.target.value)}
            />

            <TextField
              label="Deine E-Mail (optional)"
              type="email"
              value={senderEmail}
              onChange={(event) => setSenderEmail(event.target.value)}
            />

            <TextField
              label="Website"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              sx={{ display: 'none' }}
              inputProps={{ tabIndex: -1, autoComplete: 'off' }}
              aria-hidden="true"
            />

            {error && <Alert severity="error">Themen konnten nicht geladen werden: {error}</Alert>}

            {result && <Alert severity={result.success ? 'success' : 'error'}>{result.message}</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress color="inherit" size={18} />
                    Wird gesendet…
                  </Box>
                ) : (
                  'Feedback senden'
                )}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
