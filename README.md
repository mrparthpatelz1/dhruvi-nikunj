# Dhruvi & Nikunj — Digital Wedding Invitation

A royal ivory-maroon-gold invitation site: 3D envelope with an animated Ganesha wax seal,
sakura petal rain, live countdown, scratch-to-reveal couple portrait, animated peacocks,
events timeline with directions, embedded maps, RSVP via WhatsApp, and one-tap contacts.

Built with React, Tailwind CSS v4, Framer Motion and HTML5 Canvas (Vite).

## Run it

```bash
npm install
npm run dev        # local preview at http://localhost:5173
npm run build      # production files in dist/
npm run preview    # serve the built dist/ locally
```

## Edit the content

Everything guests see lives in **`src/data/weddingData.js`** (`WEDDING_DATA`):
names, parents, blessing, dates/times, venues + map links, events, dress codes,
contact numbers, RSVP settings and music.

- **Dates** are ISO strings with India's offset, e.g. `2027-01-29T19:00:00+05:30`.
  `wedding.dateTime` drives the hero date and the countdown.
- **Couple photo:** replace `src/assets/couple.jpg` (portrait 3:4 fits the arch exactly).
- **Maps:** each venue's `mapLink` powers the "Get Directions" buttons. The embedded map
  searches `mapEmbedQuery`; for a pin-perfect embed, put coordinates there (`'23.12,72.04'`).
- **Dress codes** are suggestions — change or delete them per event.
- **RSVP:** submitting shows a confirmation and opens WhatsApp with the reply pre-written to
  `rsvp.whatsappNumber`. Optionally set `rsvp.endpoint` (Formspree, Google Apps Script…)
  to also receive each response as a JSON POST.
- **Music:** by default a soft tanpura + santoor ambience is generated in the browser
  (nothing to download). To use your own instrumental track, put e.g. `music.mp3` in
  `public/` and set `music.src: 'music.mp3'`. `autoplayOnOpen: true` starts it when the
  seal is tapped.

## Deploy

`npm run build`, then upload the **`dist/`** folder anywhere static:
Netlify Drop (drag & drop), Vercel, GitHub Pages, Cloudflare Pages or any web host.
Paths are relative, so it also works from a sub-folder.

## Accessibility & performance

- Respects `prefers-reduced-motion` (petals start paused; motion becomes simple fades).
- A floating button pauses/resumes every ambient animation; another toggles music.
- Petal density scales with screen size; sprites are pre-rendered for smooth 60fps.
- Scratch card works with mouse and touch (`touch-action: none`) and has a
  "Tap to reveal" fallback button.
