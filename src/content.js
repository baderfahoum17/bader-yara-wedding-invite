// Single source of truth for the invitation copy.
// Wedding date/time is expressed in Israel time (UTC+2 on 26.10.2026, after DST ends).

export const couple = {
  first: 'Bader',
  second: 'Yara',
  initials: 'B & Y',
}

export const weddingDate = new Date('2026-10-26T17:00:00+02:00')

export const dateLabel = '26.10.2026'

export const weekday = weddingDate.toLocaleDateString('en-GB', {
  weekday: 'long',
  timeZone: 'Asia/Jerusalem',
})

export const longDate = weddingDate.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jerusalem',
})

export const schedule = [
  { time: '5:00 PM', title: 'Reception & Drinks' },
  { time: '8:00 PM', title: 'Hall Entrance & Ceremony Start' },
]

export const venue = {
  name: 'New Grand Palace',
  street: 'HaAvoda 12',
  city: 'Nof HaGalil',
}

const venueQuery = encodeURIComponent(`${venue.name}, ${venue.street}, ${venue.city}`)

export const venueLinks = {
  embed: `https://maps.google.com/maps?q=${venueQuery}&z=15&output=embed`,
  google: `https://www.google.com/maps/search/?api=1&query=${venueQuery}`,
  waze: `https://waze.com/ul?q=${venueQuery}&navigate=yes`,
}
