import { useEffect, useState } from 'react'
import Envelope from './components/Envelope.jsx'
import NamesReveal from './components/NamesReveal.jsx'
import Countdown from './components/Countdown.jsx'
import Schedule from './components/Schedule.jsx'
import Venue from './components/Venue.jsx'
import Cameo from './components/Cameo.jsx'
import Rsvp from './components/Rsvp.jsx'
import { couple, dateLabel } from './content.js'
import trunksPhoto from './assets/trunks.jpg'

export default function App() {
  const [opened, setOpened] = useState(false)

  // Lock scrolling while the envelope is sealed.
  useEffect(() => {
    document.body.classList.toggle('envelope-closed', !opened)
    return () => document.body.classList.remove('envelope-closed')
  }, [opened])

  return (
    <div className="texture-wine min-h-[100dvh]">
      <Envelope onOpened={() => setOpened(true)} />

      <main className="mx-auto max-w-lg pb-16">
        <NamesReveal active={opened} />
        <Countdown />
        <Schedule />
        <Venue />
        <Cameo
          src={trunksPhoto}
          alt="Trunks, an English Cocker Spaniel, smiling at the camera"
          name="Trunks"
          caption="Our English Cocker Spaniel would like you to know he is very excited, and would like to sniff you at the reception."
        />
        <Rsvp />

        <footer className="mt-6 text-center">
          <p className="font-script text-3xl text-gold-light">
            {couple.first} &amp; {couple.second}
          </p>
          <p className="mt-1 font-display text-[10px] uppercase tracking-[0.4em] text-ivory/50">{dateLabel}</p>
        </footer>
      </main>
    </div>
  )
}
