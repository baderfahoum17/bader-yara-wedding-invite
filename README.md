# Bader & Yara — Digital Wedding Invitation

Scrollable, animated wedding invitation. Phase 1: frontend only, no backend, no persistence.

- Live: https://baderfahoum17.github.io/bader-yara-wedding-invite/
- Stack: Vite + React + Tailwind CSS v4 + Framer Motion
- Spec: `docs/superpowers/specs/2026-09-11-wedding-digital-invitation-design.md` in the OpenClaw workspace

## Sections (scroll order)

1. Cover card closed by a flat olive monogram seal (tap to open)
2. Names reveal with arch frame and scroll cue
3. Live countdown to 26.10.2026
4. Schedule timeline
5. Venue with embedded Google Map
6. Trunks photo cameo
7. RSVP form (client-side only, shows a static thank-you)

## Develop

```sh
npm install
npm run dev
```

Copy lives in `src/content.js`. The cover florals (assets, anchors, sway, and open-drift) are configured in `src/florals.js`; the B&Y monogram is inline SVG in `src/components/Monogram.jsx`. Swap the cameo photo in `src/assets/` and update the import in `src/App.jsx`.

## Deploy (manual, no CI)

```sh
npm run deploy
```

Builds `dist/` and pushes it to the `gh-pages` branch. The `gh` account has no `workflow` scope, so do not add GitHub Actions workflows.
