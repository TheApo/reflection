import { Injectable, inject } from '@angular/core';
import { Grid } from '../models/cell.model';
import { ClueStatus, EdgeClue } from '../models/clue.model';
import { LightEngineService } from './light-engine.service';

@Injectable({ providedIn: 'root' })
export class ClueValidatorService {
  private lightEngine = inject(LightEngineService);

  validateClues(playerGrid: Grid, solutionClues: EdgeClue[], gridSize: number): EdgeClue[] {
    // Trace each clue on the player's current grid
    const traces = solutionClues.map(clue =>
      this.lightEngine.trace(playerGrid, clue.side, clue.index, gridSize)
    );

    // First pass: validate distance + status against solution
    const clues = solutionClues.map((clue, i) => {
      const result = traces[i];
      const isCorrect =
        result.totalDistance === clue.distance &&
        result.status === clue.status;
      return { ...clue, isCorrect };
    });

    // Second pass: green pairs based on player's ACTUAL exit positions
    for (let i = 0; i < clues.length; i++) {
      const trace = traces[i];
      if (trace.status !== ClueStatus.Green || trace.exitSide == null || trace.exitIndex == null) continue;
      const partner = clues.find(c => c.side === trace.exitSide && c.index === trace.exitIndex);
      if (partner && !partner.isCorrect) {
        clues[i].isCorrect = false;
      }
    }

    return clues;
  }
}
