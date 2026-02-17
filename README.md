# Reflection

**A sleek, brain-teasing light puzzle game built for the browser.**

Place mirrors, blocks, triangles and absorbers on a grid to guide light rays along the right paths. Match every clue on the edges and you win. Sounds simple? Think again.

Created by **Dirk Aporius**.

---

## The Game

You're given an empty grid surrounded by numbered clues. Each clue tells you something about a light ray entering from that edge:

| Clue Color | Meaning |
|------------|---------|
| **Green** | Light passes through the grid and exits somewhere else |
| **Yellow** | Light bounces back and exits where it entered |
| **Gray** | Light gets absorbed and never comes out |

The **number** shows how many cells the light travels inside the grid.

Your job: figure out where to place objects so that **every single clue checks out**.

## The Objects

You have up to 10 different object types at your disposal:

| Object | What it does |
|--------|-------------|
| `/` `\` **45 Mirrors** | Classic reflection - deflects light at 90 degrees |
| `\|\|` `=` **One-Way Mirrors** | Lets light pass on one axis, bounces it 180 on the other |
| **Block** | Sends light straight back, no matter what direction |
| **Triangles** (4 orientations) | The diagonal side reflects like a mirror, the two straight sides bounce 180 |
| **Absorber** | Swallows light whole. Gone. |

## Features

- **5x5 to 15x15** grids - from quick warmup to serious head-scratcher
- **Fully configurable** - toggle object types on/off, set exact counts per type
- **Light path visualization** - click any edge clue to see exactly where the light goes right now
- **Hint system** - stuck? Hit the `?` button for a nudge in the right direction
- **Ghost preview** - hover over cells to see what you're about to place
- **Mouse wheel** cycling through available objects
- **Mobile-first** - works great on phones, tablets and desktop
- **English & German** - toggle with the flag icon
- **Dark neon theme** - easy on the eyes, hard on the brain

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

### Install & Run

```bash
# Clone the repository
git clone <repository-url>
cd reflection

# Install dependencies
npm install

# Start the development server
npm run dev
```

The game opens automatically at [http://localhost:4200](http://localhost:4200).

### Build for Production

```bash
npm run build
```

Everything you need lands in the `dist/` folder - just drop it on any static web server and you're live.

## How to Play

1. **Choose your grid size** and configure which objects you want in the puzzle
2. **Hit Start Game** - a random puzzle is generated for you
3. **Select an object** from the palette at the bottom
4. **Click a cell** to place it. Click an occupied cell to remove it.
5. **Click edge clues** to trace the light path and see if you're on track
6. A **red border** on a clue means your current setup doesn't match - keep tweaking
7. When all clues turn correct: you've solved it!

### Tips

- Start with clues that have very short distances - they're the most constrained
- Gray clues tell you there's an absorber somewhere along that path
- Yellow clues mean the light hits a 180 reflector (block, one-way mirror, or triangle leg)
- Use the `?` hint button when you're stuck - it'll highlight a misplaced object or show where one is missing

## Tech Stack

Built with **Angular 21**, rendered entirely in **SVG** for pixel-perfect scaling on any screen size. No external UI libraries - just clean, handcrafted components.

- Angular 21 with standalone components & signals
- SVG-based game board with viewBox scaling
- SCSS with dark neon theme
- Signal-based state management
- Custom lightweight i18n (EN/DE)

## License

MIT

---

*Have fun. Break some light.*
