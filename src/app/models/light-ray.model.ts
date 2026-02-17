import { CellPosition } from './cell.model';
import { ClueStatus, EdgeSide } from './clue.model';
import { Direction } from './direction.model';

export interface LightSegment {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  direction: Direction;
}

export interface TraceResult {
  segments: LightSegment[];
  totalDistance: number;
  exitSide: EdgeSide | null;
  exitIndex: number | null;
  entrySide: EdgeSide;
  entryIndex: number;
  status: ClueStatus;
}
