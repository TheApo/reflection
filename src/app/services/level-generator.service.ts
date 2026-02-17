import { Injectable, inject } from '@angular/core';
import { createEmptyGrid, Grid } from '../models/cell.model';
import { ClueStatus, EdgeClue, EdgeSide } from '../models/clue.model';
import { GameObjectType } from '../models/game-object.model';
import { GameSettings, PuzzleDef } from '../models/game-state.model';
import { LightEngineService } from './light-engine.service';

@Injectable({ providedIn: 'root' })
export class LevelGeneratorService {
  private lightEngine = inject(LightEngineService);

  generate(settings: GameSettings): PuzzleDef {
    const maxAttempts = 200;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = this.tryGenerate(settings);
      if (result) return result;
    }

    // If we can't generate a valid level after max attempts, relax constraints
    for (let attempt = 0; attempt < 100; attempt++) {
      const result = this.tryGenerate(settings, 0.5);
      if (result) return result;
    }

    throw new Error('Could not generate a valid puzzle. Try adjusting the settings.');
  }

  private tryGenerate(settings: GameSettings, minInteractionRatio = 0.8): PuzzleDef | null {
    const { gridSize } = settings;
    const grid = createEmptyGrid(gridSize);

    // Build object pool
    const objectPool = this.buildObjectPool(settings);
    if (objectPool.length === 0) return null;

    // Ensure we don't have more objects than cells
    const maxObjects = Math.floor(gridSize * gridSize * 0.5);
    const pool = objectPool.slice(0, Math.min(objectPool.length, maxObjects));

    // Shuffle pool
    this.shuffle(pool);

    // Generate random positions
    const allPositions: { row: number; col: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        allPositions.push({ row: r, col: c });
      }
    }
    this.shuffle(allPositions);
    const positions = allPositions.slice(0, pool.length);

    // Place objects
    for (let i = 0; i < pool.length; i++) {
      grid[positions[i].row][positions[i].col] = pool[i];
    }

    // Compute all edge clues
    const clues = this.computeAllClues(grid, gridSize);

    // Validate: enough clues must have distance != gridSize
    const trivialCount = clues.filter(c => c.distance === gridSize && c.status === ClueStatus.Green).length;
    const totalClues = 4 * gridSize;
    if (trivialCount / totalClues > (1 - minInteractionRatio)) {
      return null;
    }

    // Build inventory
    const objectInventory: Record<string, number> = {};
    for (const obj of pool) {
      objectInventory[obj] = (objectInventory[obj] ?? 0) + 1;
    }

    return {
      gridSize,
      solution: grid,
      clues,
      objectInventory,
    };
  }

  private buildObjectPool(settings: GameSettings): GameObjectType[] {
    const pool: GameObjectType[] = [];
    const counts = settings.objectCounts;

    const allTypes = Object.values(GameObjectType);
    for (const type of allTypes) {
      const count = counts[type] ?? 0;
      for (let i = 0; i < count; i++) {
        pool.push(type);
      }
    }

    return pool;
  }

  private computeAllClues(grid: Grid, gridSize: number): EdgeClue[] {
    const clues: EdgeClue[] = [];
    const sides: EdgeSide[] = [EdgeSide.Top, EdgeSide.Bottom, EdgeSide.Left, EdgeSide.Right];

    for (const side of sides) {
      for (let index = 0; index < gridSize; index++) {
        const result = this.lightEngine.trace(grid, side, index, gridSize);
        const clue: EdgeClue = {
          side,
          index,
          distance: result.totalDistance,
          status: result.status,
          isCorrect: true,
        };
        // For green clues, store where the light exits
        if (result.status === ClueStatus.Green && result.exitSide != null && result.exitIndex != null) {
          clue.exitSide = result.exitSide;
          clue.exitIndex = result.exitIndex;
        }
        clues.push(clue);
      }
    }

    return clues;
  }

  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
