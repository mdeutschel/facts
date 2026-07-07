import type { ArgumentVerdict } from '../../types'

export interface VerdictMeta {
  label: string
  ratingValue: number
  color: 'error' | 'warning' | 'info' | 'success'
}

export const VERDICT_META: Record<ArgumentVerdict, VerdictMeta> = {
  'false': { label: 'Falsch', ratingValue: 1, color: 'error' },
  'mostly-false': { label: 'Überwiegend falsch', ratingValue: 2, color: 'error' },
  'misleading': { label: 'Irreführend', ratingValue: 2, color: 'warning' },
  'outdated': { label: 'Überholt', ratingValue: 2, color: 'warning' },
  'lacks-context': { label: 'Ohne Kontext irreführend', ratingValue: 2, color: 'warning' },
  'partially-true': { label: 'Teilweise wahr', ratingValue: 3, color: 'info' },
  'mostly-true': { label: 'Überwiegend wahr', ratingValue: 4, color: 'success' },
  'true': { label: 'Wahr', ratingValue: 5, color: 'success' },
}

export const VERDICT_RATING_BEST = 5
export const VERDICT_RATING_WORST = 1
