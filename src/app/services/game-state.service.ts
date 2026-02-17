import { Injectable, inject, signal, computed } from '@angular/core';
import { Grid, cloneGrid, createEmptyGrid } from '../models/cell.model';
import { EdgeSide } from '../models/clue.model';
import { GameObjectType } from '../models/game-object.model';
import { PuzzleDef } from '../models/game-state.model';
import { TraceResult } from '../models/light-ray.model';
import { ClueValidatorService } from './clue-validator.service';
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

  // Core state
  readonly puzzle = signal<PuzzleDef | null>(null);
  readonly playerGrid = signal<Grid>([]);
  readonly selectedObject = signal<GameObjectType | null>(null);
  readonly remainingObjects = signal<Record<string, number>>({});
  readonly activeClueTrace = signal<TraceResult | null>(null);
  readonly activeClueIndex = signal<{ side: EdgeSide; index: number } | null>(null);

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

  startGame(puzzle: PuzzleDef): void {
    this.puzzle.set(puzzle);
    this.playerGrid.set(createEmptyGrid(puzzle.gridSize));
    this.remainingObjects.set({ ...puzzle.objectInventory });
    this.activeClueTrace.set(null);
    this.activeClueIndex.set(null);

    // Auto-select first available palette object
    const firstType = PALETTE_ORDER.find(t => (puzzle.objectInventory[t] ?? 0) > 0);
    this.selectedObject.set(firstType ?? null);
  }

  selectObject(type: GameObjectType | null): void {
    if (this.selectedObject() === type) {
      this.selectedObject.set(null);
    } else {
      this.selectedObject.set(type);
    }
  }

  handleCellClick(row: number, col: number): void {
    const grid = cloneGrid(this.playerGrid());
    const remaining = { ...this.remainingObjects() };
    const existing = grid[row][col];
    const selected = this.selectedObject();

    if (existing !== null) {
      // Cell is occupied - always just remove it
      remaining[existing] = (remaining[existing] ?? 0) + 1;
      grid[row][col] = null;
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
