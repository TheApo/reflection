import { Injectable, inject } from '@angular/core';
import { Grid } from '../models/cell.model';
import { ClueStatus, EdgeClue } from '../models/clue.model';
import { LightEngineService } from './light-engine.service';

@Injectable({ providedIn: 'root' })
export class ClueValidatorService {
  private lightEngine = inject(LightEngineService);

  validateClues(playerGrid: Grid, solutionClues: EdgeClue[], gridSize: number): EdgeClue[] {
    return solutionClues.map(clue => {
      const result = this.lightEngine.trace(playerGrid, clue.side, clue.index, gridSize);
      const isCorrect =
        result.totalDistance === clue.distance &&
        result.status === clue.status;
      return { ...clue, isCorrect };
    });
  }
}
