import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import AppShell from './components/layout/AppShell'
import ScrollManager from './components/layout/ScrollManager'
import Home from './pages/Home'

// Home stays eager so the most-visited route renders without a Suspense swap
// (keeps its zero layout shift). Every other route is code-split into its own
// chunk so the initial load no longer ships their components.
const TopicPage = lazy(() => import('./pages/TopicPage'))
const ArgumentPage = lazy(() => import('./pages/ArgumentPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const Impressum = lazy(() => import('./pages/Impressum'))
const Feedback = lazy(() => import('./pages/Feedback'))
const Ueber = lazy(() => import('./pages/Ueber'))
const Methodik = lazy(() => import('./pages/Methodik'))
const Leitfaden = lazy(() => import('./pages/Leitfaden'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="thema/:topicId" element={<TopicPage />} />
            <Route path="thema/:topicId/:argumentId" element={<ArgumentPage />} />
            <Route path="suche" element={<SearchPage />} />
            <Route path="impressum" element={<Impressum />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="ueber" element={<Ueber />} />
            <Route path="methodik" element={<Methodik />} />
            <Route path="leitfaden" element={<Leitfaden />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
