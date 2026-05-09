import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const positions = new Map<string, number>()

// Retry scrolling while async content is still expanding the document height.
function restoreScroll(targetY: number) {
  let attempt = 0
  const tryScroll = () => {
    window.scrollTo(0, targetY)
    if (Math.abs(window.scrollY - targetY) < 2 || attempt >= 10) return
    attempt += 1
    setTimeout(tryScroll, 50)
  }
  tryScroll()
}

export default function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const isInitialMount = useRef(true)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const key = location.key
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        positions.set(key, window.scrollY)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      positions.set(key, window.scrollY)
    }
  }, [location.key])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (navigationType === 'POP') {
      const savedY = positions.get(location.key) ?? 0
      restoreScroll(savedY)
    } else if (!location.hash) {
      window.scrollTo(0, 0)
    }
    // PUSH/REPLACE with hash: let the target page handle the hash scroll.
  }, [location.key, location.hash, navigationType])

  return null
}
