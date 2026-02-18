import { Injectable, inject, signal, computed } from '@angular/core';
import { Grid, cloneGrid, createEmptyGrid } from '../models/cell.model';
import { EdgeClue, EdgeSide } from '../models/clue.model';
import { GameObjectType } from '../models/game-object.model';
import { GameSettings, PuzzleDef } from '../models/game-state.model';
import { TraceResult } from '../models/light-ray.model';
import { ClueValidatorService } from './clue-validator.service';
import { LevelGeneratorService } from './level-generator.service';
import { LightEngineService } from './light-engine.service';

const PALETTE_ORDER: GameObjectType[] = [
  GameObjectType.Mirror45CW,
  GameObjectType.Mirror45CCW,
  GameObjectType.OneWayVertical,
  GameObjectType.OneWayHorizontal,
  GameObjectType.Block,
  GameObjectType.Absorber,
  GameObjectType.TriangleBL,
  GameObjectType.TriangleBR,
  GameObjectType.TriangleTL,
  GameObjectType.TriangleTR,
];

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private lightEngine = inject(LightEngineService);
  private clueValidator = inject(ClueValidatorService);
  private levelGenerator = inject(LevelGeneratorService);

  // Core state
  readonly puzzle = signal<PuzzleDef | null>(null);
  readonly playerGrid = signal<Grid>([]);
  readonly selectedObject = signal<GameObjectType | null>(null);
  readonly remainingObjects = signal<Record<string, number>>({});
  readonly activeClueTrace = signal<TraceResult | null>(null);
  readonly activeClueIndex = signal<{ side: EdgeSide; index: number } | null>(null);
  readonly hint = signal<{ row: number; col: number; type: 'wrong' | 'missing'; object?: GameObjectType } | null>(null);
  private lastSettings: GameSettings | null = null;

  // Computed
  readonly currentClues = computed<EdgeClue[]>(() => {
    const p = this.puzzle();
    const grid = this.playerGrid();
    if (!p || grid.length === 0) return [];
    return this.clueValidator.validateClues(grid, p.clues, p.gridSize);
  });

  readonly isSolved = computed(() => {
    const clues = this.currentClues();
    return clues.length > 0 && clues.every(c => c.isCorrect);
  });

  readonly totalObjects = computed(() => {
    const remaining = this.remainingObjects();
    return Object.values(remaining).reduce((sum, v) => sum + v, 0);
  });

  startGame(puzzle: PuzzleDef, settings?: GameSettings): void {
    if (settings) this.lastSettings = settings;
    this.puzzle.set(puzzle);
    this.playerGrid.set(createEmptyGrid(puzzle.gridSize));
    this.remainingObjects.set({ ...puzzle.objectInventory });
    this.activeClueTrace.set(null);
    this.activeClueIndex.set(null);
    this.hint.set(null);

    // Auto-select first available palette object
    const firstType = PALETTE_ORDER.find(t => (puzzle.objectInventory[t] ?? 0) > 0);
    this.selectedObject.set(firstType ?? null);
  }

  newGame(): boolean {
    if (!this.lastSettings) return false;
    try {
      const puzzle = this.levelGenerator.generate(this.lastSettings);
      this.startGame(puzzle);
      return true;
    } catch {
      return false;
    }
  }

  selectObject(type: GameObjectType | null): void {
    if (this.selectedObject() === type) {
      this.selectedObject.set(null);
    } else {
      this.selectedObject.set(type);
    }
  }

  requestHint(): void {
    const p = this.puzzle();
    if (!p) return;
    const grid = this.playerGrid();
    const solution = p.solution;
    const n = p.gridSize;

    // Collect all wrong placements and missing objects
    const wrong: { row: number; col: number }[] = [];
    const missing: { row: number; col: number; object: GameObjectType }[] = [];

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const player = grid[r][c];
        const sol = solution[r][c];
        if (player !== null && player !== sol) {
          wrong.push({ row: r, col: c });
        } else if (player === null && sol !== null) {
          missing.push({ row: r, col: c, object: sol });
        }
      }
    }

    // Prefer showing a wrong placement, otherwise show a missing object
    if (wrong.length > 0) {
      const pick = wrong[Math.floor(Math.random() * wrong.length)];
      this.hint.set({ row: pick.row, col: pick.col, type: 'wrong' });
    } else if (missing.length > 0) {
      const pick = missing[Math.floor(Math.random() * missing.length)];
      this.hint.set({ row: pick.row, col: pick.col, type: 'missing', object: pick.object });
    }
  }

  handleCellClick(row: number, col: number): void {
    this.hint.set(null);
    const grid = cloneGrid(this.playerGrid());
    const remaining = { ...this.remainingObjects() };
    const existing = grid[row][col];
    const selected = this.selectedObject();

    if (existing !== null) {
      // Cell is occupied - remove and auto-select removed type
      remaining[existing] = (remaining[existing] ?? 0) + 1;
      grid[row][col] = null;
      if (selected === null) {
        this.selectedObject.set(existing);
      }
    } else if (selected !== null) {
      // Cell empty, place selected object if available
      const count = remaining[selected] ?? 0;
      if (count <= 0) return;
      grid[row][col] = selected;
      remaining[selected] = count - 1;
    } else {
      return;
    }

    this.playerGrid.set(grid);
    this.remainingObjects.set(remaining);

    // Auto-switch to next available object if current is depleted
    if (selected !== null && (remaining[selected] ?? 0) <= 0) {
      const next = PALETTE_ORDER.find(t => (remaining[t] ?? 0) > 0);
      this.selectedObject.set(next ?? null);
    }

    this.refreshActiveTrace();
  }

  traceClue(side: EdgeSide, index: number): void {
    const puzzle = this.puzzle();
    if (!puzzle) return;

    const current = this.activeClueIndex();
    if (current && current.side === side && current.index === index) {
      this.activeClueTrace.set(null);
      this.activeClueIndex.set(null);
      return;
    }

    const result = this.lightEngine.trace(this.playerGrid(), side, index, puzzle.gridSize);
    this.activeClueTrace.set(result);
    this.activeClueIndex.set({ side, index });
  }

  private refreshActiveTrace(): void {
    const idx = this.activeClueIndex();
    if (idx) {
      const puzzle = this.puzzle();
      if (puzzle) {
        const result = this.lightEngine.trace(this.playerGrid(), idx.side, idx.index, puzzle.gridSize);
        this.activeClueTrace.set(result);
      }
    }
  }
}
