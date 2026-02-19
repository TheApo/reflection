import { Injectable, inject } from '@angular/core';
import { Grid } from '../models/cell.model';
import { ClueStatus, EdgeClue } from '../models/clue.model';
import { LightEngineService } from './light-engine.service';

@Injectable({ providedIn: 'root' })
export class ClueValidatorService {
  private lightEngine = inject(LightEngineService);

  validateClues(playerGrid: Grid, solutionClues: EdgeClue[], gridSize: number): EdgeClue[] {
    // First pass: validate each clue individually
    const clues = solutionClues.map(clue => {
      const result = this.lightEngine.trace(playerGrid, clue.side, clue.index, gridSize);
      let isCorrect =
        result.totalDistance === clue.distance &&
        result.status === clue.status;

      // For green clues, also verify light exits at the correct position
      if (isCorrect && clue.status === ClueStatus.Green && clue.exitSide != null) {
        isCorrect = result.exitSide === clue.exitSide && result.exitIndex === clue.exitIndex;
      }

      return { ...clue, isCorrect };
    });

    // Second pass: green clue pairs must both be correct
    for (const clue of clues) {
      if (clue.status !== ClueStatus.Green || clue.exitSide == null || clue.exitIndex == null) continue;
      const partner = clues.find(c => c.side === clue.exitSide && c.index === clue.exitIndex);
      if (partner && !partner.isCorrect) {
        clue.isCorrect = false;
      }
    }

    return clues;
  }
}
