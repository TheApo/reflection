# Reflection - Light Puzzle Game

## Overview

A logic puzzle game where the player places objects on an NxN grid so that light rays match numbered clues on the edges. Built with **Angular 21** (standalone components + signals), **SVG** for game board rendering, and **SCSS** for styling. No external UI libraries.

## Tech Stack

- Angular 21.1.4 with standalone components + signals (no NgModules, no RxJS for state)
- SVG for all game board rendering (viewBox-based, 1 unit = 1 cell)
- SCSS with shared variables/mixins (`stylePreprocessorOptions.includePaths: ["src"]` in angular.json)
- Signal-based state management in `GameStateService`
- Lightweight custom i18n via `TranslationService` (English/German)

## Game Mechanics

### Objects (10 types)

| Object | Symbol | Behavior |
|--------|--------|----------|
| Mirror45CW | `\` | Reflects 45°: Right→Down, Down→Right, Left→Up, Up→Left |
| Mirror45CCW | `/` | Reflects 45°: Right→Up, Up→Right, Left→Down, Down→Left |
| OneWayVertical | `\|\|` | Vertical passes through, horizontal reflects 180° |
| OneWayHorizontal | `=` | Horizontal passes through, vertical reflects 180° |
| Block | `■` | Reflects 180° from any direction |
| TriangleBL | `◣` | Hypotenuse `\` reflects (from open sides), legs (left+bottom) reflect 180° |
| TriangleBR | `◢` | Hypotenuse `/` reflects (from open sides), legs (right+bottom) reflect 180° |
| TriangleTL | `◤` | Hypotenuse `/` reflects (from open sides), legs (left+top) reflect 180° |
| TriangleTR | `◥` | Hypotenuse `\` reflects (from open sides), legs (right+top) reflect 180° |
| Absorber | `●` | Absorbs light completely |

### Edge Clues

- Number = distance the light ray travels inside the grid
- **Green background** = light passes through (exits elsewhere)
- **Yellow background** = light reflects back (exits at entry point)
- **Gray background** = light is absorbed
- **Red border** = current placement doesn't match expected clue
- **Cyan border** = clue is active (clicked, showing light path)

### Clue Validation

Each clue is validated **independently** against the current board state (not the solution). A light ray is traced from the clue's entry point through the player's grid, and the result (distance + status) is compared to the expected clue values.

### Cell Interaction

1. Cell empty + object selected + count > 0 → place object
2. Cell occupied → remove object (always, regardless of selection)
3. When an object's count reaches 0 after placing → auto-select next available object
4. Click on edge clue → show/hide light path trace
5. Mouse wheel → cycle through available objects (skips depleted ones)
6. Level start → first palette object auto-selected

### Light Path Rendering

- Green dashed animated SVG `<path>` for all traces
- **Yellow clues** (entry = exit): path is split into outgoing/return halves with perpendicular offset so both directions are visible
- Path start/end clamped to grid boundary (never drawn into clue cells)

### Hint System

- `?` button bottom-right during gameplay
- Compares player grid with solution grid
- Prioritizes showing **wrong placements** (red pulsing border) over **missing objects** (semi-transparent ghost)
- Hint clears on next cell click

## Project Structure

```
src/
├── index.html                          # Entry HTML, SVG favicon
├── main.ts                             # Angular bootstrap
├── styles.scss                         # Global styles (reset, dark theme, safe-area)
├── styles/
│   ├── _variables.scss                 # Colors, breakpoints, fonts, shadows
│   ├── _mixins.scss                    # tablet/desktop breakpoints, glow-button, card
│   └── _animations.scss                # Shared keyframes
└── app/
    ├── app.ts                          # Root component (minimal, just router-outlet)
    ├── app.config.ts                   # Provider config
    ├── app.routes.ts                   # Routes: / → StartMenu, /settings → GameSettings, /play → GameScreen
    ├── models/
    │   ├── direction.model.ts          # Direction enum + helpers (oppositeDirection, directionDelta)
    │   ├── game-object.model.ts        # GameObjectType enum, applyObject() reflection logic, category arrays
    │   ├── cell.model.ts               # Grid type, createEmptyGrid(), cloneGrid()
    │   ├── clue.model.ts               # ClueStatus, EdgeSide, EdgeClue interface
    │   ├── light-ray.model.ts          # LightSegment, TraceResult interfaces
    │   └── game-state.model.ts         # GameSettings, PuzzleDef, getDefaultObjectCounts()
    ├── services/
    │   ├── light-engine.service.ts     # Core ray-tracing: trace(grid, side, index, gridSize) → TraceResult
    │   ├── level-generator.service.ts  # Random puzzle generation, validates >80% non-trivial clues
    │   ├── clue-validator.service.ts   # Validates player grid vs solution clues (independent per clue)
    │   ├── game-state.service.ts       # Central state (signals), game logic, hint system
    │   └── translation.service.ts      # i18n: lang signal, translations computed, toggleLang()
    └── components/
        ├── start-menu/                 # Home screen: title, play button, how-to-play rules, language toggle
        ├── game-settings/              # Grid size slider, object toggles, count steppers, min total validation
        ├── game-screen/                # Orchestrator: board + palette/victory, wheel handler, hint button
        ├── game-board/                 # SVG host: grid cells, edge clues, light path, hover ghost
        ├── board-cell/                 # Single grid cell (SVG <g>), hint display, ghost preview
        ├── edge-clue/                  # Edge number with status color, shows current trace when active
        ├── light-path/                 # SVG path rendering, yellow split offset logic
        ├── object-palette/             # Horizontal scrollable object selection bar
        ├── palette-item/               # Single palette button with SVG icon + count badge
        └── object-icon/                # Reusable SVG icon for all 10 object types
```

## Key Architecture Decisions

- **SVG coordinate system**: ViewBox `(-1.1, -1.1, N+2.2, N+2.2)`, each cell is 1x1, clues at -1 and N
- **All components use attribute selectors** for SVG (`selector: '[appBoardCell]'`) so they render as `<g>` elements
- **pointer-events: none** on placed objects so cell background always receives clicks
- **No paired clue validation** - each clue validates independently against current board state
- **Settings stored** in GameStateService for "New Level" regeneration with same config
- **PALETTE_ORDER** constant defines consistent object ordering across palette and auto-selection

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | StartMenuComponent | Title, play button, rules, language toggle |
| `/settings` | GameSettingsComponent | Grid size, toggles, counts, start game |
| `/play` | GameScreenComponent | Active game with board + palette |

## Styling

- **Dark theme**: background `#0a0a1a`, cards `#1a1a2e`
- **Neon accents**: cyan `#00d4ff`, green `#00ff88`, magenta `#e040fb`
- **Mobile-first**: `100dvh`, safe-area-inset, flex column layout
- **Responsive breakpoints**: tablet 600px, desktop 1024px
- SCSS imports use `@use 'styles/variables' as *` (resolved via includePaths)

## Build

- `npm run dev` → `ng serve --open` (development)
- `npm run build` → outputs directly to `dist/` (no browser subfolder, configured via outputPath in angular.json)

## Common Pitfalls

- **One-way mirror logic**: `||` (vertical lines) lets vertical light through, reflects horizontal 180°. `=` (horizontal lines) lets horizontal through, reflects vertical. Easy to confuse.
- **Triangle logic**: hypotenuse reflects like the corresponding 45° mirror. The two legs (straight sides) reflect 180° back. Light enters from "open" sides (no leg) and hits hypotenuse.
- **applyObject() direction convention**: `travelDir` is the direction the light is MOVING, not where it came from. E.g., `Direction.Right` means light travels rightward (enters cell from the left side).
