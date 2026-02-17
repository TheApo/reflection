import { Injectable } from '@angular/core';
import { Grid } from '../models/cell.model';
import { ClueStatus, EdgeSide } from '../models/clue.model';
import { Direction, directionDelta } from '../models/direction.model';
import { applyObject } from '../models/game-object.model';
import { LightSegment, TraceResult } from '../models/light-ray.model';

@Injectable({ providedIn: 'root' })
export class LightEngineService {

  trace(grid: Grid, entrySide: EdgeSide, entryIndex: number, gridSize: number): TraceResult {
    const { row: startRow, col: startCol, dir: startDir } = this.entryPointToPosition(entrySide, entryIndex, gridSize);

    const segments: LightSegment[] = [];
    let row = startRow;
    let col = startCol;
    let dir = startDir;
    let distance = 0;
    const maxSteps = gridSize * gridSize * 4;

    let segStartRow = row;
    let segStartCol = col;

    for (let step = 0; step < maxSteps; step++) {
      const delta = directionDelta(dir);
      row += delta.dr;
      col += delta.dc;

      // Check if light exited the grid
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
        // Record final segment to exit point
        segments.push({
          fromRow: segStartRow,
          fromCol: segStartCol,
          toRow: row,
          toCol: col,
          direction: dir,
        });

        const { side: exitSide, index: exitIndex } = this.positionToExitPoint(row, col, dir, gridSize);

        const isSameEntry = exitSide === entrySide && exitIndex === entryIndex;
        const status = isSameEntry ? ClueStatus.Yellow : ClueStatus.Green;

        return {
          segments,
          totalDistance: distance,
          exitSide,
          exitIndex,
          entrySide,
          entryIndex,
          status,
        };
      }

      distance++;

      const obj = grid[row][col];
      if (obj === null) {
        continue;
      }

      const newDir = applyObject(obj, dir);

      if (newDir === null) {
        // Absorbed
        segments.push({
          fromRow: segStartRow,
          fromCol: segStartCol,
          toRow: row,
          toCol: col,
          direction: dir,
        });

        return {
          segments,
          totalDistance: distance,
          exitSide: null,
          exitIndex: null,
          entrySide,
          entryIndex,
          status: ClueStatus.Gray,
        };
      }

      if (newDir !== dir) {
        // Direction changed - record segment and start new one
        segments.push({
          fromRow: segStartRow,
          fromCol: segStartCol,
          toRow: row,
          toCol: col,
          direction: dir,
        });
        segStartRow = row;
        segStartCol = col;
        dir = newDir;
      }
      // If direction is same (pass-through), continue without new segment
    }

    // Safety: max steps exceeded (loop), treat as absorbed
    return {
      segments,
      totalDistance: distance,
      exitSide: null,
      exitIndex: null,
      entrySide,
      entryIndex,
      status: ClueStatus.Gray,
    };
  }

  private entryPointToPosition(side: EdgeSide, index: number, gridSize: number): { row: number; col: number; dir: Direction } {
    switch (side) {
      case EdgeSide.Top:
        return { row: -1, col: index, dir: Direction.Bottom };
      case EdgeSide.Bottom:
        return { row: gridSize, col: index, dir: Direction.Top };
      case EdgeSide.Left:
        return { row: index, col: -1, dir: Direction.Right };
      case EdgeSide.Right:
        return { row: index, col: gridSize, dir: Direction.Left };
    }
  }

  private positionToExitPoint(row: number, col: number, dir: Direction, gridSize: number): { side: EdgeSide; index: number } {
    if (row < 0) return { side: EdgeSide.Top, index: col };
    if (row >= gridSize) return { side: EdgeSide.Bottom, index: col };
    if (col < 0) return { side: EdgeSide.Left, index: row };
    if (col >= gridSize) return { side: EdgeSide.Right, index: row };
    // Shouldn't reach here
    return { side: EdgeSide.Top, index: 0 };
  }
}
