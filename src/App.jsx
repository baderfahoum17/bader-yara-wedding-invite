import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Cover from './components/Cover.jsx'
import NamesReveal from './components/NamesReveal.jsx'
import Countdown from './components/Countdown.jsx'
import Schedule from './components/Schedule.jsx'
import Venue from './components/Venue.jsx'
import Rsvp from './components/Rsvp.jsx'
import Closing from './components/Closing.jsx'

export default function App() {
  const [opened, setOpened] = useState(false)

  // Lock scrolling while the cover is sealed.
  useEffect(() => {
    document.body.classList.toggle('cover-closed', !opened)
    return () => document.body.classList.remove('cover-closed')
  }, [opened])

  return (
    <MotionConfig reducedMotion="user">
      <Cover onOpened={() => setOpened(true)} />
      <main>
        <NamesReveal active={opened} />
        <Countdown />
        <Schedule />
        <Venue />
        <Rsvp />
        <Closing />
      </main>
    </MotionConfig>
  )
}
