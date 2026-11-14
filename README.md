# 🎮 Arcade Resume

An interactive, retro-arcade take on my résumé. Walk a pixel-art world map, enter each "world"
(About, Experience, Power-ups, Education, Contact), and explore my career like a classic platformer,
complete with sprites, animations and 8-bit sound effects.

**▶ Live:** https://abhishekkirloskar.github.io/resume-site/

## Tech

- **React 19** + **Vite**
- **Tailwind CSS**
- Web Audio API for chiptune sound effects (with a mute toggle)
- Deployed to **GitHub Pages** via `gh-pages`

## Run locally

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run deploy   # build and publish to GitHub Pages
```

## Structure

```
src/
├── App.jsx          # résumé data, world map and section screens
├── MarioSprite.jsx  # animated player sprite
├── sound.js         # sound effects + mute toggle
└── index.css        # Tailwind + arcade styling
```
